// src/store/auth.store.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import api from '@/lib/axios';
import { toast } from 'react-hot-toast';

// Định nghĩa interface cho User (khớp với API response)
export interface User {
  id: string;
  user_id?: string;
  email: string;
  username?: string;
  fullName?: string;
  full_name?: string;
  roles_admin?: string;
  roles_group?: string[];
  avatar?: string;
}

// Thời gian session tồn tại: 12 giờ (ms)
const SESSION_DURATION_MS = 12 * 60 * 60 * 1000

function setAuthCookie() {
  if (typeof document === 'undefined') return
  document.cookie = `auth-token=1; max-age=${12 * 60 * 60}; path=/; SameSite=Strict`
}

function clearAuthCookie() {
  if (typeof document === 'undefined') return
  document.cookie = 'auth-token=; max-age=0; path=/; SameSite=Strict'
}

// Định nghĩa interface cho AuthState
interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  loginAt: number | null; // timestamp đăng nhập

  // Actions
  login: (identifier: string, password: string) => Promise<boolean>;
  register: (email: string, username: string, fullName: string, password: string) => Promise<boolean>;
  logout: () => void;
  setUser: (user: User | null) => void;
  fetchMe: () => Promise<void>;
  checkSessionExpiry: () => void;
}

// Tạo Zustand store với persist middleware (lưu vào localStorage)
export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,
      loginAt: null,

      // Đăng nhập
      login: async (identifier: string, password: string) => {
        set({ isLoading: true });
        try {
          const response = await api.post('/auth/login', { identifier, password });
          const { accessToken, user } = response.data;

          const loginAt = Date.now()
          set({
            token: accessToken,
            user: user,
            isAuthenticated: true,
            isLoading: false,
            loginAt,
          });
          setAuthCookie()

          toast.success('Đăng nhập thành công!');
          return true;
        } catch (error: any) {
          console.error('Login failed:', error);
          toast.error(error.response?.data?.message || 'Đăng nhập thất bại!');
          set({ isLoading: false });
          return false;
        }
      },

      // Đăng ký
      register: async (email: string, username: string, fullName: string, password: string) => {
        set({ isLoading: true });
        try {
          await api.post('/auth/register', { 
            email, 
            username,
            full_name: fullName, 
            password 
          });
          toast.success('Đăng ký thành công! Vui lòng đăng nhập.');
          set({ isLoading: false });
          return true;
        } catch (error: any) {
          console.error('Register failed:', error);
          toast.error(error.response?.data?.message || 'Đăng ký thất bại!');
          set({ isLoading: false });
          return false;
        }
      },

      // Đăng xuất
      logout: () => {
        clearAuthCookie()
        set({
          user: null,
          token: null,
          isAuthenticated: false,
          loginAt: null,
        });
        toast.success('Đã đăng xuất!');
      },

      // Kiểm tra session còn hạn không (gọi khi app khởi động)
      checkSessionExpiry: () => {
        const { loginAt, isAuthenticated } = get()
        if (!isAuthenticated || !loginAt) return
        if (Date.now() - loginAt > SESSION_DURATION_MS) {
          clearAuthCookie()
          set({ user: null, token: null, isAuthenticated: false, loginAt: null })
          // Không toast ở đây vì có thể chưa mount
        } else {
          // Làm mới cookie cho đủ 12h từ lần check hiện tại
          setAuthCookie()
        }
      },

      // Set user
      setUser: (user: User | null) => {
        set({ user });
      },

      // Lấy thông tin user hiện tại
      fetchMe: async () => {
        const token = get().token;
        if (!token) return;

        try {
          const response = await api.get('/auth/me');
          // Merge thông tin từ /me vào user hiện tại
          const currentUser = get().user;
          set({ 
            user: { ...currentUser, ...response.data },
            isAuthenticated: true 
          });
        } catch (error) {
          // Token không hợp lệ, đăng xuất
          get().logout();
        }
      },
    }),
    {
      name: 'auth-storage', // Tên key trong localStorage
      partialize: (state) => ({
        token: state.token,
        user: state.user,
        isAuthenticated: state.isAuthenticated,
        loginAt: state.loginAt,
      }),
      onRehydrateStorage: () => (state) => {
        if (!state) return
        // Tự động logout nếu session đã hết 12h
        if (state.isAuthenticated && state.loginAt) {
          if (Date.now() - state.loginAt > SESSION_DURATION_MS) {
            clearAuthCookie()
            state.user = null
            state.token = null
            state.isAuthenticated = false
            state.loginAt = null
          } else {
            setAuthCookie()
          }
        }
      },
    }
  )
);
