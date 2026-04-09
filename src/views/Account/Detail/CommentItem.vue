<template>
	<div ref="rootEl" class="comment-item">
		<UserAvatar :user="userMap[comment.userId]" size="md" />
		<div class="comment-body">
			<div class="comment-meta">
				<span class="author">{{ userMap[comment.userId]?.name ?? "알 수 없음" }}</span>
				<span class="date">{{ formatDate(comment.createdAt) }}</span>
				<!-- 2·3. 내 댓글 → 수정/삭제, 남의 댓글 → 신고 -->
				<div class="menu-wrap">
					<button class="btn-more" @click="toggleMenu('root', $event)">···</button>
				</div>
			</div>

			<!-- 수정 중이면 인풋, 아니면 텍스트 -->
			<template v-if="editingId === comment.id">
				<input
					v-model="editText"
					class="comment-input"
					@keydown.enter.prevent="submitEdit(comment.id)"
					@keyup.esc="cancelEdit"
				/>
			</template>
			<p v-else class="comment-text">{{ comment.content }}</p>

			<div class="reply-action-row">
				<button class="reply-btn" @click="toggleReplyInput('root')">답글쓰기</button>
				<button v-if="editingId === comment.id" class="cancel-inline" @click="cancelEdit">
					취소
				</button>
			</div>

			<!-- 대댓글 목록 -->
			<div v-for="reply in replies" :key="reply.id" class="reply-item">
				<UserAvatar :user="userMap[reply.userId]" size="sm" />
				<div class="comment-body">
					<div class="comment-meta">
						<span class="author">{{ userMap[reply.userId]?.name ?? "알 수 없음" }}</span>
						<span class="date">{{ formatDate(reply.createdAt) }}</span>
						<div class="menu-wrap">
							<button class="btn-more" @click="toggleMenu(reply.id, $event)">···</button>
						</div>
					</div>

					<template v-if="editingId === reply.id">
						<input
							v-model="editText"
							class="comment-input"
							@keydown.enter.prevent="submitEdit(reply.id)"
							@keyup.esc="cancelEdit"
						/>
					</template>
					<p v-else class="comment-text">{{ reply.content }}</p>

					<!-- 대댓글에도 답글쓰기 입력창 -->
					<div class="reply-action-row">
						<button class="reply-btn" @click="toggleReplyInput(reply.id)">답글쓰기</button>
						<button v-if="editingId === reply.id" class="cancel-inline" @click="cancelEdit">
							취소
						</button>
					</div>
					<div v-if="replyInputId === reply.id" ref="replyInputRef" class="inline-input-row">
						<input
							v-model="replyText"
							class="comment-input"
							placeholder="답글을 입력해주세요"
							enterkeyhint="send"
							@keydown.enter.prevent="submitReply(comment.id)"
							@keyup.esc="replyInputId = null"
						/>
					</div>
				</div>
			</div>

			<!-- 루트 댓글 답글 입력창 -->
			<div v-if="replyInputId === 'root'" ref="replyInputRef" class="inline-input-row">
				<input
					v-model="replyText"
					class="comment-input"
					placeholder="답글을 입력해주세요"
					enterkeyhint="send"
					@keydown.enter.prevent="submitReply(comment.id)"
					@keyup.esc="replyInputId = null"
				/>
			</div>
		</div>
	</div>

	<!-- 메뉴 닫기용 오버레이 -->
	<div v-if="openMenuId !== null" class="overlay" @click="closeMenu" />

	<!-- fixed dropdown (overflow 잘림 방지) -->
	<Teleport to="body">
		<div
			v-if="openMenuId !== null"
			class="dropdown-fixed"
			:style="{ top: dropdownPos.top + 'px', right: dropdownPos.right + 'px' }"
		>
			<template v-if="openMenuId === 'root'">
				<template v-if="isMyComment">
					<button @click="startEdit(comment)">수정</button>
					<button
						class="danger"
						@click="
							emit('delete', comment.id);
							closeMenu();
						"
					>
						삭제
					</button>
				</template>
				<template v-else>
					<button class="danger" @click="closeMenu()">신고</button>
				</template>
			</template>
			<template v-else>
				<template v-for="reply in replies" :key="reply.id">
					<template v-if="openMenuId === reply.id">
						<template v-if="me && reply.userId === me.id">
							<button @click="startEdit(reply)">수정</button>
							<button
								class="danger"
								@click="
									emit('delete', reply.id);
									closeMenu();
								"
							>
								삭제
							</button>
						</template>
						<template v-else>
							<button class="danger" @click="closeMenu()">신고</button>
						</template>
					</template>
				</template>
			</template>
		</div>
	</Teleport>
</template>

<script setup>
import { ref, computed, nextTick, onMounted, onUnmounted } from "vue";
import UserAvatar from "./UserAvatar.vue";

const props = defineProps({
	comment: Object,
	replies: Array,
	userMap: Object,
	me: Object,
});
const emit = defineEmits(["reply", "delete", "update"]);

const rootEl = ref(null);
const openMenuId = ref(null);
const replyInputId = ref(null);
const replyText = ref("");
const editingId = ref(null);
const editText = ref("");

