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
	// userId 값을 쿼리 파라미터로 전달해 해당 유저의 기록만 필터링합니다.
	return api.get("/account", { params: { userId } });
};

/**
 * 특정 거래 내역 1건을 상세 조회합니다. (댓글 포함)
 * @param {string|number} accountId - 상세 조회할 거래 내역 ID
 * @returns {Promise<Object>} 거래 내역과 댓글이 포함된 객체
 */
export const getAccountDetail = (accountId) => {
	// _embed=comments 를 통해 관련 댓글 목록까지 같이 가져옵니다.
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
