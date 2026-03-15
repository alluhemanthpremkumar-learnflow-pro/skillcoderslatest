import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Clock, Users, Star, Play, BookOpen, ArrowLeft, CheckCircle, FileText, Video } from 'lucide-react';
import ParticleBackground from '@/components/ParticleBackground';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import GlowText from '@/components/GlowText';
import GlowButton from '@/components/GlowButton';
import { Badge } from '@/components/ui/badge';
import { sampleCourses } from '@/lib/sampleCourses';

const sampleModules = [
  {
    title: 'Module 1: Introduction',
    lessons: [
      { title: 'Welcome & Course Overview', type: 'video', duration: '10 min' },
      { title: 'Setting Up Your Environment', type: 'video', duration: '25 min' },
      { title: 'Course Resources', type: 'pdf', duration: '5 min' },
    ],
  },
  {
    title: 'Module 2: Fundamentals',
    lessons: [
      { title: 'Core Concepts', type: 'video', duration: '30 min' },
      { title: 'Hands-on Lab 1', type: 'video', duration: '45 min' },
      { title: 'Module Quiz', type: 'quiz', duration: '15 min' },
    ],
  },
  {
    title: 'Module 3: Advanced Techniques',
    lessons: [
      { title: 'Advanced Methods', type: 'video', duration: '40 min' },
      { title: 'Case Study', type: 'pdf', duration: '20 min' },
      { title: 'Hands-on Lab 2', type: 'video', duration: '50 min' },
      { title: 'Final Assessment', type: 'quiz', duration: '30 min' },
    ],
  },
];

const CourseDetail = () => {
  const { id } = useParams();
  const course = sampleCourses.find(c => c.id === id);

  if (!course) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Course not found</h1>
          <Link to="/courses"><GlowButton variant="primary">Back to Courses</GlowButton></Link>
        </div>
      </div>
    );
  }

  const lessonIcon = (type: string) => {
    if (type === 'video') return <Video className="w-4 h-4 text-primary" />;
    if (type === 'pdf') return <FileText className="w-4 h-4 text-secondary" />;
    return <CheckCircle className="w-4 h-4 text-muted-foreground" />;
  };

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      <ParticleBackground />
      <Navbar />

      <main className="pt-24 pb-12 px-4">
        <div className="container mx-auto max-w-6xl">
          <Link to="/courses" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-6">
            <ArrowLeft className="w-4 h-4" /> Back to Courses
          </Link>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2">
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                <img src={course.thumbnail} alt={course.title} className="w-full h-64 md:h-80 object-cover rounded-2xl mb-6" />
                <div className="flex flex-wrap gap-2 mb-4">
                  <Badge className="bg-primary/20 text-primary">{course.level}</Badge>
                  <Badge variant="outline">{course.domain}</Badge>
                  {course.tags.map(tag => (
                    <Badge key={tag} variant="outline" className="text-muted-foreground">{tag}</Badge>
                  ))}
                </div>
                <h1 className="text-3xl md:text-4xl font-bold mb-4">{course.title}</h1>
                <p className="text-muted-foreground mb-6">{course.description}</p>

                <div className="flex flex-wrap items-center gap-6 text-sm text-muted-foreground mb-8">
                  <span className="flex items-center gap-1">
                    <Star className="w-4 h-4 fill-yellow-500 text-yellow-500" />
                    {course.rating} ({course.reviewCount.toLocaleString()} reviews)
                  </span>
                  <span className="flex items-center gap-1">
                    <Users className="w-4 h-4" />
                    {course.studentsEnrolled.toLocaleString()} students
                  </span>
                  <span>by <span className="text-foreground font-medium">{course.instructorName}</span></span>
                </div>

                {/* Curriculum */}
                <h2 className="text-2xl font-bold mb-4">
                  <GlowText as="span" color="blue" animate={false}>Curriculum</GlowText>
                </h2>
                <div className="space-y-4">
                  {sampleModules.map((mod, mi) => (
                    <motion.div
                      key={mi}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: mi * 0.1 }}
                      className="bg-card rounded-xl border border-border overflow-hidden"
                    >
                      <div className="p-4 bg-muted/30 font-semibold flex items-center gap-2">
                        <BookOpen className="w-4 h-4 text-primary" />
                        {mod.title}
                        <span className="ml-auto text-sm text-muted-foreground">{mod.lessons.length} lessons</span>
                      </div>
                      <div className="divide-y divide-border">
                        {mod.lessons.map((lesson, li) => (
                          <div key={li} className="p-4 flex items-center gap-3 text-sm">
                            {lessonIcon(lesson.type)}
                            <span className="flex-1">{lesson.title}</span>
                            <span className="text-muted-foreground">{lesson.duration}</span>
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1">
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="sticky top-24 bg-card rounded-2xl border border-border p-6"
              >
                <div className="text-3xl font-bold text-primary mb-2">₹{course.price.toLocaleString()}</div>
                <GlowButton variant="primary" size="lg" className="w-full mb-4">
                  <span className="flex items-center gap-2">
                    <Play className="w-5 h-5" /> Enroll Now
                  </span>
                </GlowButton>
                <GlowButton variant="outline" size="lg" className="w-full mb-6">
                  Add to Wishlist
                </GlowButton>

                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Level</span>
                    <span className="font-medium">{course.level}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Students</span>
                    <span className="font-medium">{course.studentsEnrolled.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Rating</span>
                    <span className="font-medium flex items-center gap-1">
                      <Star className="w-3 h-3 fill-yellow-500 text-yellow-500" /> {course.rating}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Domain</span>
                    <span className="font-medium">{course.domain}</span>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default CourseDetail;
