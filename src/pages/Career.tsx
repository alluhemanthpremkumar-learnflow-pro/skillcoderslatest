import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Users, Briefcase, Clock, DollarSign, Star, ArrowRight, CheckCircle, GraduationCap, Award, TrendingUp } from 'lucide-react';
import ParticleBackground from '@/components/ParticleBackground';
import Navbar from '@/components/Navbar';
import GlowCard from '@/components/GlowCard';
import GlowText from '@/components/GlowText';
import GlowButton from '@/components/GlowButton';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

const instructors = [
  {
    id: 1,
    name: 'Alex Security',
    title: 'Senior Penetration Tester',
    avatar: 'https://i.pravatar.cc/150?img=1',
    rating: 5.0,
    reviews: 2456,
    students: 12450,
    courses: 24,
    specialization: 'Ethical Hacking',
    available: true,
  },
  {
    id: 2,
    name: 'Sarah White',
    title: 'Web Security Expert',
    avatar: 'https://i.pravatar.cc/150?img=5',
    rating: 4.9,
    reviews: 1892,
    students: 8920,
    courses: 18,
    specialization: 'Web Application Security',
    available: true,
  },
  {
    id: 3,
    name: 'Mike Chen',
    title: 'Network Security Analyst',
    avatar: 'https://i.pravatar.cc/150?img=3',
    rating: 4.8,
    reviews: 1567,
    students: 15670,
    courses: 15,
    specialization: 'Network Security',
    available: false,
  },
  {
    id: 4,
    name: 'Lisa Hunt',
    title: 'Bug Bounty Hunter',
    avatar: 'https://i.pravatar.cc/150?img=9',
    rating: 4.9,
    reviews: 2134,
    students: 9870,
    courses: 12,
    specialization: 'Bug Bounty',
    available: true,
  },
];

const benefits = [
  { icon: DollarSign, title: 'Competitive Earnings', description: 'Earn up to ₹1,50,000+ per month' },
  { icon: Clock, title: 'Flexible Hours', description: 'Work part-time or full-time, your choice' },
  { icon: Users, title: 'Unlimited Students', description: 'No limit on how many students you can teach' },
  { icon: TrendingUp, title: 'Growth Platform', description: 'Build your personal brand and reputation' },
];

