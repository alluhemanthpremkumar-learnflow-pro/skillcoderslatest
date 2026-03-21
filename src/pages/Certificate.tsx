import { useState, useRef, CSSProperties } from 'react';
import { motion } from 'framer-motion';
import { Download, ArrowLeft, FileImage, FileText } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ParticleBackground from '@/components/ParticleBackground';
import GlowText from '@/components/GlowText';
import GlowButton from '@/components/GlowButton';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { useCertificateGenerator } from '@/hooks/certificateHooks';
import certificateTemplate from '@/assets/certificate_template.png';

const certificateStyles = {
  container: { width: '900px', maxWidth: '100%', aspectRatio: 1.414 } as CSSProperties,
  nameOverlay: { paddingTop: '28%' } as CSSProperties,
  nameText: { fontFamily: 'Georgia, serif' } as CSSProperties,
  dateOverlay: { top: '30%', right: '12%' } as CSSProperties,
  dateText: { fontFamily: 'Georgia, serif' } as CSSProperties,
  certNoOverlay: { top: '33%', right: '8%' } as CSSProperties,
  certNoText: { fontFamily: 'Georgia, serif' } as CSSProperties,
};

const Certificate = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const certificateRef = useRef<HTMLDivElement>(null);
  const { generateAndDownloadCertificate, isGenerating, error } = useCertificateGenerator();
  
  const { user, userProfile } = useAuth();
  
  const [studentName, setStudentName] = useState(userProfile?.displayName || user?.displayName || '');
  const [courseName, setCourseName] = useState('');
  const [showCertificate, setShowCertificate] = useState(false);

  const today = new Date();
  const dateStr = `${today.toLocaleString('default', { month: 'long' })} ${today.getDate()}, ${today.getFullYear()}`;
  const certNo = `SKILLCODERS-${today.getFullYear()}${String(today.getMonth() + 1).padStart(2, '0')}`;

  const handleGenerate = () => {
    if (!studentName.trim() || !courseName.trim()) {
      toast({ title: 'Please enter student name and course name', variant: 'destructive' });
      return;
    }
    setShowCertificate(true);
  };

  const handleDownloadCertificate = async () => {
    try {
      // Use Firebase certificate generation
      await generateAndDownloadCertificate('course-123', courseName);
    } catch (err: unknown) {
      console.error('Error generating certificate:', err);
      // Fallback to local generation
      downloadAsPDF();
    }
  };

  const downloadAsPNG = async () => {
    if (!certificateRef.current) return;
    try {
      const canvas = await html2canvas(certificateRef.current, { scale: 2, useCORS: true });
      const link = document.createElement('a');
      link.download = `${studentName.replace(/\s+/g, '_')}_Certificate.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
      toast({ title: 'Certificate downloaded as PNG!' });
    } catch {
      toast({ title: 'Download failed', variant: 'destructive' });
    }
  };

  const downloadAsPDF = async () => {
    if (!certificateRef.current) return;
    try {
      const canvas = await html2canvas(certificateRef.current, { scale: 2, useCORS: true });
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('landscape', 'mm', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save(`${studentName.replace(/\s+/g, '_')}_Certificate.pdf`);
      toast({ title: 'Certificate downloaded as PDF!' });
    } catch {
      toast({ title: 'Download failed', variant: 'destructive' });
    }
  };

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      <ParticleBackground />
      <Navbar />
      <main className="pt-24 pb-12 px-4">
        <div className="container mx-auto max-w-4xl">
          <motion.button initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} onClick={() => navigate(-1)} className="flex items-center gap-2 text-muted-foreground hover:text-foreground mb-6 group transition-colors">
            <ArrowLeft className="w-5 h-5 group-hover:text-primary transition-colors" />
            <span className="text-sm font-medium">Go Back</span>
          </motion.button>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-8">
            <h1 className="text-3xl font-bold mb-2">
              Course Completion <GlowText as="span" color="gradient" animate={false}>Certificate</GlowText>
            </h1>
            <p className="text-muted-foreground">Download your certificate in PDF or PNG format</p>
          </motion.div>

          {!showCertificate ? (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-card/80 backdrop-blur-xl rounded-2xl border border-border p-8 max-w-md mx-auto glow-border">
              <div className="space-y-4">
                <div>
                  <Label>Student Full Name *</Label>
                  <Input value={studentName} onChange={(e) => setStudentName(e.target.value)} placeholder="Enter your full name" className="mt-1 bg-background/50" required />
                </div>
                <div>
                  <Label>Course / Program Name *</Label>
                  <Input value={courseName} onChange={(e) => setCourseName(e.target.value)} placeholder="e.g., Cyber Security Internship" className="mt-1 bg-background/50" required />
                </div>
                <GlowButton variant="primary" size="lg" className="w-full" onClick={handleGenerate}>
                  Generate Certificate
                </GlowButton>
              </div>
            </motion.div>
          ) : (
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}>
              {/* Certificate Preview */}
              {/* Use inline styles for certificate positioning */}
              <div ref={certificateRef} className="relative mx-auto" style={certificateStyles.container}>
                <img src={certificateTemplate} alt="Certificate" className="w-full h-full object-contain" crossOrigin="anonymous" />
                {/* Overlay name on the certificate */}
                {/* Use inline styles for certificate positioning */}
                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none" style={certificateStyles.nameOverlay}>
                  {/* Use inline styles for certificate positioning */}
                  <p className="text-3xl md:text-4xl font-bold tracking-widest text-gray-800 uppercase" style={certificateStyles.nameText}>
                    {studentName.toUpperCase()}
                  </p>
                </div>
                {/* Date overlay */}
                {/* Use inline styles for certificate positioning */}
                <div className="absolute pointer-events-none" style={certificateStyles.dateOverlay}>
                  {/* Use inline styles for certificate positioning */}
                  <p className="text-xs text-gray-700" style={certificateStyles.dateText}>{dateStr}</p>
                </div>
                {/* Cert No overlay */}
                {/* Use inline styles for certificate positioning */}
                <div className="absolute pointer-events-none" style={certificateStyles.certNoOverlay}>
                  {/* Use inline styles for certificate positioning */}
                  <p className="text-xs text-gray-700" style={certificateStyles.certNoText}>CT-NO:- {certNo}</p>
                </div>
              </div>

              {/* Download Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
                <GlowButton variant="primary" onClick={downloadAsPNG} disabled={isGenerating}>
                  <span className="flex items-center gap-2"><FileImage className="w-5 h-5" />{isGenerating ? 'Generating...' : 'Download PNG'}</span>
                </GlowButton>
                <GlowButton variant="secondary" onClick={downloadAsPDF} disabled={isGenerating}>
                  <span className="flex items-center gap-2"><FileText className="w-5 h-5" />{isGenerating ? 'Saving...' : 'Download PDF'}</span>
                </GlowButton>
                <GlowButton variant="outline" onClick={() => setShowCertificate(false)} disabled={isGenerating}>
                  Edit Name
                </GlowButton>
              </div>
              {error && <div className="text-red-500 text-sm mt-4 text-center">{error}</div>}
            </motion.div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Certificate;
