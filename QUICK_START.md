# Backend Integration - Quick Start Guide

## 5-Minute Setup

### 1. Check Files Created
All backend integration files have been created in:
```
src/services/
├── api.ts                          # API client
├── endpoints.ts                    # Endpoint definitions
├── hooks.ts                        # React Query hooks
├── index.ts                        # Exports
├── INTEGRATION_GUIDE.md            # Detailed examples
└── COMPONENT_MIGRATION_EXAMPLES.tsx # Real component examples
```

### 2. Environment Variables
Create `.env.local` in project root (already created):
```
VITE_API_URL=http://localhost:3000/api
VITE_API_TIMEOUT=30000
VITE_APP_ENV=development
```

### 3. Start Your Backend
Ensure your backend is running:
```bash
# Your backend command
npm run dev  # or your backend command
```

The API should be available at: `http://localhost:3000/api`

### 4. Update a Component (5 minutes)

**Before (with static data):**
```tsx
import { sampleCourses } from '@/lib/sampleCourses';

function Courses() {
  return (
    <div>
      {sampleCourses.map(course => <div>{course.title}</div>)}
    </div>
  );
}
```

**After (with API):**
```tsx
import { useGetCourses } from '@/services/hooks';

function Courses() {
  const { data, isLoading } = useGetCourses(1, 10);
  
  if (isLoading) return <div>Loading...</div>;
  
  return (
    <div>
      {data?.data?.map(course => <div>{course.title}</div>)}
    </div>
  );
}
```

## Usage Patterns

### Pattern 1: Fetch Data
```tsx
import { useGetCourses } from '@/services/hooks';

const { data, isLoading, error } = useGetCourses();
// data.data = array of courses
// isLoading = true while fetching
// error = error object if failed
```

### Pattern 2: Submit Data
```tsx
import { useEnrollCourse } from '@/services/hooks';

const enrollCourse = useEnrollCourse();

const handleEnroll = async () => {
  const result = await enrollCourse.mutateAsync(courseId);
  if (result.success) {
    // Success!
  }
};
```

### Pattern 3: Direct API Calls
```tsx
import { apiClient } from '@/services';

const response = await apiClient.get('/courses');
const response = await apiClient.post('/courses', { title: 'New' });
```

## Available Hooks

### Authentication
- `useLogin(options)` - POST /auth/login
- `useRegister(options)` - POST /auth/register
- `useLogout(options)` - POST /auth/logout
- `useGetProfile()` - GET /auth/profile
- `useUpdateProfile(options)` - PUT /auth/profile

### Courses
- `useGetCourses(page, limit)` - GET /courses
- `useGetCourse(id)` - GET /courses/:id
- `useSearchCourses(query)` - GET /courses/search
- `useGetCoursesByDomain(domain)` - GET /courses/domain
- `useEnrollCourse()` - POST /courses/:id/enroll
- `useGetEnrolledCourses()` - GET /courses/enrolled

### Quizzes
- `useGetQuizzes()` - GET /quizzes
- `useGetQuiz(id)` - GET /quizzes/:id
- `useGetQuizzesByDomain(domain)` - GET /quizzes/domain
- `useGetQuizzesByLevel(level)` - GET /quizzes/level
- `useStartQuiz()` - POST /quizzes/:id/start
- `useSubmitQuiz()` - POST /quizzes/:id/submit
- `useGetQuizResults(quizId)` - GET /quizzes/:id/results

### More hooks in `src/services/hooks.ts`

## Real World Examples

See detailed examples in:
- `src/services/COMPONENT_MIGRATION_EXAMPLES.tsx` - Component before/after
- `src/services/INTEGRATION_GUIDE.md` - Code examples
- `BACKEND_INTEGRATION.md` - Full documentation

## Common Tasks

