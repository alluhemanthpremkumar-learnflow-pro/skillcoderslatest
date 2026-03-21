# Phase 3b: Firebase Cloud Functions Setup (Email & WhatsApp Delivery)

## 🎯 Objective

Create Firebase Cloud Functions that:
1. **Email Delivery Function** - Sends queued emails via SendGrid/Gmail
2. **WhatsApp Delivery Function** - Sends queued WhatsApp messages via Twilio

This enables the notification system to actually deliver messages from Firestore queues.

---

## Architecture Overview

### Current State (Phase 3a):
```
Admin approves school
    ↓
Email document created in email_queue collection
    ↓
STOPS HERE (no delivery) ❌
```

### After Phase 3b:
```
Admin approves school
    ↓
Email document created in email_queue collection
    ↓
Cloud Function triggers automatically
    ↓
Sends via SendGrid/Gmail API
    ↓
Marks as sent in Firestore
    ↓
Email reaches principal ✅
```

---

## Prerequisites

### 1. Firebase Project Setup
```
✅ Firestore initialized
✅ Firebase Auth working
✅ Collections created:
  - email_queue
  - whatsapp_queue
  - school_registrations
  - etc.
```

### 2. External APIs (Choose One)

#### Option A: SendGrid (Email) - RECOMMENDED
```
1. Sign up: https://sendgrid.com
2. Get API key
3. Set up sender email verification
4. Cost: Free tier includes 100 emails/day
```

#### Option B: Gmail API (Email)
```
1. Enable Gmail API: Google Cloud Console
2. Create service account
3. Grant send permissions
4. Cost: Free with quotas
```

#### Option C: Twilio (WhatsApp) - RECOMMENDED
```
1. Sign up: https://www.twilio.com
2. Get Account SID & Auth Token
3. Get WhatsApp Business number
4. Cost: $0.005 per message
```

---

## Implementation Plan

### Phase 3b Delivery Timeline

#### Week 1: Email Function
- [ ] Set up Firebase Functions project
- [ ] Create `processEmailQueue` function
- [ ] Configure SendGrid/Gmail API
- [ ] Test with sample emails
- [ ] Deploy to Firebase

#### Week 2: WhatsApp Function
- [ ] Create `processWhatsAppQueue` function
- [ ] Configure Twilio API
- [ ] Test with sample messages
- [ ] Deploy to Firebase
- [ ] Set up retry logic

#### Week 3: Testing & Monitoring
- [ ] End-to-end testing
- [ ] Monitor function logs
- [ ] Handle errors gracefully
- [ ] Set up alerts

---

## Cloud Function 1: Email Delivery

### File Location (to create):
```
functions/src/emailQueue.ts
```

### Function Structure:
```typescript
import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import sgMail from '@sendgrid/mail';

// Initialize
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

// Trigger: On new document in email_queue
exports.processEmailQueue = functions.firestore
  .document('email_queue/{docId}')
  .onCreate(async (snap, context) => {
    try {
      const emailData = snap.data();
      
      // Skip if already sent
      if (emailData.status === 'sent') {
        console.log('Email already sent, skipping');
        return;
      }

      // Send email via SendGrid
      const result = await sgMail.send({
        to: emailData.recipientEmail,
        from: 'noreply@skillcoders.com',
        subject: emailData.subject,
        html: emailData.body,
      });

      // Update status to sent
      await snap.ref.update({
        status: 'sent',
        sentAt: admin.firestore.FieldValue.serverTimestamp(),
        messageId: result[0].headers['x-message-id'],
      });

      console.log('Email sent successfully:', emailData.recipientEmail);
    } catch (error) {
      console.error('Email send failed:', error);
      
      // Update retries
      const currentRetries = snap.data().retries || 0;
      const maxRetries = 3;
      
      if (currentRetries < maxRetries) {
        await snap.ref.update({
          status: 'retry',
          retries: currentRetries + 1,
          lastError: error.message,
        });
      } else {
        await snap.ref.update({
          status: 'failed',
          error: error.message,
        });
      }
    }
  });
```

### What It Does:
1. ✅ Listens to email_queue collection
2. ✅ Grabs new documents (emails to send)
3. ✅ Sends via SendGrid API
4. ✅ Updates status to 'sent'
5. ✅ Handles retries (up to 3x)
6. ✅ Logs errors to Firebase console

### Firestore Document (Input):
```typescript
{
  id: 'email_123',
  recipientEmail: 'principal@school.com',
  subject: 'Your School Approved',
  body: '<html>...</html>',
  status: 'queued',
  createdAt: timestamp,
  retries: 0,
  // optional
  schoolData: {...}
}
```

### Firestore Document (After Sent):
```typescript
{
  // ... + new fields:
  status: 'sent',
  sentAt: timestamp,
  messageId: 'sendgrid_msg_id',
}
```

