<script setup>
import TransactionList from "@/views/Account/components/TransactionList.vue";
import TransactionFilter from "./components/TransactionFilter.vue";

import { ref } from "vue";

const selectedCategory = ref("0");
const handleCategoryChange = (name) => {
	selectedCategory.value = name;
};

const selectedDate = ref("0");
const handleDateChange = (date) => {
	selectedDate.value = date;
};
</script>

<template>
	<div class="d-flex justify-content-center min-vh-100 px-5">
		<div class="account-header-container"></div>
		<div class="account-main-container d-flex flex-column w-100">
			<TransactionFilter
				:selectedCategory="selectedCategory"
				:selectedDate="selectedDate"
				@change-date="handleDateChange"
				@change-category="handleCategoryChange"
			/>
			<TransactionList :currentCategory="selectedCategory" :selectedDate="selectedDate" />
		</div>
	</div>
</template>

<style scoped></style>
