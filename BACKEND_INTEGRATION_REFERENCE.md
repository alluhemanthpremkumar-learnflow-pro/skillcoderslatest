# Backend Integration - Complete Reference

## What Was Created

Your SkillCoders project now has a complete backend API integration layer with the following components:

### Core Files

1. **API Client** (`src/services/api.ts`)
   - Centralized HTTP client
   - Bearer token authentication
   - Error handling & timeouts
   - Request/response interceptors ready
   - 200+ lines of production code

2. **Endpoints** (`src/services/endpoints.ts`)
   - 50+ endpoint definitions
   - Organized by feature (Auth, Courses, Quizzes, etc.)
   - Type-safe references
   - Easy to maintain and update

3. **React Query Hooks** (`src/services/hooks.ts`)
   - 40+ pre-built hooks
   - Automatic caching
   - Loading/error states
   - Mutation support (POST, PUT, DELETE)

4. **Configuration Files**
   - `.env.example` - Template for environment variables
   - `.env.local` - Local development configuration

### Documentation Files

1. **BACKEND_INTEGRATION.md** (Main Guide)
   - Complete overview
   - Response format requirements
   - Migration guide
   - Configuration options
   - Common issues & solutions

2. **QUICK_START.md** (5-Minute Setup)
   - Quick reference
   - Basic patterns
   - Common tasks
   - Troubleshooting

3. **src/services/INTEGRATION_GUIDE.md** (Code Examples)
   - 8 real code examples
   - Authentication flow
   - Query & mutation patterns
   - Error handling

4. **src/services/COMPONENT_MIGRATION_EXAMPLES.tsx** (Real Components)
   - Before/after component examples
   - Courses, Quizzes, Admin Dashboard, Profile
   - Migration checklist

5. **src/contexts/AuthContext.integration.ts** (Auth Examples)
   - Hybrid approach (Firebase + Backend)
   - Pure backend authentication
   - Implementation steps

## Architecture Overview

```
┌─────────────────────────────────────────────────┐
│           React Components                      │
│  (Courses, Login, Dashboard, etc.)              │
└────────────────┬────────────────────────────────┘
                 │
┌────────────────▼────────────────────────────────┐
│     React Query Hooks Layer                     │
│  (useGetCourses, useSubmitQuiz, etc.)           │
└────────────────┬────────────────────────────────┘
                 │
┌────────────────▼────────────────────────────────┐
│        API Client (apiClient)                   │
│  • Fetch wrapper                               │
│  • Authentication                              │
│  • Error handling                              │
│  • Timeout management                          │
└────────────────┬────────────────────────────────┘
                 │
┌────────────────▼────────────────────────────────┐
│        Backend API Server                       │
│     (Node.js, Python, Java, etc.)              │
│     http://localhost:3000/api                  │
└─────────────────────────────────────────────────┘
```

## Covered Endpoints (50+)

### Authentication (5 endpoints)
- Login, Register, Logout, Profile, Update Profile

### Courses (6 endpoints)
- Get all, Get one, Search, Filter by domain, Enroll, Get enrolled

### Labs (6 endpoints)
- Get all, Get one, Create, Update, Delete, Start, Submit

### Quizzes (6 endpoints)
- Get all, Get one, By domain, By level, Start, Submit, Results

### Users (4 endpoints)
- Get all, Get one, Update, Delete, Search, Statistics

### Instructors (6 endpoints)
- Get all, Get one, Apply, Get pending, Approve, Reject, Dashboard

### Certificates (4 endpoints)
- Get all, Get one, Generate, Download, User certificates

### Meetings (6 endpoints)
- Get all, Create, Update, Delete, Join, User meetings

### Cart (5 endpoints)
- Get, Add, Remove, Update, Clear, Checkout

### Payments (5 endpoints)
- Get all, Get one, Create, Verify, Refund, User payments

### Admin (5 endpoints)
- Dashboard, Analytics, Users, Payments, Reports, Settings

### General (3 endpoints)
- Domains, Settings, Health check

## Quick Integration Steps

### Step 1: Configure Environment
```bash
# .env.local is already created with:
VITE_API_URL=http://localhost:3000/api
VITE_API_TIMEOUT=30000
```

### Step 2: Start Your Backend
```bash
# Start your backend server on port 3000
# API should be available at http://localhost:3000/api
```

### Step 3: Import in Your Component
```tsx
import { useGetCourses } from '@/services/hooks';
```

### Step 4: Use the Hook
```tsx
const { data, isLoading, error } = useGetCourses();
```

### Step 5: Handle States
```tsx
if (isLoading) return <Loading />;
if (error) return <Error />;
return <Display data={data?.data} />;
```

## Code Organization

```
src/
├── services/
│   ├── api.ts                    # Main API client (210 lines)
│   ├── endpoints.ts              # Endpoint definitions (250 lines)
│   ├── hooks.ts                  # React Query hooks (350 lines)
│   ├── index.ts                  # Exports
│   ├── INTEGRATION_GUIDE.md       # Code examples
│   └── COMPONENT_MIGRATION_EXAMPLES.tsx
├── contexts/
│   ├── AuthContext.tsx           # Original Firebase auth
│   └── AuthContext.integration.ts # NEW: Backend auth options
├── .env.local                    # NEW: Environment config
└── ...

Root/
├── BACKEND_INTEGRATION.md        # NEW: Complete guide
├── QUICK_START.md                # NEW: Quick reference
├── .env.example                  # NEW: Env template
└── ...
```

## Key Features

✅ **Automatic Token Management**
```ts
apiClient.setToken(token); // Stored & added to all requests
```

