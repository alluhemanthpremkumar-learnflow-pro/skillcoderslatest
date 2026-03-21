/**
 * School Registration Service
 * Handles school registrations, parent tracking, and student management
 */

import { db } from '@/firebase/config';
import {
  collection,
  addDoc,
  getDocs,
  query,
  where,
  updateDoc,
  deleteDoc,
  doc,
  serverTimestamp,
  DocumentData,
  QuerySnapshot,
} from 'firebase/firestore';
import { sendCustomWhatsAppMessage, sendEmailNotification } from './notificationService';

export interface SchoolRegistration {
  id?: string;
  schoolName: string;
  schoolEmail: string;
  schoolPhone: string;
  principalName: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  numberOfStudents: number;
  courseInterested: string;
  registrationStatus: 'pending' | 'approved' | 'rejected';
  registrationDate: Date;
  approvedDate?: Date;
  adminNotes?: string;
  contactPerson?: string;
}

export interface StudentInSchool {
  id?: string;
  schoolId: string;
  studentName: string;
  studentEmail: string;
  studentPhone: string;
  parentName: string;
  parentEmail: string;
  parentPhone: string;
  className: string;
  rollNumber?: string;
  enrolledCourses: string[];
  enrollmentDate: Date;
  status: 'active' | 'inactive' | 'withdrawn';
}

export interface ParentNotification {
  id?: string;
  parentPhone: string;
  parentEmail: string;
  studentName: string;
  schoolId: string;
  studentId: string;
  message: string;
  type: 'enrollment' | 'progress' | 'announcement' | 'event';
  sentAt: Date;
  read: boolean;
}

/**
 * Register a new school
 */
export const registerSchool = async (schoolData: SchoolRegistration): Promise<string | null> => {
  try {
    const docRef = await addDoc(collection(db, 'school_registrations'), {
      ...schoolData,
      registrationDate: serverTimestamp(),
      registrationStatus: 'pending',
      createdAt: serverTimestamp(),
    });

    // Send confirmation email to school
    await sendEmailNotification(
      schoolData.schoolEmail,
      'School Registration Received - SkillCoders',
      `
        <h2>Registration Received</h2>
        <p>Dear ${schoolData.principalName},</p>
        <p>Thank you for registering ${schoolData.schoolName} with SkillCoders!</p>
        <p>We have received your registration request and our team will review it shortly.</p>
        <p>You will receive an email once your registration is approved.</p>
        <p>Best regards,<br/>SkillCoders Team</p>
      `
    );

    console.log('School registered successfully:', docRef.id);
    return docRef.id;
  } catch (error: unknown) {
    console.error('Error registering school:', error);
    return null;
  }
};

/**
 * Get all school registrations
 */
export const getAllSchoolRegistrations = async (): Promise<SchoolRegistration[]> => {
  try {
    const querySnapshot = await getDocs(collection(db, 'school_registrations'));
    const schools: SchoolRegistration[] = [];

    querySnapshot.forEach((doc) => {
      schools.push({
        id: doc.id,
        ...doc.data(),
        registrationDate: doc.data().registrationDate?.toDate(),
        approvedDate: doc.data().approvedDate?.toDate(),
      } as SchoolRegistration);
    });

    return schools;
  } catch (error: unknown) {
    console.error('Error fetching school registrations:', error);
    return [];
  }
};

/**
 * Get pending school registrations
 */
export const getPendingSchoolRegistrations = async (): Promise<SchoolRegistration[]> => {
  try {
    const q = query(
      collection(db, 'school_registrations'),
      where('registrationStatus', '==', 'pending')
    );

    const querySnapshot = await getDocs(q);
    const schools: SchoolRegistration[] = [];

    querySnapshot.forEach((doc) => {
      schools.push({
        id: doc.id,
        ...doc.data(),
        registrationDate: doc.data().registrationDate?.toDate(),
      } as SchoolRegistration);
    });

    return schools;
  } catch (error: unknown) {
    console.error('Error fetching pending registrations:', error);
    return [];
  }
};

/**
 * Approve or reject school registration
 */
export const approveSchoolRegistration = async (
  schoolId: string,
  approved: boolean,
  adminNotes?: string
): Promise<boolean> => {
  try {
    const schoolRef = doc(db, 'school_registrations', schoolId);
    const status = approved ? 'approved' : 'rejected';
    const message = approved
      ? `Your school registration has been approved! You can now proceed with enrolling students.`
      : `We are unable to approve your registration at this time. ${adminNotes || ''}`;

    await updateDoc(schoolRef, {
      registrationStatus: status,
      approvedDate: approved ? serverTimestamp() : null,
      adminNotes,
      updatedAt: serverTimestamp(),
    });

    // Get school data to send notification
    const schoolDoc = await getDocs(query(collection(db, 'school_registrations'), where('__name__', '==', schoolId)));
    schoolDoc.forEach((doc) => {
      const schoolData = doc.data() as SchoolRegistration;
      sendEmailNotification(
        schoolData.schoolEmail,
        `School Registration ${status === 'approved' ? 'Approved' : 'Rejected'} - SkillCoders`,
        `
          <h2>Registration ${status === 'approved' ? 'Approved' : 'Rejected'}</h2>
          <p>Dear ${schoolData.principalName},</p>
          <p>${message}</p>
          ${approved ? `<p>You can now access your school dashboard and enroll students.</p>` : ''}
          <p>Best regards,<br/>SkillCoders Team</p>
        `
      );
    });

    return true;
  } catch (error: unknown) {
    console.error('Error updating school registration:', error);
    return false;
  }
};

