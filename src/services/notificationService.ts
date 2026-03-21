/**
 * Notification Service - Email & WhatsApp
 * Handles sending payment receipts and notifications
 */

import { db } from '@/firebase/config';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

export interface PaymentReceipt {
  userId: string;
  email: string;
  phoneNumber: string;
  userName: string;
  amount: number;
  planName: string;
  courseId: string;
  courseName: string;
  paymentId: string;
  transactionDate: Date;
  receiptUrl?: string;
}

export interface WhatsAppMessage {
  phoneNumber: string;
  message: string;
  type: 'payment_receipt' | 'class_reminder' | 'notification' | 'announcement' | 'enrollment';
  metadata?: Record<string, unknown>;
}

export interface EmailNotification {
  to: string;
  subject: string;
  body: string;
  type: 'payment_receipt' | 'class_reminder' | 'notification' | 'announcement' | 'enrollment';
  metadata?: Record<string, unknown>;
}

/**
 * Send payment receipt via email
 * Uses Firebase Cloud Functions backend
 */
export const sendPaymentReceiptEmail = async (receipt: PaymentReceipt): Promise<boolean> => {
  try {
    const emailNotification: EmailNotification = {
      to: receipt.email,
      subject: `Payment Receipt - ₹${(receipt.amount / 100).toFixed(2)} - ${receipt.planName}`,
      body: `
        <h2>Payment Receipt</h2>
        <p>Dear ${receipt.userName},</p>
        <p>Thank you for your payment! Here are your receipt details:</p>
        <table style="border-collapse: collapse; width: 100%;">
          <tr style="background-color: #f2f2f2;">
            <td style="border: 1px solid #ddd; padding: 8px;">Course</td>
            <td style="border: 1px solid #ddd; padding: 8px;">${receipt.courseName}</td>
          </tr>
          <tr>
            <td style="border: 1px solid #ddd; padding: 8px;">Plan</td>
            <td style="border: 1px solid #ddd; padding: 8px;">${receipt.planName}</td>
          </tr>
          <tr style="background-color: #f2f2f2;">
            <td style="border: 1px solid #ddd; padding: 8px;">Amount</td>
            <td style="border: 1px solid #ddd; padding: 8px;">₹${(receipt.amount / 100).toFixed(2)}</td>
          </tr>
          <tr>
            <td style="border: 1px solid #ddd; padding: 8px;">Payment ID</td>
            <td style="border: 1px solid #ddd; padding: 8px;">${receipt.paymentId}</td>
          </tr>
          <tr style="background-color: #f2f2f2;">
            <td style="border: 1px solid #ddd; padding: 8px;">Date</td>
            <td style="border: 1px solid #ddd; padding: 8px;">${receipt.transactionDate.toLocaleDateString()}</td>
          </tr>
        </table>
        <p style="margin-top: 20px;">You can now access your course immediately!</p>
        <p>Best regards,<br/>SkillCoders Team</p>
      `,
      type: 'payment_receipt',
      metadata: {
        userId: receipt.userId,
        courseId: receipt.courseId,
        paymentId: receipt.paymentId,
      },
    };

    // Log to Firestore for backend processing
    await addDoc(collection(db, 'email_queue'), {
      ...emailNotification,
      status: 'pending',
      createdAt: serverTimestamp(),
      sentAt: null,
      retries: 0,
    });

    return true;
  } catch (error: unknown) {
    console.error('Error sending payment receipt email:', error);
    return false;
  }
};

/**
 * Send payment receipt via WhatsApp
 * Uses WhatsApp Business API
 */
export const sendPaymentReceiptWhatsApp = async (receipt: PaymentReceipt): Promise<boolean> => {
  try {
    const message = `
🎓 *Payment Receipt - SkillCoders*

Hello ${receipt.userName},

Thank you for your payment! 

📚 *Course Details:*
Course: ${receipt.courseName}
Plan: ${receipt.planName}
Amount: ₹${(receipt.amount / 100).toFixed(2)}

Transaction ID: ${receipt.paymentId}
Date: ${receipt.transactionDate.toLocaleDateString()}

✅ Your enrollment is active!

Start learning now: ${process.env.VITE_APP_URL || 'https://skillcoders.com'}/dashboard

Best regards,
SkillCoders Team
    `.trim();

    const whatsappData: WhatsAppMessage = {
      phoneNumber: receipt.phoneNumber,
      message,
      type: 'payment_receipt',
      metadata: {
        userId: receipt.userId,
        courseId: receipt.courseId,
        paymentId: receipt.paymentId,
      },
    };

    // Log to Firestore for backend processing
    await addDoc(collection(db, 'whatsapp_queue'), {
      ...whatsappData,
      status: 'pending',
      createdAt: serverTimestamp(),
      sentAt: null,
      retries: 0,
    });

    return true;
  } catch (error: unknown) {
    console.error('Error sending WhatsApp notification:', error);
    return false;
  }
};

/**
 * Send class reminder via WhatsApp
 */
export const sendClassReminderWhatsApp = async (
  phoneNumber: string,
  studentName: string,
  className: string,
  classTime: string,
  instructorName: string
): Promise<boolean> => {
  try {
    const message = `
📚 *Class Reminder - SkillCoders*

Hi ${studentName},

Reminder: Your class is starting soon!

📖 *Class Details:*
Class: ${className}
Time: ${classTime}
Instructor: ${instructorName}

📍 Join here: ${process.env.VITE_APP_URL || 'https://skillcoders.com'}/classes

See you soon! 👋
    `.trim();

    const whatsappData: WhatsAppMessage = {
      phoneNumber,
      message,
      type: 'class_reminder',
    };

    await addDoc(collection(db, 'whatsapp_queue'), {
      ...whatsappData,
      status: 'pending',
      createdAt: serverTimestamp(),
      sentAt: null,
      retries: 0,
    });

    return true;
  } catch (error: unknown) {
    console.error('Error sending class reminder:', error);
    return false;
  }
};

/**
 * Send custom notification via WhatsApp
 */
export const sendCustomWhatsAppMessage = async (
  phoneNumber: string,
  message: string,
  type: 'notification' | 'announcement' | 'enrollment' = 'notification'
): Promise<boolean> => {
  try {
    const whatsappData: WhatsAppMessage = {
      phoneNumber,
      message,
      type,
    };

    await addDoc(collection(db, 'whatsapp_queue'), {
      ...whatsappData,
      status: 'pending',
      createdAt: serverTimestamp(),
      sentAt: null,
      retries: 0,
    });

    return true;
  } catch (error: unknown) {
    console.error('Error sending WhatsApp message:', error);
    return false;
  }
};

/**
 * Send notification via email
 */
export const sendEmailNotification = async (
  email: string,
  subject: string,
  body: string,
  type: 'notification' | 'announcement' | 'enrollment' = 'notification'
): Promise<boolean> => {
  try {
    const emailData: EmailNotification = {
      to: email,
      subject,
      body,
      type,
    };

    await addDoc(collection(db, 'email_queue'), {
      ...emailData,
      status: 'pending',
      createdAt: serverTimestamp(),
      sentAt: null,
      retries: 0,
    });

    return true;
  } catch (error: unknown) {
    console.error('Error sending email notification:', error);
    return false;
  }
};

/**
 * Get notification history for user
 */
export const getNotificationHistory = async (userId: string, type?: string) => {
  try {
    // This would be implemented with Firestore queries
    // For now, returns a promise
    return Promise.resolve([]);
  } catch (error: unknown) {
    console.error('Error fetching notification history:', error);
    return [];
  }
};
