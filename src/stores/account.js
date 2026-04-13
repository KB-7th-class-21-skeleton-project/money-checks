import { defineStore } from "pinia";
import { api } from "@/api/instance";

export const useAccountStore = defineStore("account", {
	state: () => ({
		currentAccount: null,
		loading: false,
		error: null,
		id: "",
	}),
	actions: {
		// 데이터 저장
		async saveAccount(formData, accountId = null) {
			const payload = { ...formData, amount: Number(formData.amount) };

			try {
				if (accountId) {
					//수정 모드
					await api.put(`/account/${accountId}`, payload);
				} else {
					//생성 모드
					await api.post("/account", payload);
				}
			} catch (err) {
				this.error = "저장에 실패했습니다.";
				throw err;
			}
		},
		//단일 데이터 불러오기
		async fetchAccountById(id) {
			this.loading = true;
			try {
				const responseData = await api.get(`/account/${id}`);
				this.currentAccount = responseData;
				return responseData;
			} catch (err) {
				this.error = "데이터를 불러오는 데 실패했습니다.";
				throw err;
			} finally {
				this.loading = false;
			}
		},
	},
});
