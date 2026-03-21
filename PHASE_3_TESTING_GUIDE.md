# Phase 3 Admin Schools - Quick Start & Testing Guide

## 🚀 Getting Started

### Step 1: Verify Files Are Updated
```
☑️ src/hooks/schoolHooks.ts - NEW (created)
☑️ src/pages/AdminDashboard.tsx - UPDATED (with Schools tab)
```

### Step 2: Run Development Server
```bash
npm run dev
# or
yarn dev
# or
bun dev
```

### Step 3: Access Admin Dashboard
```
URL: http://localhost:5173/admin
Login: Your admin account
Click: "Schools" tab
```

---

## ✅ Testing Checklist

### Test 1: Schools Tab Appears
**What to check**:
- [ ] Admin Dashboard loads without errors
- [ ] "Schools" tab appears (between Overview and Users)
- [ ] Tab is clickable

**Expected Result**: 
```
Dashboard > Overview | Schools | Users | Settings
                    [Click] ↑
                    Should show school data
```

---

### Test 2: School Statistics Display
**What to check**:
- [ ] 4 statistics cards appear
  - Total Schools: X
  - Approved Schools: X
  - Pending Schools: X
  - Total Students: X
- [ ] Numbers are non-zero (if schools exist)
- [ ] Cards have correct styling

**Expected Layout**:
```
╔─────────────┐  ╔─────────────┐  ╔─────────────┐  ╔─────────────┐
║ 15 Schools  │  ║12 Approved  │  ║ 2 Pending   │  ║8500 Students║
║(card 1)     │  │(card 2)     │  │(card 3)     │  │(card 4)     │
╚─────────────┘  ╚─────────────┘  ╚─────────────┘  ╚─────────────┘
```

---

### Test 3: Schools Table Loads
**What to check**:
- [ ] Table appears with columns:
  - School Name
  - Principal Name
  - Location (City, State)
  - Number of Students
  - Status
  - Registration Date
  - Actions

- [ ] Data populated from Firestore
- [ ] Status badges color-coded correctly:
  - 🟢 Approved (green)
  - 🟡 Pending (yellow)
  - 🔴 Rejected (red)

**Expected Table Format**:
```
School Name        | Principal      | Location          | Students | Status    | Date       | Action
ABC School         | John Smith     | Mumbai, MH        | 500      | Approved  | 2024-01-15| [Approve]
XYZ Institute      | Jane Doe       | Delhi, DL         | 300      | Pending   | 2024-01-20| [Approve]
```

---

### Test 4: Pending Schools Approval Section
**What to check**:
- [ ] Yellow alert box appears for pending schools
- [ ] Section shows:
  - School details
  - Principal info
  - School email
  - School phone
  - Location
  - Number of students
  - Course interests
  - Notes textarea (optional)
  - Approve button
  - Reject button

**Expected Visual**:
```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
⚠️  PENDING SCHOOL APPROVALS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
[School Card 1]
  School: ABC School
  Principal: John Smith
  Email: principal@abc.com
  Phone: 9876543210
  Location: Mumbai, Maharashtra
  Students: 500
  Courses: Web Development, Data Science
  
  Add Notes:
  [________________ textarea ________________]
  
  [Reject] [Approve]

[School Card 2]
...
```

---

### Test 5: Approve School (Most Important Test)
**Setup Test Data**:
```
You need a school in 'pending' status.
If none exist, create via: schoolRegistrationService.registerSchool()
```

**Steps to Test**:
1. Find a pending school in approval section
2. (Optional) Add admin notes
3. Click "Approve" button
4. ⏳ Wait for loading state
5. 🔄 Button should show "Approving..."
6. ✅ Page should refresh

**Expected Results**:
```
BEFORE:
- School shows in pending section
- Status badge shows "pending"

DURING:
- Approve button shows loading state
- Other buttons disabled

AFTER:
- School disappears from pending section
- Status changes to "Approved" (green badge)
- Table updates
- Confirmation email sent to school admin
- Admin notes saved to Firestore
```

**Verify in Firestore**:
```
Go to: Firebase Console > Firestore > school_registrations
Find the school by ID
Check:
  - registrationStatus: 'approved' ✅
  - approvedDate: [new timestamp] ✅
  - adminNotes: [your notes text] ✅
```

---

### Test 6: Reject School
**Steps**:
1. Find another pending school
2. Click "Reject" button
3. See school status change to rejected

**Expected Results**:
```
School moves from pending section
Status changes to "Rejected" (red badge)
Email sent to school admin
No approval notes needed for reject
```

---

### Test 7: Real-time Refresh
**Steps**:
1. Open Admin Dashboard in 2 browser tabs
2. In tab 1: Approve a school
3. Watch tab 2: Does it auto-update?

**Expected**: 
- ✅ List refreshes automatically after approval
- ✅ Both tabs show same data
- ✅ Status updates in real-time

---

## 🐛 Troubleshooting

### Issue: "Schools" tab not appearing
**Solution**:
```
1. Clear browser cache (Ctrl+Shift+Delete)
2. Restart dev server (npm run dev)
3. Check AdminDashboard.tsx has Schools import
4. Verify schoolHooks.ts exists in src/hooks/
```

