import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, Lock, Eye, EyeOff, ArrowRight, ArrowLeft, Phone } from 'lucide-react';
import ParticleBackground from '@/components/ParticleBackground';
import GlowButton from '@/components/GlowButton';
import GlowText from '@/components/GlowText';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import scLogo from '@/assets/sc_logo.png';

const Login = () => {
  const navigate = useNavigate();
  const { signInWithGoogle, signInWithGithub, sendPhoneOTP } = useAuth();
  const { toast } = useToast();
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [showPhoneLogin, setShowPhoneLogin] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState('');
  const [confirmResult, setConfirmResult] = useState<any>(null);

  const handleGoogleLogin = async () => {
    try {
      await signInWithGoogle();
      toast({ title: 'Logged in successfully!' });
      navigate('/');
    } catch (err: any) {
      toast({ title: 'Login failed', description: err.message, variant: 'destructive' });
    }
  };

  const handleGithubLogin = async () => {
    try {
      await signInWithGithub();
      toast({ title: 'Logged in successfully!' });
      navigate('/');
    } catch (err: any) {
      toast({ title: 'Login failed', description: err.message, variant: 'destructive' });
    }
  };

  const handleSendOTP = async () => {
    try {
      const result = await sendPhoneOTP(phoneNumber, 'recaptcha-container');
      setConfirmResult(result);
      setOtpSent(true);
      toast({ title: 'OTP sent!' });
    } catch (err: any) {
      toast({ title: 'Failed to send OTP', description: err.message, variant: 'destructive' });
    }
  };

  const handleVerifyOTP = async () => {
    try {
      await confirmResult.confirm(otp);
      toast({ title: 'Logged in successfully!' });
      navigate('/');
    } catch (err: any) {
      toast({ title: 'Invalid OTP', variant: 'destructive' });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({ title: 'Email login', description: 'Enable Firebase Email/Password auth to use this method.' });
  };

  const socialProviders = [
    { name: 'Google', onClick: handleGoogleLogin, icon: (
      <svg className="w-5 h-5" viewBox="0 0 24 24"><path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/><path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
    ), color: 'hover:bg-destructive/10 hover:border-destructive/50' },
    { name: 'GitHub', onClick: handleGithubLogin, icon: (
      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>
    ), color: 'hover:bg-muted hover:border-muted-foreground/50' },
  ];

  return (
    <div className="min-h-screen bg-background relative overflow-hidden flex items-center justify-center">
      <ParticleBackground />
      <div className="container mx-auto px-4 py-8 relative z-10">
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
              <h1 className="text-3xl font-bold mb-2">Welcome Back</h1>
              <p className="text-muted-foreground">Sign in to continue your learning journey</p>
            </div>

            {/* Social Login */}
            <div className="space-y-3 mb-6">
              {socialProviders.map((provider, index) => (
                <motion.button key={provider.name} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 + index * 0.1 }} whileHover={{ scale: 1.02, x: 5 }} whileTap={{ scale: 0.98 }} onClick={provider.onClick} className={`w-full flex items-center justify-center gap-3 px-4 py-3 rounded-lg border border-border bg-background/50 transition-all duration-300 ${provider.color}`}>
                  {provider.icon}
                  <span className="font-medium">Continue with {provider.name}</span>
                </motion.button>
              ))}

              {/* Phone OTP */}
              <motion.button initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.4 }} whileHover={{ scale: 1.02, x: 5 }} whileTap={{ scale: 0.98 }} onClick={() => setShowPhoneLogin(!showPhoneLogin)} className="w-full flex items-center justify-center gap-3 px-4 py-3 rounded-lg border border-border bg-background/50 transition-all duration-300 hover:bg-primary/10 hover:border-primary/50">
                <Phone className="w-5 h-5" />
                <span className="font-medium">Continue with Phone</span>
              </motion.button>
            </div>

            {showPhoneLogin && (
              <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="space-y-3 mb-6">
                {!otpSent ? (
                  <>
                    <Input value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} placeholder="+91 XXXXX XXXXX" className="bg-background/50" />
                    <div id="recaptcha-container" />
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
              <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-card px-4 text-sm text-muted-foreground">or continue with email</span>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="email">Email Address</Label>
                <div className="relative mt-2">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" className="pl-10 bg-background/50 border-border" />
                </div>
              </div>
              <div>
                <Label htmlFor="password">Password</Label>
                <div className="relative mt-2">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <Input id="password" type={showPassword ? 'text' : 'password'} value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" className="pl-10 pr-10 bg-background/50 border-border" />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>
              <div className="flex items-center justify-between text-sm">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" className="rounded border-border" />
                  <span className="text-muted-foreground">Remember me</span>
                </label>
                <Link to="/forgot-password" className="text-primary hover:underline">Forgot password?</Link>
              </div>
              <GlowButton variant="primary" size="lg" className="w-full" type="submit">
                <span className="flex items-center justify-center gap-2">Sign In<ArrowRight className="w-5 h-5" /></span>
              </GlowButton>
            </form>

            <p className="text-center mt-6 text-muted-foreground">
              Don't have an account?{' '}
              <Link to="/register" className="text-primary hover:underline font-medium">Sign up free</Link>
            </p>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Login;
