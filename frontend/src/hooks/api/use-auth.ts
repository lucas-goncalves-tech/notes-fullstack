import { useMutation, useQuery } from '@tanstack/react-query';
import { RegisterRequest, LoginRequest, User } from '@/types/api';
import { api } from '@/lib/api-client';

export const useLogin = () => {
  return useMutation({
    mutationFn: (data: LoginRequest) => api.post('/auth/login', data),
  });
};

export const useRegister = () => {
  return useMutation({
    mutationFn: (data: RegisterRequest) => api.post('/auth/register', data),
  });
};

export const useAuthMe = () => {
  return useQuery({
    queryKey: ['auth', 'me'],
    queryFn: () => api.get<User>('/auth/me').then(res => res.data),
    staleTime: 1000 * 60 * 15,
    enabled: false,
  });
};