### Issue: "No schools showing in table"
**Solution**:
```
1. Check Firestore has data in school_registrations collection
2. Verify admin user has read permission
3. Check browser console for errors
4. Ensure Firebase auth is working
```

### Issue: "Approve button not working"
**Solution**:
1. Check network tab for errors
2. Verify Firestore has update permission
3. Look for error in browser console
4. Check admin user has write access

### Issue: "Email not sent on approval"
**Note**: Email is queued in Firestore only.
**Real emails require** Cloud Functions (Phase 3b).

For now:
```
Check: email_queue collection in Firestore
Should see new document:
{
  schoolEmail: 'principal@school.com',
  type: 'school_approved',
  status: 'queued',
  createdAt: timestamp,
  schoolData: {...}
}
```

---

## 📊 What Gets Saved to Firestore

### School Registration Document Updates:
```typescript
{
  id: 'school_123',
  schoolName: 'ABC School',
  registrationStatus: 'approved', // ← CHANGED
  approvedDate: Timestamp, // ← NEW
  adminNotes: 'Good school, approved by admin', // ← NEW (optional)
  // ... other fields unchanged
}
```

### New Email Queue Document Created:
```typescript
{
  id: 'email_queue_123',
  schoolEmail: 'principal@abc.com',
  type: 'school_approved',
  subject: 'Your School Registration Approved - Skill Coders',
  body: '...',
  status: 'queued',
  createdAt: Timestamp,
  sentAt?: null (until Cloud Function processes),
  schoolData: {
    schoolName: 'ABC School',
    schoolPhone: '9876543210',
    // ...
  },
  adminNotes: 'Good school, approved by admin'
}
```

---

## 🔄 Testing Flow (Complete Walkthrough)

### Scenario: Admin Approves First School

**Step 1**: Launch App
```bash
npm run dev
```

**Step 2**: Go to Admin Dashboard
```
http://localhost:5173/admin
Login with admin account
```

**Step 3**: Click Schools Tab
```
Should see:
- Statistics cards (may show 0 if no schools)
- Empty table (if no schools) or populated table (if schools exist)
```

**Step 4**: Check If Pending Schools Exist
```
Scroll to "Pending School Approvals" section
If no pending schools:
  → Create test data via Firebase Console
  → Add document to school_registrations collection
  → Set registrationStatus: 'pending'
```

**Step 5**: Approve a School
```
1. Find a pending school
2. (Optional) Type admin notes
3. Click "Approve" button
4. See button go into loading state
5. Wait 2-3 seconds
```

**Step 6**: Verify in Firestore
```
1. Open Firebase Console
2. Go to Firestore > school_registrations
3. Find the school you just approved
4. Check:
   ✅ registrationStatus = 'approved'
   ✅ approvedDate = new timestamp
   ✅ adminNotes = your notes (if entered)
```

**Step 7**: Verify Email Queue
```
1. In Firestore, go to email_queue collection
2. Should see new document created
3. Status should be 'queued'
4. Reason: Cloud Functions not set up yet
5. (Will be processed in Phase 3b)
```

**Step 8**: Verify UI Updated
```
1. School should disappear from pending section
2. School should show in table with 'Approved' status
3. Status badge should be green
4. Statistics should update (+1 to approved count)
```

---

## 📋 Next: Phase 3b - Cloud Functions

After Admin Dashboard works, build Cloud Functions that:

### 1. Email Delivery Function
```
Trigger: On document create in email_queue
Action: Send email via SendGrid/Gmail API
Result: Mark as sent, update sentAt timestamp
```

### 2. WhatsApp Delivery Function
```
Trigger: On document create in whatsapp_queue
Action: Send WhatsApp via Twilio API
Result: Mark as sent, update sentAt timestamp
```

### Why This Matters:
```
Current State:
Admin Approves School → Email queued in Firestore
                       ↓
                    STOPS HERE (no Cloud Function)

After Phase 3b:
Admin Approves School → Email queued in Firestore
                       ↓
                    Cloud Function picks up
                       ↓
                    Sends via SendGrid/API
                       ↓
                    Email reaches principal! ✅
```

---

## 🎯 Success Criteria

✅ **Admin Schools Feature Complete When**:
1. Schools tab loads in Admin Dashboard
2. School statistics display
3. Schools table shows all registered schools
4. Pending schools section visible
5. Admin can approve schools
6. Admin can reject schools
7. Admin notes are optional
8. Firestore updates correctly
9. Email queued for approval
10. UI refreshes after approval
11. Status badges update
12. Loading states visible
13. Error states handled
14. No console errors

---

## 🚀 Ready to Move Forward?

When all tests pass:
1. ✅ Admin Dashboard schools feature is COMPLETE
2. Next priority: **Cloud Functions** to send emails
3. Then: Instructor Messaging UI

---

**Version**: Phase 3 Testing Guide v1.0
**Status**: Ready to test
**Estimated Testing Time**: 15-30 minutes

