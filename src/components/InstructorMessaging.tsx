import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, Send, X, Search, Clock, Users } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface ConversationMessage {
  id: string;
  sender: string;
  senderRole: 'instructor' | 'student';
  content: string;
  timestamp: Date;
}

interface Conversation {
  id: string;
  studentName: string;
  studentEmail: string;
  courseName: string;
  lastMessage: string;
  lastMessageTime: Date;
  unreadCount: number;
  status: 'online' | 'offline';
  messages: ConversationMessage[];
}

const sampleConversations: Conversation[] = [
  {
    id: '1',
    studentName: 'Aman Kumar',
    studentEmail: 'aman@example.com',
    courseName: 'Web Security Fundamentals',
    lastMessage: 'Thank you for the explanation on SQL injection!',
    lastMessageTime: new Date(Date.now() - 300000),
    unreadCount: 0,
    status: 'online',
    messages: [
      {
        id: '1',
        sender: 'Aman Kumar',
        senderRole: 'student',
        content: 'Hi, can you explain XSS attacks in detail?',
        timestamp: new Date(Date.now() - 600000),
      },
      {
        id: '2',
        sender: 'You',
        senderRole: 'instructor',
        content: 'Of course! XSS (Cross-Site Scripting) allows attackers to inject malicious scripts into web pages. Let me explain the types...',
        timestamp: new Date(Date.now() - 550000),
      },
      {
        id: '3',
        sender: 'Aman Kumar',
        senderRole: 'student',
        content: 'Thank you for the explanation on SQL injection!',
        timestamp: new Date(Date.now() - 300000),
      },
    ],
  },
  {
    id: '2',
    studentName: 'Priya Singh',
    studentEmail: 'priya@example.com',
    courseName: 'Network Security Advanced',
    lastMessage: 'When will the next assignment be available?',
    lastMessageTime: new Date(Date.now() - 1200000),
    unreadCount: 2,
    status: 'offline',
    messages: [
      {
        id: '4',
        sender: 'Priya Singh',
        senderRole: 'student',
        content: 'When will the next assignment be available?',
        timestamp: new Date(Date.now() - 1200000),
      },
    ],
  },
  {
    id: '3',
    studentName: 'Rajesh Patel',
    studentEmail: 'rajesh@example.com',
    courseName: 'Ethical Hacking Basics',
    lastMessage: 'Can you review my lab submission?',
    lastMessageTime: new Date(Date.now() - 3600000),
    unreadCount: 1,
    status: 'online',
    messages: [
      {
        id: '5',
        sender: 'Rajesh Patel',
        senderRole: 'student',
        content: 'Can you review my lab submission?',
        timestamp: new Date(Date.now() - 3600000),
      },
    ],
  },
];

interface InstructorMessagingProps {
  userName?: string;
}

