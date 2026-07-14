import axios from 'axios'
import ENV from "./env.utils"
import { useAuthStore } from '../store/auth.store'

const apiClient = axios.create({
    baseURL: ENV.BASE_URL_API,
    headers: {
        'Content-Type': 'application/json',
    },
})

// Inject token into requests
apiClient.interceptors.request.use((config) => {
    const authStore = useAuthStore.getState();
    const isRefreshEndpoint = config.url?.includes('/v1/auth/refresh');
    const token = isRefreshEndpoint ? authStore.refreshToken : authStore.accessToken;
    
    if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

let isRefreshing = false;
interface FailedQueueItem {
    resolve: (token: string) => void;
    reject: (error: any) => void;
}
let failedQueue: FailedQueueItem[] = [];

const processQueue = (error: any, token: string | null = null) => {
    failedQueue.forEach((prom) => {
        if (error) {
            prom.reject(error);
        } else {
            prom.resolve(token!);
        }
    });
    failedQueue = [];
};

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
            if (isRefreshing) {
                return new Promise<string>((resolve, reject) => {
                    failedQueue.push({ resolve, reject });
                })
                    .then((token) => {
                        originalRequest.headers.Authorization = `Bearer ${token}`;
                        return apiClient(originalRequest);
                    })
                    .catch((err) => {
                        return Promise.reject(err);
                    });
            }

            originalRequest._retry = true;
            isRefreshing = true;

            return new Promise((resolve, reject) => {
                const authStore = useAuthStore.getState();
                authStore.refreshAuth()
                    .then(() => {
                        const newToken = useAuthStore.getState().accessToken;
                        if (newToken && originalRequest.headers) {
                            originalRequest.headers.Authorization = `Bearer ${newToken}`;
                            processQueue(null, newToken);
                            resolve(apiClient(originalRequest));
                        } else {
                            const err = new Error('Erro ao renovar token');
                            processQueue(err, null);
                            reject(err);
                        }
                    })
                    .catch((refreshError) => {
                        processQueue(refreshError, null);
                        useAuthStore.getState().logout();
                        reject(refreshError);
                    })
                    .finally(() => {
                        isRefreshing = false;
                    });
            });
        }

        return Promise.reject(error);
    }
);

export default apiClient