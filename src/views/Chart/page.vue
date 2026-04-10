<template>
	<main class="main-content">
		<!-- 월 네비게이터 -->
		<div class="month-nav">
			<button class="nav-arrow" @click="prevMonth">
				<ChevronLeft :size="16" :stroke-width="3" color="black" />
			</button>
			<span class="month-label">{{ currentMonthLabel }}</span>
			<button class="nav-arrow" @click="nextMonth">
				<ChevronRight :size="16" :stroke-width="3" color="black" />
			</button>
		</div>

		<!-- 수입 / 지출 / 순이익 카드 -->
		<div class="summary-row">
			<div class="summary-card">
				<span class="card-label">수입</span>
				<span class="text-income">{{ formatWon(summary.income) }}</span>
			</div>
			<div class="summary-card">
				<span class="card-label">지출</span>
				<span class="text-expense">{{ formatWon(summary.expense) }}</span>
			</div>
			<div class="summary-card">
				<span class="card-label">순이익</span>
				<span class="text-net">{{ formatWon(summary.net) }}</span>
			</div>
		</div>

		<!-- 이번달 목표 금액 -->
		<div class="section-wrap">
			<div class="section-header">
				<p class="section-title">이번달 목표 금액</p>
				<button v-if="budget.total > 0" class="budget-setting-btn" @click="openBudgetSheet">
					<Settings2 :size="13" :stroke-width="2" />
					설정
				</button>
			</div>
			<div class="budget-card">
				<!-- 예산 미설정 -->
				<template v-if="budget.total === 0">
					<Wallet :size="20" color="#FFD100" />
					<div class="budget-inner">
						<span class="budget-label">이번달 예산</span>
						<div class="budget-right">
							<span class="budget-unset">설정하기</span>
							<button class="budget-chevron" @click="openBudgetSheet">
								<Pencil :size="14" :stroke-width="2" color="#aaaaaa" />
							</button>
						</div>
					</div>
				</template>

				<!-- 예산 설정됨 -->
				<template v-else>
					<div class="budget-info">
						<p class="budget-status-text">
							<template v-if="budget.remaining >= 0">
								예산이<br />
								<span class="budget-status-amount">{{ formatWon(budget.remaining) }}</span> 남았어요
							</template>
							<template v-else>
								예산보다<br />
								<span class="budget-status-amount exceeded">{{
									formatWon(-budget.remaining)
								}}</span>
								더 썼어요
							</template>
						</p>
						<div class="budget-detail-list">
							<div v-if="budget.remaining >= 0" class="budget-detail-row">
								<span class="budget-detail-label">하루 권장 예산</span>
								<span class="budget-detail-value">{{ formatWon(dailyBudget) }}</span>
							</div>
							<div class="budget-detail-row">
								<span class="budget-detail-label">하루 평균 지출</span>
								<span class="budget-detail-value">{{ formatWon(dailyExpense) }}</span>
							</div>
							<div class="budget-detail-row">
								<span class="budget-detail-label">총 예산</span>
								<span class="budget-detail-value">{{ formatWon(budget.total) }}</span>
							</div>
						</div>
					</div>
				</template>
			</div>
		</div>

		<!-- 카테고리별 지출 -->
		<div class="section-wrap">
			<p class="section-title">카테고리별 지출</p>
			<div class="donut-card">
				<svg
					:viewBox="`0 0 ${CHART_SIZE} ${CHART_SIZE}`"
					:width="CHART_SIZE"
					:height="CHART_SIZE"
					class="donut-svg"
				>
					<defs>
						<filter id="shadow" x="-30%" y="-30%" width="160%" height="160%">
							<feDropShadow dx="0" dy="3" stdDeviation="4" flood-color="rgba(0,0,0,0.12)" />
						</filter>
					</defs>

					<g
						v-for="(seg, i) in donutSegments"
						:key="i"
						:transform="
							hoveredIndex === i
								? `translate(${CHART_CX},${CHART_CY}) scale(1.08) translate(${-CHART_CX},${-CHART_CY}) translate(${Math.cos(seg.midRad) * 6},${Math.sin(seg.midRad) * 6})`
								: ''
						"
						style="cursor: pointer; transition: transform 0.25s cubic-bezier(0.34, 1.56, 0.64, 1)"
						@click="hoveredIndex = hoveredIndex === i ? null : i"
					>
						<path :d="seg.innerPath" :fill="seg.color" :stroke="seg.color" stroke-width="1" />
						<path :d="seg.outerPath" :fill="seg.color" :stroke="seg.color" stroke-width="1" />
					</g>

					<circle
						:cx="CHART_CX"
						:cy="CHART_CY"
						:r="R_INNER"
						fill="white"
						style="pointer-events: none"
					/>

					<g
						v-if="hoveredIndex !== null && donutSegments[hoveredIndex]"
						:style="{
							transform: `translate(${donutSegments[hoveredIndex].labelX}px, ${donutSegments[hoveredIndex].labelY}px)`,
							pointerEvents: 'none',
						}"
					>
						<circle
							cx="0"
							cy="0"
							r="30"
							fill="white"
							:stroke="donutSegments[hoveredIndex].color"
							stroke-width="1.5"
							filter="url(#shadow)"
						/>
						<text x="0" y="-8" text-anchor="middle" font-size="9" font-weight="600" fill="#444">
							{{ donutSegments[hoveredIndex].name }}
						</text>
						<text
							x="0"
							y="10"
							text-anchor="middle"
							font-size="12"
							font-weight="700"
							:fill="donutSegments[hoveredIndex].color"
						>
							{{ donutSegments[hoveredIndex].percent }}%
						</text>
					</g>
				</svg>

				<!-- 범례 -->
				<div class="legend">
					<div class="legend-item" v-for="(cat, i) in chartCategories" :key="i">
						<span class="legend-dot" :style="{ background: cat.color }"></span>
						<span class="legend-name">{{ cat.name }}</span>
						<span class="legend-amount">{{ formatWon(cat.amount) }}</span>
					</div>
				</div>
			</div>
		</div>
	</main>

	<!-- 예산 설정 바텀 시트 -->
	<transition name="fade">
		<div v-if="showBudgetSheet" class="sheet-overlay" @click.self="showBudgetSheet = false" />
	</transition>
	<transition name="slide-up">
		<div v-if="showBudgetSheet" class="budget-sheet">
			<p class="sheet-title">예산 설정</p>
			<div class="sheet-input-wrap">
				<input
					type="number"
					class="sheet-input"
					v-model.number="budgetInput"
					placeholder="0"
					autofocus
				/>
				<span class="sheet-unit">원</span>
			</div>
			<div class="sheet-actions">
				<button class="sheet-btn reset" @click="resetBudget">초기화</button>
				<button class="sheet-btn cancel" @click="showBudgetSheet = false">취소</button>
				<button class="sheet-btn confirm" @click="saveBudget">저장</button>
			</div>
		</div>
	</transition>

	<!-- 초기화 확인 다이얼로그 -->
	<transition name="fade">
		<div v-if="showResetConfirm" class="confirm-overlay" @click.self="showResetConfirm = false">
			<div class="confirm-dialog">
				<p class="confirm-title">예산을 초기화할까요?</p>
				<div class="confirm-actions">
					<button class="confirm-btn cancel" @click="showResetConfirm = false">취소</button>
					<button class="confirm-btn delete" @click="confirmReset">초기화</button>
				</div>
			</div>
		</div>
	</transition>
