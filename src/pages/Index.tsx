import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Code, Terminal, Users, Trophy, Zap, BookOpen, Target, ArrowRight, Play, Star, Shield, Check } from 'lucide-react';
import ParticleBackground from '@/components/ParticleBackground';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import IPSecurityBanner from '@/components/IPSecurityBanner';
import GlowButton from '@/components/GlowButton';
import GlowCard from '@/components/GlowCard';
import GlowText from '@/components/GlowText';
import { sampleCourses } from '@/lib/sampleCourses';
import { domains } from '@/lib/domains';

const features = [
  { icon: Terminal, title: 'Hands-on Labs', description: 'Practice on real systems with Kali Linux, Ubuntu, Windows, and more.', color: 'blue' as const },
  { icon: BookOpen, title: 'Expert Courses', description: 'Learn from certified instructors with 5-star rated content.', color: 'purple' as const },
  { icon: Target, title: '100 Level Quizzes', description: 'Progress through challenging quizzes and earn credits.', color: 'cyan' as const },
  { icon: Trophy, title: 'Certifications', description: 'Earn industry-recognized certificates upon completion.', color: 'red' as const },
];

const stats = [
  { value: '10K+', label: 'Students' },
  { value: '500+', label: 'Courses' },
  { value: '50+', label: 'Instructors' },
  { value: '1M+', label: 'Quizzes Solved' },
];

const testimonials = [
  { name: 'Rahul S.', role: 'Bug Bounty Hunter', text: 'SkillCoders transformed my career. I went from zero to earning ₹50K/month through bug bounties!', rating: 5 },
  { name: 'Priya M.', role: 'Security Analyst', text: 'The hands-on labs are incredible. Real-world scenarios that prepared me for my SOC analyst role.', rating: 5 },
  { name: 'Amit K.', role: 'Penetration Tester', text: 'Best cybersecurity platform in India. The instructors are top-notch professionals.', rating: 5 },
];

const pricingPlans = [
  { name: 'Basic', price: 1999, features: ['Basic courses', '2 years access', 'Community forum', 'Certificate'] },
  { name: 'Intermediate', price: 5999, highlighted: true, features: ['All Basic features', 'Advanced courses', 'Mentor sessions', 'Priority support', 'Advanced labs'] },
  { name: 'Advanced', price: 19999, features: ['All Intermediate features', 'Lifetime access', 'Personal mentor', 'Job referrals', 'Certifications prep'] },
];