---

## Cloud Function 2: WhatsApp Delivery

### File Location (to create):
```
functions/src/whatsappQueue.ts
```

### Function Structure:
```typescript
import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import twilio from 'twilio';

// Initialize Twilio
const twilioClient = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

// Trigger: On new document in whatsapp_queue
exports.processWhatsAppQueue = functions.firestore
  .document('whatsapp_queue/{docId}')
  .onCreate(async (snap, context) => {
    try {
      const messageData = snap.data();
      
      // Skip if already sent
      if (messageData.status === 'sent') {
        console.log('WhatsApp already sent, skipping');
        return;
      }

      // Validate phone number
      const phoneNumber = `+${messageData.recipientPhone}`;

      // Send via Twilio WhatsApp
      const result = await twilioClient.messages.create({
        from: `whatsapp:${process.env.TWILIO_WHATSAPP_NUMBER}`,
        to: `whatsapp:${phoneNumber}`,
        body: messageData.message,
      });

      // Update status to sent
      await snap.ref.update({
        status: 'sent',
        sentAt: admin.firestore.FieldValue.serverTimestamp(),
        twilioMessageId: result.sid,
      });

      console.log('WhatsApp sent successfully:', phoneNumber);
    } catch (error) {
      console.error('WhatsApp send failed:', error);
      
      // Update retries
      const currentRetries = snap.data().retries || 0;
      const maxRetries = 3;
      
      if (currentRetries < maxRetries) {
        await snap.ref.update({
          status: 'retry',
          retries: currentRetries + 1,
          lastError: error.message,
        });
      } else {
        await snap.ref.update({
          status: 'failed',
          error: error.message,
        });
      }
    }
  });
```

### What It Does:
1. ✅ Listens to whatsapp_queue collection
2. ✅ Grabs new documents (messages to send)
3. ✅ Sends via Twilio API
4. ✅ Updates status to 'sent'
5. ✅ Handles retries (up to 3x)
6. ✅ Logs all transactions

### Firestore Document (Input):
```typescript
{
  id: 'whatsapp_123',
  recipientPhone: '919876543210', // without +
  message: 'Your school registration approved!',
  status: 'queued',
  createdAt: timestamp,
  retries: 0,
  messageType: 'school_approved'
}
```

### Firestore Document (After Sent):
```typescript
{
  // ... + new fields:
  status: 'sent',
  sentAt: timestamp,
  twilioMessageId: 'SMxxx...',
}
```

---

## Environment Variables

### In Firebase Console (Or local .env.local):

#### For Email Function:
```bash
SENDGRID_API_KEY=SG.xxxxxxxxxxxxx
# or
GMAIL_API_KEY=xxxxx
```

#### For WhatsApp Function:
```bash
TWILIO_ACCOUNT_SID=ACxxxxx
TWILIO_AUTH_TOKEN=xxxxx
TWILIO_WHATSAPP_NUMBER=+1234567890
```

### Set via Firebase CLI:
```bash
firebase functions:config:set sendgrid.key="SG.xxxxml"
firebase functions:config:set twilio.sid="ACxxxxx"
firebase functions:config:set twilio.token="xxxxx"
firebase functions:config:set twilio.whatsapp="whatsapp:+1234567890"
```

---

## Step-by-Step Setup

### Step 1: Initialize Firebase Functions
```bash
cd functions
npm init
npm install firebase-functions firebase-admin @sendgrid/mail twilio
```

### Step 2: Create Email Function File
```bash
# Create: functions/src/emailQueue.ts
# Copy code from "Cloud Function 1" above
```

### Step 3: Create WhatsApp Function File
```bash
# Create: functions/src/whatsappQueue.ts
# Copy code from "Cloud Function 2" above
```

### Step 4: Update functions/src/index.ts
```typescript
import * as admin from 'firebase-admin';

admin.initializeApp();

// Import and export functions
export { processEmailQueue } from './emailQueue';
export { processWhatsAppQueue } from './whatsappQueue';
```

### Step 5: Get API Keys
```
SendGrid:
  1. Go to: https://sendgrid.com/
  2. Sign up for free account
  3. Go to Settings > API Keys
  4. Create new key
  5. Copy key (starts with "SG.")

Twilio:
  1. Go to: https://www.twilio.com
  2. Sign up for free account
  3. Go to Account Settings
  4. Copy Account SID & Auth Token
  5. Get WhatsApp number from console
```

### Step 6: Deploy
```bash
firebase deploy --only functions
```

### Step 7: Monitor Logs
```bash
firebase functions:log
```

---

## Testing Functions Locally

### Test Setup:
```bash
firebase emulators:start
```

### Trigger Email Test:
```bash
# Manually add to email_queue collection in emulator
{
  recipientEmail: 'test@example.com',
  subject: 'Test Email',
  body: '<p>Test message</p>',
  status: 'queued',
  createdAt: now()
}
```

