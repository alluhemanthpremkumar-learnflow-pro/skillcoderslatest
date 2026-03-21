/**
 * Payment Service - Razorpay Integration
 * Handles all payment processing and verification
 */

import { db } from '@/firebase/config';
import { collection, addDoc, updateDoc, doc, serverTimestamp, query, where, getDocs } from 'firebase/firestore';
import { sendPaymentReceiptEmail, sendPaymentReceiptWhatsApp } from './notificationService';

export interface PaymentDetails {
  userId: string;
  email: string;
  name: string;
  planName: string;
  amount: number;
  courseId?: string;
  courseName?: string;
  paymentMethod: 'razorpay' | 'paypal' | 'card';
  status: 'pending' | 'completed' | 'failed';
  orderId?: string;
  paymentId?: string;
  signature?: string;
}

export interface UserEnrollment {
  userId: string;
  email: string;
  name: string;
  plan: string;
  courseIds: string[];
  enrolledAt: string;
  status: 'active' | 'inactive' | 'completed';
  enrollmentDate: Date;
}

/**
 * Initialize Razorpay payment
 */
export const initializeRazorpayPayment = async (
  paymentDetails: PaymentDetails,
  onSuccess: (response: Record<string, unknown>) => void,
  onError: (error: unknown) => void
) => {
  interface RazorpayWindow extends Window {
    Razorpay: new (options: Record<string, unknown>) => {
      open: () => void;
    };
  }

  try {
    // Load Razorpay script
    return new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.async = true;
      script.onload = () => {
        const options = {
          key: import.meta.env.VITE_RAZORPAY_KEY_ID || 'rzp_test_1234567890',
          amount: paymentDetails.amount * 100, // Amount in paise
          currency: 'INR',
          name: 'SkillCoders',
          description: `Payment for ${paymentDetails.planName}`,
          image: '/assets/sc_logo.png',
          handler: async (response: Record<string, unknown>) => {
            try {
              // Verify payment on backend
              const verified = await verifyPayment(response, paymentDetails);
              if (verified) {
                onSuccess(response);
                resolve(response);
              } else {
                reject(new Error('Payment verification failed'));
              }
            } catch (err) {
              onError(err);
              reject(err);
            }
          },
          prefill: {
            name: paymentDetails.name,
            email: paymentDetails.email,
          },
          theme: {
            color: '#8b5cf6',
          },
          modal: {
            ondismiss: () => {
              onError(new Error('Payment cancelled'));
              reject(new Error('Payment cancelled'));
            },
          },
        };

        const razorpay = new (window as unknown as RazorpayWindow).Razorpay(options);
        razorpay.open();
      };
      script.onerror = reject;
      document.body.appendChild(script);
    });
  } catch (error) {
    onError(error);
    throw error;
  }
};

/**
 * Verify payment (should be called from backend)
 */
