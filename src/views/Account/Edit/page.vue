<script setup>
import { useRoute } from "vue-router";

const route = useRoute();
const accountId = route.params.id;
</script>

<template>
	<div>
		<h1>수정/추가 폼 (Account Edit: {{ accountId }})</h1>
	</div>
</template>

<style scoped></style>
