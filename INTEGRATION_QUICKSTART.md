# Quick Start Implementation Guide

## 🎯 Get Everything Working in 30 Minutes

Follow these exact steps to integrate everything into your app.

---

## Step 1: Verify Installation (5 minutes)

### ✅ Check Node Dependencies

```bash
npm list @tanstack/react-query firebase jspdf html2canvas
```

All should be installed already. If not:
```bash
npm install
```

### ✅ Verify Firebase Works

Open your browser DevTools (F12) → Console and look for this:
```javascript
// You should NOT see Firebase errors
// Firebase console shows logs like:
// "Firebase Auth is ready"
// "Firestore connected"
```

Test by running this in console:
```javascript
import { db } from './src/firebase/config';
console.log(db);
// Should show Firestore instance
```

---

## Step 2: Update Register.tsx (5 minutes)

### Current State
Your register page signs up users but doesn't log registrations.

### What to Add

Find the `onRegisterSuccess` or signup completion function and add:

```typescript
import { useRegisterUser } from '@/hooks/registrationHooks';

// Inside component:
const { registerUser, isRegistering } = useRegisterUser();

// After successful Firebase signup:
const handleRegistrationComplete = async (userId, email, name, phone) => {
  await registerUser({
    userId,
    email,
    name,
    phone,
    registrationType: 'student', // or 'instructor', 'school'
    password: btoa(password) // Base64 encode for now
  });
  
  // Show success message
  toast.success('Registration logged! Check admin dashboard.');
};
```

### Test It
1. Sign up as new user
2. Open Firebase Console → Firestore → `registration_logs`
3. You should see a new document with user data

---

## Step 3: Update CourseDetail.tsx (10 minutes)

### Current State
"Enroll Now" button probably doesn't do anything.

### What to Add

```typescript
import { usePaymentProcessor } from '@/hooks/paymentHooks';

// Inside component:
const { processPayment, isProcessing, error } = usePaymentProcessor();

// Update your "Enroll Now" button:
const handleEnrollClick = async () => {
  const planName = 'Pro Plan'; // Or dynamic from course
  const amount = 999; // In paise (99.99 rupees = 9999 paise)
  const courseId = course.id;
  const courseName = course.title;
  
  await processPayment(planName, amount, courseId, courseName);
};

// In JSX:
<button 
  onClick={handleEnrollClick}
  disabled={isProcessing}
>
  {isProcessing ? 'Processing...' : 'Enroll Now'}
</button>

// Show error if payment fails:
{error && <div className="text-red-500">{error}</div>}
```

### Test It (Use Razorpay Test Mode)
1. Click "Enroll Now"
2. Razorpay modal opens
3. Enter test card: `4111111111111111`
4. Any future date, any CVV
5. Click pay
6. Check Firebase Console → `payments` collection
7. Should see payment record

---

## Step 4: Update Certificate.tsx (8 minutes)

### Current State
Probably shows hardcoded or empty certificate.

### What to Add

```typescript
import { useCertificateGenerator } from '@/hooks/certificateHooks';

// Inside component:
const { generateAndDownloadCertificate, isGenerating } = useCertificateGenerator();

// Add download button:
const handleDownloadCertificate = async () => {
  const courseId = 'course-id-here';
  const courseName = 'React Mastery';
  
  await generateAndDownloadCertificate(courseId, courseName);
};

// In JSX:
<button 
  onClick={handleDownloadCertificate}
  disabled={isGenerating}
>
  {isGenerating ? 'Generating PDF...' : 'Download Certificate'}
</button>
```

### Test It
1. Click "Download Certificate"
2. PDF should download with:
   - Your name
   - Course name
   - CTI number (SKILLCODERS-XXXXX)
   - Issue date
3. Check Firebase Storage → `certificates` folder

---

## Step 5: Update AdminDashboard.tsx (10 minutes)

### Current State
Probably shows hardcoded data.

### What to Add

```typescript
import { useAdminRegistrationDashboard, useRegistrationStats } from '@/hooks/registrationHooks';
import { getAllPayments } from '@/services/paymentService';

// Inside component:
const { dashboardData, isLoading } = useAdminRegistrationDashboard();
const { stats } = useRegistrationStats();
const [payments, setPayments] = useState([]);

// Load payments:
useEffect(() => {
  const loadPayments = async () => {
    const data = await getAllPayments();
    setPayments(data);
  };
  loadPayments();
}, []);

// Display registration stats:
<div className="grid grid-cols-4 gap-4">
  <StatCard 
    title="Total Students" 
    value={stats?.studentCount || 0}
  />
  <StatCard 
    title="Total Instructors" 
    value={stats?.instructorCount || 0}
  />
  <StatCard 
    title="Total Schools" 
    value={stats?.schoolCount || 0}
  />
  <StatCard 
    title="Total Revenue" 
    value={`₹${stats?.totalRevenue || 0}`}
  />
</div>

// Display recent registrations:
<div className="mt-8">
  <h3>Recent Registrations</h3>
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
      {dashboardData?.recentRegistrations?.map(reg => (
        <tr key={reg.id}>
          <td>{reg.name}</td>
          <td>{reg.email}</td>
          <td>{reg.registrationType}</td>
          <td>{new Date(reg.createdAt).toLocaleDateString()}</td>
        </tr>
      ))}
    </tbody>
  </table>
</div>

// Display payments:
<div className="mt-8">
  <h3>Recent Payments</h3>
  <table>
    <thead>
      <tr>
        <th>User</th>
        <th>Amount</th>
        <th>Plan</th>
        <th>Status</th>
      </tr>
    </thead>
    <tbody>
      {payments?.map(payment => (
        <tr key={payment.id}>
          <td>{payment.userEmail}</td>
          <td>₹{(payment.amount / 100).toFixed(2)}</td>
          <td>{payment.planName}</td>
          <td>{payment.status}</td>
        </tr>
      ))}
    </tbody>
  </table>
</div>
```

