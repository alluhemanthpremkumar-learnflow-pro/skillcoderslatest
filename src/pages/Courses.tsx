import { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Search, Clock, Users, Star, Play } from 'lucide-react';
import ParticleBackground from '@/components/ParticleBackground';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import GlowCard from '@/components/GlowCard';
import GlowText from '@/components/GlowText';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { sampleCourses } from '@/lib/sampleCourses';
import { domains } from '@/lib/domains';

const Courses = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDomain, setSelectedDomain] = useState('All');

  const filteredCourses = sampleCourses.filter(course => {
    const matchesSearch = searchQuery === '' ||
      course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      course.domain.toLowerCase().includes(searchQuery.toLowerCase()) ||
      course.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesDomain = selectedDomain === 'All' || course.domain === selectedDomain;
    return matchesSearch && matchesDomain;
  });

  const domainNames = ['All', ...domains.map(d => d.name)];

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      <ParticleBackground />
      <Navbar />
      <main className="pt-24 pb-12 px-4">
        <div className="container mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Explore <GlowText as="span" color="gradient" animate={false}>Courses</GlowText>
            </h1>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Learn from industry experts and master skills with our comprehensive courses.
            </p>
          </motion.div>

          {/* Search */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="relative max-w-xl mx-auto mb-8">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input placeholder="Search by title, domain, or tags..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="pl-10 bg-card border-border" />
          </motion.div>

          {/* Domain Filters */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="flex flex-wrap gap-2 mb-8 justify-center">
            {domainNames.map((domain) => (
              <motion.button key={domain} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={() => setSelectedDomain(domain)} className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                selectedDomain === domain ? 'bg-primary text-primary-foreground' : 'bg-card border border-border text-muted-foreground hover:text-foreground hover:border-primary/50'
              }`}>
                {domain}
              </motion.button>
            ))}
          </motion.div>

          {/* Course Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCourses.map((course, index) => (
              <motion.div key={course.id} initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 + index * 0.05 }}>
                <Link to={`/courses/${course.id}`}>
                  <GlowCard className="p-0 overflow-hidden" glowColor="blue">
                    <div className="relative">
                      <img src={course.thumbnail} alt={course.title} className="w-full h-48 object-cover" />
                      <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent" />
                      <Badge className="absolute top-3 left-3 bg-primary/80">{course.level}</Badge>
                      <motion.div whileHover={{ scale: 1.1 }} className="absolute bottom-3 right-3 w-12 h-12 rounded-full bg-primary flex items-center justify-center">
                        <Play className="w-5 h-5 text-primary-foreground fill-current" />
                      </motion.div>
                    </div>
                    <div className="p-6">
                      <p className="text-sm text-primary mb-2">{course.domain}</p>
                      <h3 className="text-lg font-semibold mb-2 line-clamp-2">{course.title}</h3>
                      <p className="text-sm text-muted-foreground mb-4">by {course.instructorName}</p>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
                        <span className="flex items-center gap-1">
                          <Star className="w-4 h-4 fill-yellow-500 text-yellow-500" />{course.rating}
                        </span>
                        <span className="flex items-center gap-1">
                          <Users className="w-4 h-4" />{course.studentsEnrolled.toLocaleString()}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-xl font-bold text-primary">₹{course.price.toLocaleString()}</span>
                        <Button size="sm" className="bg-primary hover:bg-primary/90">Enroll Now</Button>
                      </div>
                    </div>
                  </GlowCard>
                </Link>
              </motion.div>
            ))}
          </div>

          {filteredCourses.length === 0 && (
            <div className="text-center py-12">
              <p className="text-muted-foreground text-lg">No courses found matching your search.</p>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Courses;
