import { api } from "@/api/instance.js";

/**
 * 내 정보를 조회합니다.
 * @returns {Promise<Object>} 내 정보 객체
 */
export const getMe = () => {
	return api.get("/me");
};

/**
 * 특정 유저의 거래 내역 전체를 조회합니다.
 * @param {string|number} userId - 조회할 유저 ID
 * @returns {Promise<Array>} 거래 내역 배열
 */
export const getAccounts = (userId) => {
	return api.get("/account", { params: { userId } });
};

/**
 * 특정 거래 내역 1건을 상세 조회합니다. (댓글 포함)
 * @param {string|number} accountId - 상세 조회할 거래 내역 ID
 * @returns {Promise<Object>} 거래 내역과 댓글이 포함된 객체
 */
export const getAccountDetail = (accountId) => {
	return api.get(`/account/${accountId}`, { params: { _embed: "comments" } });
};

/**
 * 새로운 거래 내역을 추가합니다.
 * @param {Object} data - 추가할 거래 내역 데이터 (예: 금액, 분류, 내용 등)
 * @returns {Promise<Object>} 추가 완료된 거래 내역
 */
export const postAccount = (data) => {
	return api.post("/account", data);
};

/**
 * 특정 거래 내역을 수정(업데이트)합니다.
 * @param {Object} payload - 파라미터 묶음 객체
 * @param {string|number} payload.accountId - 수정할 거래 내역 ID
 * @param {Object} payload.data - 수정할 데이터 페이로드
 * @returns {Promise<Object>} 수정 완료된 거래 내역
 */
export const patchAccount = ({ accountId, data }) => {
	return api.patch(`/account/${accountId}`, data);
};

/**
 * 특정 거래 내역을 삭제합니다.
 * @param {string|number} accountId - 삭제할 거래 내역 ID
 * @returns {Promise<Object>} 성공 빈 객체
 */
export const deleteAccount = (accountId) => {
	return api.delete(`/account/${accountId}`);
};

const BASE = "http://localhost:3000";

const http = async (url, options = {}) => {
	const res = await fetch(`${BASE}${url}`, {
		headers: { "Content-Type": "application/json" },
		...options,
	});
	if (!res.ok) throw new Error(`HTTP ${res.status}`);
	return res.json();
};

// 유저 단건 (id로)
export const getUser = (id) => http(`/users/${id}`);

// 유저 목록
export const getUsers = () => http("/users");

// 가계부 단건
export const getAccount = (id) => http(`/account/${id}`);

// 댓글 목록 (accountId 기준)
export const getComments = async (accountId) => {
	const all = await http("/comments");
	return all.filter((c) => String(c.accountId) === String(accountId));
};

// 댓글 작성
export const createComment = (data) =>
	http("/comments", { method: "POST", body: JSON.stringify(data) });

// 댓글 수정
export const updateComment = (id, data) =>
	http(`/comments/${id}`, { method: "PATCH", body: JSON.stringify(data) });

// 댓글 삭제
export const deleteComment = (id) => http(`/comments/${id}`, { method: "DELETE" });

// 리액션 목록 (accountId 기준)
export const getReactions = async (accountId) => {
	const all = await http("/reactions");
	return all.filter((r) => String(r.accountId) === String(accountId));
};

// 리액션 추가
export const createReaction = (data) =>
	http("/reactions", { method: "POST", body: JSON.stringify(data) });

// 리액션 삭제
export const deleteReaction = (id) => http(`/reactions/${id}`, { method: "DELETE" });
