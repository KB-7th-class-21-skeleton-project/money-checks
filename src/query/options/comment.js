import { queryOptions } from "@tanstack/vue-query";
import { getComments } from "@/api/comment.js";

/**
 * 특정 거래 내역에 달린 댓글 목록을 가져오는 Query Option
 * @param {import('vue').Ref<string|number> | string | number} accountId - 거래 내역 ID
 * @returns {import('@tanstack/vue-query').UseQueryOptions}
 */
export const getCommentsOption = (accountId) => {
	return queryOptions({
		queryKey: ["comments", accountId],
		queryFn: () => getComments(accountId),
	});
};
