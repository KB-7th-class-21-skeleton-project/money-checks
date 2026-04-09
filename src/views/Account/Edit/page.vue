<script setup>
import { useRoute, useRouter } from "vue-router";
// import EditForm from "./components/EditForm.vue";
import { reactive, onMounted, computed, ref } from "vue";
import axios from "axios";
import CategorySelect from "./components/CategorySelect.vue";

const route = useRoute();
const router = useRouter();
const accountId = route.params.id;

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
});

const isEditMode = computed(() => !!accountId);

const loadData = async () => {
	const url = "http://localhost:3000/account";
	if (isEditMode.value) {
		//수정모드
		try {
			const response = await axios.get(`${url}/${accountId}`);
			// 나중에 pinia로 변경?
			const data = response.data;
			Object.assign(formData, data);
		} catch (error) {
			console.error("데이터 로그 실패:", error);
			alert("내역을 불러올 수 없습니다.");
		}
	} else {
		console.log("새로 만들기 모드");
	}
};

const handleSubmit = async () => {
	try {
		const url = "http://localhost:3000/account";
		formData.amount = Number(formData.amount);

		if (isEditMode.value) {
			//수정 모드
			await axios.put(`${url}/${accountId}`, formData);
		} else {
			//생성 모드
			await axios.post(url, formData);
		}
		router.push("/account");
	} catch (error) {
		console.error("저장 실패:", error);
	}
};

// const handleDelete = async () => {
// 	const url = "http://localhost:3000/account";
// 	if (!confirm("삭제하시겠습니까?")) return;
// 	try {
// 		await axios.delete(`${url}/${accountId}`);
// 		router.push("/account");
// 	} catch (error) {
// 		console.error("삭제 실패:", error);
// 	}
// };

const isShowCategory = ref(false); //처음 false

const selectCategory = (name) => {
	formData.category = name;
	isShowCategory.value = false; //선택 끝나면 숨기기
};

const setType = (type) => {
	formData.type = type;
};

onMounted(loadData);
</script>

<template>
	<div class="page-container">
		<!-- 나중에 상단바 맞추기 -->
		<header class="form-header">
			<button @click="router.back()" class="back-btn">〈</button>
			<h2 class="header-title">{{ formData.type === "in" ? "수입" : "지출" }}</h2>
		</header>

		<div class="type-tap-group">
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
				<!-- <input type="" v-model.number="formData.amount" /> -->
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
		<!-- 상단바 만들기 전 저장확인 위한 버튼 -->

		<div class="container">
			<button @click="handleSubmit" class="save-btn">저장</button>
			<!-- <button v-if="isEditMode" @click="handleDelete" class="delete-btn">삭제</button> -->
		</div>

		<CategorySelect
			v-if="isShowCategory"
			:selected="formData.category"
			@select="selectCategory"
		></CategorySelect>
	</div>
</template>

<style scoped>
.form-body {
	padding: 20px;
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

/* 입력창 공통 스타일 */
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
	flex: 1; /* 전체 박스는 꽉 채우되 */
	display: flex;
	justify-content: space-between; /* 안쪽 내용물은 왼쪽으로 */
	align-items: center;
	background-color: #f8f9fa;
	border-radius: 10px;
	padding: 0 16px 0 0;
}

.amount-input {
	flex: 1;
	background-color: transparent;
	border: none;
	outline: none;
	font-size: 16px;
	padding: 12px 0 12px 16px;
	text-align: left;
}

.unit {
	color: #333;
	font-weight: bold;
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
	background-color: #ffcc00;
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
	padding: 20px;
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

/* 수입 활성화 */
.in-btn.active {
	border-color: #ffcc00;
	color: #ffcc00;
}
/* 지출 활성화 */
.out-btn.active {
	border-color: #444;
	color: #444;
}

/* 상단 헤더 */
.form-header {
	display: flex;
	align-items: center;
	padding: 10px 20px;
	border-bottom: 1px solid #f1f1f1;
}
.back-btn {
	border: none;
	background: none;
	font-size: 20px;
	cursor: pointer;
}
.header-title {
	flex: 1;
	text-align: center;
	font-size: 18px;
	margin-right: 30px;
}
</style>