### Task 1: Replace Static Courses with API
**File:** `src/pages/Courses.tsx`
```tsx
// Replace:
const { sampleCourses } = from '@/lib/sampleCourses';
// With:
import { useGetCourses } from '@/services/hooks';
const { data } = useGetCourses();
const courses = data?.data || [];
```

### Task 2: Replace Form Submit with API
**File:** `src/pages/Login.tsx`
```tsx
// Replace:
console.log('Form submitted:', formData);
// With:
import { useLogin } from '@/services/hooks';
const login = useLogin();
await login.mutateAsync(formData);
```

### Task 3: Replace Hardcoded Admin Data
**File:** `src/pages/AdminDashboard.tsx`
```tsx
// Replace:
const [users, setUsers] = useState(initialUsers);
// With:
import { useGetAllUsers } from '@/services/hooks';
const { data } = useGetAllUsers();
const users = data?.data || [];
```

## Backend Requirements

Your backend API must return responses like:

```json
{
  "success": true,
  "data": { "id": 1, "title": "Course Title" }
}
```

Error responses:
```json
{
  "success": false,
  "error": "Error message"
}
```

## Testing

1. **Check Network Tab**
   - Open DevTools → Network tab
   - Perform an action
   - See the API call and response

2. **Check Console**
   - Look for fetch errors
   - Check CORS issues
   - Verify token is sent

3. **Backend Logs**
   - Check if request reached backend
   - Verify response format

## Troubleshooting

### "Cannot fetch from API"
- ✓ Backend is running
- ✓ Check VITE_API_URL matches your backend
- ✓ Look for CORS errors in console

### "401 Unauthorized"
- ✓ Token is being sent (see Network tab)
- ✓ Backend recognizes Bearer token format
- ✓ Token is not expired

### "Request timeout"
- ✓ Increase timeout: `VITE_API_TIMEOUT=60000`
- ✓ Check backend performance
- ✓ Check network connection

## Next Steps

1. ✅ Backend setup complete
2. Choose authentication approach:
   - Option A: Keep Firebase + add backend sync
   - Option B: Pure backend authentication
   - See `src/contexts/AuthContext.integration.ts`
3. Migrate components one by one
4. Test all flows (login, courses, quizzes, etc.)
5. Update error handling and UI feedback

## Architecture

```
Frontend (React)
    ↓
API Client (src/services/api.ts)
    ↓
Hooks Layer (src/services/hooks.ts)
    ↓
Components
    ↓
Backend API
    ↓
Database
```

## Documentation

- **Full Guide:** `BACKEND_INTEGRATION.md`
- **Code Examples:** `src/services/INTEGRATION_GUIDE.md`
- **Component Examples:** `src/services/COMPONENT_MIGRATION_EXAMPLES.tsx`
- **API Client:** `src/services/api.ts`
- **Endpoints:** `src/services/endpoints.ts`
- **Hooks:** `src/services/hooks.ts`

## Key Files Overview

| File | Purpose |
|------|---------|
| `api.ts` | HTTP client with auth & error handling |
| `endpoints.ts` | Centralized endpoint definitions |
| `hooks.ts` | React Query hooks for all endpoints |
| `index.ts` | Export all services |
| `.env.example` | Environment variables template |
| `.env.local` | Local environment configuration |

## Questions?

Refer to the detailed documentation:
- API Examples: `src/services/INTEGRATION_GUIDE.md`
- Component Migration: `src/services/COMPONENT_MIGRATION_EXAMPLES.tsx`
- Full Guide: `BACKEND_INTEGRATION.md`
- AuthContext Options: `src/contexts/AuthContext.integration.ts`

## Success Criteria

- ✅ API client set up and working
- ✅ Environment variables configured
- ✅ At least one component fetching from API
- ✅ Error handling in place
- ✅ Loading states showing
- ✅ Token management working

## Support

For issues:
1. Check environment variables
2. Verify backend is running
3. Look at Network tab in DevTools
4. Check browser console
5. Review backend logs
6. Read the detailed guides mentioned above