/**
 * Register a student in school
 */
export const registerStudentInSchool = async (studentData: StudentInSchool): Promise<string | null> => {
  try {
    const docRef = await addDoc(collection(db, 'school_students'), {
      ...studentData,
      enrollmentDate: serverTimestamp(),
      status: 'active',
      createdAt: serverTimestamp(),
    });

    // Send parent notification via WhatsApp
    if (studentData.parentPhone) {
      const parentMessage = `
🎓 *Student Enrollment - SkillCoders*

Hello ${studentData.parentName},

Your child ${studentData.studentName} has been enrolled in our courses at ${studentData.className}!

📚 *Details:*
School: Your School
Student: ${studentData.studentName}
Roll Number: ${studentData.rollNumber || 'N/A'}

✅ Enrollment is active and learning materials are ready.

📱 Login to track progress: ${process.env.VITE_APP_URL || 'https://skillcoders.com'}/dashboard

Best regards,
SkillCoders Team
      `.trim();

      await sendCustomWhatsAppMessage(studentData.parentPhone, parentMessage, 'enrollment');
    }

    // Send email notification
    if (studentData.parentEmail) {
      await sendEmailNotification(
        studentData.parentEmail,
        `Student Enrollment Confirmation - ${studentData.studentName}`,
        `
          <h2>Enrollment Confirmation</h2>
          <p>Dear ${studentData.parentName},</p>
          <p>Your child ${studentData.studentName} has been enrolled in SkillCoders courses!</p>
          <table style="border-collapse: collapse; width: 100%; margin: 20px 0;">
            <tr style="background-color: #f2f2f2;">
              <td style="border: 1px solid #ddd; padding: 8px;">Student Name</td>
              <td style="border: 1px solid #ddd; padding: 8px;">${studentData.studentName}</td>
            </tr>
            <tr>
              <td style="border: 1px solid #ddd; padding: 8px;">Class</td>
              <td style="border: 1px solid #ddd; padding: 8px;">${studentData.className}</td>
            </tr>
            <tr style="background-color: #f2f2f2;">
              <td style="border: 1px solid #ddd; padding: 8px;">Enrollment Date</td>
              <td style="border: 1px solid #ddd; padding: 8px;">${new Date().toLocaleDateString()}</td>
            </tr>
          </table>
          <p>You can track your child's progress on our dashboard.</p>
          <p>Best regards,<br/>SkillCoders Team</p>
        `,
        'enrollment'
      );
    }

    console.log('Student registered successfully:', docRef.id);
    return docRef.id;
  } catch (error: unknown) {
    console.error('Error registering student:', error);
    return null;
  }
};

/**
 * Get students in a school
 */
export const getSchoolStudents = async (schoolId: string): Promise<StudentInSchool[]> => {
  try {
    const q = query(collection(db, 'school_students'), where('schoolId', '==', schoolId));

    const querySnapshot = await getDocs(q);
    const students: StudentInSchool[] = [];

    querySnapshot.forEach((doc) => {
      students.push({
        id: doc.id,
        ...doc.data(),
        enrollmentDate: doc.data().enrollmentDate?.toDate(),
      } as StudentInSchool);
    });

    return students;
  } catch (error: unknown) {
    console.error('Error fetching school students:', error);
    return [];
  }
};

/**
 * Send announcement to all parents in a school
 */
export const sendSchoolAnnouncement = async (
  schoolId: string,
  title: string,
  message: string
): Promise<boolean> => {
  try {
    const students = await getSchoolStudents(schoolId);

    // Send to all parents
    const uniqueParents = new Set<string>();
    for (const student of students) {
      if (student.status === 'active') {
        // Send WhatsApp
        if (student.parentPhone && !uniqueParents.has(student.parentPhone)) {
          const announcement = `
📢 *Announcement - SkillCoders*

*${title}*

${message}

From: SkillCoders Team
          `.trim();

          await sendCustomWhatsAppMessage(student.parentPhone, announcement, 'announcement');
          uniqueParents.add(student.parentPhone);
        }

        // Send Email
        if (student.parentEmail) {
          await sendEmailNotification(
            student.parentEmail,
            `Important Announcement: ${title}`,
            `
              <h2>${title}</h2>
              <p>Dear ${student.parentName},</p>
              <p>${message}</p>
              <p>Best regards,<br/>SkillCoders Team</p>
            `,
            'announcement'
          );
        }
      }
    }

    return true;
  } catch (error: unknown) {
    console.error('Error sending announcement:', error);
    return false;
  }
};

/**
 * Update student status
 */
export const updateStudentStatus = async (
  studentId: string,
  status: 'active' | 'inactive' | 'withdrawn'
): Promise<boolean> => {
  try {
    const studentRef = doc(db, 'school_students', studentId);
    await updateDoc(studentRef, {
      status,
      updatedAt: serverTimestamp(),
    });

    return true;
  } catch (error: unknown) {
    console.error('Error updating student status:', error);
    return false;
  }
};

/**
 * Get school statistics
 */
export const getSchoolStatistics = async (schoolId: string) => {
  try {
    const students = await getSchoolStudents(schoolId);

    return {
      totalStudents: students.length,
      activeStudents: students.filter((s) => s.status === 'active').length,
      inactiveStudents: students.filter((s) => s.status === 'inactive').length,
      withdrawnStudents: students.filter((s) => s.status === 'withdrawn').length,
      courses: new Set(students.flatMap((s) => s.enrolledCourses)).size,
    };
  } catch (error: unknown) {
    console.error('Error getting school statistics:', error);
    return null;
  }
};
