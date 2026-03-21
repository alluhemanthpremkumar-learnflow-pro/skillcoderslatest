/**
 * Certificate Service - Generate and manage certificates
 * Handles certificate generation with custom names and CTI numbers
 */

import { db, storage } from '@/firebase/config';
import { collection, addDoc, updateDoc, doc, serverTimestamp, query, where, getDocs } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

export interface Certificate {
  id?: string;
  userId: string;
  email: string;
  userName: string;
  courseId: string;
  courseName: string;
  ctiNumber: string; // CTI number format: SKILLCODERS-XXXXX
  issuedDate: Date;
  certificateUrl?: string;
  status: 'pending' | 'issued' | 'expired';
  completionPercentage: number;
  createdAt?: Date;
}

/**
 * Generate unique CTI number
 * Format: SKILLCODERS-XXXXX
 */
export const generateCTINumber = (): string => {
  const timestamp = Date.now();
  const random = Math.floor(Math.random() * 100000);
  const ctiNumber = `SKILLCODERS-${timestamp.toString().slice(-5)}${random.toString().padStart(5, '0')}`.slice(0, 20);
  return ctiNumber;
};

/**
 * Create certificate for user
 */
export const createCertificate = async (
  userId: string,
  email: string,
  userName: string,
  courseId: string,
  courseName: string,
  completionPercentage: number = 100
): Promise<Certificate> => {
  try {
    const certificate: Certificate = {
      userId,
      email,
      userName,
      courseId,
      courseName,
      ctiNumber: generateCTINumber(),
      issuedDate: new Date(),
      status: 'pending',
      completionPercentage,
    };

    const certificatesRef = collection(db, 'certificates');
    const docRef = await addDoc(certificatesRef, {
      ...certificate,
      createdAt: serverTimestamp(),
      issuedDate: certificate.issuedDate,
    });

    certificate.id = docRef.id;
    return certificate;
  } catch (error) {
    console.error('Error creating certificate:', error);
    throw error;
  }
};

/**
 * Generate certificate PDF
 */
export const generateCertificatePDF = async (
  certificate: Certificate
): Promise<{ blob: Blob; filename: string }> => {
  try {
    // Create certificate HTML
    const certificateHTML = `
      <div style="
        width: 1200px;
        height: 800px;
        padding: 60px;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        color: white;
        font-family: 'Arial', sans-serif;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        text-align: center;
        box-shadow: 0 20px 60px rgba(0,0,0,0.3);
        border-radius: 20px;
        position: relative;
      ">
        <!-- Background Pattern -->
        <div style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; opacity: 0.1;">
          <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M 40 0 L 0 0 0 40" fill="none" stroke="white" stroke-width="1"/>
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />
          </svg>
        </div>

        <!-- Content -->
        <div style="position: relative; z-index: 1;">
          <!-- Title -->
          <div style="margin-bottom: 40px;">
            <img src="/assets/sc_logo.png" alt="SkillCoders" style="height: 80px; margin-bottom: 20px;" />
            <h1 style="
              font-size: 48px;
              font-weight: bold;
              margin: 0;
              text-transform: uppercase;
              letter-spacing: 2px;
              text-shadow: 2px 2px 4px rgba(0,0,0,0.3);
            ">Certificate of Achievement</h1>
          </div>

          <!-- Divider -->
          <div style="width: 200px; height: 3px; background: white; margin: 30px auto;"></div>

          <!-- Body Text -->
          <div style="margin: 40px 0; font-size: 18px; line-height: 1.8;">
            <p style="margin: 0; font-size: 16px; opacity: 0.9;">This is to certify that</p>
            <h2 style="
              font-size: 44px;
              font-weight: bold;
              margin: 15px 0;
              text-decoration: underline;
            ">${certificate.userName}</h2>
            <p style="margin: 0; font-size: 16px; opacity: 0.9;">has successfully completed the course</p>
            <h3 style="
              font-size: 28px;
              font-weight: bold;
              margin: 15px 0;
              font-style: italic;
            ">${certificate.courseName}</h3>
          </div>

          <!-- Details -->
          <div style="
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 40px;
            margin: 40px 0;
            width: 100%;
            max-width: 600px;
            font-size: 14px;
          ">
            <div>
              <p style="margin: 0; opacity: 0.9;">Certificate ID</p>
              <p style="font-weight: bold; font-size: 16px; margin: 5px 0;">${certificate.ctiNumber}</p>
            </div>
            <div>
              <p style="margin: 0; opacity: 0.9;">Date of Issue</p>
              <p style="font-weight: bold; font-size: 16px; margin: 5px 0;">${certificate.issuedDate.toLocaleDateString()}</p>
            </div>
          </div>

          <!-- Footer -->
          <div style="margin-top: 40px; font-size: 12px; opacity: 0.8;">
            <p style="margin: 5px 0;">SkillCoders - Empowering Future Technologists</p>
            <p style="margin: 5px 0;">www.skillcoders.com | Authorized by SkillCoders Education</p>
          </div>
        </div>
      </div>
    `;

    // Create temporary container
    const container = document.createElement('div');
    container.innerHTML = certificateHTML;
    container.style.position = 'absolute';
    container.style.left = '-9999px';
    document.body.appendChild(container);

    // Convert to canvas
    const canvas = await html2canvas(container, {
      scale: 2,
      useCORS: true,
      backgroundColor: '#ffffff',
    });

    // Convert to PDF
    const pdf = new jsPDF({
      orientation: 'landscape',
      unit: 'mm',
      format: 'a4',
    });

    const imgWidth = 297; // A4 landscape width in mm
    const imgHeight = (canvas.height * imgWidth) / canvas.width;

    const imgData = canvas.toDataURL('image/png');
    pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);

    // Clean up
    document.body.removeChild(container);

    const pdfBlob = pdf.output('blob');
    const filename = `${certificate.ctiNumber}-${certificate.userName.replace(/\s+/g, '_')}.pdf`;

    return { blob: pdfBlob, filename };
  } catch (error) {
    console.error('Error generating certificate PDF:', error);
    throw error;
  }
};