</template>

<script setup>
import { ref, reactive, computed, onMounted, watch } from "vue";
import { Wallet, ChevronLeft, ChevronRight, Pencil, Settings2 } from "lucide-vue-next";
import { getMe, getAccounts, getBudget, postBudget, patchBudget, deleteBudget } from "@/api/account.js";

// ── 상태 ──────────────────────────────────────────────
const currentMonth = ref(new Date().getMonth() + 1);
const currentYear = ref(new Date().getFullYear());
const budget = reactive({ id: null, total: 0, remaining: 0 });
const summary = reactive({ income: 0, expense: 0, net: 0 });
const categories = ref([]);
const me = ref(null);
const showBudgetSheet = ref(false);
const showResetConfirm = ref(false);
const budgetInput = ref("");

// ── 데이터 fetch ───────────────────────────────────────
async function loadChartData() {
	try {
		if (!me.value) me.value = await getMe();
		const userId = me.value.id;

		const accounts = await getAccounts(userId);

		const prefix = `${currentYear.value}-${String(currentMonth.value).padStart(2, "0")}`;
		const monthly = accounts.filter((a) => a.date.startsWith(prefix));

		let income = 0,
			expense = 0;
		const categoryMap = {};
		for (const a of monthly) {
			if (a.type === "in") {
				income += a.amount;
			} else {
				expense += a.amount;
				categoryMap[a.category] = (categoryMap[a.category] || 0) + a.amount;
			}
		}
		summary.income = income;
		summary.expense = expense;
		summary.net = income - expense;

		const totalExpense = Object.values(categoryMap).reduce((s, v) => s + v, 0) || 1;
		categories.value = Object.entries(categoryMap).map(([name, amount]) => ({
			name,
			amount,
			percent: Math.round((amount / totalExpense) * 100),
		}));

		const budgets = await getBudget({
			userId,
			year: currentYear.value,
			month: currentMonth.value,
		});
		if (budgets.length > 0) {
			budget.id = budgets[0].id;
			budget.total = budgets[0].amount;
			budget.remaining = budgets[0].amount - expense;
		} else {
			budget.id = null;
			budget.total = 0;
			budget.remaining = 0;
		}

		hoveredIndex.value = 0;
	} catch (e) {
		console.error("차트 데이터 로드 실패:", e);
	}
}

