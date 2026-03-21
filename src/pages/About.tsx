import { motion } from 'framer-motion';
import { Users, Award, BookOpen, Briefcase, GraduationCap, Gift, Laptop, Star, Heart, CheckCircle } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ParticleBackground from '@/components/ParticleBackground';
import GlowText from '@/components/GlowText';
import GlowCard from '@/components/GlowCard';

const benefits = [
  'High-quality practical learning programs',
  'Regular quizzes and knowledge challenges',
  'Interview preparation and career guidance',
  'Placement opportunities',
  'Affordable course fees',
  'Free laptops for eligible students',
  'Exciting gifts and rewards for top-performing students',
  'Opportunities to earn income through Skill Coders programs',
];

const whyJoin = [
  'Learn high-quality practical courses',
  'Participate in knowledge quizzes',
  'Prepare for job interviews',
  'Gain industry-relevant skills',
  'Access affordable education',
  'Improve their career opportunities',
];

const About = () => {
  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      <ParticleBackground />
      <Navbar />

      <main className="pt-24 pb-12 px-4">
        <div className="container mx-auto max-w-5xl">
          {/* Hero */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-16">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              <GlowText as="span" color="gradient" animate={false}>Skill Coders</GlowText>
            </h1>
            <p className="text-xl text-primary font-semibold mb-4">Where Code Meets Future and Technology</p>
            <p className="text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              Skill Coders is an innovative skill development and learning platform created to help students, employees, and learners build real-world skills through practical education. Our mission is to provide high-quality, affordable, and future-focused learning that empowers individuals to succeed in their careers and life.
            </p>
          </motion.div>

          {/* Mission */}
          <motion.section initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mb-16">
            <GlowCard glowColor="blue" className="text-center">
              <BookOpen className="w-12 h-12 text-primary mx-auto mb-4" />
              <h2 className="text-2xl font-bold mb-4">Our Mission</h2>
              <p className="text-muted-foreground leading-relaxed max-w-2xl mx-auto">
                At Skill Coders, we believe education should not only be theoretical but also practical, skill-based, and career-oriented. Our platform helps learners gain knowledge, develop technical skills, and prepare for the competitive job market with confidence. Through practical courses, quizzes, and career guidance, Skill Coders helps students transform their knowledge into real-world opportunities.
              </p>
            </GlowCard>
          </motion.section>

          {/* Leadership */}
          <motion.section initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mb-16">
            <h2 className="text-3xl font-bold text-center mb-8">
              <GlowText as="span" color="purple" animate={false}>Leadership</GlowText>
            </h2>
            <div className="grid md:grid-cols-2 gap-6">
              <GlowCard glowColor="blue">
                <div className="text-center">
                  <div className="w-20 h-20 rounded-full bg-primary/20 flex items-center justify-center mx-auto mb-4">
                    <Briefcase className="w-10 h-10 text-primary" />
                  </div>
                  <h3 className="text-xl font-bold mb-1">Mr. Allu Hemanth Prem Kumar</h3>
                  <p className="text-primary font-semibold mb-3">CEO</p>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    Mr. Allu Hemanth Prem Kumar is the visionary leader behind Skill Coders. His mission is to transform education by providing practical learning opportunities, skill development programs, and career-focused education for students and professionals.
                  </p>
                </div>
              </GlowCard>
              <GlowCard glowColor="purple">
                <div className="text-center">
                  <div className="w-20 h-20 rounded-full bg-secondary/20 flex items-center justify-center mx-auto mb-4">
                    <Users className="w-10 h-10 text-secondary" />
                  </div>
                  <h3 className="text-xl font-bold mb-1">Mr. Jakkam Narayana Reddy</h3>
                  <p className="text-secondary font-semibold mb-3">Co-Founder</p>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    Mr. Jakkam Narayana Reddy is a passionate educator and innovator dedicated to creating opportunities for students and professionals to grow through technology, knowledge, and skill development.
                  </p>
                </div>
              </GlowCard>
            </div>
          </motion.section>

          {/* Why Join */}
          <motion.section initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mb-16">
            <h2 className="text-3xl font-bold text-center mb-4">
              Why Should Every Student Join <GlowText as="span" color="blue" animate={false}>Skill Coders?</GlowText>
            </h2>
            <p className="text-muted-foreground text-center mb-8 max-w-2xl mx-auto">
              In today's highly competitive world, students need more than just academic knowledge. They need practical skills, industry knowledge, and career preparation.
            </p>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {whyJoin.map((item, i) => (
                <motion.div key={i} initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.05 }} className="flex items-center gap-3 bg-card rounded-xl border border-border p-4">
                  <CheckCircle className="w-5 h-5 text-primary shrink-0" />
                  <span className="text-sm">{item}</span>
                </motion.div>
              ))}
            </div>
          </motion.section>

          {/* Benefits */}
          <motion.section initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mb-16">
            <h2 className="text-3xl font-bold text-center mb-4">
              Benefits of Joining <GlowText as="span" color="gradient" animate={false}>Skill Coders</GlowText>
            </h2>
            <p className="text-muted-foreground text-center mb-8">Our platform provides:</p>
            <div className="grid md:grid-cols-2 gap-4">
              {benefits.map((item, i) => (
                <motion.div key={i} initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.05 }} className="flex items-start gap-3 bg-card rounded-xl border border-border p-4">
                  <Star className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                  <span className="text-sm">{item}</span>
                </motion.div>
              ))}
            </div>
          </motion.section>

          {/* Platform For Everyone */}
          <motion.section initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mb-16">
            <GlowCard glowColor="cyan">
              <h2 className="text-2xl font-bold text-center mb-4">A Platform for Everyone</h2>
              <p className="text-muted-foreground text-center mb-6">Skill Coders is designed for:</p>
              <div className="flex flex-wrap justify-center gap-3">
                {['Students', 'Graduates', 'Employees', 'Job seekers', 'Anyone who wants to learn new skills'].map((item) => (
                  <span key={item} className="px-4 py-2 rounded-full bg-primary/10 border border-primary/30 text-sm text-primary font-medium">{item}</span>
                ))}
              </div>
            </GlowCard>
          </motion.section>

          {/* Quizzes */}
          <motion.section initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mb-16">
            <GlowCard glowColor="purple">
              <div className="text-center">
                <GraduationCap className="w-12 h-12 text-secondary mx-auto mb-4" />
                <h2 className="text-2xl font-bold mb-4">Knowledge Through Quizzes</h2>
                <p className="text-muted-foreground mb-4">At Skill Coders, we believe learning should be interactive, engaging, and enjoyable.</p>
                <div className="grid sm:grid-cols-2 gap-3 max-w-md mx-auto text-left">
                  {['Improve their knowledge', 'Practice problem-solving skills', 'Build confidence', 'Learn in a fun and engaging way'].map((item) => (
                    <div key={item} className="flex items-center gap-2 text-sm">
                      <CheckCircle className="w-4 h-4 text-secondary shrink-0" />
                      {item}
                    </div>
                  ))}
                </div>
              </div>
            </GlowCard>
          </motion.section>

          {/* Message to Parents */}
          <motion.section initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mb-16">
            <GlowCard glowColor="blue">
              <div className="text-center">
                <Heart className="w-12 h-12 text-destructive mx-auto mb-4" />
                <h2 className="text-2xl font-bold mb-4">A Message to Parents</h2>
                <p className="text-muted-foreground leading-relaxed max-w-2xl mx-auto">
                  Every parent dreams of seeing their children succeed in life. At Skill Coders, we understand that dream and work hard to support students in achieving their goals. We encourage every parent to motivate their children to develop skills, gain knowledge, and build a successful future. Skill Coders is here to guide students toward success and a brighter future.
                </p>
              </div>
            </GlowCard>
          </motion.section>

          {/* Commitment */}
          <motion.section initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center">
            <h2 className="text-3xl font-bold mb-6">Our <GlowText as="span" color="gradient" animate={false}>Commitment</GlowText></h2>
            <div className="flex flex-wrap justify-center gap-3 mb-6">
              {['High-quality education', 'Practical skill training', 'Career-focused learning', 'Affordable learning opportunities', 'Future-ready education'].map((item) => (
                <span key={item} className="px-4 py-2 rounded-full bg-card border border-border text-sm font-medium">{item}</span>
              ))}
            </div>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              We will always try our best to guide students, support their learning journey, and help them achieve success in their studies and careers. Thank you for being part of the Skill Coders journey.
            </p>
          </motion.section>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default About;
