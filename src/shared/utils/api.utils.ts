import axios from 'axios'
import ENV from "./env.utils"
import { useAuthStore } from '../../store/auth.store'

const apiClient = axios.create({
    baseURL: ENV.BASE_URL_API,
    headers: {
        'Content-Type': 'application/json',
    },
})

// Inject token into requests
apiClient.interceptors.request.use((config) => {
    const token = useAuthStore.getState().accessToken;
    if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// Handle 401 Unauthorized for token refresh
apiClient.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        // Prevent infinite loops if refresh also fails with 401
        if (
            error.response?.status === 401 &&
            !originalRequest._retry &&
            originalRequest.url !== '/v1/auth/refresh'
        ) {
            originalRequest._retry = true;

            try {
                const authStore = useAuthStore.getState();
                await authStore.refreshAuth();
                
                const newToken = useAuthStore.getState().accessToken;
                if (newToken && originalRequest.headers) {
                    originalRequest.headers.Authorization = `Bearer ${newToken}`;
                    return apiClient(originalRequest);
                }
            } catch (refreshError) {
                useAuthStore.getState().logout();
                return Promise.reject(refreshError);
            }
        }

        return Promise.reject(error);
    }
);

export default apiClient