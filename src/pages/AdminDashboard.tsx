import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Shield, LogOut, Users, BookOpen, Settings, Trash2, Edit, Plus, Search,
  BarChart3, Eye, Ban, CheckCircle, X, Bell, CreditCard, Globe, Layers,
  Send, TrendingUp
} from 'lucide-react';
import { adminLogout } from '@/lib/adminAuth';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Label } from '@/components/ui/label';
import { sampleCourses } from '@/lib/sampleCourses';
import { domains } from '@/lib/domains';
import scLogo from '@/assets/sc_logo.png';

const initialUsers = [
  { id: 1, name: 'Rahul Sharma', email: 'rahul@example.com', role: 'Student', status: 'Active', joined: '2025-01-15' },
  { id: 2, name: 'Priya Patel', email: 'priya@example.com', role: 'Instructor', status: 'Active', joined: '2025-02-01' },
  { id: 3, name: 'Amit Kumar', email: 'amit@example.com', role: 'Student', status: 'Suspended', joined: '2025-01-20' },
  { id: 4, name: 'Sneha Reddy', email: 'sneha@example.com', role: 'Student', status: 'Active', joined: '2025-03-01' },
  { id: 5, name: 'Kiran V.', email: 'kiran@example.com', role: 'Instructor', status: 'Pending', joined: '2025-03-10' },
];

const initialPayments = [
  { id: 1, user: 'Rahul Sharma', plan: 'Intermediate', amount: '₹5,999', status: 'Completed', date: '2025-03-01' },
  { id: 2, user: 'Sneha Reddy', plan: 'Basic', amount: '₹1,999', status: 'Completed', date: '2025-03-05' },
  { id: 3, user: 'Amit Kumar', plan: 'Advanced', amount: '₹19,999', status: 'Failed', date: '2025-03-08' },
];

const siteSettings = [
  { key: 'site_title', label: 'Site Title', value: 'SkillCoders - Learning Platform' },
  { key: 'hero_tagline', label: 'Hero Tagline', value: 'Master Technology Skills That Matter' },
  { key: 'pricing_basic', label: 'Basic Plan Price', value: '₹1,999' },
  { key: 'pricing_intermediate', label: 'Intermediate Plan Price', value: '₹5,999' },
  { key: 'pricing_advanced', label: 'Advanced Plan Price', value: '₹19,999' },
  { key: 'support_email', label: 'Support Email', value: 'support@skillcoders.com' },
];

