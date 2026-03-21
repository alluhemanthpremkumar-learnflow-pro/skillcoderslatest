/**
 * Registration Hooks - React hooks for registration and admin logging
 */

import { useState, useCallback, useEffect } from 'react';
import {
  logUserRegistration,
  getRegistrationLogs,
  buildAdminRegistrationDashboard,
  getRegistrationStats,
  RegistrationLog,
  AdminRegistrationDashboard,
} from '@/services/registrationService';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';

/**
 * Hook for logging user registration
 */
export const useRegisterUser = () => {
  const [isRegistering, setIsRegistering] = useState(false);
  const { toast } = useToast();

  const registerUser = useCallback(
    async (
      userId: string,
      email: string,
      name: string,
      phone?: string,
      registrationType: 'student' | 'instructor' | 'school' = 'student',
      password?: string
    ): Promise<boolean> => {
      setIsRegistering(true);

      try {
        const registration: RegistrationLog = {
          userId,
          email,
          name,
          phone,
          registrationType,
          registrationDate: new Date(),
          loginCredentials: password
            ? {
                email,
                password: btoa(password), // Simple encoding (use proper hashing in production)
              }
            : undefined,
        };

        const registrationId = await logUserRegistration(registration);

        console.log(`User registered: ${registrationId}`);

        // Don't show to user - background logging
        // toast({
        //   title: 'Registration logged successfully',
        // });

        return true;
      } catch (err: unknown) {
        console.error('Error registering user:', err);
        return false;
      } finally {
        setIsRegistering(false);
      }
    },
    []
  );

  return { registerUser, isRegistering };
};

/**
 * Hook for admin registration dashboard
 */
export const useAdminRegistrationDashboard = () => {
  const [dashboardData, setDashboardData] = useState<AdminRegistrationDashboard | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { isAdmin } = useAuth();

  const loadDashboard = useCallback(async () => {
    if (!isAdmin) return;

    setIsLoading(true);
    try {
      const data = await buildAdminRegistrationDashboard();
      setDashboardData(data);
    } catch (err) {
      console.error('Error loading admin dashboard:', err);
    } finally {
      setIsLoading(false);
    }
  }, [isAdmin]);

  useEffect(() => {
    loadDashboard();
  }, [loadDashboard]);

  return { dashboardData, isLoading, loadDashboard };
};

/**
 * Hook for registration statistics
 */
export const useRegistrationStats = () => {
  const [stats, setStats] = useState<Record<string, unknown> | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { isAdmin } = useAuth();

  const fetchStats = useCallback(async () => {
    if (!isAdmin) return;

    setIsLoading(true);
    try {
      const data = await getRegistrationStats();
      setStats(data);
    } catch (err) {
      console.error('Error fetching stats:', err);
    } finally {
      setIsLoading(false);
    }
  }, [isAdmin]);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  return { stats, isLoading, fetchStats };
};
