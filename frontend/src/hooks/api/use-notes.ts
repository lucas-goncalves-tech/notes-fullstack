import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Note, CreateNoteRequest, UpdateNoteRequest } from '@/types/api';
import { api } from '@/lib/api-client';

export const useNotes = () => {
  return useQuery({
    queryKey: ['notes'],
    queryFn: () => api.get<Note[]>('/notes').then(res => res.data),
    staleTime: 1000 * 60 * 5,
  });
};

export const useNote = (id: string) => {
  return useQuery({
    queryKey: ['note', id],
    queryFn: () => api.get<Note>(`/notes/${id}`).then(res => res.data),
    enabled: !!id,
    staleTime: 1000 * 60 * 5,
  });
};

export const useCreateNote = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateNoteRequest) => api.post<Note>('/notes', data).then(res => res.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notes'] });
    },
  });
};

export const useUpdateNote = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateNoteRequest }) =>
      api.put<Note>(`/notes/${id}`, data).then(res => res.data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ['notes'] });
      queryClient.invalidateQueries({ queryKey: ['note', id] });
    },
  });
};

export const useDeleteNote = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => api.delete(`/notes/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notes'] });
    },
  });
};
