<template>
	<div class="modal-backdrop" @click.self="emit('cancel')">
		<div class="confirm-modal-box">
			<p class="modal-message">{{ message }}</p>
			<div class="modal-actions">
				<button class="btn-cancel" @click="emit('cancel')">취소</button>
				<button class="btn-confirm danger" @click="emit('confirm')">삭제</button>
			</div>
		</div>
	</div>
</template>

<script setup>
defineProps({
	message: {
		type: String,
		default: "정말 삭제하시겠어요?",
	},
});
const emit = defineEmits(["confirm", "cancel"]);
</script>

<style scoped>
.modal-backdrop {
	position: fixed;
	inset: 0;
	background: rgba(0, 0, 0, 0.4);
	z-index: 300;
	display: flex;
	align-items: center;
	justify-content: center;
}
.confirm-modal-box {
	background: #fff;
	border-radius: 16px;
	padding: 28px 24px 20px;
	width: 280px;
	box-shadow: 0 8px 32px rgba(0, 0, 0, 0.15);
}
.modal-message {
	font-size: 15px;
	color: #111;
	text-align: center;
	margin: 0 0 24px;
	line-height: 1.5;
}
.modal-actions {
	display: flex;
	gap: 8px;
}
.btn-cancel,
.btn-confirm {
	flex: 1;
	padding: 12px;
	border-radius: 12px;
	font-size: 14px;
	font-weight: 500;
	cursor: pointer;
	border: none;
}
.btn-cancel {
	background: #f5f5f5;
	color: #555;
}
.btn-cancel:hover {
	background: #ebebeb;
}
.btn-confirm.danger {
	background: #111;
	color: #fff;
}
.btn-confirm.danger:hover {
	background: #e55;
}
</style>
