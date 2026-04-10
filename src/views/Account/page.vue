<script setup>
import TransactionList from "@/views/Account/components/TransactionList.vue";
import TransactionFilter from "./components/TransactionFilter.vue";
import FriendsTap from "./components/FriendsTap.vue";
import { ref } from "vue";

const selectedCategory = ref("0");
const handleCategoryChange = (name) => {
	selectedCategory.value = name;
};

const selectedDate = ref("0");
const handleDateChange = (date) => {
	selectedDate.value = date;
};

const selectedFriend = ref("1");
const handleFriendChage = (friendId) => {
	selectedFriend.value = friendId;
};
</script>

<template>
	<div class="wrapper d-flex justify-content-center min-vh-100 w-100 px-5">
		<div class="account-header-container"></div>
		<div class="account-main-container d-flex flex-column w-100">
			<FriendsTap :selectedFriend="selectedFriend" @change-friend="handleFriendChage" />
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
	</div>
</template>

<style>
html {
	scrollbar-gutter: stable;
}
</style>

<style scoped></style>
