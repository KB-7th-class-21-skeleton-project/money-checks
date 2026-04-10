import { defineStore } from "pinia";
import axios from "axios";

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
			const url = "http://localhost:3000/account";
			const payload = { ...formData, amount: Number(formData.amount) };

			try {
				if (accountId) {
					//수정 모드
					await axios.put(`${url}/${accountId}`, payload);
				} else {
					//생성 모드
					await axios.post(url, payload);
				}
			} catch (err) {
				this.error = "저장에 실패했습니다.";
				throw err;
			}
		},
		//단일 데이터 불러오기
		async fetchAccountById(id) {
			const url = `http://localhost:3000/account/${id}`;
			this.loading = true;
			try {
				const response = await axios.get(url);
				this.currentAccount = response.data;
				return response.data;
			} catch (err) {
				this.error = "데이터를 불러오는 데 실패했습니다.";
				throw err;
			} finally {
				this.loading = false;
			}
		},
	},
});
