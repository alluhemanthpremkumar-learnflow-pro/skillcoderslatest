/**
 * Payment Hooks - React hooks for payment processing
 * Use these hooks in your components for payment flows
 */

import { useState, useCallback } from 'react';
import {
  initializeRazorpayPayment,
  savePaymentRecord,
  PaymentDetails,
  UserEnrollment,
  logUserEnrollment,
} from '@/services/paymentService';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';

/**
 * Hook for handling payment processing
 * Usage: const { processPayment, isProcessing, error } = usePaymentProcessor();
 */
export const usePaymentProcessor = () => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();
  const { user, userProfile } = useAuth();

  const processPayment = useCallback(
    async (
      planName: string,
      amount: number,
      courseId?: string,
      courseName?: string
    ): Promise<boolean> => {
      if (!user || !userProfile) {
        toast({
          title: 'Please login first',
          description: 'You need to be logged in to make a payment',
          variant: 'destructive',
        });
        return false;
      }

      setIsProcessing(true);
      setError(null);

      try {
        const paymentDetails: PaymentDetails = {
          userId: user.uid,
          email: user.email || userProfile.email,
          name: userProfile.displayName || 'User',
          planName,
          amount,
          courseId,
          courseName,
          paymentMethod: 'razorpay',
          status: 'pending',
        };

        let resolved = false;

        await initializeRazorpayPayment(
          paymentDetails,
          (response) => {
            toast({
              title: 'Payment Successful! ✨',
              description: `You have successfully enrolled in ${planName}`,
            });
            resolved = true;
          },
          (err) => {
            setError(err instanceof Error ? err.message : 'Payment failed');
            toast({
              title: 'Payment Failed',
              description: err instanceof Error ? err.message : 'Please try again',
              variant: 'destructive',
            });
          }
        );

        return resolved;
      } catch (err: unknown) {
        const errorMsg = err instanceof Error ? err.message : 'Payment processing error';
        setError(errorMsg);
        toast({
          title: 'Error',
          description: errorMsg,
          variant: 'destructive',
        });
        return false;
      } finally {
        setIsProcessing(false);
      }
    },
    [user, userProfile, toast]
  );

  return { processPayment, isProcessing, error };
};

/**
 * Hook for processing course enrollment
 */
export const useEnrollCourse = () => {
  const [isEnrolling, setIsEnrolling] = useState(false);
  const { toast } = useToast();
  const { user, userProfile } = useAuth();

  const enrollCourse = useCallback(
    async (
      courseId: string,
      courseName: string,
      planName: string = 'Individual Course'
    ): Promise<boolean> => {
      if (!user || !userProfile) {
        toast({
          title: 'Please login first',
          variant: 'destructive',
        });
        return false;
      }

      setIsEnrolling(true);

      try {
        // Log enrollment
        const enrollment: UserEnrollment = {
          userId: user.uid,
          email: user.email || userProfile.email,
          name: userProfile.displayName || 'User',
          plan: planName,
          courseIds: [courseId],
          enrolledAt: new Date().toISOString(),
          status: 'active',
          enrollmentDate: new Date(),
        };

        await logUserEnrollment(enrollment);

        toast({
          title: 'Enrollment Successful! 🎉',
          description: `You are now enrolled in ${courseName}`,
        });

        return true;
      } catch (err: unknown) {
        toast({
          title: 'Enrollment Failed',
          description: err instanceof Error ? err.message : 'Please try again',
          variant: 'destructive',
        });
        return false;
      } finally {
        setIsEnrolling(false);
      }
    },
    [user, userProfile, toast]
  );

  return { enrollCourse, isEnrolling };
};

/**
 * Hook for plan pricing and details
 */
export const usePricingPlans = () => {
  const plans = [
    {
      id: 'basic',
      name: 'Basic Plan',
      price: 1999,
      duration: '2 Years Access',
      description: 'Perfect for beginners',
      features: [
        'Access to basic courses',
        'Community forum access',
        'Certificate of completion',
        'Email support',
        'Basic lab environment',
      ],
    },
    {
      id: 'intermediate',
      name: 'Intermediate Plan',
      price: 5999,
      duration: '2 Years Access',
      description: 'Most popular',
      highlighted: true,
      features: [
        'Everything in Basic',
        'Advanced courses access',
        'Live mentor sessions',
        'Priority support',
        'Advanced lab environment',
        'Downloadable resources',
        'Mock interviews',
      ],
    },
    {
      id: 'advanced',
      name: 'Advanced Plan',
      price: 19999,
      duration: 'Lifetime Access',
      description: 'For serious learners',
      features: [
        'Everything in Intermediate',
        'All courses unlocked',
        'Personal mentor',
        '1-on-1 doubt clearing',
        'Resume building',
        'Job referrals',
        'Industry certifications prep',
        'Priority placement support',
      ],
    },
    {
      id: 'laptop',
      name: 'Course + Laptop Plan',
      price: 35000,
      duration: 'Lifetime + Laptop',
      description: 'Complete package',
      features: [
        'Everything in Advanced',
        'Brand new laptop included',
        'Pre-installed tools',
        'VIP support channel',
        'Guaranteed internship',
        'Exclusive masterclasses',
      ],
    },
  ];

  return { plans };
};