const Career = () => {
  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      <ParticleBackground />
      <Navbar />

      <main className="pt-24 pb-12 px-4">
        <div className="container mx-auto">
          {/* Hero */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-16"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-secondary/10 border border-secondary/30 mb-4">
              <Briefcase className="w-4 h-4 text-secondary" />
              <span className="text-sm text-secondary font-medium">Career Opportunities</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Join as an{' '}
              <GlowText as="span" color="purple" animate={false}>
                Instructor
              </GlowText>
            </h1>
            <p className="text-muted-foreground max-w-2xl mx-auto mb-8">
              Share your cybersecurity expertise with thousands of students. 
              Part-time or full-time opportunities available.
            </p>
            <Link to="/register?role=instructor">
              <GlowButton variant="secondary" size="lg">
                <span className="flex items-center gap-2">
                  Apply as Instructor
                  <ArrowRight className="w-5 h-5" />
                </span>
              </GlowButton>
            </Link>
          </motion.div>

          {/* Benefits */}
          <motion.section
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mb-16"
          >
            <h2 className="text-2xl font-bold text-center mb-8">Why Become an Instructor?</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {benefits.map((benefit, index) => (
                <motion.div
                  key={benefit.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 + index * 0.1 }}
                >
                  <GlowCard glowColor="purple">
                    <benefit.icon className="w-10 h-10 text-secondary mb-4" />
                    <h3 className="font-semibold mb-2">{benefit.title}</h3>
                    <p className="text-sm text-muted-foreground">{benefit.description}</p>
                  </GlowCard>
                </motion.div>
              ))}
            </div>
          </motion.section>

          {/* Work Types */}
          <motion.section
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mb-16"
          >
            <h2 className="text-2xl font-bold text-center mb-8">Choose Your Path</h2>
            <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
              <GlowCard glowColor="blue" className="text-center">
                <Clock className="w-12 h-12 text-primary mx-auto mb-4" />
                <h3 className="text-xl font-bold mb-2">Part-Time Instructor</h3>
                <p className="text-muted-foreground mb-4">
                  Work on your schedule. Perfect for professionals who want to teach alongside their day job.
                </p>
                <ul className="text-left space-y-2 mb-6">
                  {['10-20 hours per week', 'Create courses at your pace', 'Flexible class timings', 'Minimum ₹30,000/month'].map((item) => (
                    <li key={item} className="flex items-center gap-2 text-sm">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      {item}
                    </li>
                  ))}
                </ul>
                <Link to="/register?role=instructor&type=part-time">
                  <GlowButton variant="outline" className="w-full">
                    Apply Part-Time
                  </GlowButton>
                </Link>
              </GlowCard>

              <GlowCard glowColor="purple" className="text-center">
                <Briefcase className="w-12 h-12 text-secondary mx-auto mb-4" />
                <h3 className="text-xl font-bold mb-2">Full-Time Instructor</h3>
                <p className="text-muted-foreground mb-4">
                  Dedicate yourself to teaching. Maximum earning potential with full platform benefits.
                </p>
                <ul className="text-left space-y-2 mb-6">
                  {['40+ hours per week', 'Priority course placement', 'Premium support', 'Up to ₹1,50,000+/month'].map((item) => (
                    <li key={item} className="flex items-center gap-2 text-sm">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      {item}
                    </li>
                  ))}
                </ul>
                <Link to="/register?role=instructor&type=full-time">
                  <GlowButton variant="secondary" className="w-full">
                    Apply Full-Time
                  </GlowButton>
                </Link>
              </GlowCard>
            </div>
          </motion.section>

          {/* Top Instructors */}
          <motion.section
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <h2 className="text-2xl font-bold text-center mb-2">Top Instructors</h2>
            <p className="text-muted-foreground text-center mb-8">
              Book a session with our expert instructors
            </p>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {instructors.map((instructor, index) => (
                <motion.div
                  key={instructor.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 + index * 0.1 }}
                >
                  <GlowCard glowColor="blue">
                    <div className="text-center mb-4">
                      <Avatar className="w-20 h-20 mx-auto mb-3 border-2 border-primary">
                        <AvatarImage src={instructor.avatar} alt={instructor.name} />
                        <AvatarFallback>{instructor.name[0]}</AvatarFallback>
                      </Avatar>
                      <h3 className="font-semibold">{instructor.name}</h3>
                      <p className="text-sm text-muted-foreground">{instructor.title}</p>
                      <Badge variant="outline" className="mt-2 border-primary/50 text-primary">
                        {instructor.specialization}
                      </Badge>
                    </div>

                    <div className="flex items-center justify-center gap-1 mb-4">
                      {[...Array(5)].map((_, i) => (
                        <Star 
                          key={i} 
                          className={`w-4 h-4 ${i < Math.floor(instructor.rating) ? 'fill-yellow-500 text-yellow-500' : 'text-muted'}`} 
                        />
                      ))}
                      <span className="text-sm ml-1">
                        {instructor.rating} ({instructor.reviews.toLocaleString()})
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-center text-sm mb-4">
                      <div className="bg-background/50 rounded-lg p-2">
                        <p className="font-semibold">{instructor.students.toLocaleString()}</p>
                        <p className="text-xs text-muted-foreground">Students</p>
                      </div>
                      <div className="bg-background/50 rounded-lg p-2">
                        <p className="font-semibold">{instructor.courses}</p>
                        <p className="text-xs text-muted-foreground">Courses</p>
                      </div>
                    </div>

                    <GlowButton 
                      variant={instructor.available ? 'primary' : 'outline'} 
                      size="sm"
                      className="w-full"
                      disabled={!instructor.available}
                    >
                      {instructor.available ? 'Book Session' : 'Not Available'}
                    </GlowButton>
                  </GlowCard>
                </motion.div>
              ))}
            </div>
          </motion.section>
        </div>
      </main>
    </div>
  );
};

export default Career;
