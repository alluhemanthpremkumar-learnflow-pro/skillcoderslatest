import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Shield, LogOut, Users, BookOpen, Settings, Trash2, Edit, Plus, Search,
  BarChart3, Eye, Ban, CheckCircle, X
} from 'lucide-react';
import { adminLogout } from '@/lib/adminAuth';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import GlowButton from '@/components/GlowButton';
import scLogo from '@/assets/sc_logo.png';

// Mock data
const initialUsers = [
  { id: 1, name: 'Rahul Sharma', email: 'rahul@example.com', role: 'Student', status: 'Active', joined: '2025-01-15' },
  { id: 2, name: 'Priya Patel', email: 'priya@example.com', role: 'Instructor', status: 'Active', joined: '2025-02-01' },
  { id: 3, name: 'Amit Kumar', email: 'amit@example.com', role: 'Student', status: 'Suspended', joined: '2025-01-20' },
  { id: 4, name: 'Sneha Reddy', email: 'sneha@example.com', role: 'Student', status: 'Active', joined: '2025-03-01' },
];

const initialCourses = [
  { id: 1, title: 'Ethical Hacking Masterclass', instructor: 'Priya Patel', students: 245, price: '₹4,999', status: 'Published' },
  { id: 2, title: 'Network Security Fundamentals', instructor: 'Admin', students: 180, price: '₹2,999', status: 'Published' },
  { id: 3, title: 'Malware Analysis Deep Dive', instructor: 'Priya Patel', students: 0, price: '₹6,999', status: 'Draft' },
  { id: 4, title: 'Bug Bounty Hunting', instructor: 'Admin', students: 320, price: '₹3,499', status: 'Published' },
];

