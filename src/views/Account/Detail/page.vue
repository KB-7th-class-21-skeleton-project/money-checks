<script setup>
import { useRoute } from "vue-router";

const route = useRoute();
const accountId = route.params.id;
</script>

<template>
	<div>
		<h1>상세 조회 (Account Detail: {{ accountId }})</h1>
	</div>
</template>

<style scoped></style>