const InstructorMessaging = ({ userName = 'Instructor' }: InstructorMessagingProps) => {
  const [conversations, setConversations] = useState<Conversation[]>(sampleConversations);
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(
    conversations[0]
  );
  const [newMessage, setNewMessage] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('all');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [selectedConversation?.messages]);

  const handleSendMessage = () => {
    if (!newMessage.trim() || !selectedConversation) return;

    const updatedConversations = conversations.map(conv => {
      if (conv.id === selectedConversation.id) {
        return {
          ...conv,
          lastMessage: newMessage,
          lastMessageTime: new Date(),
          messages: [
            ...conv.messages,
            {
              id: Date.now().toString(),
              sender: 'You',
              senderRole: 'instructor' as const,
              content: newMessage,
              timestamp: new Date(),
            },
          ],
        };
      }
      return conv;
    });

    setConversations(updatedConversations);
    setSelectedConversation(updatedConversations.find(c => c.id === selectedConversation.id) || null);
    setNewMessage('');
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const filteredConversations = conversations.filter(conv => {
    const matchesSearch =
      conv.studentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      conv.courseName.toLowerCase().includes(searchQuery.toLowerCase());

    if (activeTab === 'unread') {
      return matchesSearch && conv.unreadCount > 0;
    }
    if (activeTab === 'online') {
      return matchesSearch && conv.status === 'online';
    }
    return matchesSearch;
  });

  const formatTime = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return 'just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    if (days < 7) return `${days}d ago`;
    return date.toLocaleDateString();
  };

  return (
    <div className="grid lg:grid-cols-3 gap-6 h-[600px]">
      {/* Conversations List */}
      <Card className="lg:col-span-1 flex flex-col">
        <CardHeader className="border-b">
          <CardTitle className="flex items-center gap-2">
            <MessageCircle className="w-5 h-5" />
            Messages {conversations.filter(c => c.unreadCount > 0).length > 0 && (
              <Badge variant="destructive" className="ml-auto">
                {conversations.filter(c => c.unreadCount > 0).length}
              </Badge>
            )}
          </CardTitle>
        </CardHeader>
        <div className="p-4 border-b">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search conversations..."
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full border-b">
          <TabsList className="grid w-full grid-cols-3 rounded-none">
            <TabsTrigger value="all" className="rounded-none">All</TabsTrigger>
            <TabsTrigger value="unread" className="rounded-none">Unread</TabsTrigger>
            <TabsTrigger value="online" className="rounded-none">Online</TabsTrigger>
          </TabsList>
        </Tabs>

        <ScrollArea className="flex-1">
          <div className="space-y-2 p-4">
            {filteredConversations.map((conversation) => (
              <motion.button
                key={conversation.id}
                onClick={() => setSelectedConversation(conversation)}
                className={`w-full text-left p-3 rounded-lg transition-all ${
                  selectedConversation?.id === conversation.id
                    ? 'bg-primary/20 border border-primary'
                    : 'hover:bg-muted border border-transparent'
                }`}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <div className="flex items-start justify-between mb-1">
                  <div className="flex items-center gap-2">
                    <div className="relative">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white text-sm font-bold">
                        {conversation.studentName.charAt(0)}
                      </div>
                      {conversation.status === 'online' && (
                        <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-background"></div>
                      )}
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">{conversation.studentName}</p>
                      <p className="text-xs text-muted-foreground">{conversation.courseName}</p>
                    </div>
                  </div>
                  {conversation.unreadCount > 0 && (
                    <Badge variant="destructive" className="text-xs">
                      {conversation.unreadCount}
                    </Badge>
                  )}
                </div>
                <p className="text-xs text-muted-foreground line-clamp-1">
                  {conversation.lastMessage}
                </p>
                <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {formatTime(conversation.lastMessageTime)}
                </p>
              </motion.button>
            ))}
          </div>
        </ScrollArea>
      </Card>

      {/* Chat Area */}
      {selectedConversation ? (
        <Card className="lg:col-span-2 flex flex-col">
          <CardHeader className="border-b">
            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <CardTitle>{selectedConversation.studentName}</CardTitle>
                  {selectedConversation.status === 'online' && (
                    <Badge variant="outline" className="text-green-500 border-green-500">
                      Online
                    </Badge>
                  )}
                </div>
                <p className="text-sm text-muted-foreground">
                  {selectedConversation.courseName}
                </p>
              </div>
            </div>
          </CardHeader>

          <ScrollArea className="flex-1 p-4 border-b">
            <div className="space-y-4">
              {selectedConversation.messages.map((message) => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex ${
                    message.senderRole === 'instructor' ? 'justify-end' : 'justify-start'
                  }`}
                >
                  <div
                    className={`max-w-xs px-4 py-2 rounded-lg ${
                      message.senderRole === 'instructor'
                        ? 'bg-primary text-primary-foreground rounded-br-none'
                        : 'bg-muted text-foreground rounded-bl-none'
                    }`}
                  >
                    <p className="text-sm">{message.content}</p>
                    <p className="text-xs mt-1 opacity-70">
                      {message.timestamp.toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </p>
                  </div>
                </motion.div>
              ))}
              <div ref={messagesEndRef} />
            </div>
          </ScrollArea>

          <div className="p-4 border-t flex gap-2">
            <Input
              placeholder="Type your message..."
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              className="flex-1"
            />
            <Button
              onClick={handleSendMessage}
              disabled={!newMessage.trim()}
              className="px-6"
            >
              <Send className="w-4 h-4" />
            </Button>
          </div>
        </Card>
      ) : (
        <Card className="lg:col-span-2 flex items-center justify-center bg-muted/30">
          <div className="text-center">
            <MessageCircle className="w-12 h-12 mx-auto text-muted-foreground mb-4 opacity-50" />
            <p className="text-muted-foreground">Select a conversation to start messaging</p>
          </div>
        </Card>
      )}
    </div>
  );
};

export default InstructorMessaging;
