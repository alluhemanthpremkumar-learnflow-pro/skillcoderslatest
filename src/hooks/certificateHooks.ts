/**
 * Certificate Hooks - React hooks for certificate operations
 */

import { useState, useCallback } from 'react';
import {
  createCertificate,
  generateCertificatePDF,
  uploadAndSaveCertificate,
  getUserCertificates,
  Certificate,
} from '@/services/certificateService';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';

/**
 * Hook for generating and downloading certificates
 * Usage: const { generateCert, isGenerating } = useCertificateGenerator();
 */
export const useCertificateGenerator = () => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();
  const { user, userProfile } = useAuth();

  const generateAndDownloadCertificate = useCallback(
    async (
      courseId: string,
      courseName: string,
      completionPercentage: number = 100
    ): Promise<boolean> => {
      if (!userProfile) {
        toast({
          title: 'Please login first',
          variant: 'destructive',
        });
        return false;
      }

      setIsGenerating(true);
      setError(null);

      try {
        // Create certificate record
        const certificate = await createCertificate(
          user?.uid || userProfile.id,
          user?.email || userProfile.email,
          userProfile.displayName || 'User',
          courseId,
          courseName,
          completionPercentage
        );

        toast({
          title: 'Generating certificate...',
          description: 'Please wait while we create your certificate',
        });

        // Generate PDF
        const { blob, filename } = await generateCertificatePDF(certificate);

        // Upload and save
        const certificateUrl = await uploadAndSaveCertificate(certificate, blob);

        // Trigger download
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);

        toast({
          title: 'Certificate Downloaded! 🎓',
          description: `Your certificate (${certificate.ctiNumber}) has been saved`,
        });

        return true;
      } catch (err: unknown) {
        const errorMsg = err instanceof Error ? err.message : 'Failed to generate certificate';
        setError(errorMsg);
        toast({
          title: 'Certificate Generation Failed',
          description: errorMsg,
          variant: 'destructive',
        });
        return false;
      } finally {
        setIsGenerating(false);
      }
    },
    [user, userProfile, toast]
  );

  return { generateAndDownloadCertificate, isGenerating, error };
};

/**
 * Hook for fetching user certificates
 */
export const useUserCertificates = () => {
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { user, userProfile } = useAuth();

  const fetchCertificates = useCallback(async () => {
    if (!userProfile) return;

    setIsLoading(true);
    try {
      const certs = await getUserCertificates(user?.uid || userProfile.id);
      setCertificates(certs);
    } catch (err) {
      console.error('Error fetching certificates:', err);
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  return { certificates, isLoading, fetchCertificates };
};