/**
 * Upload and save certificate
 */
export const uploadAndSaveCertificate = async (
  certificate: Certificate,
  pdfBlob: Blob
): Promise<string> => {
  try {
    // Upload to Firebase Storage
    const storageRef = ref(
      storage,
      `certificates/${certificate.ctiNumber}/${certificate.userName.replace(/\s+/g, '_')}.pdf`
    );
    await uploadBytes(storageRef, pdfBlob);
    const url = await getDownloadURL(storageRef);

    // Update certificate record in Firestore
    if (certificate.id) {
      const certRef = doc(db, 'certificates', certificate.id);
      await updateDoc(certRef, {
        certificateUrl: url,
        status: 'issued',
        updatedAt: serverTimestamp(),
      });
    }

    return url;
  } catch (error) {
    console.error('Error uploading certificate:', error);
    throw error;
  }
};

/**
 * Get user certificates
 */
export const getUserCertificates = async (userId: string): Promise<Certificate[]> => {
  try {
    const certificatesRef = collection(db, 'certificates');
    const q = query(certificatesRef, where('userId', '==', userId));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({
      ...doc.data(),
      issuedDate: doc.data().issuedDate?.toDate(),
    })) as Certificate[];
  } catch (error) {
    console.error('Error fetching certificates:', error);
    throw error;
  }
};

/**
 * Get certificate by ID
 */
export const getCertificateById = async (certificateId: string): Promise<Certificate | null> => {
  try {
    const certificatesRef = collection(db, 'certificates');
    const q = query(certificatesRef, where('id', '==', certificateId));
    const snapshot = await getDocs(q);
    if (snapshot.empty) return null;

    const doc = snapshot.docs[0];
    return {
      ...doc.data(),
      issuedDate: doc.data().issuedDate?.toDate(),
    } as Certificate;
  } catch (error) {
    console.error('Error fetching certificate:', error);
    throw error;
  }
};

/**
 * Mark certificate as downloaded
 */
export const markCertificateAsDownloaded = async (certificateId: string) => {
  try {
    const certRef = doc(db, 'certificates', certificateId);
    await updateDoc(certRef, {
      status: 'issued',
      downloadedAt: serverTimestamp(),
    });
  } catch (error) {
    console.error('Error marking certificate as downloaded:', error);
    throw error;
  }
};
