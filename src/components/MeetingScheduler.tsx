import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Video, Calendar, Clock, Users, ExternalLink, X, BookOpen, Briefcase } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import GlowButton from '@/components/GlowButton';

interface Meeting {
  id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  duration: string;
  type: 'class' | 'client';
  host: string;
  meetLink: string;
  participants: string[];
  isEnrolled?: boolean;
}

const sampleMeetings: Meeting[] = [
  {
    id: '1',
    title: 'Web Security Fundamentals',
    description: 'Learn about OWASP Top 10 vulnerabilities',
    date: '2024-02-15',
    time: '10:00 AM',
    duration: '2 hours',
    type: 'class',
    host: 'Dr. Cyber Expert',
    meetLink: 'https://meet.google.com/abc-defg-hij',
    participants: ['student1', 'student2', 'student3'],
    isEnrolled: true,
  },
  {
    id: '2',
    title: 'Network Penetration Testing',
    description: 'Advanced network security testing techniques',
    date: '2024-02-16',
    time: '2:00 PM',
    duration: '1.5 hours',
    type: 'class',
    host: 'Prof. Network Pro',
    meetLink: 'https://meet.google.com/xyz-uvwx-rst',
    participants: ['student1', 'student4'],
    isEnrolled: true,
  },
  {
    id: '3',
    title: 'Client Security Consultation',
    description: 'Security audit discussion for ABC Corp',
    date: '2024-02-17',
    time: '11:00 AM',
    duration: '1 hour',
    type: 'client',
    host: 'Security Consultant',
    meetLink: 'https://meet.google.com/cli-ent-meet',
    participants: ['client1'],
    isEnrolled: false,
  },
];

interface MeetingSchedulerProps {
  isOpen: boolean;
  onClose: () => void;
  userRole?: 'student' | 'instructor' | 'client';
  onOpenChat?: (meetingId: string) => void;
}

const MeetingScheduler = ({ isOpen, onClose, userRole = 'student', onOpenChat }: MeetingSchedulerProps) => {
  const [meetings] = useState<Meeting[]>(sampleMeetings);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newMeeting, setNewMeeting] = useState({
    title: '',
    description: '',
    date: '',
    time: '',
    duration: '1 hour',
    type: 'class' as 'class' | 'client',
  });

  const handleJoinMeeting = (meeting: Meeting) => {
    if (!meeting.isEnrolled && userRole === 'student') {
      alert('You must be enrolled in this course to join the meeting.');
      return;
    }
    window.open(meeting.meetLink, '_blank');
  };

  const handleCreateMeeting = () => {
    // Generate a Google Meet link format
    const meetCode = `${Math.random().toString(36).substring(2, 5)}-${Math.random().toString(36).substring(2, 6)}-${Math.random().toString(36).substring(2, 5)}`;
    const meetLink = `https://meet.google.com/${meetCode}`;
    console.log('Creating meeting with link:', meetLink, newMeeting);
    setShowCreateForm(false);
    setNewMeeting({
      title: '',
      description: '',
      date: '',
      time: '',
      duration: '1 hour',
      type: 'class',
    });
  };

  const canCreateMeeting = userRole === 'instructor' || userRole === 'client';

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Video className="w-5 h-5 text-primary" />
            <span>Meeting Room</span>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Create Meeting Button for Instructors/Clients */}
          {canCreateMeeting && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <Button
                onClick={() => setShowCreateForm(!showCreateForm)}
                className="w-full"
                variant="outline"
              >
                {showCreateForm ? 'Cancel' : '+ Schedule New Meeting'}
              </Button>
            </motion.div>
          )}

          {/* Create Meeting Form */}
          <AnimatePresence>
            {showCreateForm && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="bg-card border border-border rounded-lg p-4 space-y-4"
              >
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="title">Meeting Title</Label>
                    <Input
                      id="title"
                      value={newMeeting.title}
                      onChange={(e) => setNewMeeting({ ...newMeeting, title: e.target.value })}
                      placeholder="Enter meeting title"
                    />
                  </div>
                  <div>
                    <Label htmlFor="type">Meeting Type</Label>
                    <div className="flex gap-2 mt-1">
                      <Button
                        type="button"
                        variant={newMeeting.type === 'class' ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => setNewMeeting({ ...newMeeting, type: 'class' })}
                        className="flex-1"
                      >
                        <BookOpen className="w-4 h-4 mr-1" />
                        Class
                      </Button>
                      <Button
                        type="button"
                        variant={newMeeting.type === 'client' ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => setNewMeeting({ ...newMeeting, type: 'client' })}
                        className="flex-1"
                      >
                        <Briefcase className="w-4 h-4 mr-1" />
                        Client
                      </Button>
                    </div>
                  </div>
                </div>

                <div>
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={newMeeting.description}
                    onChange={(e) => setNewMeeting({ ...newMeeting, description: e.target.value })}
                    placeholder="Meeting description"
                    rows={2}
                  />
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="date">Date</Label>
                    <Input
                      id="date"
                      type="date"
                      value={newMeeting.date}
                      onChange={(e) => setNewMeeting({ ...newMeeting, date: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="time">Time</Label>
                    <Input
                      id="time"
                      type="time"
                      value={newMeeting.time}
                      onChange={(e) => setNewMeeting({ ...newMeeting, time: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="duration">Duration</Label>
                    <Input
                      id="duration"
                      value={newMeeting.duration}
                      onChange={(e) => setNewMeeting({ ...newMeeting, duration: e.target.value })}
                      placeholder="e.g., 1 hour"
                    />
                  </div>
                </div>

                <GlowButton variant="primary" className="w-full" onClick={handleCreateMeeting}>
                  Create & Generate Google Meet Link
                </GlowButton>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Meetings List */}
          <div className="space-y-3">
            <h3 className="font-semibold text-lg">Scheduled Meetings</h3>
            {meetings.map((meeting, index) => (
              <motion.div
                key={meeting.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-card border border-border rounded-lg p-4 hover:border-primary/50 transition-colors"
              >
                <div className="flex items-start justify-between">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <h4 className="font-semibold">{meeting.title}</h4>
                      <Badge variant={meeting.type === 'class' ? 'default' : 'secondary'}>
                        {meeting.type === 'class' ? (
                          <><BookOpen className="w-3 h-3 mr-1" /> Class</>
                        ) : (
                          <><Briefcase className="w-3 h-3 mr-1" /> Client</>
                        )}
                      </Badge>
                      {meeting.isEnrolled && (
                        <Badge variant="outline" className="text-green-500 border-green-500">
                          Enrolled
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground">{meeting.description}</p>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        {meeting.date}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        {meeting.time} ({meeting.duration})
                      </span>
                      <span className="flex items-center gap-1">
                        <Users className="w-4 h-4" />
                        {meeting.participants.length} participants
                      </span>
                    </div>
                    <p className="text-sm">
                      <span className="text-muted-foreground">Host: </span>
                      <span className="text-primary">{meeting.host}</span>
                    </p>
                  </div>
                  <div className="flex flex-col gap-2">
                    <Button
                      size="sm"
                      onClick={() => onOpenChat?.(meeting.id)}
                      variant="outline"
                    >
                      💬 Pre-Class Chat
                    </Button>
                    <GlowButton
                      variant="primary"
                      size="sm"
                      onClick={() => handleJoinMeeting(meeting)}
                      disabled={!meeting.isEnrolled && userRole === 'student'}
                    >
                      <ExternalLink className="w-4 h-4 mr-1" />
                      Join Meet
                    </GlowButton>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default MeetingScheduler;
