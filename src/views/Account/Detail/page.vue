<template>
	<div class="expense-detail">
		<div v-if="loading" class="state-msg">불러오는 중...</div>
		<div v-else-if="error" class="state-msg error">{{ error }}</div>

		<template v-else-if="account">
			<!-- 헤더 -->
			<AccountHeader
				:title="TAB_LABELS[account.type]"
				:show-menu="isMyAccount"
				@back="$router.back()"
				@edit="handleEditAccount"
				@delete="handleDeleteAccount"
			/>

			<!-- 상세 정보 -->
			<div class="detail-rows">
				<div class="detail-row" v-for="row in detailRows" :key="row.label">
					<span class="row-label">{{ row.label }}</span>
					<span class="row-value">{{ row.value }}</span>
				</div>
			</div>

			<!-- 섹션 구분선 -->
			<div class="section-divider" />

			<!-- 리액션 -->
			<div class="reaction-section">
				<div class="section-title">{{ account.memo }}</div>
				<div class="reactions">
					<button
						v-for="r in reactionSummary"
						:key="r.emoji"
						:class="['reaction-btn', { active: r.myReactionId }]"
						@click="toggleReaction(r.emoji)"
					>
						{{ r.emoji }} {{ r.count }}
					</button>

					<div v-if="filteredEmojiOptions.length > 0" class="menu-wrap">
						<button class="reaction-btn add-btn" @click="showEmojiPicker = !showEmojiPicker">
							+
						</button>

						<div v-if="showEmojiPicker" class="dropdown emoji-picker-dropdown">
							<button
								v-for="e in filteredEmojiOptions"
								:key="e"
								class="emoji-item"
								@click="pickEmoji(e)"
							>
								{{ e }}
							</button>
						</div>
					</div>
				</div>
			</div>

			<!-- 섹션 구분선 -->
			<div class="section-divider-lighter" />

			<!-- 댓글 -->
			<div class="comments">
				<CommentItem
					v-for="comment in rootComments"
					:key="comment.id"
					:comment="comment"
					:replies="repliesOf(comment.id)"
					:user-map="userMap"
					:me="me"
					@reply="(content, parentId) => submitComment(content, parentId)"
					@delete="removeComment"
					@update="updateComment"
				/>
			</div>

			<!-- 하단 고정 댓글 입력 -->
			<div class="comment-input-row">
				<UserAvatar :user="me" size="md" />
				<input
					v-model="newComment"
					class="comment-input"
					placeholder="댓글을 입력해주세요"
					enterkeyhint="send"
					@keydown.enter.prevent="handleSubmitComment"
				/>
			</div>
		</template>
	</div>

	<!-- 바깥 클릭 시 이모지 피커 닫기 -->
	<div v-if="showEmojiPicker" class="overlay" @click="showEmojiPicker = false" />
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { useRoute } from "vue-router";
import CommentItem from "./CommentItem.vue";
import UserAvatar from "./UserAvatar.vue";
import AccountHeader from "./AccountHeader.vue";
import {
	getMe,
	getUsers,
	getAccount,
	getComments,
	createComment,
	deleteComment,
	updateComment as apiUpdateComment,
	getReactions,
	createReaction,
	deleteReaction,
} from "@/api/account.js";

const route = useRoute();
const accountId = route.params.id;

const me = ref(null);
const users = ref([]);
const account = ref(null);
const comments = ref([]);
const reactions = ref([]);
const loading = ref(false);
const error = ref(null);
const newComment = ref("");
const showEmojiPicker = ref(false);

const TAB_LABELS = { in: "수입", out: "지출" };
const EMOJI_OPTIONS = ["👍", "👎", "☺️", "😮", "😢"];

const isMyAccount = computed(
	() => me.value && account.value && account.value.userId === me.value.id,
);

const userMap = computed(() => {
	const map = {};
	users.value.forEach((u) => (map[u.id] = u));
	if (me.value) map[me.value.id] = me.value;
	return map;
});

