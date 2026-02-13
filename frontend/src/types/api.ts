export type UserRole = 'user' | 'admin';
export type ImportanceLevel = 'baixo' | 'medio' | 'alto';
export type CompletionStatus = 0 | 1;

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  created_at: string;
  updated_at: string;
}

export interface UserWithToken extends User {
  iat: number;
  exp: number;
}

export interface Note {
  id: string;
  user_id: string;
  title: string;
  description: string;
  importance: ImportanceLevel;
  completed: CompletionStatus;
  created_at: string;
  updated_at: string;
}

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
  repassword: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
}

export interface CreateNoteRequest {
  title: string;
  description: string;
  importance: ImportanceLevel;
}

export interface UpdateNoteRequest {
  title?: string;
  description?: string;
  importance?: ImportanceLevel;
  completed?: CompletionStatus;
}

export interface UpdateUserRequest {
  name?: string;
}

export interface ApiError {
  message: string;
  error?: ValidationError[];
}

export interface ValidationError {
  path: string;
  message: string;
}

export interface ApiResponse<T = any> {
  data?: T;
  error?: ApiError;
  status: number;
}