const Index = () => {
  const popularCourses = sampleCourses.slice(0, 3);

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      <ParticleBackground />
      <Navbar />
      <IPSecurityBanner />

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-4">
        <div className="container mx-auto text-center">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="max-w-4xl mx-auto">
            <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.2, type: 'spring' }} className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/30 mb-6">
              <Shield className="w-4 h-4 text-primary" />
              <span className="text-sm text-primary font-medium">EdTech Learning Platform</span>
            </motion.div>
            <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
              Master{' '}
              <GlowText as="span" color="gradient" animate={false}>Technology</GlowText>
              <br /><span className="text-foreground">Skills That Matter</span>
            </h1>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Join thousands of students learning cybersecurity, AI, cloud computing, and more through hands-on labs and expert-led courses.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/register"><GlowButton variant="primary" size="lg"><span className="flex items-center gap-2">Start Learning Free<ArrowRight className="w-5 h-5" /></span></GlowButton></Link>
              <Link to="/courses"><GlowButton variant="outline" size="lg"><span className="flex items-center gap-2"><Play className="w-5 h-5" />Explore Courses</span></GlowButton></Link>
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-20 max-w-4xl mx-auto">
            {stats.map((stat, index) => (
              <motion.div key={stat.label} initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.5 + index * 0.1 }} className="text-center">
                <div className="text-3xl md:text-4xl font-bold glow-text mb-1">{stat.value}</div>
                <div className="text-muted-foreground text-sm">{stat.label}</div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Popular Courses */}
      <section className="py-20 px-4 relative">
        <div className="container mx-auto">
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">Popular <GlowText as="span" color="blue" animate={false}>Courses</GlowText></h2>
            <p className="text-muted-foreground">Our most enrolled courses by students worldwide</p>
          </motion.div>
          <div className="grid md:grid-cols-3 gap-6">
            {popularCourses.map((course, i) => (
              <motion.div key={course.id} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}>
                <Link to={`/courses/${course.id}`}>
                  <GlowCard className="p-0 overflow-hidden" glowColor="blue">
                    <img src={course.thumbnail} alt={course.title} className="w-full h-48 object-cover" />
                    <div className="p-5">
                      <p className="text-xs text-primary mb-1">{course.domain}</p>
                      <h3 className="font-semibold mb-2">{course.title}</h3>
                      <div className="flex items-center gap-3 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1"><Star className="w-3 h-3 fill-yellow-500 text-yellow-500" />{course.rating}</span>
                        <span>{course.studentsEnrolled.toLocaleString()} students</span>
                      </div>
                      <div className="mt-3 text-lg font-bold text-primary">₹{course.price.toLocaleString()}</div>
                    </div>
                  </GlowCard>
                </Link>
              </motion.div>
            ))}
          </div>
          <div className="text-center mt-8">
            <Link to="/courses"><GlowButton variant="outline">View All Courses</GlowButton></Link>
          </div>
        </div>
      </section>

      {/* Domains */}
      <section className="py-20 px-4 relative">
        <div className="container mx-auto">
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">Explore <GlowText as="span" color="purple" animate={false}>Domains</GlowText></h2>
            <p className="text-muted-foreground">Browse courses by technology domain</p>
          </motion.div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {domains.slice(0, 8).map((domain, i) => (
              <motion.div key={domain.id} initial={{ opacity: 0, scale: 0.9 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ delay: i * 0.05 }}>
                <Link to={`/courses?domain=${encodeURIComponent(domain.name)}`}>
                  <GlowCard glowColor={i % 2 === 0 ? 'blue' : 'purple'} className="text-center">
                    <h3 className="font-semibold mb-1">{domain.name}</h3>
                    <p className="text-xs text-muted-foreground">{domain.courseCount} courses</p>
                  </GlowCard>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 px-4 relative">
        <div className="container mx-auto">
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Everything You Need to <GlowText as="span" color="blue" animate={false}>Succeed</GlowText></h2>
          </motion.div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <motion.div key={feature.title} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: index * 0.1 }}>
                <GlowCard glowColor={feature.color}>
                  <feature.icon className="w-10 h-10 mb-4 text-primary" />
                  <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                  <p className="text-muted-foreground text-sm">{feature.description}</p>
                </GlowCard>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Preview */}
      <section className="py-20 px-4 relative">
        <div className="container mx-auto">
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">Pricing <GlowText as="span" color="gradient" animate={false}>Plans</GlowText></h2>
            <p className="text-muted-foreground">Affordable plans for every learner</p>
          </motion.div>
          <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {pricingPlans.map((plan, i) => (
              <motion.div key={plan.name} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} className={`rounded-2xl border p-6 ${plan.highlighted ? 'border-primary bg-primary/5 glow-border' : 'border-border bg-card'}`}>
                {plan.highlighted && <div className="text-center text-xs font-bold text-primary mb-2">MOST POPULAR</div>}
                <h3 className="text-xl font-bold mb-1">{plan.name}</h3>
                <div className="text-3xl font-bold text-primary mb-4">₹{plan.price.toLocaleString()}</div>
                <ul className="space-y-2 mb-6">
                  {plan.features.map(f => (
                    <li key={f} className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Check className="w-4 h-4 text-primary shrink-0" />{f}
                    </li>
                  ))}
                </ul>
                <Link to="/pricing"><GlowButton variant={plan.highlighted ? 'primary' : 'outline'} className="w-full">Get Started</GlowButton></Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 px-4 relative">
        <div className="container mx-auto">
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">What Students <GlowText as="span" color="purple" animate={false}>Say</GlowText></h2>
          </motion.div>
          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {testimonials.map((t, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}>
                <GlowCard glowColor={i % 2 === 0 ? 'blue' : 'purple'}>
                  <div className="flex gap-1 mb-3">
                    {[...Array(t.rating)].map((_, j) => <Star key={j} className="w-4 h-4 fill-yellow-500 text-yellow-500" />)}
                  </div>
                  <p className="text-sm text-muted-foreground mb-4">"{t.text}"</p>
                  <div>
                    <p className="font-semibold">{t.name}</p>
                    <p className="text-xs text-primary">{t.role}</p>
                  </div>
                </GlowCard>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-4 relative">
        <div className="container mx-auto">
          <motion.div initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} className="relative rounded-3xl overflow-hidden p-12 text-center">
            <div className="absolute inset-0 bg-gradient-to-r from-secondary/20 via-primary/20 to-destructive/20" />
            <div className="absolute inset-0 bg-card/80 backdrop-blur-sm" />
            <div className="relative z-10">
              <h2 className="text-4xl font-bold mb-4">Ready to Start Your <GlowText as="span" color="gradient" animate={false}>Journey?</GlowText></h2>
              <p className="text-muted-foreground mb-8 max-w-xl mx-auto">Join our community and start your path to becoming a certified professional today.</p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link to="/register"><GlowButton variant="primary" size="lg">Create Free Account</GlowButton></Link>
                <Link to="/courses"><GlowButton variant="outline" size="lg">Browse Courses</GlowButton></Link>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Index;