const analyticsData = [
  { label: 'Page Views (Today)', value: '3,450' },
  { label: 'New Signups (Week)', value: '127' },
  { label: 'Course Enrollments (Week)', value: '89' },
  { label: 'Revenue (Month)', value: '₹4,56,000' },
  { label: 'Avg Session Duration', value: '12m 34s' },
  { label: 'Bounce Rate', value: '23%' },
];

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState(initialUsers);
  const [courseList, setCourseList] = useState(sampleCourses.map(c => ({ ...c, statusAdmin: c.status })));
  const [settings, setSettings] = useState(siteSettings);
  const [searchQuery, setSearchQuery] = useState('');
  const [editingSettingKey, setEditingSettingKey] = useState<string | null>(null);
  const [editingSettingValue, setEditingSettingValue] = useState('');
  const [notifications, setNotifications] = useState([
    { id: 1, title: 'New instructor application', message: 'Kiran V. applied as instructor', date: '2025-03-10', read: false },
    { id: 2, title: 'Payment failed', message: 'Amit Kumar payment for Advanced plan failed', date: '2025-03-08', read: true },
  ]);
  const [newNotification, setNewNotification] = useState({ title: '', message: '', target: 'all' });

  const handleLogout = () => { adminLogout(); navigate('/admin'); };
  const deleteUser = (id: number) => setUsers(users.filter(u => u.id !== id));
  const toggleUserStatus = (id: number) => setUsers(users.map(u => u.id === id ? { ...u, status: u.status === 'Active' ? 'Suspended' : 'Active' } : u));
  const approveInstructor = (id: number) => setUsers(users.map(u => u.id === id ? { ...u, status: 'Active', role: 'Instructor' } : u));
  const deleteCourse = (id: string) => setCourseList(courseList.filter(c => c.id !== id));
  const toggleCourseStatus = (id: string) => setCourseList(courseList.map(c => c.id === id ? { ...c, statusAdmin: c.statusAdmin === 'published' ? 'draft' : 'published' } : c));

  const startEditSetting = (key: string, value: string) => { setEditingSettingKey(key); setEditingSettingValue(value); };
  const saveSetting = () => { if (editingSettingKey) { setSettings(settings.map(s => s.key === editingSettingKey ? { ...s, value: editingSettingValue } : s)); setEditingSettingKey(null); }};

  const sendNotification = () => {
    if (newNotification.title && newNotification.message) {
      setNotifications([{ id: Date.now(), title: newNotification.title, message: newNotification.message, date: new Date().toISOString().split('T')[0], read: false }, ...notifications]);
      setNewNotification({ title: '', message: '', target: 'all' });
    }
  };

  const filteredUsers = users.filter(u => u.name.toLowerCase().includes(searchQuery.toLowerCase()) || u.email.toLowerCase().includes(searchQuery.toLowerCase()));
  const filteredCourses = courseList.filter(c => c.title.toLowerCase().includes(searchQuery.toLowerCase()));

  const stats = [
    { label: 'Total Users', value: users.length, icon: Users, color: 'text-primary' },
    { label: 'Total Courses', value: courseList.length, icon: BookOpen, color: 'text-secondary' },
    { label: 'Domains', value: domains.length, icon: Globe, color: 'text-primary' },
    { label: 'Revenue', value: '₹12.4L', icon: BarChart3, color: 'text-accent' },
  ];

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 bg-card/90 backdrop-blur-xl border-b border-border px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <img src={scLogo} alt="SkillCoders" className="w-8 h-8" />
          <div>
            <h1 className="text-lg font-bold flex items-center gap-2"><Shield className="w-5 h-5 text-destructive" /> Admin Panel</h1>
            <p className="text-xs text-muted-foreground">Full Dashboard</p>
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
            <motion.div key={stat.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }} className="bg-card/80 rounded-xl border border-border p-5">
              <stat.icon className={`w-6 h-6 ${stat.color} mb-2`} />
              <p className="text-2xl font-bold">{stat.value}</p>
              <p className="text-sm text-muted-foreground">{stat.label}</p>
            </motion.div>
          ))}
        </div>

        <div className="relative mb-6">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <Input placeholder="Search users, courses..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="pl-10 bg-card/50" />
        </div>

        <Tabs defaultValue="overview">
          <TabsList className="bg-card border border-border mb-6 flex-wrap h-auto gap-1 p-1">
            <TabsTrigger value="overview" className="data-[state=active]:bg-primary/20"><BarChart3 className="w-4 h-4 mr-1" /> Overview</TabsTrigger>
            <TabsTrigger value="users" className="data-[state=active]:bg-primary/20"><Users className="w-4 h-4 mr-1" /> Users</TabsTrigger>
            <TabsTrigger value="courses" className="data-[state=active]:bg-primary/20"><BookOpen className="w-4 h-4 mr-1" /> Courses</TabsTrigger>
            <TabsTrigger value="domains" className="data-[state=active]:bg-primary/20"><Layers className="w-4 h-4 mr-1" /> Domains</TabsTrigger>
            <TabsTrigger value="payments" className="data-[state=active]:bg-primary/20"><CreditCard className="w-4 h-4 mr-1" /> Payments</TabsTrigger>
            <TabsTrigger value="analytics" className="data-[state=active]:bg-primary/20"><TrendingUp className="w-4 h-4 mr-1" /> Analytics</TabsTrigger>
            <TabsTrigger value="notifications" className="data-[state=active]:bg-primary/20"><Bell className="w-4 h-4 mr-1" /> Notifications</TabsTrigger>
            <TabsTrigger value="content" className="data-[state=active]:bg-primary/20"><Globe className="w-4 h-4 mr-1" /> Content</TabsTrigger>
            <TabsTrigger value="settings" className="data-[state=active]:bg-primary/20"><Settings className="w-4 h-4 mr-1" /> Settings</TabsTrigger>
          </TabsList>

          {/* Overview */}
          <TabsContent value="overview">
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-card/60 rounded-xl border border-border p-6">
                <h3 className="text-lg font-semibold mb-4">Recent Users</h3>
                {users.slice(0, 3).map(u => (
                  <div key={u.id} className="flex items-center justify-between py-2 border-b border-border last:border-0">
                    <div><p className="font-medium text-sm">{u.name}</p><p className="text-xs text-muted-foreground">{u.email}</p></div>
                    <span className={`px-2 py-1 rounded-full text-xs ${u.status === 'Active' ? 'bg-green-500/20 text-green-400' : u.status === 'Pending' ? 'bg-yellow-500/20 text-yellow-400' : 'bg-destructive/20 text-destructive'}`}>{u.status}</span>
                  </div>
                ))}
              </div>
              <div className="bg-card/60 rounded-xl border border-border p-6">
                <h3 className="text-lg font-semibold mb-4">Recent Payments</h3>
                {initialPayments.map(p => (
                  <div key={p.id} className="flex items-center justify-between py-2 border-b border-border last:border-0">
                    <div><p className="font-medium text-sm">{p.user}</p><p className="text-xs text-muted-foreground">{p.plan} • {p.date}</p></div>
                    <span className={`font-medium text-sm ${p.status === 'Completed' ? 'text-green-400' : 'text-destructive'}`}>{p.amount}</span>
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>

          {/* Users */}
          <TabsContent value="users">
            <div className="bg-card/60 rounded-xl border border-border overflow-hidden">
              <Table>
                <TableHeader><TableRow>
                  <TableHead>Name</TableHead><TableHead>Email</TableHead><TableHead>Role</TableHead><TableHead>Status</TableHead><TableHead>Joined</TableHead><TableHead className="text-right">Actions</TableHead>
                </TableRow></TableHeader>
                <TableBody>
                  {filteredUsers.map(user => (
                    <TableRow key={user.id}>
                      <TableCell className="font-medium">{user.name}</TableCell>
                      <TableCell className="text-muted-foreground">{user.email}</TableCell>
                      <TableCell><span className={`px-2 py-1 rounded-full text-xs font-medium ${user.role === 'Instructor' ? 'bg-secondary/20 text-secondary' : 'bg-primary/20 text-primary'}`}>{user.role}</span></TableCell>
                      <TableCell><span className={`px-2 py-1 rounded-full text-xs font-medium ${user.status === 'Active' ? 'bg-green-500/20 text-green-400' : user.status === 'Pending' ? 'bg-yellow-500/20 text-yellow-400' : 'bg-destructive/20 text-destructive'}`}>{user.status}</span></TableCell>
                      <TableCell className="text-muted-foreground">{user.joined}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-1">
                          {user.status === 'Pending' && <Button variant="ghost" size="icon" onClick={() => approveInstructor(user.id)} title="Approve"><CheckCircle className="w-4 h-4 text-green-400" /></Button>}
                          <Button variant="ghost" size="icon" onClick={() => toggleUserStatus(user.id)} title={user.status === 'Active' ? 'Suspend' : 'Activate'}>
                            {user.status === 'Active' ? <Ban className="w-4 h-4 text-yellow-400" /> : <CheckCircle className="w-4 h-4 text-green-400" />}
                          </Button>
                          <Button variant="ghost" size="icon" onClick={() => deleteUser(user.id)}><Trash2 className="w-4 h-4 text-destructive" /></Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </TabsContent>

          {/* Courses */}
          <TabsContent value="courses">
            <div className="flex justify-end mb-4">
              <Button className="bg-primary hover:bg-primary/90"><Plus className="w-4 h-4 mr-2" /> Add Course</Button>
            </div>
            <div className="bg-card/60 rounded-xl border border-border overflow-hidden">
              <Table>
                <TableHeader><TableRow>
                  <TableHead>Title</TableHead><TableHead>Domain</TableHead><TableHead>Level</TableHead><TableHead>Students</TableHead><TableHead>Price</TableHead><TableHead>Status</TableHead><TableHead className="text-right">Actions</TableHead>
                </TableRow></TableHeader>
                <TableBody>
                  {filteredCourses.map(course => (
                    <TableRow key={course.id}>
                      <TableCell className="font-medium">{course.title}</TableCell>
                      <TableCell className="text-muted-foreground">{course.domain}</TableCell>
                      <TableCell>{course.level}</TableCell>
                      <TableCell>{course.studentsEnrolled.toLocaleString()}</TableCell>
                      <TableCell>₹{course.price.toLocaleString()}</TableCell>
                      <TableCell><span className={`px-2 py-1 rounded-full text-xs font-medium ${course.statusAdmin === 'published' ? 'bg-green-500/20 text-green-400' : 'bg-yellow-500/20 text-yellow-400'}`}>{course.statusAdmin}</span></TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-1">
                          <Button variant="ghost" size="icon" onClick={() => toggleCourseStatus(course.id)}><Eye className="w-4 h-4 text-primary" /></Button>
                          <Button variant="ghost" size="icon"><Edit className="w-4 h-4 text-muted-foreground" /></Button>
                          <Button variant="ghost" size="icon" onClick={() => deleteCourse(course.id)}><Trash2 className="w-4 h-4 text-destructive" /></Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </TabsContent>

          {/* Domains */}
          <TabsContent value="domains">
            <div className="grid md:grid-cols-3 gap-4">
              {domains.map(domain => (
                <div key={domain.id} className="bg-card/60 rounded-xl border border-border p-5">
                  <h3 className="font-semibold mb-1">{domain.name}</h3>
                  <p className="text-sm text-muted-foreground mb-2">{domain.description}</p>
                  <p className="text-xs text-primary">{domain.courseCount} courses</p>
                </div>
              ))}
            </div>
          </TabsContent>

          {/* Payments */}
          <TabsContent value="payments">
            <div className="bg-card/60 rounded-xl border border-border overflow-hidden">
              <Table>
                <TableHeader><TableRow>
                  <TableHead>User</TableHead><TableHead>Plan</TableHead><TableHead>Amount</TableHead><TableHead>Status</TableHead><TableHead>Date</TableHead>
                </TableRow></TableHeader>
                <TableBody>
                  {initialPayments.map(p => (
                    <TableRow key={p.id}>
                      <TableCell className="font-medium">{p.user}</TableCell>
                      <TableCell>{p.plan}</TableCell>
                      <TableCell>{p.amount}</TableCell>
                      <TableCell><span className={`px-2 py-1 rounded-full text-xs font-medium ${p.status === 'Completed' ? 'bg-green-500/20 text-green-400' : 'bg-destructive/20 text-destructive'}`}>{p.status}</span></TableCell>
                      <TableCell className="text-muted-foreground">{p.date}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </TabsContent>

          {/* Analytics */}
          <TabsContent value="analytics">
            <div className="grid md:grid-cols-3 gap-4">
              {analyticsData.map(a => (
                <div key={a.label} className="bg-card/60 rounded-xl border border-border p-5">
                  <p className="text-sm text-muted-foreground mb-1">{a.label}</p>
                  <p className="text-2xl font-bold">{a.value}</p>
                </div>
              ))}
            </div>
          </TabsContent>

          {/* Notifications */}
          <TabsContent value="notifications">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-semibold mb-4">Send Notification</h3>
                <div className="bg-card/60 rounded-xl border border-border p-5 space-y-4">
                  <div><Label>Title</Label><Input value={newNotification.title} onChange={(e) => setNewNotification({ ...newNotification, title: e.target.value })} placeholder="Notification title" className="mt-1 bg-background/50" /></div>
                  <div><Label>Message</Label><textarea value={newNotification.message} onChange={(e) => setNewNotification({ ...newNotification, message: e.target.value })} placeholder="Notification message..." className="mt-1 w-full rounded-md border border-input bg-background/50 px-3 py-2 text-sm min-h-[80px]" /></div>
                  <Button onClick={sendNotification} className="bg-primary hover:bg-primary/90"><Send className="w-4 h-4 mr-2" /> Send</Button>
                </div>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-4">Recent Notifications</h3>
                <div className="space-y-3">
                  {notifications.map(n => (
                    <div key={n.id} className={`bg-card/60 rounded-xl border p-4 ${n.read ? 'border-border' : 'border-primary/50'}`}>
                      <p className="font-medium text-sm">{n.title}</p>
                      <p className="text-xs text-muted-foreground mt-1">{n.message}</p>
                      <p className="text-xs text-muted-foreground mt-2">{n.date}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </TabsContent>

          {/* Website Content */}
          <TabsContent value="content">
            <div className="bg-card/60 rounded-xl border border-border overflow-hidden">
              <Table>
                <TableHeader><TableRow><TableHead>Setting</TableHead><TableHead>Value</TableHead><TableHead className="text-right">Actions</TableHead></TableRow></TableHeader>
                <TableBody>
                  {settings.map(setting => (
                    <TableRow key={setting.key}>
                      <TableCell className="font-medium">{setting.label}</TableCell>
                      <TableCell>{editingSettingKey === setting.key ? <Input value={editingSettingValue} onChange={(e) => setEditingSettingValue(e.target.value)} className="max-w-md bg-background/50" autoFocus /> : <span className="text-muted-foreground">{setting.value}</span>}</TableCell>
                      <TableCell className="text-right">
                        {editingSettingKey === setting.key ? (
                          <div className="flex items-center justify-end gap-1">
                            <Button variant="ghost" size="icon" onClick={saveSetting}><CheckCircle className="w-4 h-4 text-green-400" /></Button>
                            <Button variant="ghost" size="icon" onClick={() => setEditingSettingKey(null)}><X className="w-4 h-4 text-muted-foreground" /></Button>
                          </div>
                        ) : (
                          <Button variant="ghost" size="icon" onClick={() => startEditSetting(setting.key, setting.value)}><Edit className="w-4 h-4 text-primary" /></Button>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </TabsContent>

          {/* Settings */}
          <TabsContent value="settings">
            <div className="bg-card/60 rounded-xl border border-border p-6 max-w-2xl">
              <h3 className="text-lg font-semibold mb-4">Admin Settings</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 rounded-lg bg-background/30">
                  <div><p className="font-medium text-sm">Maintenance Mode</p><p className="text-xs text-muted-foreground">Temporarily disable the site for maintenance</p></div>
                  <Button variant="outline" size="sm">Enable</Button>
                </div>
                <div className="flex items-center justify-between p-3 rounded-lg bg-background/30">
                  <div><p className="font-medium text-sm">Registration</p><p className="text-xs text-muted-foreground">Allow new user registrations</p></div>
                  <Button variant="outline" size="sm">Enabled</Button>
                </div>
                <div className="flex items-center justify-between p-3 rounded-lg bg-background/30">
                  <div><p className="font-medium text-sm">Instructor Approval</p><p className="text-xs text-muted-foreground">Require admin approval for new instructors</p></div>
                  <Button variant="outline" size="sm">Required</Button>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default AdminDashboard;
