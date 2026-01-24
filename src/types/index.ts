// src/types/index.ts

// User types
export interface User {
  _id: string;
  email: string;
  fullName: string;
  role: string;
  avatar?: string;
  createdAt?: string;
  updatedAt?: string;
}

// Auth types
export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  fullName: string;
  password: string;
}

export interface AuthResponse {
  access_token: string;
  user: User;
}