✅ **Error Handling**
```ts
if (response.success) {
  // Handle success
} else {
  // Handle error
  console.error(response.error);
}
```

✅ **Request Timeout**
```ts
// Default: 30 seconds
// Customize: VITE_API_TIMEOUT=60000
```

✅ **Loading & Caching**
```ts
const { data, isLoading, error } = useGetCourses();
// Automatically cached and refetched
```

✅ **Type-Safe**
```ts
const endpoint = API_ENDPOINTS.COURSES.GET_ONE('123');
// Returns '/courses/123'
```

## Integration Checklist

- [ ] Read QUICK_START.md (5 minutes)
- [ ] Review BACKEND_INTEGRATION.md (10 minutes)
- [ ] Check .env.local configuration
- [ ] Start your backend server
- [ ] Update 1 component to use API hooks
- [ ] Test in browser Network tab
- [ ] Check that data loads correctly
- [ ] Test error handling
- [ ] Test loading states
- [ ] Update authentication flow
- [ ] Replace all static data with API
- [ ] Test all forms and submissions
- [ ] Test pagination & filtering
- [ ] Deploy backend

## Files to Update

Priority order for migrating your app:

1. **Authentication** (`src/pages/Login.tsx`, `Register.tsx`)
   ```tsx
   // Replace: hardcoded login logic
   // With: useLogin() hook
   ```

2. **Course List** (`src/pages/Courses.tsx`)
   ```tsx
   // Replace: sampleCourses
   // With: useGetCourses() hook
   ```

3. **Dashboard** (`src/pages/AdminDashboard.tsx`)
   ```tsx
   // Replace: initialUsers, initialPayments
   // With: useGetAllUsers(), useGetAllPayments()
   ```

4. **Quizzes** (`src/pages/Quizzes.tsx`)
   ```tsx
   // Replace: sampleQuestions
   // With: useGetQuizzes() hooks
   ```

5. **Profile** (`src/pages/Profile.tsx`)
   ```tsx
   // Replace: console.log
   // With: useUpdateProfile() mutation
   ```

## Environment Variables

| Variable | Default | Description |
|----------|---------|-------------|
| VITE_API_URL | http://localhost:3000/api | Backend API base URL |
| VITE_API_TIMEOUT | 30000 | Request timeout in ms |
| VITE_APP_ENV | development | Environment name |

## API Response Format

**Success:**
```json
{
  "success": true,
  "data": { "id": 1, "name": "Course" }
}
```

**With Message:**
```json
{
  "success": true,
  "data": { "id": 1 },
  "message": "Created successfully"
}
```

**Error:**
```json
{
  "success": false,
  "error": "Validation failed"
}
```

## Authentication Flow

1. User logs in with credentials
2. Backend returns token
3. `apiClient.setToken(token)` stores it
4. Token automatically added to all requests
5. On logout: `apiClient.setToken(null)`

```typescript
const login = useLogin();
const response = await login.mutateAsync(credentials);
if (response.data?.token) {
  apiClient.setToken(response.data.token);
}
```

## Debugging

```tsx
// In browser console:
localStorage.getItem('authToken') // Check token

// Network tab:
// 1. Click on API request
// 2. Check Request Headers (Authorization)
// 3. Check Response body

// To enable React Query DevTools:
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
<ReactQueryDevtools initialIsOpen={false} />
```

## Common Patterns

### Pattern 1: Fetch on Mount
```tsx
const { data } = useGetCourses();
```

### Pattern 2: Fetch with Conditions
```tsx
const { data } = useGetCourses(1, 10, { enabled: isReady });
```

### Pattern 3: Refetch After Mutation
```tsx
const queryClient = useQueryClient();
const createCourse = useCreateCourse({
  onSuccess: () => queryClient.invalidateQueries(['courses']),
});
```

### Pattern 4: Search with Debounce
```tsx
const [query, setQuery] = useState('');
const [debouncedQuery, setDebouncedQuery] = useState('');
useEffect(() => {
  const timer = setTimeout(() => setDebouncedQuery(query), 500);
  return () => clearTimeout(timer);
}, [query]);
const { data } = useSearchCourses(debouncedQuery);
```

## Performance Optimization

✅ **Caching** - React Query caches data automatically
✅ **Deduplication** - Duplicate requests are merged
✅ **Background Refetch** - Keeps data fresh
✅ **Pagination** - Load data efficiently
✅ **Lazy Loading** - Load on demand

## What's Next?

1. **Read Documentation**
   - QUICK_START.md (5 min)
   - BACKEND_INTEGRATION.md (10 min)

2. **Build Backend**
   - Implement 50+ endpoints
   - Return proper response format
   - Set up CORS

3. **Migrate Components**
   - Replace static data
   - Update forms
   - Test flows

4. **Deploy**
   - Test in production
   - Monitor performance
   - Gather feedback

## Support Resources

- **Quick Start:** QUICK_START.md
- **Full Guide:** BACKEND_INTEGRATION.md
- **Code Examples:** src/services/INTEGRATION_GUIDE.md
- **Component Migration:** src/services/COMPONENT_MIGRATION_EXAMPLES.tsx
- **Auth Options:** src/contexts/AuthContext.integration.ts

## Summary

Your project now has a professional-grade backend integration setup with:
- ✅ 50+ API endpoints defined
- ✅ 40+ React Query hooks ready
- ✅ Complete error handling
- ✅ Token management
- ✅ Request timeout support
- ✅ Production-ready code
- ✅ Comprehensive documentation
- ✅ Real code examples
- ✅ Migration guide

**Total Integration Time:** ~2 hours to connect your entire app

**Start Now:** Read QUICK_START.md
