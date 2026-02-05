import { motion } from 'framer-motion';
import { Search, Filter, Clock, Users, Star, Play, BookOpen } from 'lucide-react';
import ParticleBackground from '@/components/ParticleBackground';
import Navbar from '@/components/Navbar';
 import Footer from '@/components/Footer';
import GlowCard from '@/components/GlowCard';
import GlowText from '@/components/GlowText';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

const courses = [
  {
    id: 1,
    title: 'Ethical Hacking Masterclass',
    instructor: 'Alex Security',
    rating: 4.9,
    students: 12450,
    duration: '42 hours',
    price: 4999,
    image: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=400&h=250&fit=crop',
    level: 'Advanced',
    category: 'Penetration Testing',
  },
  {
    id: 2,
    title: 'Web Application Security',
    instructor: 'Sarah White',
    rating: 4.8,
    students: 8920,
    duration: '36 hours',
    price: 3999,
    image: 'https://images.unsplash.com/photo-1555949963-ff9fe0c870eb?w=400&h=250&fit=crop',
    level: 'Intermediate',
    category: 'Web Security',
  },
  {
    id: 3,
    title: 'Network Security Fundamentals',
    instructor: 'Mike Chen',
    rating: 4.7,
    students: 15670,
    duration: '28 hours',
    price: 2499,
    image: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=400&h=250&fit=crop',
    level: 'Beginner',
    category: 'Network Security',
  },
  {
    id: 4,
    title: 'Malware Analysis & Reverse Engineering',
    instructor: 'David Black',
    rating: 4.9,
    students: 6340,
    duration: '48 hours',
    price: 5999,
    image: 'https://images.unsplash.com/photo-1504639725590-34d0984388bd?w=400&h=250&fit=crop',
    level: 'Expert',
    category: 'Malware Analysis',
  },
  {
    id: 5,
    title: 'Bug Bounty Hunting',
    instructor: 'Lisa Hunt',
    rating: 4.8,
    students: 9870,
    duration: '32 hours',
    price: 3499,
    image: 'https://images.unsplash.com/photo-1563206767-5b18f218e8de?w=400&h=250&fit=crop',
    level: 'Intermediate',
    category: 'Bug Bounty',
  },
  {
    id: 6,
    title: 'Cloud Security (AWS/Azure)',
    instructor: 'John Cloud',
    rating: 4.6,
    students: 7230,
    duration: '40 hours',
    price: 4499,
    image: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=400&h=250&fit=crop',
    level: 'Advanced',
    category: 'Cloud Security',
  },
];

const categories = ['All', 'Penetration Testing', 'Web Security', 'Network Security', 'Malware Analysis', 'Bug Bounty', 'Cloud Security'];

const Courses = () => {
  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      <ParticleBackground />
      <Navbar />

      <main className="pt-24 pb-12 px-4">
        <div className="container mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Explore{' '}
              <GlowText as="span" color="gradient" animate={false}>
                Courses
              </GlowText>
            </h1>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Learn from industry experts and master cybersecurity skills with our comprehensive courses.
            </p>
          </motion.div>

          {/* Search and Filter */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="flex flex-col md:flex-row gap-4 mb-8"
          >
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input
                placeholder="Search courses..."
                className="pl-10 bg-card border-border"
              />
            </div>
            <Button variant="outline" className="gap-2">
              <Filter className="w-4 h-4" />
              Filters
            </Button>
          </motion.div>

          {/* Categories */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="flex flex-wrap gap-2 mb-8"
          >
            {categories.map((category, index) => (
              <motion.button
                key={category}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  index === 0
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-card border border-border text-muted-foreground hover:text-foreground hover:border-primary/50'
                }`}
              >
                {category}
              </motion.button>
            ))}
          </motion.div>

          {/* Course Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {courses.map((course, index) => (
              <motion.div
                key={course.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 + index * 0.1 }}
              >
                <GlowCard className="p-0 overflow-hidden" glowColor="blue">
                  <div className="relative">
                    <img
                      src={course.image}
                      alt={course.title}
                      className="w-full h-48 object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent" />
                    <Badge className="absolute top-3 left-3 bg-primary/80">
                      {course.level}
                    </Badge>
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      className="absolute bottom-3 right-3 w-12 h-12 rounded-full bg-primary flex items-center justify-center"
                    >
                      <Play className="w-5 h-5 text-primary-foreground fill-current" />
                    </motion.button>
                  </div>
                  <div className="p-6">
                    <p className="text-sm text-primary mb-2">{course.category}</p>
                    <h3 className="text-lg font-semibold mb-2 line-clamp-2">{course.title}</h3>
                    <p className="text-sm text-muted-foreground mb-4">by {course.instructor}</p>
                    
                    <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
                      <span className="flex items-center gap-1">
                        <Star className="w-4 h-4 fill-yellow-500 text-yellow-500" />
                        {course.rating}
                      </span>
                      <span className="flex items-center gap-1">
                        <Users className="w-4 h-4" />
                        {course.students.toLocaleString()}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        {course.duration}
                      </span>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-xl font-bold text-primary">₹{course.price.toLocaleString()}</span>
                      <Button size="sm" className="bg-primary hover:bg-primary/90">
                        Enroll Now
                      </Button>
                    </div>
                  </div>
                </GlowCard>
              </motion.div>
            ))}
          </div>
        </div>
      </main>
     <Footer />
    </div>
  );
};

export default Courses;
