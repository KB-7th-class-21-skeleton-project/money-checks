import axios from "axios";

export const api = axios.create({
	baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:3000",
	timeout: 5000,
});

api.interceptors.response.use(
	(response) => response.data,
	(error) => {
		console.error("API 통신 에러:", error);
		return Promise.reject(error);
	},
);
