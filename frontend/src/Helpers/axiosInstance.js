import axios from "axios";

const axiosInstance = axios.create(); // Create a new instance of axios

// Configure base URL with safe fallbacks for local dev
const envBaseUrl = import.meta.env?.VITE_BACKEND_URL;
axiosInstance.defaults.baseURL = envBaseUrl && envBaseUrl.trim() !== ''
  ? envBaseUrl
  : (window?.location?.hostname === 'localhost' || window?.location?.hostname === '127.0.0.1')
    ? 'http://localhost:3000'
    : '';

axiosInstance.defaults.withCredentials = true; // Allow cookies to be sent with requests(signed user having token in cookies hence we have to sent cookies in each request to interact with backened)

export default axiosInstance;