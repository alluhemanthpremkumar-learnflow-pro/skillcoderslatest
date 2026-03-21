import { useState } from 'react';
import { motion } from 'framer-motion';
import { GraduationCap, ArrowLeft, ArrowRight, School } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '@/firebase/config';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ParticleBackground from '@/components/ParticleBackground';
import GlowText from '@/components/GlowText';
import GlowButton from '@/components/GlowButton';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';

const classes = ['5th', '6th', '7th', '8th', '9th', '10th'];
const schoolDomains = ['Cyber Security & Ethical Hacking', 'Artificial Intelligence', 'Robotics'];

const SchoolRegistration = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    studentName: '',
    parentName: '',
    phone: '',
    email: '',
    schoolName: '',
    selectedClass: '',
    selectedDomain: '',
  });
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.selectedClass || !formData.selectedDomain) {
      toast({ title: 'Please select class and domain', variant: 'destructive' });
      return;
    }
    setSubmitting(true);
    try {
      const id = `school_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      await setDoc(doc(db, 'school_registrations', id), {
        ...formData,
        id,
        status: 'registered',
        coursesCompleted: [],
        certificateGenerated: false,
        createdAt: serverTimestamp(),
      });
      toast({ title: 'Registration Successful!', description: 'Welcome to Skill Coders School Program.' });
      setFormData({ studentName: '', parentName: '', phone: '', email: '', schoolName: '', selectedClass: '', selectedDomain: '' });
    } catch (err: any) {
      toast({ title: 'Registration failed', description: err.message, variant: 'destructive' });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      <ParticleBackground />
      <Navbar />
      <main className="pt-24 pb-12 px-4">
        <div className="container mx-auto max-w-lg">
          <motion.button initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} onClick={() => navigate(-1)} className="flex items-center gap-2 text-muted-foreground hover:text-foreground mb-6 group transition-colors">
            <ArrowLeft className="w-5 h-5 group-hover:text-primary transition-colors" />
            <span className="text-sm font-medium">Go Back</span>
          </motion.button>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/30 mb-4">
              <School className="w-4 h-4 text-primary" />
              <span className="text-sm text-primary font-medium">School Program</span>
            </div>
            <h1 className="text-3xl font-bold mb-2">
              School Student <GlowText as="span" color="gradient" animate={false}>Registration</GlowText>
            </h1>
            <p className="text-muted-foreground">For students from Class 5th to 10th</p>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-card/80 backdrop-blur-xl rounded-2xl border border-border p-8 glow-border">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label>Student Full Name *</Label>
                <Input value={formData.studentName} onChange={(e) => setFormData({ ...formData, studentName: e.target.value })} placeholder="Enter student name" className="mt-1 bg-background/50" required />
              </div>
              <div>
                <Label>Parent/Guardian Name *</Label>
                <Input value={formData.parentName} onChange={(e) => setFormData({ ...formData, parentName: e.target.value })} placeholder="Enter parent name" className="mt-1 bg-background/50" required />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Phone *</Label>
                  <Input value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} placeholder="+91 XXXXX" className="mt-1 bg-background/50" required />
                </div>
                <div>
                  <Label>Email</Label>
                  <Input type="email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} placeholder="email@example.com" className="mt-1 bg-background/50" />
                </div>
              </div>
              <div>
                <Label>School Name *</Label>
                <Input value={formData.schoolName} onChange={(e) => setFormData({ ...formData, schoolName: e.target.value })} placeholder="Enter school name" className="mt-1 bg-background/50" required />
              </div>
              <div>
                <Label>Select Class *</Label>
                <div className="grid grid-cols-3 gap-2 mt-2">
                  {classes.map((cls) => (
                    <button type="button" key={cls} onClick={() => setFormData({ ...formData, selectedClass: cls })} className={`px-4 py-2 rounded-lg border text-sm font-medium transition-all ${formData.selectedClass === cls ? 'bg-primary text-primary-foreground border-primary' : 'border-border bg-background/50 text-muted-foreground hover:border-primary/50'}`}>
                      Class {cls}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <Label>Select Domain *</Label>
                <div className="grid gap-2 mt-2">
                  {schoolDomains.map((domain) => (
                    <button type="button" key={domain} onClick={() => setFormData({ ...formData, selectedDomain: domain })} className={`px-4 py-3 rounded-lg border text-sm font-medium text-left transition-all ${formData.selectedDomain === domain ? 'bg-secondary text-secondary-foreground border-secondary' : 'border-border bg-background/50 text-muted-foreground hover:border-secondary/50'}`}>
                      {domain}
                    </button>
                  ))}
                </div>
              </div>
              <GlowButton type="submit" variant="primary" size="lg" className="w-full" disabled={submitting}>
                <span className="flex items-center justify-center gap-2">
                  {submitting ? 'Registering...' : 'Register Now'}
                  <ArrowRight className="w-5 h-5" />
                </span>
              </GlowButton>
            </form>
          </motion.div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default SchoolRegistration;
