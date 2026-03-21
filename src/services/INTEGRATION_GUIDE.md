/**
 * API Integration Guide - How to use the backend API services
 * This file demonstrates common patterns for API usage in your React components
 */

/**
 * SETUP INSTRUCTIONS:
 * 
 * 1. Environment Configuration:
 *    - Copy .env.example to .env.local
 *    - Update VITE_API_URL to point to your backend server
 *    - Default: http://localhost:3000/api
 * 
 * 2. Backend Requirements:
 *    - Your backend should serve API at /api/* endpoints
 *    - All responses should return JSON
 *    - Auth should use Bearer tokens in Authorization header
 * 
 * 3. CORS Setup:
 *    - Backend should allow requests from your frontend origin
 *    - Example: http://localhost:5173 (Vite dev server)
 */

// ==================== EXAMPLE 1: Using Query Hooks ====================
/**
 * Getting data that doesn't change frequently
 * Use useQuery hooks in your components
 */

import { useGetCourses, useGetCourse } from '@/services/hooks';

function CoursesExample() {
  // Fetch all courses
  const { data, isLoading, error } = useGetCourses(1, 10);

  if (isLoading) return <div>Loading courses...</div>;
  if (error) return <div>Error fetching courses</div>;

  return (
    <div>
      {data?.data?.map((course: any) => (
        <div key={course.id}>{course.title}</div>
      ))}
    </div>
  );
}

// ==================== EXAMPLE 2: Using Mutation Hooks ====================
/**
 * Sending data to the backend
 * Use useMutation hooks for POST/PUT/DELETE operations
 */

import { useEnrollCourse, useSubmitQuiz } from '@/services/hooks';
import { useToast } from '@/hooks/use-toast';

function EnrollCourseExample() {
  const enrollCourse = useEnrollCourse();
  const { toast } = useToast();

  const handleEnroll = async (courseId: string) => {
    const result = await enrollCourse.mutateAsync(courseId);

    if (result.success) {
      toast({
        title: 'Success',
        description: 'Successfully enrolled in course',
      });
    } else {
      toast({
        title: 'Error',
        description: result.error || 'Failed to enroll',
        variant: 'destructive',
      });
    }
  };

  return <button onClick={() => handleEnroll('123')}>Enroll</button>;
}

// ==================== EXAMPLE 3: Direct API Calls ====================
/**
 * For custom API calls not covered by hooks
 * Use apiClient directly
 */

import { apiClient } from '@/services';

async function customApiCall() {
  const response = await apiClient.get('/some-endpoint');

  if (response.success) {
    console.log('Data:', response.data);
  } else {
    console.error('Error:', response.error);
  }
}

// ==================== EXAMPLE 4: Authentication Flow ====================
/**
 * Handle login and token storage
 */

import { useLogin } from '@/services/hooks';
import { useNavigate } from 'react-router-dom';

function LoginExample() {
  const navigate = useNavigate();
  const login = useLogin({
    onSuccess: (response) => {
      if (response.success && response.data?.token) {
        // Token is automatically stored by apiClient
        apiClient.setToken(response.data.token);
        navigate('/dashboard');
      }
    },
  });

  const handleLogin = (email: string, password: string) => {
    login.mutate({ email, password });
  };

  return <button onClick={() => handleLogin('user@email.com', 'password')}>
    Login
  </button>;
}

// ==================== EXAMPLE 5: Using Query Client ====================
/**
 * Manually invalidate cache after mutations
 * Useful for keeping data in sync
 */

import { useQueryClient } from '@tanstack/react-query';

function InvalidateCacheExample() {
  const queryClient = useQueryClient();

  const updateProfile = useUpdateProfile({
    onSuccess: () => {
      // Invalidate profile data to refetch it
      queryClient.invalidateQueries({ queryKey: ['profile'] });
    },
  });

  return <div>Profile update example</div>;
}

// ==================== EXAMPLE 6: Search with Debounce ====================
/**
 * Implement search with debounce to avoid excessive API calls
 */

import { useSearchCourses } from '@/services/hooks';
import { useState, useEffect } from 'react';

function SearchCoursesExample() {
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const { data, isLoading } = useSearchCourses(debouncedQuery);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedQuery(searchQuery), 500);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  return (
    <div>
      <input
        type="text"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        placeholder="Search courses..."
      />
      {isLoading && <div>Searching...</div>}
      {data?.data?.map((course: any) => (
        <div key={course.id}>{course.title}</div>
      ))}
    </div>
  );
}

// ==================== EXAMPLE 7: Handling Errors ====================
/**
 * Comprehensive error handling pattern
 */

import { UseQueryResult } from '@tanstack/react-query';

function ErrorHandlingExample() {
  const { data, isLoading, error, isError } = useGetCourses();

  if (isLoading) return <div>Loading...</div>;

  if (isError) {
    const errorMessage = error instanceof Error ? error.message : 'An error occurred';
    return <div className="text-red-500">Error: {errorMessage}</div>;
  }

  if (!data?.data || data.data.length === 0) {
    return <div>No courses found</div>;
  }

  return <div>{/* Render data */}</div>;
}

// ==================== EXAMPLE 8: Pagination ====================
/**
 * Implement pagination with React Query
 */

import { useState } from 'react';

function PaginationExample() {
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const { data, isLoading } = useGetCourses(page, limit);

  return (
    <div>
      {/* Render courses */}
      <button onClick={() => setPage((p) => p - 1)} disabled={page === 1}>
        Previous
      </button>
      <span>Page {page}</span>
      <button onClick={() => setPage((p) => p + 1)}>Next</button>
    </div>
  );
}

// ==================== BACKEND REQUIREMENTS ====================
/**
 * Your backend API should implement these endpoints:
 * 
 * Authentication:
 * - POST /api/auth/login
 * - POST /api/auth/register
 * - POST /api/auth/logout
 * - GET /api/auth/profile (requires auth token)
 * - PUT /api/auth/profile (requires auth token)
 * 
 * Courses:
 * - GET /api/courses?page=1&limit=10
 * - GET /api/courses/:id
 * - GET /api/courses/search?q=query
 * - GET /api/courses/domain/:domain
 * - POST /api/courses/:id/enroll (requires auth)
 * - GET /api/courses/enrolled (requires auth)
 * 
 * Quizzes:
 * - GET /api/quizzes
 * - GET /api/quizzes/:id
 * - GET /api/quizzes/level/:level
 * - POST /api/quizzes/:id/start
 * - POST /api/quizzes/:id/submit
 * 
 * And more... see API_ENDPOINTS in src/services/endpoints.ts
 */

// ==================== TOKEN MANAGEMENT ====================
/**
 * The apiClient automatically handles token storage and retrieval
 * When your backend returns a token on login:
 * 
 * const response = await apiClient.post('/auth/login', credentials);
 * if (response.success && response.data.token) {
 *   apiClient.setToken(response.data.token);
 * }
 * 
 * The token is stored in localStorage and automatically added to
 * all subsequent requests in the Authorization header
 */

export { CoursesExample, EnrollCourseExample, LoginExample, SearchCoursesExample, ErrorHandlingExample, PaginationExample };
