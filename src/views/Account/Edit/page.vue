<script setup>
import { useRoute, useRouter } from "vue-router";
import { reactive, onMounted, computed, ref } from "vue";
import { useAccountStore } from "@/stores/account";
import axios from "axios";
import CategorySelect from "./components/CategorySelect.vue";
import AccountHeader from "../Detail/AccountHeader.vue";
import ToggleSwitch from "./components/ToggleSwitch.vue";

const route = useRoute();
const router = useRouter();
const accountId = route.params.id;
const accountStore = useAccountStore();

const getToday = () => {
	const now = new Date();
	const year = now.getFullYear();
	//<input type="date">는 YYYY-MM-DD 형식
	const month = String(now.getMonth() + 1).padStart(2, "0");
	const day = String(now.getDate()).padStart(2, "0");
	return `${year}-${month}-${day}`;
};

const getTime = () => {
	const now = new Date();
	const hours = String(now.getHours()).padStart(2, "0");
	const minutes = String(now.getMinutes()).padStart(2, "0");
	return `${hours}:${minutes}`;
};

const formData = reactive({
	date: getToday(),
	time: getTime(),
	amount: 0,
	category: "",
	content: "",
	memo: "",
	type: "out", //디폴트 지출
	userId: 1,
	isPublic: true, //공개여부 디폴트 공개
});

const isEditMode = computed(() => !!accountId);

const loadData = async () => {
	if (isEditMode.value) {
		try {
			//store의 fetch 액션
			const data = await accountStore.fetchAccountById(accountId);
			Object.assign(formData, data);
		} catch (error) {
			console.error(error);
			alert("내역을 불러올 수 없습니다.");
		}
	}
};

const handleSubmit = async () => {
	try {
		//store의 save 액션
		await accountStore.saveAccount(formData, accountId);
		router.push(`/account/${accountId}`);
	} catch (error) {
		console.error("저장 실패:", error);
	}
};

const isShowCategory = ref(false); //처음 false

const selectCategory = (name) => {
	formData.category = name;
	isShowCategory.value = false; //선택 끝나면 숨기기
};

const closeCategory = () => {
	isShowCategory.value = false;
};

const setType = (type) => {
	formData.type = type;
};

onMounted(loadData);
</script>

<template>
	<div class="page-container">
		<AccountHeader :title="formData.type === 'in' ? '수입' : '지출'" @back="router.back()" />

		<div class="type-tap-group">
			<div class="tabs">
				<button
					type="button"
					class="tab-btn in-btn"
					:class="{ active: formData.type === 'in' }"
					@click="setType('in')"
				>
					수입
				</button>
				<button
					type="button"
					class="tab-btn out-btn"
					:class="{ active: formData.type === 'out' }"
					@click="setType('out')"
				>
					지출
				</button>
			</div>
			<ToggleSwitch v-model="formData.isPublic" />
		</div>
		<main class="form-body">
			<div class="input-group">
				<label>날짜</label>
				<div class="datetime-inputs">
					<input type="date" v-model="formData.date" />
					<input type="time" v-model="formData.time" />
				</div>
			</div>
			<div class="input-group">
				<label>금액</label>
				<div class="amount-wrapper">
					<input type="number" v-model.number="formData.amount" class="input-field amount-input" />
					<span class="unit">원</span>
				</div>
			</div>
			<div class="input-group">
				<label>카테고리</label>
				<input
					type="text"
					v-model="formData.category"
					readonly
					@click="isShowCategory = true"
					class="input-field"
				/>
			</div>
			<div class="input-group">
				<label>내용</label>
				<input type="text" v-model="formData.content" class="input-field" />
			</div>
			<div class="input-group align-top">
				<label>메모</label>
				<textarea v-model="formData.memo" placeholder="메모" class="memo-area"></textarea>
			</div>
		</main>

		<div class="container">
			<button @click="handleSubmit" class="save-btn">저장</button>
		</div>

		<CategorySelect
			:is-open="isShowCategory"
			:selected="formData.category"
			@select="selectCategory"
			@close="closeCategory"
		></CategorySelect>
	</div>
</template>

<style scoped>
.form-body {
	padding: 0px 20px 20px 20px;
	background-color: #fff;
}

.form-body .input-group {
	display: flex;
	justify-content: flex-start;
	align-items: center;
	margin-bottom: 16px;
	gap: 15px;
}

.input-group label {
	color: #adb5bd;
	font-size: 16px;
	width: 80px;
	flex-shrink: 0;
}

.input-field {
	flex: 1;
	border: none;
	background-color: #f8f9fa;
	padding: 12px 16px;
	border-radius: 10px;
	font-size: 16px;
	outline: none;
	text-align: left;
}

/* 금액 입력 시 '원' 표시를 위한 스타일 */
.amount-wrapper {
	flex: 1;
	display: flex;
	justify-content: space-between;
	align-items: center;
	background-color: #f8f9fa;
	border-radius: 10px;
	padding: 0;
	overflow: hidden;
}

.amount-input {
	flex: 1;
	background-color: transparent;
	border: none;
	outline: none;
	font-size: 16px;
	padding: 12px 16px;
	text-align: left;
	width: 0;
}

.unit {
	color: #333;
	font-weight: bold;
	padding-right: 16px;
	white-space: nowrap;
}

.datetime-inputs {
	display: flex;
	gap: 8px;
}

.date-input,
.time-input {
	border: none;
	background-color: #f8f9fa;
	padding: 10px;
	border-radius: 8px;
	font-family: inherit;
}

.memo-area {
	flex: 1;
	height: 80px;
	border: none;
	background-color: #f8f9fa;
	padding: 12px 16px;
	border-radius: 10px;
	font-size: 16px;
	resize: none;
	outline: none;
}

.input-group.align-top {
	align-items: flex-start;
}

.input-group.align-top label {
	margin-top: 12px;
}

.container {
	padding: 20px;
	width: 100%;
}

.save-btn {
	width: 100%;
	padding: 15px 0;
	background-color: #ffd100;
	color: white;
	border: none;
	border-radius: 8px;
	font-size: 18px;
	font-weight: bold;
	cursor: pointer;
	transition: background-color 0.2s;
}

.save-btn:hover {
	background-color: #e6b800;
}

.save-btn:active {
	transform: scale(0.98);
}

.type-tap-group {
	display: flex;
	gap: 10px !important;
	align-items: flex-start;
	padding: 20px 20px 0 20px;
	margin-bottom: 0;
	background-color: #fff;
}

.tab-btn {
	padding: 8px 20px;
	border-radius: 8px;
	border: 1px solid #ddd;
	background: #fff;
	color: #999;
	font-weight: bold;
	cursor: pointer;

	height: auto;
	line-height: 1.2;
}

.in-btn.active {
	border-color: #ffd100;
	color: #ffd100;
}

.out-btn.active {
	border-color: #444;
	color: #444;
}

.type-tap-group {
	display: flex;
	justify-content: space-between;
	align-items: center;
	padding: 20px;
	background-color: #fff;
}

.tabs {
	display: flex;
	gap: 10px;
}
</style>