const isMyComment = computed(() => props.me && props.comment.userId === props.me.id);

function onDocumentClick(e) {
	if (replyInputId.value !== null && rootEl.value && !rootEl.value.contains(e.target)) {
		replyInputId.value = null;
	}
}
onMounted(() => document.addEventListener("click", onDocumentClick, true));
onUnmounted(() => document.removeEventListener("click", onDocumentClick, true));

const dropdownPos = ref({ top: 0, right: 0 });

function toggleMenu(id, event) {
	if (openMenuId.value === id) {
		openMenuId.value = null;
	} else {
		const rect = event.currentTarget.getBoundingClientRect();
		dropdownPos.value = {
			top: rect.bottom + 4,
			right: window.innerWidth - rect.right,
		};
		openMenuId.value = id;
	}
}
function closeMenu() {
	openMenuId.value = null;
}

// 1. 답글 입력창 토글
const replyInputRef = ref(null);

function toggleReplyInput(id) {
	if (replyInputId.value === id) {
		replyInputId.value = null;
	} else {
		replyInputId.value = id;
		replyText.value = "";
		cancelEdit(); // 수정 중이면 취소
		nextTick(() => {
			const el = Array.isArray(replyInputRef.value) ? replyInputRef.value[0] : replyInputRef.value;
			el?.scrollIntoView({ behavior: "smooth", block: "nearest" });
		});
	}
}

function submitReply(parentId) {
	if (!replyText.value.trim()) return;
	emit("reply", replyText.value, parentId);
	replyText.value = "";
	replyInputId.value = null;
}

// 2. 수정
function startEdit(target) {
	editingId.value = target.id;
	editText.value = target.content;
	replyInputId.value = null; // 답글 입력창 닫기
	closeMenu();
}
function cancelEdit() {
	editingId.value = null;
	editText.value = "";
}
function submitEdit(id) {
	if (!editText.value.trim()) return;
	emit("update", id, editText.value.trim());
	cancelEdit();
}

function formatDate(iso) {
	if (!iso) return "";
	const d = new Date(iso);
	const now = new Date();
	const diffMs = now - d;
	const diffMin = Math.floor(diffMs / 1000 / 60);
	const diffHour = Math.floor(diffMin / 60);
	const diffDay = Math.floor(diffHour / 24);

	if (diffMin < 60) return `${diffMin}분 전`;
	if (diffHour < 24) return `${diffHour}시간 전`;
	if (diffDay < 7) return `${diffDay}일 전`;
	return `${d.getFullYear()}년 ${d.getMonth() + 1}월 ${d.getDate()}일`;
}
</script>

<style scoped>
.comment-item {
	display: flex;
	gap: 12px;
	margin-bottom: 20px;
}
.reply-item {
	display: flex;
	gap: 10px;
	margin-top: 16px;
}
.comment-body {
	flex: 1;
	min-width: 0;
}

.comment-meta {
	display: flex;
	align-items: center;
	gap: 8px;
	margin-bottom: 4px;
}
.author {
	font-size: 14px;
	font-weight: 600;
	color: #111;
}
.date {
	font-size: 12px;
	color: #bbb;
}

.menu-wrap {
	position: relative;
	margin-left: auto;
}
.btn-more {
	background: none;
	border: none;
	color: #bbb;
	cursor: pointer;
	font-size: 15px;
	letter-spacing: 1px;
	padding: 0 2px;
	line-height: 1;
}

.dropdown-fixed {
	position: fixed;
	background: #fff;
	border: 1px solid #e0e0e0;
	border-radius: 10px;
	box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
	z-index: 200;
	overflow: hidden;
	min-width: fit-content;
}
.dropdown-fixed button {
	display: block;
	width: 100%;
	padding: 10px 20px;
	background: none;
	border: none;
	font-size: 14px;
	color: #111;
	cursor: pointer;
	text-align: left;
	white-space: nowrap;
}
.dropdown-fixed button:hover {
	background: #f5f5f5;
}
.dropdown-fixed button.danger {
	color: #e55;
}
.dropdown-fixed button.danger:hover {
	background: #fef0f0;
}

.comment-text {
	font-size: 14px;
	color: #222;
	line-height: 1.5;
}
.reply-action-row {
	display: flex;
	align-items: center;
	justify-content: space-between;
	margin: 5px 0 2px;
}
.reply-btn {
	font-size: 12px;
	color: #bbb;
	background: none;
	border: none;
	cursor: pointer;
	padding: 0;
}
.cancel-inline {
	font-size: 12px;
	color: #bbb;
	background: none;
	border: none;
	cursor: pointer;
	padding: 0;
}

.inline-input-row {
	margin-top: 8px;
	position: relative;
	z-index: 100;
}
.comment-input {
	width: 100%;
	padding: 8px 12px;
	border-radius: 18px;
	border: 1px solid #e0e0e0;
	background: #f5f5f5;
	font-size: 13px;
	outline: none;
	box-sizing: border-box;
}

.overlay {
	position: fixed;
	inset: 0;
	z-index: 99;
}
</style>
