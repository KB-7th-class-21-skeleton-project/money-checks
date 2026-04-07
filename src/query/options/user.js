import { queryOptions } from "@tanstack/vue-query";
import { getUsers, getUser } from "@/api/user.js";

/**
 * 전체 유저 목록을 가져오는 Query Option
 * @returns {import('@tanstack/vue-query').UseQueryOptions}
 */
export const getUsersOption = () => {
	return queryOptions({
		queryKey: ["users"],
		queryFn: getUsers,
	});
};

/**
 * 특정 유저 정보를 상세 조회하는 Query Option
 * @param {import('vue').Ref<string|number> | string | number} userId - 조회할 유저 ID
 * @returns {import('@tanstack/vue-query').UseQueryOptions}
 */
export const getUserOption = (userId) => {
	return queryOptions({
		queryKey: ["user", userId],
		queryFn: () => getUser(userId),
	});
};
