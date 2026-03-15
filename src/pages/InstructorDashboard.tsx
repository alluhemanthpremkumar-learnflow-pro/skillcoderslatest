import { motion } from 'framer-motion';
import { BookOpen, Users, Star, DollarSign, Plus, BarChart3 } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ParticleBackground from '@/components/ParticleBackground';
import GlowText from '@/components/GlowText';
import GlowCard from '@/components/GlowCard';
import GlowButton from '@/components/GlowButton';

const stats = [
  { label: 'Total Courses', value: '3', icon: BookOpen, color: 'blue' as const },
  { label: 'Total Students', value: '1,240', icon: Users, color: 'purple' as const },
  { label: 'Avg Rating', value: '4.8', icon: Star, color: 'cyan' as const },
  { label: 'Earnings', value: '₹85,000', icon: DollarSign, color: 'blue' as const },
];

const myCourses = [
  { title: 'Ethical Hacking Basics', students: 450, rating: 4.7, revenue: '₹25,000', status: 'Published' },
  { title: 'Web Security Advanced', students: 320, rating: 4.9, revenue: '₹35,000', status: 'Published' },
  { title: 'Network Pentesting', students: 0, rating: 0, revenue: '₹0', status: 'Draft' },
];

const InstructorDashboard = () => {
  const { userProfile, loading } = useAuth();
  const navigate = useNavigate();

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    );
  }

  if (!userProfile || (userProfile.role !== 'instructor' && userProfile.role !== 'admin')) {
    navigate('/login');
    return null;
  }

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      <ParticleBackground />
      <Navbar />

      <main className="pt-24 pb-12 px-4">
        <div className="container mx-auto max-w-6xl">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8 flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold mb-1">
                Instructor <GlowText as="span" color="gradient" animate={false}>Dashboard</GlowText>
              </h1>
              <p className="text-muted-foreground">Welcome back, {userProfile.displayName}</p>
            </div>
            <GlowButton variant="primary">
              <span className="flex items-center gap-2"><Plus className="w-4 h-4" /> Create Course</span>
            </GlowButton>
          </motion.div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            {stats.map((stat, i) => (
              <motion.div key={stat.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}>
                <GlowCard glowColor={stat.color}>
                  <stat.icon className="w-6 h-6 text-primary mb-2" />
                  <p className="text-2xl font-bold">{stat.value}</p>
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                </GlowCard>
              </motion.div>
            ))}
          </div>

          {/* My Courses */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
            <h2 className="text-xl font-bold mb-4">My Courses</h2>
            <div className="space-y-4">
              {myCourses.map((course, i) => (
                <div key={i} className="bg-card rounded-xl border border-border p-5 flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold mb-1">{course.title}</h3>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1"><Users className="w-3 h-3" /> {course.students}</span>
                      {course.rating > 0 && (
                        <span className="flex items-center gap-1"><Star className="w-3 h-3 fill-yellow-500 text-yellow-500" /> {course.rating}</span>
                      )}
                      <span className="flex items-center gap-1"><DollarSign className="w-3 h-3" /> {course.revenue}</span>
                    </div>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                    course.status === 'Published' ? 'bg-green-500/20 text-green-400' : 'bg-yellow-500/20 text-yellow-400'
                  }`}>
                    {course.status}
                  </span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default InstructorDashboard;