const rootComments = computed(() => comments.value.filter((c) => c.parentCommentId === null));

const repliesOf = (parentId) => comments.value.filter((c) => c.parentCommentId === parentId);

const reactionSummary = computed(() => {
	const map = {};
	reactions.value.forEach((r) => {
		if (!map[r.emoji]) map[r.emoji] = { emoji: r.emoji, count: 0, myReactionId: null };
		map[r.emoji].count++;
		if (me.value && r.userId === me.value.id) map[r.emoji].myReactionId = r.id;
	});
	return EMOJI_OPTIONS.filter((e) => map[e]).map((e) => map[e]);
});

const detailRows = computed(() => {
	if (!account.value) return [];
	const a = account.value;
	return [
		{ label: "날짜", value: formatDateTime(a.date, a.time) },
		{ label: "금액", value: `${a.amount.toLocaleString()}원` },
		{ label: "카테고리", value: a.category },
		{ label: "내용", value: a.content },
	];
});

function formatDateTime(date, time) {
	if (!date) return "";
	const [y, m, d] = date.split("-");
	return `${y}년 ${Number(m)}월 ${Number(d)}일 ${time}`;
}

async function load() {
	loading.value = true;
	error.value = null;
	try {
		const [meData, usersData, accountData, commentsData, reactionsData] = await Promise.all([
			getMe(),
			getUsers(),
			getAccount(accountId),
			getComments(accountId),
			getReactions(accountId),
		]);
		me.value = meData;
		users.value = usersData;
		account.value = accountData;
		comments.value = commentsData;
		reactions.value = reactionsData;
	} catch (e) {
		error.value = "데이터를 불러오지 못했어요.";
	} finally {
		loading.value = false;
	}
}

async function toggleReaction(emoji) {
	const existing = reactions.value.find((r) => r.emoji === emoji && r.userId === me.value?.id);
	if (existing) {
		reactions.value = reactions.value.filter((r) => r.id !== existing.id);
		await deleteReaction(existing.id);
	} else {
		const optimistic = { id: `temp_${Date.now()}`, userId: me.value.id, accountId, emoji };
		reactions.value.push(optimistic);
		const created = await createReaction({ userId: me.value.id, accountId, emoji });
		const idx = reactions.value.findIndex((r) => r.id === optimistic.id);
		if (idx !== -1) reactions.value[idx] = created;
	}
}

async function submitComment(content, parentCommentId = null) {
	if (!content.trim()) return;
	const data = {
		userId: me.value.id,
		accountId,
		content: content.trim(),
		createdAt: new Date().toISOString(),
		parentCommentId,
	};
	const optimistic = { ...data, id: `temp_${Date.now()}` };
	comments.value.push(optimistic);
	const created = await createComment(data);
	const idx = comments.value.findIndex((c) => c.id === optimistic.id);
	if (idx !== -1) comments.value[idx] = created;
}

async function removeComment(id) {
	comments.value = comments.value.filter((c) => c.id !== id);
	await deleteComment(id);
}

async function updateComment(id, content) {
	comments.value = comments.value.map((c) => (c.id === id ? { ...c, content } : c));
	await apiUpdateComment(id, { content });
}

async function handleSubmitComment() {
	await submitComment(newComment.value);
	newComment.value = "";
}

function pickEmoji(emoji) {
	toggleReaction(emoji);
	showEmojiPicker.value = false;
}

function handleEditAccount() {
	// TODO: 수정 페이지로 이동
}

function handleDeleteAccount() {
	// TODO: 삭제 처리
}

const filteredEmojiOptions = computed(() => {
	const myEmojis = reactionSummary.value.filter((r) => r.myReactionId).map((r) => r.emoji);
	return EMOJI_OPTIONS.filter((emoji) => !myEmojis.includes(emoji));
});

onMounted(load);
</script>

<style scoped>
.expense-detail {
	max-width: 720px;
	margin: 0 auto;
	background: #fff;
	font-family: -apple-system, sans-serif;
	display: flex;
	flex-direction: column;
	height: 100dvh;
}
.state-msg {
	padding: 40px;
	text-align: center;
	font-size: 14px;
	color: #999;
}
.state-msg.error {
	color: #e05;
}