const siteSettings = [
  { key: 'site_title', label: 'Site Title', value: 'SkillCoders - Cybersecurity Learning Platform' },
  { key: 'hero_tagline', label: 'Hero Tagline', value: 'Master Cybersecurity. Defend the Digital World.' },
  { key: 'pricing_basic', label: 'Basic Plan Price', value: '₹999/month' },
  { key: 'pricing_pro', label: 'Pro Plan Price', value: '₹2,499/month' },
  { key: 'pricing_enterprise', label: 'Enterprise Price', value: 'Contact Us' },
  { key: 'support_email', label: 'Support Email', value: 'support@skillcoders.com' },
];

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState(initialUsers);
  const [courses, setCourses] = useState(initialCourses);
  const [settings, setSettings] = useState(siteSettings);
  const [searchQuery, setSearchQuery] = useState('');
  const [editingSettingKey, setEditingSettingKey] = useState<string | null>(null);
  const [editingSettingValue, setEditingSettingValue] = useState('');

  const handleLogout = () => {
    adminLogout();
    navigate('/admin');
  };

  const deleteUser = (id: number) => setUsers(users.filter(u => u.id !== id));
  const toggleUserStatus = (id: number) =>
    setUsers(users.map(u => u.id === id ? { ...u, status: u.status === 'Active' ? 'Suspended' : 'Active' } : u));

  const deleteCourse = (id: number) => setCourses(courses.filter(c => c.id !== id));
  const toggleCourseStatus = (id: number) =>
    setCourses(courses.map(c => c.id === id ? { ...c, status: c.status === 'Published' ? 'Draft' : 'Published' } : c));

  const startEditSetting = (key: string, value: string) => {
    setEditingSettingKey(key);
    setEditingSettingValue(value);
  };

  const saveSetting = () => {
    if (editingSettingKey) {
      setSettings(settings.map(s => s.key === editingSettingKey ? { ...s, value: editingSettingValue } : s));
      setEditingSettingKey(null);
    }
  };

  const stats = [
    { label: 'Total Users', value: users.length, icon: Users, color: 'text-primary' },
    { label: 'Total Courses', value: courses.length, icon: BookOpen, color: 'text-secondary' },
    { label: 'Active Students', value: users.filter(u => u.role === 'Student' && u.status === 'Active').length, icon: CheckCircle, color: 'text-green-400' },
    { label: 'Revenue', value: '₹12.4L', icon: BarChart3, color: 'text-yellow-400' },
  ];

  const filteredUsers = users.filter(u =>
    u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    u.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredCourses = courses.filter(c =>
    c.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-background">
      {/* Top Bar */}
      <header className="sticky top-0 z-50 bg-card/90 backdrop-blur-xl border-b border-border px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <img src={scLogo} alt="SkillCoders" className="w-8 h-8" />
          <div>
            <h1 className="text-lg font-bold flex items-center gap-2">
              <Shield className="w-5 h-5 text-destructive" />
              Admin Panel
            </h1>
            <p className="text-xs text-muted-foreground">alluhemanth5063@gmail.com</p>
          </div>
        </div>
        <Button variant="ghost" size="sm" onClick={handleLogout} className="text-destructive hover:text-destructive">
          <LogOut className="w-4 h-4 mr-2" /> Logout
        </Button>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="bg-card/80 rounded-xl border border-border p-5"
            >
              <stat.icon className={`w-6 h-6 ${stat.color} mb-2`} />
              <p className="text-2xl font-bold">{stat.value}</p>
              <p className="text-sm text-muted-foreground">{stat.label}</p>
            </motion.div>
          ))}
        </div>

        {/* Search */}
        <div className="relative mb-6">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <Input
            placeholder="Search users, courses..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 bg-card/50"
          />
        </div>

        {/* Tabs */}
        <Tabs defaultValue="users">
          <TabsList className="bg-card border border-border mb-6">
            <TabsTrigger value="users" className="data-[state=active]:bg-primary/20">
              <Users className="w-4 h-4 mr-2" /> Users
            </TabsTrigger>
            <TabsTrigger value="courses" className="data-[state=active]:bg-primary/20">
              <BookOpen className="w-4 h-4 mr-2" /> Courses
            </TabsTrigger>
            <TabsTrigger value="settings" className="data-[state=active]:bg-primary/20">
              <Settings className="w-4 h-4 mr-2" /> Site Content
            </TabsTrigger>
          </TabsList>

          {/* Users Tab */}
          <TabsContent value="users">
            <div className="bg-card/60 rounded-xl border border-border overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Joined</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredUsers.map(user => (
                    <TableRow key={user.id}>
                      <TableCell className="font-medium">{user.name}</TableCell>
                      <TableCell className="text-muted-foreground">{user.email}</TableCell>
                      <TableCell>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          user.role === 'Instructor' ? 'bg-secondary/20 text-secondary' : 'bg-primary/20 text-primary'
                        }`}>
                          {user.role}
                        </span>
                      </TableCell>
                      <TableCell>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          user.status === 'Active' ? 'bg-green-500/20 text-green-400' : 'bg-destructive/20 text-destructive'
                        }`}>
                          {user.status}
                        </span>
                      </TableCell>
                      <TableCell className="text-muted-foreground">{user.joined}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-1">
                          <Button variant="ghost" size="icon" onClick={() => toggleUserStatus(user.id)}
                            title={user.status === 'Active' ? 'Suspend' : 'Activate'}>
                            {user.status === 'Active' ? <Ban className="w-4 h-4 text-yellow-400" /> : <CheckCircle className="w-4 h-4 text-green-400" />}
                          </Button>
                          <Button variant="ghost" size="icon" onClick={() => deleteUser(user.id)}>
                            <Trash2 className="w-4 h-4 text-destructive" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                  {filteredUsers.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                        No users found
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </TabsContent>

          {/* Courses Tab */}
          <TabsContent value="courses">
            <div className="bg-card/60 rounded-xl border border-border overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Title</TableHead>
                    <TableHead>Instructor</TableHead>
                    <TableHead>Students</TableHead>
                    <TableHead>Price</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredCourses.map(course => (
                    <TableRow key={course.id}>
                      <TableCell className="font-medium">{course.title}</TableCell>
                      <TableCell className="text-muted-foreground">{course.instructor}</TableCell>
                      <TableCell>{course.students}</TableCell>
                      <TableCell>{course.price}</TableCell>
                      <TableCell>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          course.status === 'Published' ? 'bg-green-500/20 text-green-400' : 'bg-yellow-500/20 text-yellow-400'
                        }`}>
                          {course.status}
                        </span>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-1">
                          <Button variant="ghost" size="icon" onClick={() => toggleCourseStatus(course.id)}
                            title={course.status === 'Published' ? 'Unpublish' : 'Publish'}>
                            <Eye className="w-4 h-4 text-primary" />
                          </Button>
                          <Button variant="ghost" size="icon" onClick={() => deleteCourse(course.id)}>
                            <Trash2 className="w-4 h-4 text-destructive" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                  {filteredCourses.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                        No courses found
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </TabsContent>

          {/* Site Content Tab */}
          <TabsContent value="settings">
            <div className="bg-card/60 rounded-xl border border-border overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Setting</TableHead>
                    <TableHead>Value</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {settings.map(setting => (
                    <TableRow key={setting.key}>
                      <TableCell className="font-medium">{setting.label}</TableCell>
                      <TableCell>
                        {editingSettingKey === setting.key ? (
                          <Input
                            value={editingSettingValue}
                            onChange={(e) => setEditingSettingValue(e.target.value)}
                            className="max-w-md bg-background/50"
                            autoFocus
                          />
                        ) : (
                          <span className="text-muted-foreground">{setting.value}</span>
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        {editingSettingKey === setting.key ? (
                          <div className="flex items-center justify-end gap-1">
                            <Button variant="ghost" size="icon" onClick={saveSetting}>
                              <CheckCircle className="w-4 h-4 text-green-400" />
                            </Button>
                            <Button variant="ghost" size="icon" onClick={() => setEditingSettingKey(null)}>
                              <X className="w-4 h-4 text-muted-foreground" />
                            </Button>
                          </div>
                        ) : (
                          <Button variant="ghost" size="icon" onClick={() => startEditSetting(setting.key, setting.value)}>
                            <Edit className="w-4 h-4 text-primary" />
                          </Button>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default AdminDashboard;
