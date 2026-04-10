import { api } from "@/api/instance.js";

/**
 * 전체 유저 목록을 조회합니다.
 * @returns {Promise<Array>} 유저 배열
 */
export const getUsers = () => {
	return api.get("/users");
};

/**
 * 특정 유저 정보를 상세 조회합니다.
 * @param {string|number} userId - 조회할 유저 ID
 * @returns {Promise<Object>} 유저 객체
 */
export const getUser = (userId) => {
	return api.get(`/users/${userId}`);
};

/**
 * 내 정보를 조회합니다.
 * @returns {Promise<Object>} 내 정보 객체
 */
export const getMe = () => {
	return api.get("/me");
};

/**
 * 내 정보를 수정합니다 (친구 목록 업데이트 등).
 * @param {Object} data - 수정할 내 정보 데이터
 * @returns {Promise<Object>} 수정된 내 정보 객체
 */
export const updateMe = (data) => {
	return api.patch("/me", data);
};
