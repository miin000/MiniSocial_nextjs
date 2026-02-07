// src/lib/axios.ts
import axios from 'axios';
import { useAuthStore } from '@/store/auth.store';

// Tạo một instance axios
const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Cấu hình "Interceptor" (Người can thiệp)
// Đoạn code này sẽ chạy *trước khi* bất kỳ request nào được gửi đi
api.interceptors.request.use(
  (config) => {
    // Lấy token từ Zustand store (lấy trực tiếp state)
    const token = useAuthStore.getState().token;

    if (token) {
      // Nếu có token, gắn nó vào header Authorization
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);
api.interceptors.request.use((config) => {
  const token = useAuthStore.getState().token;

  console.log("AXIOS TOKEN =", token);

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export default api;