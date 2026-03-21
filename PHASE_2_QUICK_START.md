# Phase 2 Developer Quick Guide

## Quick Integration Examples

### 1. Send Payment Receipt

**After Payment Success:**
```typescript
import { sendPaymentReceiptEmail, sendPaymentReceiptWhatsApp } from '@/services/notificationService';

// Already integrated in verifyPayment() in paymentService.ts
// Receipts are sent automatically after payment verification
```

---

### 2. School Registration Flow

**Register School:**
```typescript
import { registerSchool, getPendingSchoolRegistrations, approveSchoolRegistration } from '@/services/schoolRegistrationService';

// When admin reviews registrations
const pending = await getPendingSchoolRegistrations();

// Approve school
await approveSchoolRegistration('school123', true, 'Welcome!');
```

**Register Student:**
```typescript
import { registerStudentInSchool, getSchoolStudents } from '@/services/schoolRegistrationService';

// Enroll student
const studentId = await registerStudentInSchool({
  schoolId: 'school123',
  studentName: 'John Doe',
  studentEmail: 'john@example.com',
  studentPhone: '9876543210',
  parentName: 'Parent Name',
  parentEmail: 'parent@example.com',
  parentPhone: '9876543210',
  className: '10th Grade',
  enrolledCourses: ['web101', 'python101'],
  status: 'active',
  enrollmentDate: new Date(),
});

// Get all students in school
const students = await getSchoolStudents('school123');
```

---

### 3. Instructor Messaging

**Create Group:**
```typescript
import { createMessageGroup, addGroupMember, sendGroupMessage } from '@/services/messagingService';

const groupId = await createMessageGroup({
  instructorId: 'instr123',
  instructorName: 'Dr. Smith',
  groupName: 'Web Development - Batch A',
  courseName: 'Web Development',
  courseId: 'web101',
  members: ['student1', 'student2', 'student3'],
  groupType: 'class',
});
```

**Send Message:**
```typescript
await sendGroupMessage({
  groupId: 'group123',
  senderId: 'instr123',
  senderName: 'Dr. Smith',
  senderRole: 'instructor',
  message: 'Today we will learn about React Hooks!',
  messageType: 'text', // or 'announcement'
});
```

**Get Messages (Real-time):**
```typescript
import { subscribeToGroupMessages } from '@/services/messagingService';

// Subscribe to real-time updates
const unsubscribe = subscribeToGroupMessages('group123', (messages) => {
  console.log('Messages:', messages);
  // Update UI with messages
});

// Cleanup when component unmounts
// unsubscribe();
```

**Let's Get All Groups:**
```typescript
import { getStudentGroups, getInstructorGroups } from '@/services/messagingService';

// For student
const groups = await getStudentGroups('student123');

// For instructor
const groups = await getInstructorGroups('instr123');
```

---

### 4. Terms & Conditions Integration

**In Your Component:**
```typescript
import { TermsAndConditions } from '@/components/TermsAndConditions';
import { useState } from 'react';

export function MySignupComponent() {
  const [termsOpen, setTermsOpen] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);

  const handleSignup = () => {
    if (!termsAccepted) {
      setTermsOpen(true);
      return;
    }
    // Proceed with signup
  };

  return (
    <>
      <button onClick={handleSignup}>Sign Up</button>
      
      <TermsAndConditions
        open={termsOpen}
        onOpenChange={setTermsOpen}
        onAccept={() => setTermsAccepted(true)}
        onReject={() => setTermsAccepted(false)}
      />
    </>
  );
}
```

---

### 5. Send Custom Notifications

**Email Notification:**
```typescript
import { sendEmailNotification } from '@/services/notificationService';

await sendEmailNotification(
  'user@example.com',
  'Class Tomorrow Reminder',
  '<p>Your class starts tomorrow at 10 AM. See you there!</p>',
  'notification'
);
```

**WhatsApp Notification:**
```typescript
import { sendCustomWhatsAppMessage } from '@/services/notificationService';

await sendCustomWhatsAppMessage(
  '+919876543210',
  'Hi John! Your class starts in 1 hour. Click here to join: https://skillcoders.com/class',
  'notification'
);
```

**Class Reminder:**
```typescript
import { sendClassReminderWhatsApp } from '@/services/notificationService';

await sendClassReminderWhatsApp(
  '+919876543210',
  'John Doe',
  'Web Development - Batch A',
  '10:00 AM - 11:30 AM',
  'Dr. Smith'
);
```

---

### 6. School Announcements

**Send to All Parents in School:**
```typescript
import { sendSchoolAnnouncement } from '@/services/schoolRegistrationService';

await sendSchoolAnnouncement(
  'school123',
  'Holiday Announcement',
  'Dear Parents, school will be closed on Monday for holiday...'
);

// Sends to all active students' parents via WhatsApp + Email
```

---

### 7. Group Member Management

**Add Student to Group:**
```typescript
import { addGroupMember } from '@/services/messagingService';

await addGroupMember(
  'group123',
  'student123',
  'John Doe',
  'john@example.com',
  '9876543210',
  'student'
);
// Student receives welcome WhatsApp message
```

**Remove Student from Group:**
```typescript
import { removeGroupMember } from '@/services/messagingService';

await removeGroupMember('group123', 'student123');
```

