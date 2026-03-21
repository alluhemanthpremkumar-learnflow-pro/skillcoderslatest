/**
 * School Registration Hooks - React hooks for school management
 * Use these in admin dashboard and school pages
 */

import { useState, useEffect } from 'react';
import {
  getPendingSchoolRegistrations,
  getAllSchoolRegistrations,
  approveSchoolRegistration,
  getSchoolStatistics,
  SchoolRegistration,
} from '@/services/schoolRegistrationService';

/**
 * Hook for fetching pending school registrations
 * Usage: const { pendingSchools, isLoading, error } = usePendingSchoolRegistrations();
 */
export const usePendingSchoolRegistrations = () => {
  const [pendingSchools, setPendingSchools] = useState<SchoolRegistration[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPendingSchools = async () => {
      try {
        setIsLoading(true);
        const schools = await getPendingSchoolRegistrations();
        setPendingSchools(schools || []);
      } catch (err: unknown) {
        console.error('Error fetching pending schools:', err);
        setError(err instanceof Error ? err.message : 'Failed to fetch pending schools');
      } finally {
        setIsLoading(false);
      }
    };

    fetchPendingSchools();
  }, []);

  return { pendingSchools, isLoading, error };
};

/**
 * Hook for fetching all school registrations
 * Usage: const { allSchools, isLoading } = useAllSchoolRegistrations();
 */
export const useAllSchoolRegistrations = () => {
  const [allSchools, setAllSchools] = useState<SchoolRegistration[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAllSchools = async () => {
      try {
        setIsLoading(true);
        const schools = await getAllSchoolRegistrations();
        setAllSchools(schools || []);
      } catch (err: unknown) {
        console.error('Error fetching schools:', err);
        setError(err instanceof Error ? err.message : 'Failed to fetch schools');
      } finally {
        setIsLoading(false);
      }
    };

    fetchAllSchools();
  }, []);

  return { allSchools, isLoading, error };
};

/**
 * Hook for approving/rejecting school registrations
 * Usage: const { approveSchool, isApproving } = useSchoolApproval();
 */
export const useSchoolApproval = () => {
  const [isApproving, setIsApproving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const approveSchool = async (schoolId: string, approved: boolean, notes?: string): Promise<boolean> => {
    try {
      setIsApproving(true);
      setError(null);
      const result = await approveSchoolRegistration(schoolId, approved, notes);
      return result;
    } catch (err: unknown) {
      const errorMsg = err instanceof Error ? err.message : 'Failed to update school registration';
      setError(errorMsg);
      console.error('Error updating school:', err);
      return false;
    } finally {
      setIsApproving(false);
    }
  };

  return { approveSchool, isApproving, error };
};

/**
 * Hook for school statistics
 * Usage: const { statistics, isLoading } = useSchoolStats('school123');
 */
export const useSchoolStats = (schoolId: string) => {
  const [statistics, setStatistics] = useState<Record<string, unknown> | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setIsLoading(true);
        const stats = await getSchoolStatistics(schoolId);
        setStatistics(stats);
      } catch (err: unknown) {
        console.error('Error fetching school stats:', err);
        setStatistics(null);
      } finally {
        setIsLoading(false);
      }
    };

    if (schoolId) {
      fetchStats();
    }
  }, [schoolId]);

  return { statistics, isLoading };
};

/**
 * Hook for admin school dashboard
 * Usage: const { schools, stats, isLoading } = useAdminSchoolDashboard();
 */
export const useAdminSchoolDashboard = () => {
  const [schools, setSchools] = useState<SchoolRegistration[]>([]);
  const [stats, setStats] = useState({
    totalSchools: 0,
    approvedSchools: 0,
    pendingSchools: 0,
    rejectedSchools: 0,
    totalStudents: 0,
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setIsLoading(true);
        const allSchools = await getAllSchoolRegistrations();
        setSchools(allSchools || []);

        // Calculate stats
        const approved = allSchools?.filter((s) => s.registrationStatus === 'approved').length || 0;
        const pending = allSchools?.filter((s) => s.registrationStatus === 'pending').length || 0;
        const rejected = allSchools?.filter((s) => s.registrationStatus === 'rejected').length || 0;
        const totalStudents =
          allSchools?.reduce((sum, s) => sum + (s.numberOfStudents || 0), 0) || 0;

        setStats({
          totalSchools: allSchools?.length || 0,
          approvedSchools: approved,
          pendingSchools: pending,
          rejectedSchools: rejected,
          totalStudents,
        });
      } catch (err: unknown) {
        console.error('Error fetching admin school data:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const refreshSchools = async () => {
    const allSchools = await getAllSchoolRegistrations();
    setSchools(allSchools || []);
  };

  return { schools, stats, isLoading, refreshSchools };
};
