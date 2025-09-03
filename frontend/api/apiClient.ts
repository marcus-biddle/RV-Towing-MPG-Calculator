import axios from "axios";

export const clearStorage = () => {
  console.warn("Clearing local storage due to API failure...");
  localStorage.clear();
};

let failureCount = 0;
const MAX_FAILURES = 3; // configurable

const BASE_URL = "https://stock-tracker-vbdy.onrender.com"; //https://stock-tracker-vbdy.onrender.com

export const apiClient = axios.create({
  baseURL: BASE_URL,
  timeout: 20000,
});

// Response interceptor
apiClient.interceptors.response.use(
  (response) => {
    // reset on success
    failureCount = 0;
    return response;
  },
  (error) => {
    failureCount++;
    console.error("API error:", error.code || error.message);

    if (failureCount >= MAX_FAILURES) {
      clearStorage();
      failureCount = 0; // reset after clearing
    }

    return Promise.reject(error);
  }
);