### Watch Logs:
```bash
firebase functions:log
# Should see: "Email sent successfully: test@example.com"
```

---

## Error Handling & Retries

### Retry Logic:
```
Attempt 1 → Failed → Wait 1 hour → Retry
Attempt 2 → Failed → Wait 2 hours → Retry
Attempt 3 → Failed → Mark as failed ❌
```

### Error Statuses:
```
status: 'queued'  - Waiting to send
status: 'retry'   - Failed, will retry
status: 'sent'    - Successfully sent ✅
status: 'failed'  - Failed after all retries ❌
```

### Monitor Failures:
```
Firebase Console > Functions > Logs
Look for: status: 'failed'
Check: lastError field for reason
```

---

## Monitoring & Alerts

### Check Function Health:
```
Firebase Console > Functions > Monitoring
- Success rate (should be > 95%)
- Execution time (should be < 10s)
- Error rate (should be < 5%)
```

### Common Issues & Fixes:

| Issue | Cause | Fix |
|-------|-------|-----|
| 401 Unauthorized | Invalid API key | Verify SendGrid/Twilio key |
| Timeout | Slow network | Increase timeout in function config |
| Rate limited | Too many requests | Add backoff/delay |
| Phone invalid | Wrong format | Validate phone before sending |
| Email bounces | Invalid email | Check email format |

---

## Testing Scenario: End-to-End

### Before Deployment:
1. Admin approves school from dashboard
2. Check `email_queue` in Firestore
3. Should see new document with status: 'queued'

### After Deployment:
1. Admin approves school
2. Check `email_queue` in Firestore
3. Document status changes from 'queued' → 'sent' within 5 seconds
4. `sentAt` timestamp appears
5. Principal receives email ✅

### Debug:
```bash
firebase functions:log

# Should see:
[emailQueue] Email sent successfully: principal@school.com
{
  status: 'sent',
  sentAt: timestamp,
  messageId: 'sendgrid_msg_id'
}
```

---

## Firestore Indices Required

### Create Indices:
```
Required for efficient querying:

1. email_queue
   - Fields: status (Ascending), createdAt (Descending)
   - Purpose: Find queued emails quickly

2. whatsapp_queue
   - Fields: status (Ascending), createdAt (Descending)
   - Purpose: Find queued messages quickly

3. school_registrations
   - Fields: registrationStatus (Ascending), registrationDate (Descending)
   - Purpose: Filter by status and date
```

### Auto-Create:
Firebase will suggest indices when you filter/sort. Just approve them in Console.

---

## Deployment Checklist

- [ ] API keys obtained (SendGrid & Twilio)
- [ ] Environment variables configured
- [ ] Email function code written
- [ ] WhatsApp function code written
- [ ] index.ts exports both functions
- [ ] Local testing passed
- [ ] Firestore indices created
- [ ] Deploy: `firebase deploy --only functions`
- [ ] Monitor logs post-deployment
- [ ] End-to-end test (approve school → check receipt)
- [ ] Error handling verified

---

## Costs & Quotas

### SendGrid (Email):
```
Free tier: 100 emails/day
Paid: $9.95/month (5,000 emails) and up
```

### Twilio (WhatsApp):
```
Charged: $0.005 per message sent
Free trial: $15 credit (3,000 messages approx)
```

### Firebase Functions:
```
Free tier: 125k function invocations/month
Paid: After free tier exceeded

Estimate:
- 1000 schools × 1 approval email = 1000 invocations
- 2000 parents × 2 notifications = 4000 invocations
- Total: ~5000/month (well within free tier)
```

---

## Timeline

### Estimated Duration:
```
Setup & Config:        2-3 hours
Email function:        1-2 hours
WhatsApp function:     1-2 hours
Testing & debugging:   2-3 hours
Deployment:            30 minutes
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
TOTAL:                 8-12 hours
```

---

## Next After Cloud Functions

1. **Phase 3b (this)**: Cloud Functions - Email & WhatsApp ← YOU ARE HERE
2. **Phase 3c**: Instructor Messaging UI
3. **Phase 3d**: Parent Portal
4. **Phase 4**: QA & Bug Fixes
5. **Phase 5**: Deployment to Production

---

## Quick Reference

### Key Collections:
```
email_queue         → Cloud Function watches this
whatsapp_queue      → Cloud Function watches this
school_registrations → Updated by admin approval
```

### Key Functions:
```
processEmailQueue()     → Sends queued emails
processWhatsAppQueue()  → Sends queued WhatsApp
```

### Key Functions to Update:
```
approveSchoolRegistration() → Already creates email/WhatsApp queue documents
```

---

**Version**: Phase 3b Plan v1.0
**Status**: Ready to implement
**Complexity**: Medium
**Blocker**: None (all prerequisites ready)

