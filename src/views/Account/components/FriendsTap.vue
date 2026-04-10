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
	<div class="flex gap-[16px] py-[16px] bg-white border-none overflow-x-auto whitespace-nowrap scrollbar-hide -mx-[16px] px-[16px]">
		<div
			class="flex flex-col items-center gap-[8px] shrink-0 cursor-pointer w-[64px] group"
			:class="{ active: selectedFriend === me?.id }"
			@click.stop="changeFriend(me?.id)"
		>
			<Avatar :size="64" :src="me?.profileUrl" class="avatar-img rounded-full transition-all" />
			<span class="name-label text-[12px] font-medium text-gray-700 transition-colors">내 계좌</span>
		</div>

		<div v-if="me && allUsers" class="flex gap-[16px]">
			<div
				v-for="friend in myFriendsList"
				:key="friend.id"
				class="flex flex-col items-center gap-[8px] shrink-0 cursor-pointer w-[64px] group"
				:class="{ active: selectedFriend === friend.id }"
				@click.stop="changeFriend(friend.id)"
			>
				<Avatar :size="64" :src="friend?.profileUrl" class="avatar-img rounded-full transition-all" />
				<span class="name-label text-[12px] font-medium text-gray-700 transition-colors text-center w-full truncate">{{ friend.name }}</span>
			</div>
		</div>
	</div>
</template>

<style scoped>
/* 1. 스크롤바 숨기기 (선택 사항 - 디자인이 깔끔해짐) */
.scrollbar-hide {
	-ms-overflow-style: none; /* IE, Edge */
	scrollbar-width: none; /* Firefox */
}

/* Chrome, Safari, Opera에서 스크롤바 숨기기 */
.scrollbar-hide::-webkit-scrollbar {
	display: none;
}

/* 🏆 선택되었을 때 (Active) 유지되는 스타일 */
.active .avatar-img {
	box-shadow: 0 0 0 3px var(--color-primary);
}
</style>
