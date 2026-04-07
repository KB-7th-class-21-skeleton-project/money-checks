<script setup>
import { useMutation, useQuery, useQueryClient } from "@tanstack/vue-query";
import { postAccount, patchAccount, deleteAccount } from "@/api/account.js";
import { getAccountsOption, getMeOption } from "@/query/options/account.js";

// 1. GET
const { data: me, suspense: suspenseMe } = useQuery(getMeOption());
await suspenseMe();

// 2. GET
const { data: accounts, suspense: suspenseAccounts } = useQuery(getAccountsOption(1));
await suspenseAccounts();

// 3. POST
const queryClient = useQueryClient();
const { mutate: addAccount, isPending: isAdding } = useMutation({
	mutationFn: postAccount,
	onSuccess: () => {
		queryClient.invalidateQueries(getAccountsOption(1));
	},
});

const handleAddAccount = () => {
	addAccount({
		userId: 1,
		date: new Date().toISOString().split("T")[0],
		time: "12:00",
		bankName: "KB국민은행",
		content: "테스트 지출",
		category: "기타",
		amount: Math.floor(Math.random() * 10000) + 1000,
		type: "out",
		memo: "API 연동 테스트입니다.",
	});
};

// 4. PATCH
const { mutate: updateAccount, isPending: isUpdating } = useMutation({
	mutationFn: patchAccount,
	onSuccess: () => {
		queryClient.invalidateQueries(getAccountsOption(1));
	},
});

const handlePatchAccount = () => {
	if (!accounts.value || accounts.value.length === 0) return;
	const lastItem = accounts.value[accounts.value.length - 1];
	updateAccount({
		accountId: lastItem.id,
		data: { memo: "수정된 메모 내용입니다! (PATCH 성공)" },
	});
};

// 5. DELETE
const { mutate: removeAccount, isPending: isDeleting } = useMutation({
	mutationFn: deleteAccount,
	onSuccess: () => {
		queryClient.invalidateQueries(getAccountsOption(1));
	},
});

const handleDeleteAccount = () => {
	if (!accounts.value || accounts.value.length === 0) return;
	const lastItem = accounts.value[accounts.value.length - 1];
	removeAccount(lastItem.id);
};
</script>

<template>
	<div class="">
		<h1 class="text-3xl font-bold text-gray-800">프론트엔드 API 연동 테스트</h1>

		<!-- 1. POST / PATCH / DELETE Mutation 테스트 버튼 그룹 -->
		<section class="border p-6 rounded-xl bg-white shadow-sm space-y-4">
			<h2 class="text-xl font-bold text-gray-800">1. 데이터 변경 (POST / PATCH / DELETE)</h2>
			<p class="text-gray-600">
				아래 버튼을 누르면 데이터가 추가/수정/삭제되며, 성공 시 `useGetAccounts`가 재호출되어 화면이
				즉시 갱신됩니다.
			</p>
			<div class="flex flex-wrap gap-4">
				<button
					@click="handleAddAccount"
					:disabled="isAdding"
					class="px-5 py-2.5 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
				>
					{{ isAdding ? "저장 중..." : "내역 추가 (POST)" }}
				</button>
				<button
					@click="handlePatchAccount"
					:disabled="isUpdating || !accounts?.length"
					class="px-5 py-2.5 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 disabled:opacity-50 transition-colors"
				>
					{{ isUpdating ? "수정 중..." : "마지막 내역 수정 (PATCH)" }}
				</button>
				<button
					@click="handleDeleteAccount"
					:disabled="isDeleting || !accounts?.length"
					class="px-5 py-2.5 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700 disabled:opacity-50 transition-colors"
				>
					{{ isDeleting ? "삭제 중..." : "마지막 내역 삭제 (DELETE)" }}
				</button>
			</div>
		</section>

		<div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
			<!-- 2. 내 정보 조회 결과 -->
			<section class="border p-6 rounded-xl bg-white shadow-sm flex flex-col h-96">
				<h2 class="text-xl font-bold text-gray-800 mb-4">2. 내 정보 (useGetMeOption)</h2>
				<pre class="text-sm bg-gray-900 text-green-400 p-4 rounded-lg overflow-auto flex-1">{{
					JSON.stringify(me, null, 2)
				}}</pre>
			</section>

			<!-- 3. 거래 내역 조회 결과 -->
			<section class="border p-6 rounded-xl bg-wh ite shadow-sm flex flex-col h-96">
				<h2 class="text-xl font-bold text-gray-800 mb-4">3. 거래 내역 (useGetAccountsOption)</h2>
				<pre class="text-sm bg-gray-900 text-blue-300 p-4 rounded-lg overflow-auto flex-1">{{
					JSON.stringify(accounts, null, 2)
				}}</pre>
			</section>
		</div>
	</div>
</template>