onMounted(loadChartData);
watch([currentYear, currentMonth], loadChartData);

// ── 도넛 차트 ─────────────────────────────────────────
const CHART_SIZE = 260;
const CHART_CX = CHART_SIZE / 2;
const CHART_CY = CHART_SIZE / 2;
const R_OUTER = 100;
const R_INNER = 55;
const hoveredIndex = ref(null);

const COLOR_PALETTE = ["#f07bae", "#F765A3", "#A155B9", "#7987FF"];

const chartCategories = computed(() => {
	const sorted = [...categories.value].sort((a, b) => b.percent - a.percent);
	const result = sorted.slice(0, 4).map((cat, i) => ({ ...cat, color: COLOR_PALETTE[i] }));
	const rest = sorted.slice(4);
	if (rest.length > 0) {
		result.push({
			name: "기타",
			color: "#D9D9D9",
			amount: rest.reduce((s, c) => s + c.amount, 0),
			percent: rest.reduce((s, c) => s + c.percent, 0),
		});
	}
	return result;
});

function polar(cx, cy, r, deg) {
	const rad = ((deg - 90) * Math.PI) / 180;
	return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) };
}

function innerPath(cx, cy, r, s, e) {
	if (e - s >= 360)
		return `M ${cx - r} ${cy} A ${r} ${r} 0 1 1 ${cx + r} ${cy} A ${r} ${r} 0 1 1 ${cx - r} ${cy} Z`;
	const p1 = polar(cx, cy, r, s);
	const p2 = polar(cx, cy, r, e);
	const large = e - s > 180 ? 1 : 0;
	return `M ${cx} ${cy} L ${p1.x} ${p1.y} A ${r} ${r} 0 ${large} 1 ${p2.x} ${p2.y} Z`;
}

function outerPath(cx, cy, ro, ri, s, e) {
	if (e - s >= 360)
		return `M ${cx - ro} ${cy} A ${ro} ${ro} 0 1 1 ${cx + ro} ${cy} A ${ro} ${ro} 0 1 1 ${cx - ro} ${cy} Z M ${cx - ri} ${cy} A ${ri} ${ri} 0 1 0 ${cx + ri} ${cy} A ${ri} ${ri} 0 1 0 ${cx - ri} ${cy} Z`;
	const o1 = polar(cx, cy, ro, s),
		o2 = polar(cx, cy, ro, e);
	const i1 = polar(cx, cy, ri, e),
		i2 = polar(cx, cy, ri, s);
	const large = e - s > 180 ? 1 : 0;
	return `M ${o1.x} ${o1.y} A ${ro} ${ro} 0 ${large} 1 ${o2.x} ${o2.y} L ${i1.x} ${i1.y} A ${ri} ${ri} 0 ${large} 0 ${i2.x} ${i2.y} Z`;
}

const donutSegments = computed(() => {
	const total = chartCategories.value.reduce((s, c) => s + c.percent, 0);
	let angle = 0;
	return chartCategories.value.map((cat) => {
		const span = (cat.percent / total) * 360;
		const mid = angle + span / 2;
		const midRad = ((mid - 90) * Math.PI) / 180;
		const label = polar(CHART_CX, CHART_CY, R_OUTER + 18, mid);
		const seg = {
			...cat,
			innerPath: innerPath(CHART_CX, CHART_CY, R_INNER, angle, angle + span),
			outerPath: outerPath(CHART_CX, CHART_CY, R_OUTER, R_INNER, angle, angle + span),
			midRad,
			labelX: label.x,
			labelY: label.y,
		};
		angle += span;
		return seg;
	});
});

// ── 월 네비게이션 ──────────────────────────────────────
const currentMonthLabel = computed(() => `${currentMonth.value}월`);

const prevMonth = () => {
	if (currentMonth.value === 1) {
		currentMonth.value = 12;
		currentYear.value--;
	} else currentMonth.value--;
};
const nextMonth = () => {
	if (currentMonth.value === 12) {
		currentMonth.value = 1;
		currentYear.value++;
	} else currentMonth.value++;
};

