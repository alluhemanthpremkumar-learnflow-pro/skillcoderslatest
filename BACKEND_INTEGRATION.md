# Backend Integration Guide

## Overview
This project now has a complete backend integration layer that centralizes all API communication. This guide will help you connect your frontend to your backend API.

## Quick Start

### 1. Environment Setup
```bash
# Create .env.local file in the root directory (already created)
# Update the API_URL to match your backend server
VITE_API_URL=http://localhost:3000/api
```

### 2. File Structure
```
src/
├── services/
│   ├── api.ts              # API client with authentication & error handling
│   ├── endpoints.ts        # All API endpoint definitions
│   ├── hooks.ts            # React Query hooks for all API calls
│   ├── index.ts            # Centralized exports
│   └── INTEGRATION_GUIDE.md # Integration examples
└── ...
```

## API Architecture

### 1. API Client (`api.ts`)
- Centralized fetch client with error handling
- Automatic token management (Bearer token)
- Request timeout support
- JSON response parsing

```typescript
import { apiClient } from '@/services';

// Simple GET request
const response = await apiClient.get('/endpoint');

// POST request
const response = await apiClient.post('/endpoint', { data });

// With token (automatic for authenticated endpoints)
```

### 2. Endpoints (`endpoints.ts`)
- Centralized definition of all API routes
- Easy to update and maintain
- Type-safe endpoint references

```typescript
import { API_ENDPOINTS } from '@/services';

const url = API_ENDPOINTS.COURSES.GET_ALL; // '/courses'
const courseUrl = API_ENDPOINTS.COURSES.GET_ONE('123'); // '/courses/123'
```

### 3. React Query Hooks (`hooks.ts`)
- Pre-built hooks for all API endpoints
- Automatic caching and synchronization
- Loading, error, and success states

```typescript
import { useGetCourses, useEnrollCourse } from '@/services/hooks';

// Query hook (GET)
const { data, isLoading, error } = useGetCourses();

// Mutation hook (POST/PUT/DELETE)
const { mutate, isLoading } = useEnrollCourse();
```

## Integration Patterns

### Pattern 1: Fetching Data
```typescript
import { useGetCourses } from '@/services/hooks';

function CourseList() {
  const { data, isLoading, error } = useGetCourses(1, 10);
  
  if (isLoading) return <LoadingSpinner />;
  if (error) return <ErrorMessage />;
  
  return (
    <div>
      {data?.data?.map(course => (
        <CourseCard key={course.id} course={course} />
      ))}
    </div>
  );
}
```

### Pattern 2: Sending Data
```typescript
import { useEnrollCourse } from '@/services/hooks';
import { useToast } from '@/hooks/use-toast';

function CourseCard({ course }) {
  const { toast } = useToast();
  const enrollCourse = useEnrollCourse();
  
  const handleEnroll = async () => {
    const result = await enrollCourse.mutateAsync(course.id);
    
    if (result.success) {
      toast({ title: 'Enrolled successfully!' });
    } else {
      toast({ title: 'Error', description: result.error });
    }
  };
  
  return <button onClick={handleEnroll}>Enroll</button>;
}
```

### Pattern 3: Authentication
```typescript
import { useLogin } from '@/services/hooks';
import { apiClient } from '@/services';
import { useNavigate } from 'react-router-dom';

function LoginForm() {
  const navigate = useNavigate();
  const login = useLogin({
    onSuccess: (response) => {
      if (response.data?.token) {
        apiClient.setToken(response.data.token);
        navigate('/dashboard');
      }
    },
  });
  
  return (
    <form onSubmit={(e) => {
      e.preventDefault();
      login.mutate({ email: 'user@email.com', password: 'pass' });
    }}>
      {/* form fields */}
    </form>
  );
}
```

## Backend API Requirements

### Response Format
Your backend should return responses in this format:

```json
{
  "success": true,
  "data": { /* your data */ },
  "message": "Success message (optional)"
}
```

### Error Response Format
```json
{
  "success": false,
  "error": "Error message",
  "message": "Detailed error message (optional)"
}
```

### Authentication
- Use Bearer tokens in Authorization header
- Format: `Authorization: Bearer <token>`
- Tokens are automatically managed by `apiClient`

### Required Endpoints

