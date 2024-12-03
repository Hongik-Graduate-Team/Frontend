import axios from "axios";

// Axios 인스턴스 생성
const axiosClient = axios.create({
    baseURL: "https://namanba.shop", // 공통 API 베이스 URL 설정
    timeout: 10000, // 요청 타임아웃 설정
    withCredentials: true, // 쿠키를 통한 인증 정보 포함
});

// Axios 인터셉터 설정 함수
export const setupAxiosInterceptors = (navigate) => {
    // 요청 인터셉터 설정
    axiosClient.interceptors.request.use((config) => {
        const accessToken = localStorage.getItem("userToken");
        const refreshToken = localStorage.getItem("refreshToken");

        // 헤더에 액세스 토큰과 리프레시 토큰 추가
        if (accessToken) config.headers.Authorization = `Bearer ${accessToken}`;
        if (refreshToken) config.headers["Refresh-Token"] = refreshToken;

        return config;
    });

    // 응답 인터셉터 설정
    axiosClient.interceptors.response.use(
        (response) => response, // 정상 응답은 그대로 반환
        async (error) => {
            const originalRequest = error.config;

            // 401 에러 처리 (액세스 토큰 만료 시)
            if (error.response?.status === 401 && !originalRequest._retry) {
                originalRequest._retry = true; // 무한 루프 방지

                try {
                    console.error("401 에러 - 토큰 만료. 새로운 토큰 발급 요청 중...");

                    const refreshToken = localStorage.getItem("refreshToken");
                    if (!refreshToken) {
                        console.error("리프레시 토큰 없음. 다시 로그인 필요.");
                        navigate("/signin");
                        return Promise.reject(error);
                    }

                    // 리프레시 토큰으로 새 액세스 토큰 요청
                    const { data } = await axiosClient.post("/refresh-token", {
                        refreshToken,
                    });

                    // 새 액세스 토큰 저장
                    localStorage.setItem("userToken", data.token);
                    console.log("새 액세스 토큰 발급 완료:", data.token);

                    // 원래 요청에 새 토큰 추가 후 재요청
                    originalRequest.headers.Authorization = `Bearer ${data.token}`;
                    return axiosClient(originalRequest);
                } catch (refreshError) {
                    console.error("토큰 재발급 실패:", refreshError);

                    // 재발급 실패 시 로그아웃 처리
                    localStorage.removeItem("userToken");
                    localStorage.removeItem("refreshToken");
                    alert("세션이 만료되었습니다. 다시 로그인해주세요.");
                    navigate("/signin");
                    return Promise.reject(refreshError);
                }
            }

            // 기타 에러 반환
            return Promise.reject(error);
        }
    );
};

export default axiosClient;
