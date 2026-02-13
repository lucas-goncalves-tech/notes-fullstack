import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { User, UpdateUserRequest } from '@/types/api';
import { api } from '@/lib/api-client';

export const useUsers = () => {
  return useQuery({
    queryKey: ['users'],
    queryFn: () => api.get<User[]>('/users').then(res => res.data),
    staleTime: 1000 * 60 * 10,
    enabled: false,
  });
};

export const useUser = (id: string) => {
  return useQuery({
    queryKey: ['user', id],
    queryFn: () => api.get<User>(`/users/${id}`).then(res => res.data),
    enabled: !!id,
    staleTime: 1000 * 60 * 10,
  });
};

export const useUpdateUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateUserRequest }) =>
      api.put<User>(`/users/${id}`, data).then(res => res.data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ['user', id] });
      queryClient.invalidateQueries({ queryKey: ['users'] });
      queryClient.invalidateQueries({ queryKey: ['auth', 'me'] });
    },
  });
};

export const useDeleteUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => api.delete(`/users/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
  });
};
