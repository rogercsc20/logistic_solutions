import axios from 'axios';

const API_BASE_URL = 'http://127.0.0.1:5000';

// Create an Axios instance
const axiosInstance = axios.create({
    baseURL: API_BASE_URL,
});

// Interceptor to handle token refresh
axiosInstance.interceptors.request.use(
    async (config) => {
        // Get tokens from localStorage
        const accessToken = localStorage.getItem('access_token');
        const refreshToken = localStorage.getItem('refresh_token');

        // Attach the access token to headers if available
        if (accessToken) {
            config.headers['Authorization'] = `Bearer ${accessToken}`;
        }

        // Check token expiration and refresh if necessary
        if (isTokenExpired(accessToken) && refreshToken) {
            try {
                const response = await axios.post(`${API_BASE_URL}/refresh`, {}, {
                    headers: {
                        Authorization: `Bearer ${refreshToken}`,
                    },
                });

                const newAccessToken = response.data.access_token;

                // Save the new access token in localStorage
                localStorage.setItem('access_token', newAccessToken);

                // Update the request headers with the new access token
                config.headers['Authorization'] = `Bearer ${newAccessToken}`;
            } catch (error) {
                console.error('Failed to refresh token:', error);

                // Handle logout if token refresh fails
                localStorage.removeItem('access_token');
                localStorage.removeItem('refresh_token');
                window.location.href = '/login'; // Redirect to login
                throw error;
            }
        }

        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Function to check if the token is expired
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

export default axiosInstance;
