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

// Định nghĩa interface cho AuthState
interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;

  // Actions
  login: (identifier: string, password: string) => Promise<boolean>;
  register: (email: string, username: string, fullName: string, password: string) => Promise<boolean>;
  logout: () => void;
  setUser: (user: User | null) => void;
  fetchMe: () => Promise<void>;
}

// Tạo Zustand store với persist middleware (lưu vào localStorage)
export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,

      // Đăng nhập
      login: async (identifier: string, password: string) => {
        set({ isLoading: true });
        try {
          const response = await api.post('/auth/login', { identifier, password });
          const { accessToken, user } = response.data;

          set({
            token: accessToken,
            user: user,
            isAuthenticated: true,
            isLoading: false,
          });

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
        set({
          user: null,
          token: null,
          isAuthenticated: false,
        });
        toast.success('Đã đăng xuất!');
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
      }),
    }
  )
);
