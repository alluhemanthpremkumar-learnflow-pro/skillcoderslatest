/**
 * API Endpoints - Centralized endpoint definitions
 * Makes it easy to manage and update all API routes
 */

export const API_ENDPOINTS = {
  // Auth Endpoints
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    LOGOUT: '/auth/logout',
    REFRESH: '/auth/refresh',
    VERIFY_EMAIL: '/auth/verify-email',
    RESET_PASSWORD: '/auth/reset-password',
    CHANGE_PASSWORD: '/auth/change-password',
    GET_PROFILE: '/auth/profile',
    UPDATE_PROFILE: '/auth/profile',
  },

  // Courses Endpoints
  COURSES: {
    GET_ALL: '/courses',
    GET_ONE: (id: string) => `/courses/${id}`,
    CREATE: '/courses',
    UPDATE: (id: string) => `/courses/${id}`,
    DELETE: (id: string) => `/courses/${id}`,
    SEARCH: '/courses/search',
    GET_BY_DOMAIN: (domain: string) => `/courses/domain/${domain}`,
    ENROLL: (courseId: string) => `/courses/${courseId}/enroll`,
    GET_ENROLLED: '/courses/enrolled',
  },

  // Labs Endpoints
  LABS: {
    GET_ALL: '/labs',
    GET_ONE: (id: string) => `/labs/${id}`,
    CREATE: '/labs',
    UPDATE: (id: string) => `/labs/${id}`,
    DELETE: (id: string) => `/labs/${id}`,
    START: (labId: string) => `/labs/${labId}/start`,
    SUBMIT: (labId: string) => `/labs/${labId}/submit`,
  },

  // Quizzes Endpoints
  QUIZZES: {
    GET_ALL: '/quizzes',
    GET_ONE: (id: string) => `/quizzes/${id}`,
    GET_BY_DOMAIN: (domain: string) => `/quizzes/domain/${domain}`,
    GET_BY_LEVEL: (level: number) => `/quizzes/level/${level}`,
    START: (quizId: string) => `/quizzes/${quizId}/start`,
    SUBMIT_ANSWER: (quizId: string) => `/quizzes/${quizId}/submit`,
    GET_RESULTS: (quizId: string) => `/quizzes/${quizId}/results`,
  },

  // Users Endpoints
  USERS: {
    GET_ALL: '/users',
    GET_ONE: (id: string) => `/users/${id}`,
    UPDATE: (id: string) => `/users/${id}`,
    DELETE: (id: string) => `/users/${id}`,
    SEARCH: '/users/search',
    GET_STATISTICS: (id: string) => `/users/${id}/statistics`,
  },

  // Instructors Endpoints
  INSTRUCTORS: {
    GET_ALL: '/instructors',
    GET_ONE: (id: string) => `/instructors/${id}`,
    APPLY: '/instructors/apply',
    GET_PENDING: '/instructors/pending',
    APPROVE: (id: string) => `/instructors/${id}/approve`,
    REJECT: (id: string) => `/instructors/${id}/reject`,
    GET_DASHBOARD: '/instructors/dashboard',
  },

  // Certificates Endpoints
  CERTIFICATES: {
    GET_ALL: '/certificates',
    GET_ONE: (id: string) => `/certificates/${id}`,
    GENERATE: (courseId: string) => `/certificates/generate/${courseId}`,
    DOWNLOAD: (id: string) => `/certificates/${id}/download`,
    GET_USER_CERTIFICATES: '/certificates/user',
  },

  // Meetings Endpoints
  MEETINGS: {
    GET_ALL: '/meetings',
    GET_ONE: (id: string) => `/meetings/${id}`,
    CREATE: '/meetings',
    UPDATE: (id: string) => `/meetings/${id}`,
    DELETE: (id: string) => `/meetings/${id}`,
    JOIN: (id: string) => `/meetings/${id}/join`,
    GET_UPCOMING: '/meetings/upcoming',
    GET_USER_MEETINGS: '/meetings/user',
  },

  // Cart Endpoints
  CART: {
    GET: '/cart',
    ADD: '/cart/add',
    REMOVE: '/cart/remove',
    UPDATE: '/cart/update',
    CLEAR: '/cart/clear',
    CHECKOUT: '/cart/checkout',
  },

  // Payment Endpoints
  PAYMENTS: {
    GET_ALL: '/payments',
    GET_ONE: (id: string) => `/payments/${id}`,
    CREATE: '/payments',
    VERIFY: '/payments/verify',
    REFUND: (id: string) => `/payments/${id}/refund`,
    GET_USER_PAYMENTS: '/payments/user',
  },

  // Admin Endpoints
  ADMIN: {
    GET_DASHBOARD: '/admin/dashboard',
    GET_ANALYTICS: '/admin/analytics',
    GET_USERS: '/admin/users',
    GET_PAYMENTS: '/admin/payments',
    GET_REPORTS: '/admin/reports',
    UPDATE_SETTINGS: '/admin/settings',
  },

  // Schools Endpoints
  SCHOOLS: {
    GET_ALL: '/schools',
    GET_ONE: (id: string) => `/schools/${id}`,
    REGISTER: '/schools/register',
    UPDATE: (id: string) => `/schools/${id}`,
    GET_STUDENTS: (id: string) => `/schools/${id}/students`,
  },

  // General Endpoints
  GENERAL: {
    GET_DOMAINS: '/domains',
    GET_SETTINGS: '/settings',
    HEALTH_CHECK: '/health',
  },
};
