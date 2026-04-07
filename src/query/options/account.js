import { queryOptions } from "@tanstack/vue-query";
import { getMe, getAccounts, getAccountDetail } from "@/api/account.js";

/**
 * 내 정보를 가져오는 Query Option
 * @returns {import('@tanstack/vue-query').UseQueryOptions}
 */
export const getMeOption = () => {
	return queryOptions({
		queryKey: ["me"],
		queryFn: getMe,
	});
};

/**
 * 특정 유저의 거래 내역 전체를 가져오는 Query Option
 * @param {import('vue').Ref<string|number> | string | number} userId - 조회할 유저 ID
 * @returns {import('@tanstack/vue-query').UseQueryOptions}
 */
export const getAccountsOption = (userId) => {
	return queryOptions({
		queryKey: ["accounts", userId],
		queryFn: () => getAccounts(userId),
	});
};

/**
 * 특정 거래 내역 1건 상세를 가져오는 Query Option
 * @param {import('vue').Ref<string|number> | string | number} accountId - 상세 조회할 거래 내역 ID
 * @returns {import('@tanstack/vue-query').UseQueryOptions}
 */
export const getAccountDetailOption = (accountId) => {
	return queryOptions({
		queryKey: ["accountDetail", accountId],
		queryFn: () => getAccountDetail(accountId),
	});
};