// ── 예산 설정 ──────────────────────────────────────────
const openBudgetSheet = () => {
	budgetInput.value = budget.total || "";
	showBudgetSheet.value = true;
};

const resetBudget = () => {
	showResetConfirm.value = true;
};

const confirmReset = async () => {
	if (budget.id) {
		await deleteBudget(budget.id);
	}
	showResetConfirm.value = false;
	showBudgetSheet.value = false;
	await loadChartData();
};

const saveBudget = async () => {
	const amount = Number(budgetInput.value);
	if (!amount || amount <= 0) return;
	const userId = me.value.id;
	if (budget.id) {
		await patchBudget(budget.id, { amount });
	} else {
		await postBudget({
			userId,
			year: currentYear.value,
			month: currentMonth.value,
			amount,
		});
	}
	showBudgetSheet.value = false;
	await loadChartData();
};

// ── 유틸 ───────────────────────────────────────────────
const formatWon = (v) => v.toLocaleString("ko-KR") + "원";

const dailyBudget = computed(() => {
	if (!budget.total) return 0;
	const daysInMonth = new Date(currentYear.value, currentMonth.value, 0).getDate();
	return Math.round(budget.total / daysInMonth);
});

const dailyExpense = computed(() => {
	const today = new Date();
	const isCurrentMonth =
		today.getFullYear() === currentYear.value && today.getMonth() + 1 === currentMonth.value;
	const elapsedDays = isCurrentMonth
		? today.getDate()
		: new Date(currentYear.value, currentMonth.value, 0).getDate();
	return elapsedDays > 0 ? Math.round(summary.expense / elapsedDays) : 0;
});
</script>

<style scoped>
.main-content {
	width: 100%;
	padding: 0 22px;
}

/* 월 네비게이터 */
.month-nav {
	display: flex;
	justify-content: center;
	align-items: center;
	gap: 16px;
	padding: 8px 0;
	margin-top: 8px;
}
.nav-arrow {
	background: none;
	border: none;
	cursor: pointer;
	padding: 0;
	display: flex;
	align-items: center;
}
.month-label {
	font-size: 16px;
	font-weight: 600;
	color: black;
	min-width: 40px;
	text-align: center;
}

/* 수입/지출/순이익 카드 */
.summary-row {
	display: flex;
	gap: 16px;
	margin-top: 12px;
	margin-bottom: 24px;
}
.summary-card {
	flex: 1 1 0;
	padding: 2px 8px 19px;
	background: #f8f9fa;
	border-radius: 12px;
	display: flex;
	flex-direction: column;
	align-items: center;
	gap: 12px;
}
.card-label {
	font-size: 12px;
	font-weight: 600;
	color: #000;
}
.text-income {
	font-size: 12px;
	font-weight: 500;
	color: #ffd100;
}
.text-expense {
	font-size: 12px;
	font-weight: 500;
	color: #666666;
}
.text-net {
	font-size: 12px;
	font-weight: 500;
	color: #31ca31;
}

/* 섹션 공통 */
.section-wrap {
	display: flex;
	flex-direction: column;
	gap: 12px;
	margin-bottom: 24px;
}
.section-title {
	font-size: 14px;
	font-weight: 500;
	color: black;
	margin: 0;
}

/* 섹션 헤더 (타이틀 + 설정 버튼) */
.section-header {
	display: flex;
	justify-content: space-between;
	align-items: center;
}
.budget-setting-btn {
	display: flex;
	align-items: center;
	gap: 4px;
	background: none;
	border: none;
	cursor: pointer;
	font-size: 12px;
	font-weight: 500;
	color: #888;
	padding: 2px 4px;
}

/* 예산 카드 */
.budget-card {
	display: flex;
	align-items: center;
	gap: 8px;
	padding: 20px 16px 20px 20px;
	background: #f8f9fa;
	border-radius: 12px;
}

/* 예산 미설정 */
.budget-inner {
	flex: 1;
	display: flex;
	justify-content: space-between;
	align-items: center;
}
.budget-label {
	font-size: 14px;
	font-weight: 600;
	color: #333333;
}
.budget-right {
	display: flex;
	align-items: center;
	gap: 4px;
}
.budget-unset {
	font-size: 14px;
	font-weight: 500;
	color: #aaaaaa;
}
.budget-chevron {
	background: none;
	border: none;
	cursor: pointer;
	padding: 2px;
	display: flex;
	align-items: center;
}

