import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, Lock, Eye, EyeOff, User, ArrowRight, ArrowLeft, Briefcase, Phone } from 'lucide-react';
import ParticleBackground from '@/components/ParticleBackground';
import GlowButton from '@/components/GlowButton';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Checkbox } from '@/components/ui/checkbox';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { useRegisterUser } from '@/hooks/registrationHooks';
import { TermsAndConditions } from '@/components/TermsAndConditions';
import scLogo from '@/assets/sc_logo.png';

const Register = () => {
  const navigate = useNavigate();
  const { signInWithGoogle, sendPhoneOTP } = useAuth();
  const { toast } = useToast();
  const { registerUser } = useRegisterUser();
  const [showPassword, setShowPassword] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [showPhoneSignup, setShowPhoneSignup] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState('');
  const [confirmResult, setConfirmResult] = useState<any>(null);
  const [showInstructorForm, setShowInstructorForm] = useState(false);
  const [termsOpen, setTermsOpen] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [instructorData, setInstructorData] = useState({ name: '', email: '', password: '', bio: '', agreeToTerms: false });

  const handleGoogleSignup = async () => {
    if (!termsAccepted) {
      setTermsOpen(true);
      toast({ title: 'Please accept Terms & Conditions', variant: 'destructive' });
      return;
    }
    
    try {
      await signInWithGoogle();
      // Log registration - user will be set by Firebase onAuthStateChanged
      toast({ title: 'Account created!' });
      navigate('/');
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'An unexpected error occurred';
      toast({ title: 'Signup failed', description: errorMessage, variant: 'destructive' });
    }
  };

  const handleSendOTP = async () => {
    if (!termsAccepted) {
      setTermsOpen(true);
      toast({ title: 'Please accept Terms & Conditions', variant: 'destructive' });
      return;
    }
    
    try {
      const result = await sendPhoneOTP(phoneNumber, 'recaptcha-container-register');
      setConfirmResult(result);
      setOtpSent(true);
      toast({ title: 'OTP sent!' });
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to send OTP';
      toast({ title: 'Failed to send OTP', description: errorMessage, variant: 'destructive' });
    }
  };

  const handleVerifyOTP = async () => {
    try {
      const userCred = await confirmResult.confirm(otp);
      // Log registration
      if (userCred?.user) {
        await registerUser(
          userCred.user.uid,
          userCred.user.phoneNumber || '',
          userCred.user.displayName || 'User',
          phoneNumber,
          'student'
        );
      }
      toast({ title: 'Account created!' });
      navigate('/');
    } catch (err: unknown) {
      toast({ title: 'Invalid OTP', variant: 'destructive' });
    }
  };

  const handleInstructorSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!instructorData.agreeToTerms) {
      toast({ title: 'Please accept Terms & Conditions', variant: 'destructive' });
      return;
    }
    
    try {
      // Get current auth user to log as instructor registration
      const { user } = useAuth();
      if (user) {
        await registerUser(
          user.uid,
          instructorData.email,
          instructorData.name,
          '',
          'instructor'
        );
      }
      toast({
        title: 'Instructor application submitted',
        description: 'Your application is under review. Check your email for updates.',
      });
      setInstructorData({ name: '', email: '', password: '', bio: '', agreeToTerms: false });
      setShowInstructorForm(false);
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to submit application';
      toast({
        title: 'Error submitting application',
        description: errorMessage,
        variant: 'destructive',
      });
    }
  };

  return (
    <div className="min-h-screen bg-background relative overflow-hidden flex items-center justify-center py-12">
      <ParticleBackground />
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-md mx-auto">
          <motion.button initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} whileHover={{ scale: 1.05, x: -4 }} whileTap={{ scale: 0.95 }} onClick={() => navigate(-1)} className="flex items-center gap-2 text-muted-foreground hover:text-foreground mb-6 group transition-colors">
            <ArrowLeft className="w-5 h-5 group-hover:text-primary transition-colors" />
            <span className="text-sm font-medium">Go Back</span>
          </motion.button>

          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-8">
            <Link to="/" className="inline-flex items-center gap-3">
              <img src={scLogo} alt="SkillCoders Logo" className="w-12 h-12 object-contain" />
              <span className="text-2xl font-bold glow-text">SkillCoders</span>
            </Link>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }} transition={{ delay: 0.1 }} className="bg-card/80 backdrop-blur-xl rounded-2xl border border-border p-8 glow-border">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold mb-2">Join SkillCoders</h1>
              <p className="text-muted-foreground">Create your account to start learning</p>
            </div>

            {/* Social Signup for Students */}
            <div className="space-y-3 mb-4">
              <motion.button initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }} whileHover={{ scale: 1.02, x: 5 }} whileTap={{ scale: 0.98 }} onClick={handleGoogleSignup} className="w-full flex items-center justify-center gap-3 px-4 py-3 rounded-lg border border-border bg-background/50 transition-all duration-300 hover:bg-destructive/10 hover:border-destructive/50">
                <svg className="w-5 h-5" viewBox="0 0 24 24"><path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/><path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
                <span className="font-medium">Continue with Google</span>
              </motion.button>

              <motion.button initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }} whileHover={{ scale: 1.02, x: 5 }} whileTap={{ scale: 0.98 }} onClick={() => setShowPhoneSignup(!showPhoneSignup)} className="w-full flex items-center justify-center gap-3 px-4 py-3 rounded-lg border border-border bg-background/50 transition-all duration-300 hover:bg-primary/10 hover:border-primary/50">
                <Phone className="w-5 h-5" />
                <span className="font-medium">Continue with Phone</span>
              </motion.button>
            </div>

            {/* Terms & Conditions Checkbox */}
            <div className="flex items-start gap-2 mb-4 p-3 bg-blue-500/5 border border-blue-500/20 rounded-lg">
              <Checkbox
                id="accept-terms"
                checked={termsAccepted}
                onCheckedChange={(checked) => setTermsAccepted(checked as boolean)}
              />
              <label htmlFor="accept-terms" className="text-sm text-muted-foreground cursor-pointer">
                I agree to the{' '}
                <button
                  type="button"
                  onClick={() => setTermsOpen(true)}
                  className="text-primary hover:underline font-medium"
                >
                  Terms and Conditions
                </button>
              </label>
            </div>

            {showPhoneSignup && (
              <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="space-y-3 mb-4">
                {!otpSent ? (
                  <>
                    <Input value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} placeholder="+91 XXXXX XXXXX" className="bg-background/50" />
                    <div id="recaptcha-container-register" />
                    <GlowButton variant="primary" className="w-full" onClick={handleSendOTP}>Send OTP</GlowButton>
                  </>
                ) : (
                  <>
                    <Input value={otp} onChange={(e) => setOtp(e.target.value)} placeholder="Enter OTP" className="bg-background/50" />
                    <GlowButton variant="primary" className="w-full" onClick={handleVerifyOTP}>Verify OTP</GlowButton>
                  </>
                )}
              </motion.div>
            )}

            <div className="relative my-6">
              <Separator className="bg-border" />
              <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-card px-4 text-sm text-muted-foreground">or register as instructor</span>
            </div>

            {/* Instructor Registration */}
            <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={() => setShowInstructorForm(!showInstructorForm)} className="w-full flex items-center justify-center gap-3 px-4 py-3 rounded-lg border-2 border-secondary/50 bg-secondary/5 transition-all duration-300 hover:bg-secondary/10 mb-4">
              <Briefcase className="w-5 h-5 text-secondary" />
              <span className="font-medium text-secondary">Apply as Instructor</span>
            </motion.button>

            {showInstructorForm && (
              <motion.form initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} onSubmit={handleInstructorSubmit} className="space-y-4 mb-4">
                <div>
                  <Label htmlFor="inst-name">Full Name</Label>
                  <div className="relative mt-2">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <Input id="inst-name" value={instructorData.name} onChange={(e) => setInstructorData({ ...instructorData, name: e.target.value })} placeholder="John Doe" className="pl-10 bg-background/50" required />
                  </div>
                </div>
                <div>
                  <Label htmlFor="inst-email">Email</Label>
                  <div className="relative mt-2">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <Input id="inst-email" type="email" value={instructorData.email} onChange={(e) => setInstructorData({ ...instructorData, email: e.target.value })} placeholder="you@example.com" className="pl-10 bg-background/50" required />
                  </div>
                </div>
                <div>
                  <Label htmlFor="inst-password">Password</Label>
                  <div className="relative mt-2">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <Input id="inst-password" type={showPassword ? 'text' : 'password'} value={instructorData.password} onChange={(e) => setInstructorData({ ...instructorData, password: e.target.value })} placeholder="••••••••" className="pl-10 pr-10 bg-background/50" required />
                    <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>
                <div>
                  <Label htmlFor="inst-bio">Bio / Experience</Label>
                  <textarea id="inst-bio" value={instructorData.bio} onChange={(e) => setInstructorData({ ...instructorData, bio: e.target.value })} placeholder="Describe your teaching experience..." className="mt-2 w-full rounded-md border border-input bg-background/50 px-3 py-2 text-sm placeholder:text-muted-foreground min-h-[80px]" required />
                </div>
                <div className="flex items-start gap-2">
                  <Checkbox
                    id="inst-terms"
                    checked={instructorData.agreeToTerms}
                    onCheckedChange={(checked) => setInstructorData({ ...instructorData, agreeToTerms: checked as boolean })}
                  />
                  <label htmlFor="inst-terms" className="text-sm text-muted-foreground cursor-pointer">
                    I agree to the{' '}
                    <button
                      type="button"
                      onClick={() => setTermsOpen(true)}
                      className="text-primary hover:underline"
                    >
                      Terms of Service
                    </button>
                    {' '}and{' '}
                    <Link to="/privacy" className="text-primary hover:underline">
                      Privacy Policy
                    </Link>
                  </label>
                </div>
                <GlowButton variant="secondary" size="lg" className="w-full" type="submit">
                  <span className="flex items-center justify-center gap-2">Submit Application<ArrowRight className="w-5 h-5" /></span>
                </GlowButton>
              </motion.form>
            )}

            <p className="text-center mt-6 text-muted-foreground">
              Already have an account?{' '}
              <Link to="/login" className="text-primary hover:underline font-medium">Sign in</Link>
            </p>
          </motion.div>
        </div>

        {/* Terms and Conditions Modal */}
        <TermsAndConditions
          open={termsOpen}
          onOpenChange={setTermsOpen}
          onAccept={() => setTermsAccepted(true)}
          onReject={() => setTermsAccepted(false)}
        />
      </div>
    </div>
  );
};

export default Register;
