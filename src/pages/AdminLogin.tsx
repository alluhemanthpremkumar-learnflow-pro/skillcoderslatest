import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Shield, Lock, User, AlertTriangle } from 'lucide-react';
import ParticleBackground from '@/components/ParticleBackground';
import GlowButton from '@/components/GlowButton';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/contexts/AuthContext';

const AdminLogin = () => {
  const navigate = useNavigate();
  const { signInWithGoogle, signInWithEmail, mockLoginAsAdmin, userProfile, isAdmin, loading: authLoading } = useAuth();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleGoogleLogin = async () => {
    setLoading(true);
    setError('');
    try {
      await signInWithGoogle();
      // AuthContext will update userProfile and isAdmin
    } catch (err: any) {
      setError(err.message || 'Failed to sign in. Please try again.');
      setLoading(false);
    }
  };

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    // Hardcoded demo credentials
    if (email === 'alluhemanth5063@gmail.com' && password === '1234') {
      mockLoginAsAdmin();
      return;
    }

    try {
      await signInWithEmail(email, password);
    } catch (err: any) {
      setError(err.message || 'Failed to sign in. Please check your credentials.');
      setLoading(false);
    }
  };

  // Redirect if logged in as admin
  if (isAdmin) {
    navigate('/admin/dashboard');
  }

  return (
    <div className="min-h-screen bg-background relative overflow-hidden flex items-center justify-center">
      <ParticleBackground />
      <div className="container mx-auto px-4 py-8 relative z-10">
        <div className="max-w-md mx-auto">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-8"
          >
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-destructive/10 border border-destructive/30 mb-4">
              <Shield className="w-8 h-8 text-destructive" />
            </div>
            <h1 className="text-3xl font-bold mb-2">Admin Access</h1>
            <p className="text-muted-foreground">Restricted area — authorized personnel only</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ delay: 0.1 }}
            className="bg-card/80 backdrop-blur-xl rounded-2xl border border-destructive/30 p-8"
          >
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center gap-2 p-3 mb-6 rounded-lg bg-destructive/10 border border-destructive/30 text-destructive text-sm"
              >
                <AlertTriangle className="w-4 h-4 shrink-0" />
                {error}
              </motion.div>
            )}

            {!isAdmin && userProfile && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="mb-6 p-4 rounded-lg bg-destructive/5 border border-destructive/20 text-center"
              >
                <p className="text-destructive font-medium mb-1">Access Denied</p>
                <p className="text-xs text-muted-foreground">
                  Logged in as {userProfile.email} but you do not have admin privileges.
                </p>
              </motion.div>
            )}

            <form onSubmit={handleEmailLogin} className="space-y-4 mb-6">
              <div>
                <Label htmlFor="email">Email Address</Label>
                <div className="relative mt-2">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <Input 
                    id="email" 
                    type="email" 
                    value={email} 
                    onChange={(e) => setEmail(e.target.value)} 
                    placeholder="admin@example.com" 
                    className="pl-10 bg-background/50 border-border" 
                    required 
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="password">Password</Label>
                <div className="relative mt-2">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <Input 
                    id="password" 
                    type="password" 
                    value={password} 
                    onChange={(e) => setPassword(e.target.value)} 
                    placeholder="••••••••" 
                    className="pl-10 bg-background/50 border-border" 
                    required 
                  />
                </div>
              </div>
              <GlowButton 
                variant="primary" 
                size="lg" 
                className="w-full" 
                type="submit"
                disabled={loading || authLoading}
              >
                {loading || authLoading ? 'Authenticating...' : 'Sign in to Admin Panel'}
              </GlowButton>
            </form>

            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-border" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-card text-muted-foreground">Or continue with</span>
              </div>
            </div>

            <GlowButton 
              variant="outline" 
              size="lg" 
              className="w-full" 
              onClick={handleGoogleLogin} 
              disabled={loading || authLoading}
            >
              Sign in with Google
            </GlowButton>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
