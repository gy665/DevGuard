import axios, { InternalAxiosRequestConfig } from 'axios'; // <-- IMPORT THE CORRECT TYPE

// Create a configured instance of axios for our API
const apiClient = axios.create({
    baseURL: 'http://localhost:5001/api', // The base URL for all backend routes
});

// Use an interceptor to automatically add the auth token from localStorage to every request
apiClient.interceptors.request.use(
    // --- THIS IS THE FIX ---
    // Use the more specific 'InternalAxiosRequestConfig' type.
    (config: InternalAxiosRequestConfig): InternalAxiosRequestConfig => {
        const token = localStorage.getItem('token');
        if (token) {
            // The 'headers' object is guaranteed to exist on this type,
            // so we don't need to check if it's undefined.
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);


apiClient.interceptors.response.use(
    // If the response is successful (status 2xx), just return it.
    (response) => response,

    // If the response is an error, this part runs.
    (error) => {
        // Check if the error is a 401 Unauthorized error
        if (error.response && error.response.status === 401) {
            console.log("Authentication error (401): Token is invalid or expired. Logging out.");

            // Remove the invalid token from storage
            localStorage.removeItem('token');

            // Redirect the user to the login page.
            // Using window.location.href is a forceful way to ensure a full page reload,
            // which clears all application state.
            window.location.href = '/login';
        }

        // For all other errors, just pass them along.
        return Promise.reject(error);
    }
);

// --- The rest of your API functions are perfectly fine and do not need to change ---

export const scanRepositoryApi = (repoUrl: string) => {
    return apiClient.post('/scan/repository', { repoUrl });
};

export const scanContainerApi = (imageName: string) => {
    return apiClient.post('/scan/container', { imageName });
};

export const scanFileApi = (file: File) => {
    const formData = new FormData();
    formData.append('scanFile', file);

    return apiClient.post('/scan/file', formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });
};

export default apiClient;