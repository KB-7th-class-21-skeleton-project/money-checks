<script setup>
import Avatar from "@/components/Avatar.vue";

import { useQuery } from "@tanstack/vue-query";
import { getMeOption } from "@/query/options/account"; // 파일 경로에 맞게 수정
import { getUsersOption } from "@/query/options/user";
import { computed } from "vue";

const emit = defineEmits(["change-friend"]);
const { data: me } = useQuery(getMeOption());
const { data: allUsers } = useQuery(getUsersOption());

const myFriendsList = computed(() => {
	if (!me.value || !allUsers.value) return [];

	return allUsers.value.filter((user) => me.value.friendIds.includes(user.id));
});

const changeFriend = (date) => {
	emit("change-friend", date);
};

const props = defineProps({
	selectedFriend: {
		type: String,
		default: "1", // 기본값
	},
});
</script>

<template>
	<div class="friends-tap-container d-flex gap-4 pt-4 pb-2 px-3 bg-white border-0">
		<div
			class="friend-item d-flex flex-column align-items-center gap-2 shrink-0"
			:class="{ active: selectedFriend === me?.id }"
			@click.stop="changeFriend(me?.id)"
		>
			<Avatar :size="64" :src="me?.profileUrl" class="avatar-img" />
			<span class="name-label">내 계좌</span>
		</div>

		<div v-if="me && allUsers" class="d-flex gap-4">
			<div
				v-for="friend in myFriendsList"
				:key="friend.id"
				class="friend-item d-flex flex-column align-items-center gap-2 shrink-0"
				:class="{ active: selectedFriend === friend.id }"
				@click.stop="changeFriend(friend.id)"
			>
				<Avatar :size="64" :src="friend?.profileUrl" class="avatar-img" />
				<span class="name-label">{{ friend.name }}</span>
			</div>
		</div>
	</div>
</template>

<style scoped>
/* ... 기존 스타일 유지 ... */

.friends-tap-container {
	/* 1. 가로가 넘어가면 스크롤 생성 */
	overflow-x: auto;
	/* 2. 줄바꿈 방지 (아이템들이 한 줄로 서게 함) */
	display: flex;
	white-space: nowrap;

	/* 3. 스크롤바 숨기기 (선택 사항 - 디자인이 깔끔해짐) */
	-ms-overflow-style: none; /* IE, Edge */
	scrollbar-width: none; /* Firefox */
}

/* Chrome, Safari, Opera에서 스크롤바 숨기기 */
.friends-tap-container::-webkit-scrollbar {
	display: none;
}

.friend-item {
	cursor: pointer;
	transition: all 0.2s ease;
	/* 4. 너비 고정 및 수축 방지 */
	width: 75px;
	flex-shrink: 0;
}

/* 아바타 이미지 기본 상태 */
.avatar-img {
	/* 👈 핵심: 테두리가 생길 때 아바타가 흔들리지 않게 미리 투명 테두리를 두껍게 줍니다 */
	border: 3px solid transparent;
	transition: all 0.2s ease-in-out;
	border-radius: 50%;
}

/* 🏆 선택되었을 때 (Active) 유지되는 스타일 */
.friend-item.active .avatar-img {
	border-color: #ffd100 !important; /* 부트스트랩 프라이머리 블루 */
	transform: scale(1.08); /* 선택된 아바타만 살짝 키워서 강조 */
}

/* 선택된 이름 스타일 유지 */
.friend-item.active .name-label {
	color: #ffd100;
	font-weight: 800; /* 좀 더 두껍게 */
}

.name-label {
	font-size: 13px;
	font-weight: 600;
	color: #6c757d;
	transition: color 0.2s ease;
}

/* 호버 효과 (선택 안 된 것들만 살짝 반응) */
.friend-item:not(.active):hover {
	transform: translateY(-3px);
}
</style>
