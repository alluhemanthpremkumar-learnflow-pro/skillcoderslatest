import { motion } from 'framer-motion';
import { User, Mail, Phone, Shield, BookOpen, Award, LogOut } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import ParticleBackground from '@/components/ParticleBackground';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import GlowText from '@/components/GlowText';
import GlowButton from '@/components/GlowButton';
import GlowCard from '@/components/GlowCard';

const Profile = () => {
  const { userProfile, user, logout, loading } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    );
  }

  if (!user) {
    navigate('/login');
    return null;
  }

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      <ParticleBackground />
      <Navbar />

      <main className="pt-24 pb-12 px-4">
        <div className="container mx-auto max-w-4xl">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
            <h1 className="text-4xl font-bold mb-4">
              My <GlowText as="span" color="gradient" animate={false} children={undefined}>Profile</GlowText>
            </h1>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6">
            {/* Profile Card */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="md:col-span-1">
              <GlowCard glowColor="purple" children={undefined}>
                <div className="text-center">
                  <div className="w-24 h-24 mx-auto rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center mb-4 overflow-hidden">
                    {userProfile?.photoURL ? (
                      <img src={userProfile.photoURL} alt="" className="w-full h-full object-cover" />
                    ) : (
                      <User className="w-12 h-12 text-primary-foreground" />
                    )}
                  </div>
                  <h2 className="text-xl font-bold mb-1">{userProfile?.displayName || user?.displayName || 'Skillcoders User'}</h2>
                  <span className="inline-block px-3 py-1 rounded-full text-xs font-medium bg-primary/20 text-primary capitalize">
                    {userProfile?.role || 'student'}
                  </span>
                </div>
              </GlowCard>
            </motion.div>

            {/* Info */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="md:col-span-2 space-y-4"
            >
              <GlowCard glowColor="blue" children={undefined}>
                <h3 className="text-lg font-semibold mb-4">Account Details</h3>
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <Mail className="w-5 h-5 text-primary" />
                    <div>
                      <p className="text-sm text-muted-foreground">Email</p>
                      <p className="font-medium">{userProfile?.email || user?.email || 'N/A'}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Phone className="w-5 h-5 text-primary" />
                    <div>
                      <p className="text-sm text-muted-foreground">Phone</p>
                      <p className="font-medium">{userProfile?.phone || user?.phoneNumber || 'Not set'}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Shield className="w-5 h-5 text-primary" />
                    <div>
                      <p className="text-sm text-muted-foreground">Role</p>
                      <p className="font-medium capitalize">{userProfile?.role || 'student'}</p>
                    </div>
                  </div>
                </div>
              </GlowCard>

              <div className="grid grid-cols-2 gap-4">
                <GlowCard glowColor="cyan" children={undefined}>
                  <BookOpen className="w-8 h-8 text-primary mb-2" />
                  <p className="text-2xl font-bold">0</p>
                  <p className="text-sm text-muted-foreground">Enrolled Courses</p>
                </GlowCard>
                <GlowCard glowColor="purple" children={undefined}>
                  <Award className="w-8 h-8 text-secondary mb-2" />
                  <p className="text-2xl font-bold">0</p>
                  <p className="text-sm text-muted-foreground">Certificates</p>
                </GlowCard>
              </div>

              <GlowButton variant="outline" size="lg" className="w-full" onClick={handleLogout} children={undefined}>
                <span className="flex items-center gap-2"><LogOut className="w-5 h-5" /> Sign Out</span>
              </GlowButton>
            </motion.div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Profile;
