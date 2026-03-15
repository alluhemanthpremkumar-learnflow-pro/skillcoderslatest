import { motion } from 'framer-motion';
import { Check, Star, Laptop, Zap } from 'lucide-react';
import ParticleBackground from '@/components/ParticleBackground';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import GlowText from '@/components/GlowText';
import GlowButton from '@/components/GlowButton';

const plans = [
  {
    name: 'Basic Plan',
    price: 1999,
    duration: '2 Years Access',
    icon: Zap,
    features: [
      'Access to basic courses',
      'Community forum access',
      'Certificate of completion',
      'Email support',
      'Basic lab environment',
    ],
  },
  {
    name: 'Intermediate Plan',
    price: 5999,
    duration: '2 Years Access',
    icon: Star,
    highlighted: true,
    features: [
      'Everything in Basic',
      'Advanced courses access',
      'Live mentor sessions',
      'Priority support',
      'Advanced lab environment',
      'Downloadable resources',
      'Mock interviews',
    ],
  },
  {
    name: 'Advanced Plan',
    price: 19999,
    duration: 'Lifetime Access',
    icon: Star,
    features: [
      'Everything in Intermediate',
      'All courses unlocked',
      'Personal mentor',
      '1-on-1 doubt clearing',
      'Resume building',
      'Job referrals',
      'Industry certifications prep',
      'Priority placement support',
    ],
  },
  {
    name: 'Course + Laptop Plan',
    price: 35000,
    duration: 'Lifetime + Laptop',
    icon: Laptop,
    features: [
      'Everything in Advanced',
      'Brand new laptop included',
      'Pre-installed tools (Kali, VS Code)',
      'VIP support channel',
      'Guaranteed internship',
      'Exclusive masterclasses',
    ],
  },
];

const Pricing = () => (
  <div className="min-h-screen bg-background relative overflow-hidden">
    <ParticleBackground />
    <Navbar />

    <main className="pt-24 pb-12 px-4">
      <div className="container mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Choose Your{' '}
            <GlowText as="span" color="gradient" animate={false}>Plan</GlowText>
          </h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Invest in your future. Pick the plan that fits your learning goals.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
          {plans.map((plan, index) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`relative rounded-2xl border p-6 flex flex-col ${
                plan.highlighted
                  ? 'border-primary bg-primary/5 glow-border'
                  : 'border-border bg-card'
              }`}
            >
              {plan.highlighted && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 bg-primary text-primary-foreground text-xs font-bold rounded-full">
                  MOST POPULAR
                </div>
              )}
              <div className="mb-6">
                <plan.icon className={`w-8 h-8 mb-3 ${plan.highlighted ? 'text-primary' : 'text-muted-foreground'}`} />
                <h3 className="text-xl font-bold mb-1">{plan.name}</h3>
                <p className="text-sm text-muted-foreground">{plan.duration}</p>
              </div>
              <div className="mb-6">
                <span className="text-4xl font-bold text-primary">₹{plan.price.toLocaleString()}</span>
              </div>
              <ul className="space-y-3 mb-8 flex-1">
                {plan.features.map(f => (
                  <li key={f} className="flex items-start gap-2 text-sm">
                    <Check className="w-4 h-4 text-primary mt-0.5 shrink-0" />
                    <span className="text-muted-foreground">{f}</span>
                  </li>
                ))}
              </ul>
              <GlowButton
                variant={plan.highlighted ? 'primary' : 'outline'}
                size="lg"
                className="w-full"
              >
                Get Started
              </GlowButton>
            </motion.div>
          ))}
        </div>
      </div>
    </main>
    <Footer />
  </div>
);

export default Pricing;