---

### 8. Notification History

**Get Group Statistics:**
```typescript
import { getGroupStatistics } from '@/services/messagingService';

const stats = await getGroupStatistics('group123');
// Returns: { totalMessages, totalMembers, uniqueSenders, lastMessageDate }
```

**Get School Statistics:**
```typescript
import { getSchoolStatistics } from '@/services/schoolRegistrationService';

const stats = await getSchoolStatistics('school123');
// Returns: { totalStudents, activeStudents, inactiveStudents, withdrawnStudents, courses }
```

---

## Common Use Cases

### Use Case 1: Complete Payment Flow

```typescript
// 1. User goes to CourseDetail
// 2. Clicks "Enroll Now"
// 3. Payment modal opens (Razorpay)
// 4. User completes payment
// 5. verifyPayment() is called
// 6. Payment is saved
// 7. User enrollment is logged
// 8. Receipt email is sent automatically ✅
// 9. Receipt WhatsApp is sent automatically ✅
// 10. UX complete!
```

### Use Case 2: School Enrolls Students

```typescript
// 1. School registers via SchoolRegistration page
// 2. Admin reviews in school_registrations collection
// 3. Admin approves school
// 4. School admin logs in (future)
// 5. School registers first student
// 6. Parent receives enrollment email ✅
// 7. Parent receives enrollment WhatsApp ✅
// 8. Parent and student can login
// 9. Student accesses courses
```

### Use Case 3: Instructor Creates Class Group

```typescript
// 1. Instructor logs in to dashboard
// 2. Creates "Web Dev - Batch A" group
// 3. Adds 30 students to group
// 4. All students receive welcome WhatsApp ✅
// 5. Instructor sends announcement
// 6. All students notified via WhatsApp ✅
// 7. Students can message in group
// 8. Real-time message updates ✅
```

---

## Debugging Tips

### Check Email/WhatsApp Queues
```typescript
// In Firestore Console:
// 1. Navigate to: database → Collections
// 2. Click on "email_queue" collection
// 3. View pending messages
// 4. Check "status" field
// 5. Look at "retries" count
```

### Search Collections
```typescript
// Firestore Query:
db.collection('email_queue')
  .where('status', '==', 'pending')
  .limit(10)
  .get()
```

### Monitor Real-time Messages
```typescript
// In your component:
import { onSnapshot } from 'firebase/firestore';

onSnapshot(
  query(collection(db, 'group_messages'), 
    where('groupId', '==', 'group123')),
  (snapshot) => {
    console.log('New messages:', snapshot.docs.map(d => d.data()));
  }
);
```

---

## Error Handling

### Try-Catch Pattern
```typescript
try {
  const result = await registerSchool(schoolData);
  if (result) {
    console.log('✅ School registered');
  } else {
    console.log('❌ School registration failed');
  }
} catch (error) {
  console.error('💥 Error:', error.message);
}
```

### Toast Notifications
```typescript
import { useToast } from '@/hooks/use-toast';

const { toast } = useToast();

toast({
  title: 'Success',
  description: 'School registered successfully!',
});

toast({
  title: 'Error',
  description: 'Failed to register school',
  variant: 'destructive',
});
```

---

## Firestore Rules Needed

```json
{
  "rules": {
    "email_queue": {
      "allow read": "if request.auth != null && request.auth.token.admin == true",
      "allow create": "if true",
      "allow update": "if request.auth.token.admin == true"
    },
    "whatsapp_queue": {
      "allow read": "if request.auth != null && request.auth.token.admin == true",
      "allow create": "if true",
      "allow update": "if request.auth.token.admin == true"
    },
    "school_registrations": {
      "allow read": "if request.auth != null",
      "allow create": "if true",
      "allow update": "if request.auth.token.admin == true"
    },
    "school_students": {
      "allow read": "if request.auth != null",
      "allow create": "if request.auth.token.admin == true || request.auth.token.instructor == true",
      "allow update": "if request.auth.token.admin == true"
    },
    "message_groups": {
      "allow read": "if request.auth != null",
      "allow create": "if request.auth.token.instructor == true",
      "allow update": "if request.auth.token.instructor == true"
    },
    "group_messages": {
      "allow read": "if request.auth != null",
      "allow create": "if request.auth != null",
      "allow update": "if request.auth.uid == resource.data.senderId"
    },
    "group_members": {
      "allow read": "if request.auth != null",
      "allow create": "if request.auth.token.instructor == true",
      "allow update": "if request.auth != null"
    }
  }
}
```

---

## Performance Tips

1. **Message Pagination**: Load messages in batches
   ```typescript
   const q = query(
     collection(db, 'group_messages'),
     where('groupId', '==', groupId),
     limit(50)
   );
   ```

2. **Unsubscribe**: Always unsubscribe from listeners
   ```typescript
   useEffect(() => {
     const unsubscribe = subscribeToGroupMessages(groupId, callback);
     return () => unsubscribe();
   }, [groupId]);
   ```

3. **Batch Notifications**: Use batch operations
   ```typescript
   // Instead of calling sendEmails in loop
   // Collect and process in batches of 100
   ```

---

**Version**: Phase 2 Implementation
**Last Updated**: Today
**Status**: 🟢 Production Ready

