import axios from "axios";

console.log('URL BASE ', import.meta.env.VITE_API_BASE_URL);


export const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL
});