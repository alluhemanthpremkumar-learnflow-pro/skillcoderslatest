/**
 * React Query Hooks - Reusable data fetching hooks
 * Centralizes all API calls and state management
 */

import { useQuery, useMutation, useQueryClient, UseQueryResult, UseMutationResult } from '@tanstack/react-query';
import { apiClient, type ApiResponse } from './api';
import { API_ENDPOINTS } from './endpoints';

// Type definition for query/mutation options
type QueryOptions = Record<string, unknown>;
type ProfileData = Record<string, unknown>;
type SubmissionData = Record<string, unknown>;
type AnswersData = Record<string, unknown>;
type CartItem = Record<string, unknown>;
type CheckoutData = Record<string, unknown>;

// ==================== AUTH HOOKS ====================

export const useLogin = (options?: QueryOptions) =>
  useMutation({
    mutationFn: (credentials: { email: string; password: string }) =>
      apiClient.post('/auth/login', credentials),
    ...options,
  });

export const useRegister = (options?: QueryOptions) =>
  useMutation({
    mutationFn: (data: { email: string; password: string; name: string; phone?: string }) =>
      apiClient.post('/auth/register', data),
    ...options,
  });

export const useLogout = (options?: QueryOptions) =>
  useMutation({
    mutationFn: () => apiClient.post('/auth/logout'),
    ...options,
  });

export const useGetProfile = (enabled = true) =>
  useQuery({
    queryKey: ['profile'],
    queryFn: () => apiClient.get('/auth/profile'),
    enabled,
  });

export const useUpdateProfile = (options?: QueryOptions) =>
  useMutation({
    mutationFn: (data: ProfileData) => apiClient.put('/auth/profile', data),
    ...options,
  });

// ==================== COURSES HOOKS ====================

export const useGetCourses = (page = 1, limit = 10, options?: QueryOptions) =>
  useQuery({
    queryKey: ['courses', page, limit],
    queryFn: () => apiClient.get(`/courses?page=${page}&limit=${limit}`),
    ...options,
  });

export const useGetCourse = (id: string, options?: QueryOptions) =>
  useQuery({
    queryKey: ['course', id],
    queryFn: () => apiClient.get(`/courses/${id}`),
    enabled: !!id,
    ...options,
  });

export const useSearchCourses = (query: string, options?: QueryOptions) =>
  useQuery({
    queryKey: ['courses', 'search', query],
    queryFn: () => apiClient.get(`/courses/search?q=${query}`),
    enabled: query.length > 0,
    ...options,
  });

export const useGetCoursesByDomain = (domain: string, options?: QueryOptions) =>
  useQuery({
    queryKey: ['courses', 'domain', domain],
    queryFn: () => apiClient.get(`/courses/domain/${domain}`),
    enabled: !!domain,
    ...options,
  });

export const useEnrollCourse = (options?: QueryOptions) =>
  useMutation({
    mutationFn: (courseId: string) => apiClient.post(`/courses/${courseId}/enroll`),
    ...options,
  });

export const useGetEnrolledCourses = (options?: QueryOptions) =>
  useQuery({
    queryKey: ['courses', 'enrolled'],
    queryFn: () => apiClient.get('/courses/enrolled'),
    ...options,
  });

// ==================== LABS HOOKS ====================

export const useGetLabs = (options?: QueryOptions) =>
  useQuery({
    queryKey: ['labs'],
    queryFn: () => apiClient.get('/labs'),
    ...options,
  });

export const useGetLab = (id: string, options?: QueryOptions) =>
  useQuery({
    queryKey: ['lab', id],
    queryFn: () => apiClient.get(`/labs/${id}`),
    enabled: !!id,
    ...options,
  });

export const useStartLab = (options?: QueryOptions) =>
  useMutation({
    mutationFn: (labId: string) => apiClient.post(`/labs/${labId}/start`),
    ...options,
  });

export const useSubmitLab = (options?: QueryOptions) =>
  useMutation({
    mutationFn: ({ labId, submission }: { labId: string; submission: SubmissionData }) =>
      apiClient.post(`/labs/${labId}/submit`, submission),
    ...options,
  });

// ==================== QUIZZES HOOKS ====================

export const useGetQuizzes = (options?: QueryOptions) =>
  useQuery({
    queryKey: ['quizzes'],
    queryFn: () => apiClient.get('/quizzes'),
    ...options,
  });

export const useGetQuiz = (id: string, options?: QueryOptions) =>
  useQuery({
    queryKey: ['quiz', id],
    queryFn: () => apiClient.get(`/quizzes/${id}`),
    enabled: !!id,
    ...options,
  });

