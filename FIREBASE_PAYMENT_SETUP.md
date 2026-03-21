# Complete Firebase & Payment Integration Setup Guide

## Overview

Your SkillCoders project now has complete integration with:
- ✅ **Firebase** - Authentication, Firestore, Storage, Analytics
- ✅ **Razorpay** - Payment processing
- ✅ **Certificate Generation** - Custom certificates with CTI numbers
- ✅ **Registration Logging** - Admin dashboard tracking
- ✅ **Payment Tracking** - Payment history and enrollment

## Firebase Setup Status

### Current Configuration
Your Firebase config (`src/firebase/config.ts`) now includes:
- ✅ Authentication Service
- ✅ Firestore Database  
- ✅ Storage Service
- ✅ Analytics Service (with fallback)
- ✅ Environment variable support

### Services Initialized
```typescript
export const auth         // Authentication
export const db           // Firestore Database
export const storage      // File Storage
export { analytics }      // Analytics
```

## Environment Variables

### Firebase Variables (in .env.local)
```
VITE_FIREBASE_API_KEY=AIzaSyAeC19EdIEguzrzb5QCQXlf17-GEPvo6eY
VITE_FIREBASE_AUTH_DOMAIN=skill-coders-48476.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=skill-coders-48476
VITE_FIREBASE_STORAGE_BUCKET=skill-coders-48476.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID=406339300833
VITE_FIREBASE_APP_ID=1:406339300833:web:283903626c0c68999676a0
VITE_FIREBASE_MEASUREMENT_ID=G-6729JQN6M6
```

### Razorpay Variables
```
VITE_RAZORPAY_KEY_ID=rzp_test_1234567890
VITE_RAZORPAY_KEY_SECRET=your_razorpay_secret
```

## Services Created

### 1. Payment Service (`src/services/paymentService.ts`)
Handles payment processing with Razorpay

**Key Functions:**
- `initializeRazorpayPayment()` - Start payment flow
- `verifyPayment()` - Verify payment success
- `savePaymentRecord()` - Store payment in Firestore
- `logUserEnrollment()` - Log course enrollment

**Database Collections:**
- `payments` - Payment records
- `user_enrollments` - User enrollment tracking

### 2. Certificate Service (`src/services/certificateService.ts`)
Generates beautiful certificates with CTI numbers

**Key Functions:**
- `generateCTINumber()` - Creates unique CTI numbers (SKILLCODERS-XXXXX)
- `createCertificate()` - Create certificate record
- `generateCertificatePDF()` - Generate PDF with custom design
- `uploadAndSaveCertificate()` - Save to Firebase Storage
- `getUserCertificates()` - Retrieve user's certificates

**Certificate Features:**
- Custom user name
- Course name
- Unique CTI number
- Issue date
- Professional PDF design with gradient background
- Uploaded to Firebase Storage

### 3. Registration Service (`src/services/registrationService.ts`)
Tracks all user registrations for admin dashboard

**Key Functions:**
- `logUserRegistration()` - Log new registrations
- `getRegistrationLogs()` - Get all registrations
- `getRegistrationsByType()` - Filter by type (student/instructor/school)
- `buildAdminRegistrationDashboard()` - Build dashboard data
- `getRegistrationStats()` - Get statistics

**Database Collection:**
- `registration_logs` - All registration events

## React Hooks Created

### Payment Hooks (`src/hooks/paymentHooks.ts`)

```typescript
// Process payment for a plan
const { processPayment, isProcessing } = usePaymentProcessor();
await processPayment('Intermediate Plan', 5999, courseId, courseName);

// Enroll in course
const { enrollCourse, isEnrolling } = useEnrollCourse();
await enrollCourse(courseId, courseName, planName);

// Get pricing plans
const { plans } = usePricingPlans();
// Returns array of: Basic, Intermediate, Advanced, Laptop plans
```

### Certificate Hooks (`src/hooks/certificateHooks.ts`)

```typescript
// Generate and download certificate
const { generateAndDownloadCertificate, isGenerating } = useCertificateGenerator();
await generateAndDownloadCertificate(courseId, courseName, 100);

// Get user certificates
const { certificates, isLoading, fetchCertificates } = useUserCertificates();
```

### Registration Hooks (`src/hooks/registrationHooks.ts`)

```typescript
// Log user registration
const { registerUser } = useRegisterUser();
await registerUser(userId, email, name, phone, 'student', password);

// Admin dashboard
const { dashboardData, isLoading } = useAdminRegistrationDashboard();
// Returns: studentCount, instructorCount, schoolCount, recentRegistrations

// Registration statistics
const { stats } = useRegistrationStats();
// Returns: totalRegistrations, todayRegistrations, byType
```

## Implementation Examples

