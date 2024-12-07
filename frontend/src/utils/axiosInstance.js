import axios from 'axios';

const API_BASE_URL = 'http://127.0.0.1:5000';

const axiosInstance = axios.create({
    baseURL: API_BASE_URL,
});

let isRefreshing = false;
let refreshSubscribers = [];

// Utility to notify all subscribers when a new token is available
const onAccessTokenRefreshed = (newAccessToken) => {
    refreshSubscribers.forEach((callback) => callback(newAccessToken));
    refreshSubscribers = [];
};

// Add a subscriber for the token refresh process
const addRefreshSubscriber = (callback) => {
    refreshSubscribers.push(callback);
};

// Check if token is expired
const isTokenExpired = (token) => {
    if (!token) return true;

    try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        const currentTime = Math.floor(Date.now() / 1000);
        return payload.exp < currentTime;
    } catch (error) {
        console.error('Error parsing token:', error);
        return true;
    }
};

// Request interceptor
axiosInstance.interceptors.request.use(
    async (config) => {
        // Skip interceptor logic for login and signup
        if (config.url === '/login' || config.url === '/register') {
            return config;
        }

        const accessToken = localStorage.getItem('access_token');
        const refreshToken = localStorage.getItem('refresh_token');

        // Attach access token if available and not expired
        if (accessToken && !isTokenExpired(accessToken)) {
            config.headers['Authorization'] = `Bearer ${accessToken}`;
            return config;
        }

        // Handle token refresh if access token is expired
        if (isTokenExpired(accessToken) && refreshToken) {
            if (!isRefreshing) {
                isRefreshing = true;

                try {
                    const response = await axios.post(`${API_BASE_URL}/refresh`, {}, {
                        headers: {
                            Authorization: `Bearer ${refreshToken}`,
                        },
                    });

                    const newAccessToken = response.data.access_token;

                    // Save the new access token
                    localStorage.setItem('access_token', newAccessToken);

                    // Notify all subscribers about the new token
                    onAccessTokenRefreshed(newAccessToken);
                } catch (error) {
                    console.error('Token refresh failed:', error);

                    // Clear tokens and redirect to login
                    localStorage.removeItem('access_token');
                    localStorage.removeItem('refresh_token');
                    window.location.href = '/login';
                    throw error;
                } finally {
                    isRefreshing = false;
                }
            }

            // Wait for the token to be refreshed and retry the request
            return new Promise((resolve) => {
                addRefreshSubscriber((newAccessToken) => {
                    config.headers['Authorization'] = `Bearer ${newAccessToken}`;
                    resolve(config);
                });
            });
        }

        // If no valid token is available, redirect to login
        if (!accessToken && !refreshToken) {
            console.warn('No valid tokens available. Redirecting to login.');
            window.location.href = '/login';
        }

        return config;
    },
    (error) => Promise.reject(error)
);

export default axiosInstance;