---

## 🧪 Full Test Scenario

After updating all 4 pages, run this complete flow:

### Scenario: New User → Payment → Certificate

1. **Open app in incognito mode** (fresh user)

2. **Register page:**
   - Click "Sign up with Email"
   - Fill form: email@test.com, password123, name
   - Should log to Firestore `registration_logs`
   - ✅ Verify in Firebase Console

3. **Course page:**
   - Browse courses
   - Click "Enroll Now"
   - Razorpay modal opens
   - Use test card: `4111111111111111` | `12/25` | `123`
   - Should show success notification
   - ✅ Verify payment in Firebase Console `payments` collection
   - ✅ Verify enrollment in `user_enrollments` collection

4. **Certificate page:**
   - Go to Certificate section
   - Click "Download Certificate"
   - PDF downloads with name and CTI number
   - ✅ Verify certificate in Firebase Storage

5. **Admin dashboard:**
   - Login as admin
   - Should see:
     - Registration stats (student count +1)
     - New user in recent registrations
     - Payment in payment table
   - ✅ All data shows real information

---

## 🔧 Common Issues & Fixes

### Issue: "Payment hook not found"
**Fix:** Make sure file exists: `src/hooks/paymentHooks.ts`
```bash
ls src/hooks/
```

### Issue: "Firebase config not initialized"
**Fix:** Check `.env.local` has all Firebase keys
```bash
cat .env.local | grep FIREBASE
```

### Issue: "Razorpay key missing"
**Fix:** Add to `.env.local`:
```
VITE_RAZORPAY_KEY_ID=rzp_test_xxxxxxxxxxxxx
```

### Issue: "Certificate PDF blank"
**Fix:** Make sure html2canvas and jsPDF installed:
```bash
npm install html2canvas jspdf
```

### Issue: "Admin dashboard shows no data"
**Fix:** Make sure you're logged in as admin:
```javascript
// In browser console:
auth.currentUser // Should show admin user
```

---

## ✨ Success Indicators

### Register Page ✅
- [ ] Sign up button works
- [ ] Data appears in Firestore `registration_logs`
- [ ] Admin sees new registration

### Course Page ✅
- [ ] "Enroll Now" button opens Razorpay
- [ ] Test payment works
- [ ] Payment appears in Firestore
- [ ] Enrollment is logged

### Certificate Page ✅
- [ ] "Download Certificate" button works
- [ ] PDF downloads with user name
- [ ] PDF has CTI number (SKILLCODERS-XXXXX)
- [ ] Certificate in Firebase Storage

### Admin Dashboard ✅
- [ ] Shows real registration stats
- [ ] Shows recent registrations table
- [ ] Shows payments table
- [ ] All data updates in real time

---

## 🚀 Next Steps After Integration

1. **Get production Razorpay keys** from https://dashboard.razorpay.com
2. **Update `.env.local`** with production key
3. **Set Firebase security rules** for production
4. **Add email notifications** for payments
5. **Add course progress tracking**
6. **Set up certificates** to auto-generate on course completion
7. **Deploy to Firebase Hosting**

---

## 📞 Quick Reference

| Task | File | Hook |
|------|------|------|
| Register & Log | `src/pages/Register.tsx` | `useRegisterUser` |
| Payment Enrollment | `src/pages/CourseDetail.tsx` | `usePaymentProcessor` |
| Certificate Download | `src/pages/Certificate.tsx` | `useCertificateGenerator` |
| Admin Dashboard Data | `src/pages/AdminDashboard.tsx` | `useAdminRegistrationDashboard` |

---

## 💡 Pro Tips

1. **Always check console for errors** - DevTools → Console tab
2. **Use Firebase Console** to verify data is saving
3. **Test with Razorpay test mode** before production
4. **Check Firestore rules** if data can't be read/written
5. **Monitor performance** - use React DevTools Profiler

---

**You're all set! Follow these steps and everything should work. 🎉**

Questions? Check `FIREBASE_PAYMENT_SETUP.md` or `IMPLEMENTATION_EXAMPLES.tsx` for detailed examples.
