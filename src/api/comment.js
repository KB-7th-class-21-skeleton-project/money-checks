import { api } from "@/api/instance.js";

/**
 * 특정 거래 내역에 달린 댓글 목록을 조회합니다.
 * @param {string|number} accountId - 거래 내역 ID
 * @returns {Promise<Array>} 댓글 배열
 */
export const getComments = (accountId) => {
	return api.get("/comments", { params: { accountId } });
};

/**
 * 새로운 댓글을 작성합니다.
 * @param {Object} data - 댓글 데이터 (accountId, userId, content 등)
 * @returns {Promise<Object>} 추가된 댓글 객체
 */
export const postComment = (data) => {
	return api.post("/comments", data);
};

/**
 * 특정 댓글을 삭제합니다.
 * @param {string|number} commentId - 삭제할 댓글 ID
 * @returns {Promise<Object>} 빈 객체
 */
export const deleteComment = (commentId) => {
	return api.delete(`/comments/${commentId}`);
};