### Example 1: Update Register Page

In `src/pages/Register.tsx`:

```typescript
import { useRegisterUser } from '@/hooks/registrationHooks';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

function Register() {
  const { registerUser } = useRegisterUser();
  const navigate = useNavigate();
  const { signInWithGoogle } = useAuth();

  const handleGoogleSignup = async () => {
    try {
      // Firebase signup
      await signInWithGoogle();
      
      // User will be logged in, get their info
      const user = auth.currentUser;
      if (user) {
        // Log registration to admin dashboard
        await registerUser(
          user.uid,
          user.email || '',
          user.displayName || 'User',
          undefined,
          'student'
        );
        
        navigate('/');
      }
    } catch (err) {
      console.error('Signup failed:', err);
    }
  };

  return (
    // Your form JSX
  );
}
```

### Example 2: Add Payment to CourseDetail

In `src/pages/CourseDetail.tsx`:

```typescript
import { usePaymentProcessor } from '@/hooks/paymentHooks';

function CourseDetail() {
  const { id } = useParams();
  const { processPayment, isProcessing } = usePaymentProcessor();

  const handleEnrollNow = async () => {
    const success = await processPayment(
      'Intermediate Plan',
      5999,
      id,
      course?.title
    );
    
    if (success) {
      // Payment successful - user is enrolled
      // Redirect or show confirmation
    }
  };

  return (
    <div>
      {/* Course details */}
      <button 
        onClick={handleEnrollNow}
        disabled={isProcessing}
      >
        {isProcessing ? 'Processing...' : 'Enroll Now'}
      </button>
    </div>
  );
}
```

### Example 3: Add Certificate Download

In `src/pages/Certificate.tsx`:

```typescript
import { useCertificateGenerator } from '@/hooks/certificateHooks';

function Certificate() {
  const { generateAndDownloadCertificate, isGenerating } = useCertificateGenerator();

  const handleGenerateCertificate = async () => {
    await generateAndDownloadCertificate(
      'course-123',
      'Web Security Fundamentals',
      100
    );
  };

  return (
    <div>
      <button 
        onClick={handleGenerateCertificate}
        disabled={isGenerating}
      >
        {isGenerating ? 'Generating...' : 'Download Certificate'}
      </button>
    </div>
  );
}
```

### Example 4: Admin Registration Dashboard

In `src/pages/AdminDashboard.tsx`:

```typescript
import { useAdminRegistrationDashboard, useRegistrationStats } from '@/hooks/registrationHooks';

function AdminDashboard() {
  const { dashboardData, isLoading } = useAdminRegistrationDashboard();
  const { stats } = useRegistrationStats();

  if (isLoading) return <Loading />;

  return (
    <div>
      {/* Dashboard Stats */}
      <div className="grid grid-cols-3 gap-4">
        <div>
          <h3>Total Students</h3>
          <p className="text-2xl font-bold">{dashboardData?.studentCount}</p>
        </div>
        <div>
          <h3>Total Instructors</h3>
          <p className="text-2xl font-bold">{dashboardData?.instructorCount}</p>
        </div>
        <div>
          <h3>Schools</h3>
          <p className="text-2xl font-bold">{dashboardData?.schoolCount}</p>
        </div>
      </div>

      {/* Recent Registrations */}
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Type</th>
            <th>Date</th>
          </tr>
        </thead>
        <tbody>
          {dashboardData?.recentRegistrations.map(reg => (
            <tr key={reg.id}>
              <td>{reg.name}</td>
              <td>{reg.email}</td>
              <td>{reg.registrationType}</td>
              <td>{reg.registrationDate.toLocaleDateString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
```

## Firestore Database Schema

### payments collection
```json
{
  "userId": "user-id",
  "email": "user@email.com",
  "name": "User Name",
  "planName": "Intermediate Plan",
  "amount": 5999,
  "courseId": "course-123",
  "courseName": "Course Name",
  "paymentMethod": "razorpay",
  "status": "completed",
  "paymentId": "pay_123456",
  "signature": "signature_hash",
  "createdAt": "2026-03-16T10:00:00Z"
}
```

### user_enrollments collection
```json
{
  "userId": "user-id",
  "email": "user@email.com",
  "name": "User Name",
  "plan": "Intermediate Plan",
  "courseIds": ["course-123"],
  "enrolledAt": "2026-03-16T10:00:00Z",
  "status": "active",
  "createdAt": "2026-03-16T10:00:00Z"
}
```

### certificates collection
```json
{
  "userId": "user-id",
  "email": "user@email.com",
  "userName": "User Name",
  "courseId": "course-123",
  "courseName": "Course Name",
  "ctiNumber": "SKILLCODERS-XXXXX",
  "issuedDate": "2026-03-16T10:00:00Z",
  "certificateUrl": "gs://...",
  "status": "issued",
  "completionPercentage": 100,
  "createdAt": "2026-03-16T10:00:00Z"
}
```

