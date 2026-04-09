<script setup>
import axios from "axios";
import { onMounted, reactive } from "vue";
import { useRouter, useRoute } from "vue-router";

const requestTransaction = () => {
	const url = "http://loaclhost:3000/account";
	return axios.get(url);
};
</script>

<template>
	<div>
		<ul></ul>
	</div>
</template>