#### Authentication
- `POST /api/auth/login` - Returns `{ token, user }`
- `POST /api/auth/register` - New user registration
- `POST /api/auth/logout` - Logout
- `GET /api/auth/profile` - Get current user (requires auth)
- `PUT /api/auth/profile` - Update profile (requires auth)

#### Courses
- `GET /api/courses?page=1&limit=10` - List courses
- `GET /api/courses/:id` - Get single course
- `GET /api/courses/search?q=query` - Search courses
- `GET /api/courses/domain/:domain` - Filter by domain
- `POST /api/courses/:id/enroll` - Enroll in course
- `GET /api/courses/enrolled` - Get enrolled courses

#### Quizzes
- `GET /api/quizzes` - List quizzes
- `GET /api/quizzes/:id` - Get single quiz
- `GET /api/quizzes/level/:level` - Quizzes by level
- `POST /api/quizzes/:id/start` - Start quiz session
- `POST /api/quizzes/:id/submit` - Submit answers
- `GET /api/quizzes/:id/results` - Get results

#### More endpoints in `src/services/endpoints.ts`

## Migration Guide

### Step 1: Replace Static Data with API Calls
Before:
```typescript
import { sampleCourses } from '@/lib/sampleCourses';

function Courses() {
  return <div>{sampleCourses.map(...)}</div>;
}
```

After:
```typescript
import { useGetCourses } from '@/services/hooks';

function Courses() {
  const { data } = useGetCourses();
  return <div>{data?.data?.map(...)}</div>;
}
```

### Step 2: Update Forms to Use API
Before:
```typescript
const handleSubmit = (data) => {
  console.log('Form submitted:', data);
  toast({ title: 'Success' });
};
```

After:
```typescript
const createCourse = useCreateCourse();

const handleSubmit = async (data) => {
  const result = await createCourse.mutateAsync(data);
  
  if (result.success) {
    toast({ title: 'Course created!' });
    queryClient.invalidateQueries(['courses']);
  }
};
```

## Configuration

### Custom API Client
To modify API client behavior, edit `src/services/api.ts`:

```typescript
// Change timeout
new ApiClient(API_URL, 60000); // 60 seconds

// Change base URL
new ApiClient('https://api.myserver.com/v1');
```

### Custom Hooks
Add new hooks in `src/services/hooks.ts`:

```typescript
export const useCustomEndpoint = (options?: any) =>
  useQuery({
    queryKey: ['customKey'],
    queryFn: () => apiClient.get('/custom'),
    ...options,
  });
```

## Error Handling

The API client handles errors automatically:

```typescript
const { data, error, isError } = useGetCourses();

if (isError) {
  const message = error instanceof Error ? error.message : 'Unknown error';
  return <ErrorDisplay message={message} />;
}
```

## CORS Configuration

Make sure your backend allows requests from your frontend:

```
Access-Control-Allow-Origin: http://localhost:5173
Access-Control-Allow-Methods: GET, POST, PUT, DELETE, PATCH, OPTIONS
Access-Control-Allow-Headers: Content-Type, Authorization
```

## Testing

To test API integration locally:

1. **Start your backend server:**
   ```bash
   # Your backend command
   npm run dev  # or npm start, yarn dev, etc.
   ```

2. **Start frontend:**
   ```bash
   npm run dev
   ```

3. **Check API calls in Network tab of browser DevTools**

## Debugging

Enable debugging by checking:

1. **Browser Network tab** - See all API requests
2. **Console** - Check for errors
3. **Backend logs** - Verify requests are received
4. **React Query DevTools** - Install `@tanstack/react-query-devtools` for advanced debugging

```typescript
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

// Add to your App component
<ReactQueryDevtools initialIsOpen={false} />
```

## Common Issues

### Issue: "Cannot fetch from API"
- Check VITE_API_URL is correct
- Verify backend is running
- Check browser console for CORS errors

### Issue: "401 Unauthorized"
- Token not being sent properly
- Backend not recognizing token format
- Token expired

### Issue: "Request timeout"
- Backend taking too long to respond
- Increase timeout: `new ApiClient(url, 60000)`

## Next Steps

1. Set up your backend API with the required endpoints
2. Update `.env.local` with your backend URL
3. Replace static data components with API hooks
4. Test all authentication flows
5. Implement error handling and loading states

## Support

For issues or questions, refer to:
- `src/services/INTEGRATION_GUIDE.md` - Code examples
- `src/services/api.ts` - API client implementation
- `src/services/hooks.ts` - Available hooks