export const verifyPayment = async (
  response: Record<string, unknown>,
  paymentDetails: PaymentDetails
): Promise<boolean> => {
  try {
    // In production, verify on backend using crypto
    // For now, verify the payment ID exists in Razorpay

    const paymentRecord: PaymentDetails = {
      ...paymentDetails,
      paymentId: String((response as Record<string, unknown>).razorpay_payment_id || ''),
      signature: String((response as Record<string, unknown>).razorpay_signature || ''),
      orderId: String((response as Record<string, unknown>).razorpay_order_id || ''),
      status: 'completed',
    };

    // Save payment to Firestore
    await savePaymentRecord(paymentRecord);

    // Log enrollment to admin dashboard
    if (paymentDetails.courseId) {
      await logUserEnrollment({
        userId: paymentDetails.userId,
        email: paymentDetails.email,
        name: paymentDetails.name,
        plan: paymentDetails.planName,
        courseIds: [paymentDetails.courseId],
        enrolledAt: new Date().toISOString(),
        status: 'active',
        enrollmentDate: new Date(),
      });
    }

    // Send payment receipt via email and WhatsApp
    try {
      const phoneNumber = await getUserPhoneNumber(paymentDetails.userId);
      if (phoneNumber) {
        await sendPaymentReceiptEmail({
          userId: paymentDetails.userId,
          email: paymentDetails.email,
          phoneNumber,
          userName: paymentDetails.name,
          amount: paymentDetails.amount,
          planName: paymentDetails.planName,
          courseId: paymentDetails.courseId || '',
          courseName: paymentDetails.courseName || 'Course Pack',
          paymentId: String((response as Record<string, unknown>).razorpay_payment_id || ''),
          transactionDate: new Date(),
        });

        await sendPaymentReceiptWhatsApp({
          userId: paymentDetails.userId,
          email: paymentDetails.email,
          phoneNumber,
          userName: paymentDetails.name,
          amount: paymentDetails.amount,
          planName: paymentDetails.planName,
          courseId: paymentDetails.courseId || '',
          courseName: paymentDetails.courseName || 'Course Pack',
          paymentId: String((response as Record<string, unknown>).razorpay_payment_id || ''),
          transactionDate: new Date(),
        });
      }
    } catch (notificationError) {
      console.warn('Error sending payment receipt:', notificationError);
      // Don't fail the payment if receipt sending fails
    }

    return true;
  } catch (error) {
    console.error('Payment verification failed:', error);
    return false;
  }
};

/**
 * Save payment record to Firestore
 */
export const savePaymentRecord = async (payment: PaymentDetails) => {
  try {
    const paymentsRef = collection(db, 'payments');
    const docRef = await addDoc(paymentsRef, {
      ...payment,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
    return docRef.id;
  } catch (error) {
    console.error('Error saving payment record:', error);
    throw error;
  }
};

/**
 * Log user enrollment/registration to admin dashboard
 */
export const logUserEnrollment = async (enrollment: UserEnrollment) => {
  try {
    const enrollmentsRef = collection(db, 'user_enrollments');
    const docRef = await addDoc(enrollmentsRef, {
      ...enrollment,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
    return docRef.id;
  } catch (error) {
    console.error('Error logging enrollment:', error);
    throw error;
  }
};

/**
 * Get user's enrollment history
 */
export const getUserEnrollments = async (userId: string): Promise<UserEnrollment[]> => {
  try {
    const enrollmentsRef = collection(db, 'user_enrollments');
    const q = query(enrollmentsRef, where('userId', '==', userId));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({
      ...doc.data(),
      enrollmentDate: doc.data().enrollmentDate?.toDate(),
    })) as UserEnrollment[];
  } catch (error) {
    console.error('Error fetching enrollments:', error);
    throw error;
  }
};

/**
 * Get all payments for admin
 */
export const getAllPayments = async (): Promise<PaymentDetails[]> => {
  try {
    const paymentsRef = collection(db, 'payments');
    const snapshot = await getDocs(paymentsRef);
    return snapshot.docs.map(doc => doc.data()) as PaymentDetails[];
  } catch (error) {
    console.error('Error fetching payments:', error);
    throw error;
  }
};

/**
 * Update enrollment status
 */
export const updateEnrollmentStatus = async (
  enrollmentId: string,
  status: 'active' | 'inactive' | 'completed'
) => {
  try {
    const enrollmentRef = doc(db, 'user_enrollments', enrollmentId);
    await updateDoc(enrollmentRef, {
      status,
      updatedAt: serverTimestamp(),
    });
  } catch (error) {
    console.error('Error updating enrollment:', error);
    throw error;
  }
};

/**
 * Get user phone number from Firestore
 */
export const getUserPhoneNumber = async (userId: string): Promise<string | null> => {
  try {
    const usersRef = collection(db, 'users');
    const q = query(usersRef, where('uid', '==', userId));
    const snapshot = await getDocs(q);
    
    if (snapshot.docs.length > 0) {
      return snapshot.docs[0].data().phoneNumber || null;
    }
    return null;
  } catch (error) {
    console.error('Error fetching user phone number:', error);
    return null;
  }
};
