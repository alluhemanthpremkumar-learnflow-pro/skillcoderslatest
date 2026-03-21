import { motion } from 'framer-motion';
import { BookOpen, Users, Star, DollarSign, Plus, BarChart3, MessageCircle } from 'lucide-react';
import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate, Navigate } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ParticleBackground from '@/components/ParticleBackground';
import GlowText from '@/components/GlowText';
import GlowCard from '@/components/GlowCard';
import GlowButton from '@/components/GlowButton';
import { Button } from '@/components/ui/button';
import InstructorMessaging from '@/components/InstructorMessaging';
import { Tabs as TabsUI, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { FileText, Edit, Trash2, Check, Video } from 'lucide-react';

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
  const [activeTab, setActiveTab] = useState('overview');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [courses, setCourses] = useState(myCourses);
  const [editingCourse, setEditingCourse] = useState<typeof myCourses[0] | null>(null);
  const [newCourse, setNewCourse] = useState({ title: '', description: '', price: '0', domain: 'Psychology' });
  const [materialUpload, setMaterialUpload] = useState({ courseIndex: -1, type: 'topic' as 'topic' | 'quiz', content: '' });

  const handleCreateCourse = () => {
    setCourses([...courses, { ...newCourse, students: 0, rating: 0, revenue: '₹0', status: 'Draft' }]);
    setIsCreateModalOpen(false);
    setNewCourse({ title: '', description: '', price: '0', domain: 'Psychology' });
  };

  const handleUpdateCourse = () => {
    if (editingCourse) {
      const updated = courses.map(c => c.title === editingCourse.title ? editingCourse : c);
      setCourses(updated);
      setEditingCourse(null);
    }
  };

  const handleUploadMaterial = () => {
    console.log('Uploading', materialUpload);
    setMaterialUpload({ courseIndex: -1, type: 'topic', content: '' });
    // In a real app we'd save this to Firestore
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    );
  }

  if (!userProfile || (userProfile.role !== 'instructor' && userProfile.role !== 'admin')) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      <ParticleBackground />
      <Navbar />

      <main className="pt-24 pb-12 px-4">
        <div className="container mx-auto max-w-7xl">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8 flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold mb-1">
                Instructor <GlowText as="span" color="gradient" animate={false}>Dashboard</GlowText>
              </h1>
              <p className="text-muted-foreground">Welcome back, {userProfile.displayName}</p>
            </div>
            <GlowButton variant="primary" onClick={() => setIsCreateModalOpen(true)}>
              <span className="flex items-center gap-2"><Plus className="w-4 h-4" /> Create Course</span>
            </GlowButton>
          </motion.div>

          {/* Tab Navigation */}
          <TabsUI value={activeTab} onValueChange={setActiveTab} className="mb-8">
            <TabsList className="grid w-full max-w-md grid-cols-2">
              <TabsTrigger value="overview" className="flex items-center gap-2">
                <BarChart3 className="w-4 h-4" />
                Overview
              </TabsTrigger>
              <TabsTrigger value="messages" className="flex items-center gap-2">
                <MessageCircle className="w-4 h-4" />
                Messages
              </TabsTrigger>
            </TabsList>

            {/* Overview Tab */}
            <TabsContent value="overview" className="space-y-8">
              {/* Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
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
                <h2 className="text-xl font-bold mb-4">My Courses & Materials</h2>
                <div className="space-y-4">
                  {courses.map((course, i) => (
                    <GlowCard key={i} glowColor="blue" className="p-0">
                      <div className="p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-semibold text-lg">{course.title}</h3>
                            <Badge variant={course.status === 'Published' ? 'default' : 'secondary'}>
                              {course.status}
                            </Badge>
                          </div>
                          <div className="flex items-center gap-4 text-sm text-muted-foreground">
                            <span className="flex items-center gap-1"><Users className="w-3 h-3" /> {course.students}</span>
                            {course.rating > 0 && (
                              <span className="flex items-center gap-1"><Star className="w-3 h-3 fill-yellow-500 text-yellow-500" /> {course.rating}</span>
                            )}
                            <span className="flex items-center gap-1"><DollarSign className="w-3 h-3" /> {course.revenue}</span>
                          </div>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          <Button size="sm" variant="outline" onClick={() => setEditingCourse(course)}>
                            <Edit className="w-4 h-4 mr-2" /> Edit Details
                          </Button>
                          <Button size="sm" variant="outline" onClick={() => setMaterialUpload({ courseIndex: i, type: 'topic', content: '' })}>
                            <Plus className="w-4 h-4 mr-2" /> Daily Topic/Quiz
                          </Button>
                          <GlowButton size="sm" variant="secondary" onClick={() => navigate('/meetings')}>
                            <Video className="w-4 h-4 mr-2" /> Go to Meet
                          </GlowButton>
                        </div>
                      </div>

                      {/* Topic/Quiz Upload Form */}
                      {materialUpload.courseIndex === i && (
                        <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="px-5 pb-5 pt-2 border-t border-border bg-muted/20">
                          <div className="space-y-4">
                            <div className="flex items-center gap-4">
                              <Label className="font-medium">Type:</Label>
                              <div className="flex gap-2">
                                <Button size="sm" variant={materialUpload.type === 'topic' ? 'default' : 'outline'} onClick={() => setMaterialUpload({...materialUpload, type: 'topic'})}>Topic</Button>
                                <Button size="sm" variant={materialUpload.type === 'quiz' ? 'default' : 'outline'} onClick={() => setMaterialUpload({...materialUpload, type: 'quiz'})}>Quiz</Button>
                              </div>
                            </div>
                            <div>
                              <Label>Content / Link</Label>
                              <Textarea 
                                placeholder={materialUpload.type === 'topic' ? "Enter today's topic summary..." : "Enter quiz questions or link..."}
                                value={materialUpload.content}
                                onChange={(e) => setMaterialUpload({...materialUpload, content: e.target.value})}
                                className="mt-1"
                              />
                            </div>
                            <div className="flex gap-2">
                              <Button size="sm" onClick={handleUploadMaterial}>Upload</Button>
                              <Button size="sm" variant="ghost" onClick={() => setMaterialUpload({ courseIndex: -1, type: 'topic', content: '' })}>Cancel</Button>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </GlowCard>
                  ))}
                </div>
              </motion.div>
            </TabsContent>

            {/* Messages Tab */}
            <TabsContent value="messages">
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                <InstructorMessaging userName={userProfile.displayName} />
              </motion.div>
            </TabsContent>
          </TabsUI>
        </div>
      </main>
      <Footer />

      {/* Create Course Dialog */}
      <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Create New Course</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="title">Course Title</Label>
              <Input id="title" value={newCourse.title} onChange={(e) => setNewCourse({...newCourse, title: e.target.value})} />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="price">Price (₹)</Label>
              <Input id="price" type="number" value={newCourse.price} onChange={(e) => setNewCourse({...newCourse, price: e.target.value})} />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="desc">Description</Label>
              <Textarea id="desc" value={newCourse.description} onChange={(e) => setNewCourse({...newCourse, description: e.target.value})} />
            </div>
          </div>
          <DialogFooter>
            <GlowButton variant="primary" onClick={handleCreateCourse}>Create Course</GlowButton>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Course Dialog */}
      <Dialog open={!!editingCourse} onOpenChange={() => setEditingCourse(null)}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Edit Course Details</DialogTitle>
          </DialogHeader>
          {editingCourse && (
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="edit-title">Title</Label>
                <Input id="edit-title" value={editingCourse.title} onChange={(e) => setEditingCourse({...editingCourse, title: e.target.value})} />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-price">Revenue/Price (Display Info)</Label>
                <Input id="edit-price" value={editingCourse.revenue} onChange={(e) => setEditingCourse({...editingCourse, revenue: e.target.value})} />
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditingCourse(null)}>Cancel</Button>
            <GlowButton variant="primary" onClick={handleUpdateCourse}>Save Changes</GlowButton>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default InstructorDashboard;