/* 상세 정보 */
.detail-rows {
	padding: 10px 24px 12px;
	flex-shrink: 0;
}
.detail-row {
	display: flex;
	align-items: center;
	justify-content: space-between;
	padding: 10px 0;
}
.row-label {
	font-size: 15px;
	color: #aaa;
}
.row-value {
	font-size: 15px;
	color: #111;
	text-align: right;
}

/* 섹션 구분 굵은 선 */
.section-divider {
	height: 10px;
	background: #f8f9fa;
	flex-shrink: 0;
}

/* 리액션 */
.reaction-section {
	padding: 24px 24px 20px;
	flex-shrink: 0;
}
.section-title {
	font-size: 15px;
	color: #111;
	margin-bottom: 14px;
}
.reactions {
	display: flex;
	gap: 8px;
	align-items: center;
	flex-wrap: wrap;
	position: relative;
}
.reaction-btn {
	display: flex;
	align-items: center;
	gap: 4px;
	padding: 4px 12px;
	border-radius: 20px;
	background: #f5f5f5;
	font-size: 14px;
	cursor: pointer;
	color: #333;
	border: 1.5px solid transparent;
	transition: all 0.2s ease;
}
.reaction-btn.active {
	border-color: #ffd100;
	background: #fffbe6;
	color: #444;
}
.reaction-btn:hover:not(.active) {
	border-color: #ffe066;
}
.add-btn {
	padding: 4px 12px;
}

/* 리액션 전용 드롭다운 */
.emoji-picker-dropdown {
	display: flex;
	flex-direction: row;
	gap: 4px;
	padding: 6px;
	top: calc(100% + 6px);
	left: 0;
	width: fit-content !important;
	min-width: unset !important;
	z-index: 101;
}

/* 개별 이모지 버튼 */
.emoji-item {
	padding: 6px !important;
	font-size: 20px !important;
	line-height: 1;
	display: flex !important;
	align-items: center;
	justify-content: center;
	border-radius: 8px;
}
.emoji-item:hover {
	background: #fffbe6 !important;
}

/* 오버레이 */
.overlay {
	position: fixed;
	inset: 0;
	z-index: 99;
}

/* 섹션 구분 얇은 선 */
.section-divider-lighter {
	height: 1px;
	margin: 0px 10px;
	background: #e5e5e5;
	flex-shrink: 0;
}

/* 댓글 목록 */
.comments {
	padding: 24px 24px 0;
	flex: 1;
	overflow-y: auto;
}

/* 하단 고정 댓글 입력 */
.comment-input-row {
	display: flex;
	align-items: center;
	gap: 12px;
	padding: 12px 20px 28px;
	background: #fff;
	flex-shrink: 0;
}
.comment-input {
	flex: 1;
	padding: 11px 16px;
	border-radius: 24px;
	border: 1px solid #e0e0e0;
	background: #f5f5f5;
	font-size: 14px;
	outline: none;
	color: #111;
}

/* 공용 드롭다운 */
.dropdown {
	position: absolute;
	right: 0;
	top: calc(100% + 4px);
	background: #fff;
	border: 1px solid #e0e0e0;
	border-radius: 10px;
	box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
	z-index: 100;
	overflow: hidden;
	min-width: 100px;
}
.dropdown button {
	display: block;
	width: 100%;
	padding: 12px 20px;
	background: none;
	border: none;
	font-size: 14px;
	color: #111;
	cursor: pointer;
	text-align: left;
	white-space: nowrap;
}
.dropdown button:hover {
	background: #f5f5f5;
}
.dropdown button.danger {
	color: #e55;
}
.dropdown button.danger:hover {
	background: #fef0f0;
}

/* 메뉴 닫기용 투명 오버레이 */
.overlay {
	position: fixed;
	inset: 0;
	z-index: 99;
}
</style>