### registration_logs collection
```json
{
  "userId": "user-id",
  "email": "user@email.com",
  "name": "User Name",
  "phone": "+91-XXXXXXXXXX",
  "registrationType": "student",
  "registrationDate": "2026-03-16T10:00:00Z",
  "loginCredentials": {
    "email": "user@email.com",
    "password": "base64_encoded"
  },
  "createdAt": "2026-03-16T10:00:00Z"
}
```

## Button Workflow Implementation

### 1. Registration → Logging
```
User clicks "Sign Up" 
  ↓
Firebase Authentication
  ↓
Log registration via useRegisterUser()
  ↓
Admin sees registration in dashboard
```

### 2. Enroll Now → Payment → Enrollment
```
User clicks "Enroll Now"
  ↓
usePaymentProcessor() initializes Razorpay
  ↓
User completes payment
  ↓
Payment verified and saved
  ↓
Enrollment logged
  ↓
Success notification
```

### 3. Course Completion → Certificate
```
User completes course (completionPercentage = 100)
  ↓
Click "Get Certificate"
  ↓
useCertificateGenerator() creates certificate
  ↓
Generates PDF with CTI number and name
  ↓
Uploads to Firebase Storage
  ↓
Auto-downloads certificate
```

### 4. Admin Dashboard Views Registration
```
Admin logs in
  ↓
useAdminRegistrationDashboard() loads
  ↓
Shows all registrations, payments, enrollments
  ↓
Can filter by type and date
```

## Razorpay Setup

### Get API Keys
1. Go to https://dashboard.razorpay.com
2. Navigate to Settings → API Keys
3. Copy Key ID (public key)
4. Add to VITE_RAZORPAY_KEY_ID in .env.local

### Payment Flow
1. User clicks "Enroll Now"
2. Razorpay modal opens
3. User enters payment details
4. Payment verified
5. Enrollment saved to Firestore
6. Certificate generated when course complete

## Testing Checklist

- [ ] Firebase config loads without errors
- [ ] Can sign up with Google/Github
- [ ] Registration appears in admin dashboard
- [ ] Razorpay payment modal opens
- [ ] Payment can be completed (test mode)
- [ ] Enrollment shows in Firestore
- [ ] Certificate generates with correct CTI number
- [ ] Certificate downloads as PDF
- [ ] All buttons work login to logout

## Security Considerations

1. **Passwords** - Currently base64 encoded. In production, use bcrypt
2. **Payment Verification** - Verify on backend with secret key
3. **Firebase Rules** - Set proper Firestore security rules
4. **Storage Rules** - Restrict certificate access to authenticated users
5. **API Keys** - Never commit .env.local to git

## File Structure

```
src/
├── services/
│   ├── paymentService.ts              # NEW: Razorpay integration
│   ├── certificateService.ts          # NEW: Certificate generation
│   ├── registrationService.ts         # NEW: Registration logging
│   └── ...
├── hooks/
│   ├── paymentHooks.ts                # NEW: Payment hooks
│   ├── certificateHooks.ts            # NEW: Certificate hooks
│   ├── registrationHooks.ts           # NEW: Registration hooks
│   └── ...
├── firebase/
│   └── config.ts                      # UPDATED: Enhanced Firebase config
├── pages/
│   ├── Register.tsx                   # TODO: Add registration logging
│   ├── CourseDetail.tsx               # TODO: Add payment integration
│   ├── Certificate.tsx                # TODO: Add certificate generation
│   └── ...
└── .env.local                         # UPDATED: Added Razorpay keys

Root/
├── .env.example                       # UPDATED: Added Razorpay template
└── FIREBASE_PAYMENT_SETUP.md          # THIS FILE
```

## Next Steps

1. ✅ Firebase SDK configured
2. ✅ Services created
3. ✅ Hooks created
4. ✅ Environment variables set
5. TODO: Update Register page to log registrations
6. TODO: Update CourseDetail to add payment button
7. TODO: Update Certificate page with generation
8. TODO: Update Admin Dashboard with registration data
9. TODO: Get Razorpay API keys and update .env.local
10. TODO: Test complete flow end-to-end

## Commands to Run

```bash
# Verify Firebase is loading
npm run dev
# Check browser console for any Firebase errors

# Build for production
npm run build

# Run tests
npm run test
```

## Support

For issues:
1. Check browser console for Firebase errors
2. Verify .env.local has all variables
3. Check Firestore in Firebase Console
4. Verify Razorpay credentials
5. Review database schema above

Happy building! 🚀
