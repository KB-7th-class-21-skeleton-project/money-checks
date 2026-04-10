<script setup>
import TransactionList from "@/views/Account/components/TransactionList.vue";
import TransactionFilter from "./components/TransactionFilter.vue";
import FriendsTap from "./components/FriendsTap.vue";
import { Plus } from "lucide-vue-next";
import { ref, watch } from "vue";
import { useRoute, useRouter } from "vue-router";

const route = useRoute();
const router = useRouter();

const selectedCategory = ref("0");
const handleCategoryChange = (name) => {
	selectedCategory.value = name;
};

const selectedDate = ref("0");
const handleDateChange = (date) => {
	selectedDate.value = date;
};

const selectedFriend = ref(route.query.userId || "1");
const handleFriendChage = (friendId) => {
	selectedFriend.value = friendId;
	router.replace({ ...route, query: { ...route.query, userId: friendId } });
};

watch(
	() => route.query.userId,
	(newUserId) => {
		if (newUserId) {
			selectedFriend.value = newUserId;
		} else {
			selectedFriend.value = "1";
		}
	}
);
</script>

<template>
	<div class="w-full px-[16px] pb-[100px]">
		<div class="flex flex-col w-full">
			<FriendsTap :selectedFriend="selectedFriend" @change-friend="handleFriendChage" />
			<hr class="bg-gray-200 border-none w-full h-[1px] my-[8px]" />
			<TransactionFilter
				:selectedCategory="selectedCategory"
				:selectedDate="selectedDate"
				:selectedFriend="selectedFriend"
				@change-date="handleDateChange"
				@change-category="handleCategoryChange"
			/>
			<TransactionList
				:currentCategory="selectedCategory"
				:selectedDate="selectedDate"
				:selectedFriend="selectedFriend"
			/>
		</div>
		
		<!-- 우측 하단 등록(플로팅) 버튼 래퍼 (콘텐츠 영역 기준 위치 고정) -->
		<div class="fixed bottom-0 left-0 right-0 max-w-[720px] mx-auto w-full pointer-events-none z-50">
			<router-link
				to="/account/edit/new"
				@click.stop
				class="absolute bottom-[80px] right-[20px] w-[60px] h-[60px] bg-[#F4CF4D] rounded-full flex justify-center items-center shadow-lg transition-transform hover:scale-105 active:scale-95 pointer-events-auto cursor-pointer"
			>
				<Plus class="text-white w-[32px] h-[32px]" />
			</router-link>
		</div>
	</div>
</template>

<style>
html {
	scrollbar-gutter: stable;
}
</style>

<style scoped></style>
