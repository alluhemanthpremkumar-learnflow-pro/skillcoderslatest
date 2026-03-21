/**
 * Registration Service - Track user registrations for admin dashboard
 * Logs all registrations and enrollment details
 */

import { db } from '@/firebase/config';
import { collection, addDoc, updateDoc, doc, serverTimestamp, getDocs, query, where } from 'firebase/firestore';

export interface RegistrationLog {
  id?: string;
  userId: string;
  email: string;
  name: string;
  phone?: string;
  registrationType: 'student' | 'instructor' | 'school';
  registrationDate: Date;
  loginCredentials?: {
    email: string;
    password: string; // Should be hashed in production
  };
  createdAt?: Date;
  updatedAt?: Date;
}

export interface AdminRegistrationDashboard {
  studentCount: number;
  instructorCount: number;
  schoolCount: number;
  recentRegistrations: RegistrationLog[];
  registrationsByDate: { date: string; count: number }[];
}

/**
 * Log new user registration
 */
export const logUserRegistration = async (
  registration: RegistrationLog
): Promise<string> => {
  try {
    const registrationsRef = collection(db, 'registration_logs');
    const docRef = await addDoc(registrationsRef, {
      ...registration,
      registrationDate: registration.registrationDate,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });

    console.log(`Registration logged for ${registration.email}`);
    return docRef.id;
  } catch (error) {
    console.error('Error logging registration:', error);
    throw error;
  }
};

/**
 * Get all registrations for admin dashboard
 */
export const getRegistrationLogs = async (): Promise<RegistrationLog[]> => {
  try {
    const registrationsRef = collection(db, 'registration_logs');
    const snapshot = await getDocs(registrationsRef);
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      registrationDate: doc.data().registrationDate?.toDate(),
      createdAt: doc.data().createdAt?.toDate(),
      updatedAt: doc.data().updatedAt?.toDate(),
    })) as RegistrationLog[];
  } catch (error) {
    console.error('Error fetching registration logs:', error);
    throw error;
  }
};

/**
 * Get registrations by type
 */
export const getRegistrationsByType = async (
  type: 'student' | 'instructor' | 'school'
): Promise<RegistrationLog[]> => {
  try {
    const registrationsRef = collection(db, 'registration_logs');
    const q = query(registrationsRef, where('registrationType', '==', type));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      registrationDate: doc.data().registrationDate?.toDate(),
    })) as RegistrationLog[];
  } catch (error) {
    console.error('Error fetching registrations by type:', error);
    throw error;
  }
};

/**
 * Build admin registration dashboard data
 */
export const buildAdminRegistrationDashboard = async (): Promise<AdminRegistrationDashboard> => {
  try {
    const allRegistrations = await getRegistrationLogs();

    // Count by type
    const studentCount = allRegistrations.filter(r => r.registrationType === 'student').length;
    const instructorCount = allRegistrations.filter(r => r.registrationType === 'instructor').length;
    const schoolCount = allRegistrations.filter(r => r.registrationType === 'school').length;

    // Recent registrations (last 10)
    const recentRegistrations = allRegistrations
      .sort((a, b) => b.registrationDate.getTime() - a.registrationDate.getTime())
      .slice(0, 10);

    // Registrations by date (last 7 days)
    const registrationsByDate: { date: string; count: number }[] = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dateStr = date.toLocaleDateString();
      const count = allRegistrations.filter(
        r =>
          r.registrationDate.toLocaleDateString() === dateStr
      ).length;
      registrationsByDate.push({ date: dateStr, count });
    }

    return {
      studentCount,
      instructorCount,
      schoolCount,
      recentRegistrations,
      registrationsByDate,
    };
  } catch (error) {
    console.error('Error building registration dashboard:', error);
    throw error;
  }
};

/**
 * Update registration status
 */
export const updateRegistrationStatus = async (
  registrationId: string,
  status: 'pending' | 'approved' | 'rejected'
) => {
  try {
    const regRef = doc(db, 'registration_logs', registrationId);
    await updateDoc(regRef, {
      status,
      updatedAt: serverTimestamp(),
    });
  } catch (error) {
    console.error('Error updating registration:', error);
    throw error;
  }
};

/**
 * Search registrations
 */
export const searchRegistrations = async (
  query: string
): Promise<RegistrationLog[]> => {
  try {
    const allRegistrations = await getRegistrationLogs();
    const lowercaseQuery = query.toLowerCase();

    return allRegistrations.filter(
      r =>
        r.email.toLowerCase().includes(lowercaseQuery) ||
        r.name.toLowerCase().includes(lowercaseQuery) ||
        r.userId.toLowerCase().includes(lowercaseQuery)
    );
  } catch (error) {
    console.error('Error searching registrations:', error);
    throw error;
  }
};

/**
 * Get registration statistics
 */
export const getRegistrationStats = async () => {
  try {
    const registrations = await getRegistrationLogs();
    const today = new Date().toLocaleDateString();
    const thisWeek = new Date();
    thisWeek.setDate(thisWeek.getDate() - 7);
    const thisMonth = new Date();
    thisMonth.setMonth(thisMonth.getMonth() - 1);

    return {
      totalRegistrations: registrations.length,
      todayRegistrations: registrations.filter(
        r => r.registrationDate.toLocaleDateString() === today
      ).length,
      weekRegistrations: registrations.filter(
        r => r.registrationDate >= thisWeek
      ).length,
      monthRegistrations: registrations.filter(
        r => r.registrationDate >= thisMonth
      ).length,
      byType: {
        students: registrations.filter(r => r.registrationType === 'student').length,
        instructors: registrations.filter(r => r.registrationType === 'instructor').length,
        schools: registrations.filter(r => r.registrationType === 'school').length,
      },
    };
  } catch (error) {
    console.error('Error getting registration stats:', error);
    throw error;
  }
};