export const useGetQuizzesByDomain = (domain: string, options?: QueryOptions) =>
  useQuery({
    queryKey: ['quizzes', 'domain', domain],
    queryFn: () => apiClient.get(`/quizzes/domain/${domain}`),
    enabled: !!domain,
    ...options,
  });

export const useGetQuizzesByLevel = (level: number, options?: QueryOptions) =>
  useQuery({
    queryKey: ['quizzes', 'level', level],
    queryFn: () => apiClient.get(`/quizzes/level/${level}`),
    enabled: level > 0,
    ...options,
  });

export const useStartQuiz = (options?: QueryOptions) =>
  useMutation({
    mutationFn: (quizId: string) => apiClient.post(`/quizzes/${quizId}/start`),
    ...options,
  });

export const useSubmitQuiz = (options?: QueryOptions) =>
  useMutation({
    mutationFn: ({ quizId, answers }: { quizId: string; answers: AnswersData }) =>
      apiClient.post(`/quizzes/${quizId}/submit`, { answers }),
    ...options,
  });

export const useGetQuizResults = (quizId: string, options?: QueryOptions) =>
  useQuery({
    queryKey: ['quizResults', quizId],
    queryFn: () => apiClient.get(`/quizzes/${quizId}/results`),
    enabled: !!quizId,
    ...options,
  });

// ==================== CERTIFICATES HOOKS ====================

export const useGetCertificates = (options?: QueryOptions) =>
  useQuery({
    queryKey: ['certificates'],
    queryFn: () => apiClient.get('/certificates/user'),
    ...options,
  });

export const useGenerateCertificate = (options?: QueryOptions) =>
  useMutation({
    mutationFn: (courseId: string) => apiClient.post(`/certificates/generate/${courseId}`),
    ...options,
  });

// ==================== MEETINGS HOOKS ====================

export const useGetMeetings = (options?: QueryOptions) =>
  useQuery({
    queryKey: ['meetings'],
    queryFn: () => apiClient.get('/meetings/upcoming'),
    ...options,
  });

export const useGetMeeting = (id: string, options?: QueryOptions) =>
  useQuery({
    queryKey: ['meeting', id],
    queryFn: () => apiClient.get(`/meetings/${id}`),
    enabled: !!id,
    ...options,
  });

export const useJoinMeeting = (options?: QueryOptions) =>
  useMutation({
    mutationFn: (meetingId: string) => apiClient.post(`/meetings/${meetingId}/join`),
    ...options,
  });

// ==================== CART HOOKS ====================

export const useGetCart = (options?: QueryOptions) =>
  useQuery({
    queryKey: ['cart'],
    queryFn: () => apiClient.get('/cart'),
    ...options,
  });

export const useAddToCart = (options?: QueryOptions) =>
  useMutation({
    mutationFn: (item: CartItem) => apiClient.post('/cart/add', item),
    ...options,
  });

export const useRemoveFromCart = (options?: QueryOptions) =>
  useMutation({
    mutationFn: (itemId: string) => apiClient.post('/cart/remove', { itemId }),
    ...options,
  });

export const useCheckout = (options?: QueryOptions) =>
  useMutation({
    mutationFn: (data: CheckoutData) => apiClient.post('/cart/checkout', data),
    ...options,
  });

// ==================== ADMIN HOOKS ====================

export const useGetAdminDashboard = (options?: QueryOptions) =>
  useQuery({
    queryKey: ['admin', 'dashboard'],
    queryFn: () => apiClient.get('/admin/dashboard'),
    ...options,
  });

export const useGetAllUsers = (page = 1, limit = 10, options?: QueryOptions) =>
  useQuery({
    queryKey: ['admin', 'users', page, limit],
    queryFn: () => apiClient.get(`/admin/users?page=${page}&limit=${limit}`),
    ...options,
  });

export const useGetAllPayments = (page = 1, limit = 10, options?: QueryOptions) =>
  useQuery({
    queryKey: ['admin', 'payments', page, limit],
    queryFn: () => apiClient.get(`/admin/payments?page=${page}&limit=${limit}`),
    ...options,
  });

// ==================== GENERAL HOOKS ====================

export const useGetDomains = (options?: QueryOptions) =>
  useQuery({
    queryKey: ['domains'],
    queryFn: () => apiClient.get('/domains'),
    ...options,
  });

export const useHealthCheck = (options?: QueryOptions) =>
  useQuery({
    queryKey: ['health'],
    queryFn: () => apiClient.get('/health'),
    ...options,
  });