/* 예산 설정됨 */
.budget-info {
	flex: 1;
	display: flex;
	justify-content: space-between;
	align-items: center;
	gap: 12px;
}
.budget-status-text {
	font-size: 13px;
	font-weight: 500;
	color: #333;
	margin: 0;
	line-height: 1.6;
}
.budget-status-amount {
	font-size: 18px;
	font-weight: 700;
	color: #333;
}
.budget-status-amount.exceeded {
	color: #e53e3e;
}
.budget-detail-list {
	display: flex;
	flex-direction: column;
	gap: 6px;
	align-items: flex-end;
}
.budget-detail-row {
	display: flex;
	gap: 8px;
	align-items: center;
}
.budget-detail-label {
	font-size: 11px;
	color: #999;
}
.budget-detail-value {
	font-size: 12px;
	font-weight: 600;
	color: #444;
}

/* 예산 바텀 시트 */
.sheet-overlay {
	position: fixed;
	inset: 0;
	background: rgba(0, 0, 0, 0.35);
	z-index: 50;
}
.budget-sheet {
	position: fixed;
	bottom: 0;
	left: 50%;
	transform: translateX(-50%);
	width: 100%;
	max-width: 480px;
	background: white;
	border-radius: 24px 24px 0 0;
	padding: 24px;
	z-index: 51;
	display: flex;
	flex-direction: column;
	gap: 16px;
}
.sheet-title {
	font-size: 16px;
	font-weight: 700;
	margin: 0;
}
.sheet-input-wrap {
	display: flex;
	align-items: center;
	border: 1px solid #e0e0e0;
	border-radius: 8px;
	padding: 10px 12px;
	gap: 4px;
}
.sheet-input {
	flex: 1;
	border: none;
	outline: none;
	font-size: 14px;
	text-align: right;
}
.sheet-unit {
	font-size: 14px;
	color: #666;
}
.sheet-actions {
	display: flex;
	gap: 8px;
}
.sheet-btn {
	flex: 1;
	padding: 12px;
	border: none;
	border-radius: 8px;
	font-size: 14px;
	font-weight: 600;
	cursor: pointer;
}
.sheet-btn.reset {
	background: #fff0f0;
	color: #e53e3e;
}
.sheet-btn.cancel {
	background: #f1f1f1;
	color: #333;
}
.sheet-btn.confirm {
	background: #ffd100;
	color: #000;
}

/* 초기화 확인 다이얼로그 */
.confirm-overlay {
	position: fixed;
	inset: 0;
	background: rgba(0, 0, 0, 0.4);
	z-index: 100;
	display: flex;
	align-items: center;
	justify-content: center;
}
.confirm-dialog {
	background: white;
	border-radius: 16px;
	padding: 24px 20px 20px;
	width: 280px;
	display: flex;
	flex-direction: column;
	gap: 8px;
}
.confirm-title {
	font-size: 14px;
	font-weight: 600;
	color: #333;
	margin: 0;
}
.confirm-actions {
	display: flex;
	gap: 8px;
	margin-top: 16px;
}
.confirm-btn {
	flex: 1;
	padding: 11px;
	border: none;
	border-radius: 10px;
	font-size: 14px;
	font-weight: 600;
	cursor: pointer;
}
.confirm-btn.cancel {
	background: #f1f1f1;
	color: #555;
}
.confirm-btn.delete {
	background: #e53e3e;
	color: white;
}
/* 트랜지션 */
.fade-enter-active,
.fade-leave-active {
	transition: opacity 0.2s;
}
.fade-enter-from,
.fade-leave-to {
	opacity: 0;
}
.slide-up-enter-active,
.slide-up-leave-active {
	transition: transform 0.3s ease;
}
.slide-up-enter-from,
.slide-up-leave-to {
	transform: translateX(-50%) translateY(100%);
}

/* 도넛 카드 */
.donut-card {
	display: flex;
	flex-direction: column;
	align-items: center;
	gap: 24px;
	padding: 23px 24px 38px 32px;
	background: #f8f9fa;
	border-radius: 8px;
}
.donut-svg {
	overflow: visible;
}

/* 범례 */
.legend {
	align-self: stretch;
	display: flex;
	flex-direction: column;
	gap: 6px;
}
.legend-item {
	display: flex;
	align-items: center;
	gap: 8px;
}
.legend-dot {
	width: 8px;
	height: 8px;
	border-radius: 50%;
	flex-shrink: 0;
}
.legend-name {
	flex: 1;
	font-size: 12px;
	font-weight: 600;
	color: black;
}
.legend-amount {
	font-size: 12px;
	font-weight: 600;
	color: black;
}
</style>
