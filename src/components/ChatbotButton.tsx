import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, X, Send } from 'lucide-react';
import { Input } from '@/components/ui/input';

interface Message {
  id: number;
  text: string;
  isBot: boolean;
}

const quickReplies: Record<string, string> = {
  'courses': 'We offer courses in Cyber Security, Ethical Hacking, AI, Robotics, Data Science, Machine Learning, AWS, Cloud Computing, Bug Bounty, VAPT, and SOC Analyst. Visit our Courses page to explore!',
  'pricing': 'Our plans: Basic ₹1,999 | Intermediate ₹5,999 | Advanced ₹19,999 | Course + Laptop ₹35,000. Visit /pricing for details!',
  'contact': 'Email: info@skillcoders.com | Phone: +91 9177331409 | Location: Vizag',
  'certificate': 'After completing your course, visit the Certificate page to download your certificate in PDF or PNG format.',
  'register': 'You can register as a student via Google, GitHub, or Phone OTP. School students (Class 5-10) can use our School Registration form.',
};

const ChatbotButton = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { id: 1, text: 'Hi! 👋 Welcome to Skill Coders. How can I help you today? Ask about courses, pricing, contact, certificate, or registration.', isBot: true },
  ]);
  const [input, setInput] = useState('');

  const handleSend = () => {
    if (!input.trim()) return;
    const userMsg: Message = { id: Date.now(), text: input, isBot: false };
    setMessages(prev => [...prev, userMsg]);

    const lower = input.toLowerCase();
    let reply = "Thanks for your message! For detailed queries, please contact us at info@skillcoders.com or call +91 9177331409.";
    for (const [key, value] of Object.entries(quickReplies)) {
      if (lower.includes(key)) { reply = value; break; }
    }

    setTimeout(() => {
      setMessages(prev => [...prev, { id: Date.now() + 1, text: reply, isBot: true }]);
    }, 500);
    setInput('');
  };

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            className="fixed bottom-24 right-6 z-50 w-80 max-h-[450px] bg-card border border-border rounded-2xl shadow-2xl flex flex-col overflow-hidden"
          >
            <div className="bg-primary/10 border-b border-border px-4 py-3 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <MessageCircle className="w-5 h-5 text-primary" />
                <span className="font-semibold text-sm">Skill Coders Support</span>
              </div>
              <button onClick={() => setIsOpen(false)} className="text-muted-foreground hover:text-foreground"><X className="w-4 h-4" /></button>
            </div>
            <div className="flex-1 overflow-y-auto p-3 space-y-3 min-h-[200px]">
              {messages.map((msg) => (
                <div key={msg.id} className={`flex ${msg.isBot ? 'justify-start' : 'justify-end'}`}>
                  <div className={`max-w-[85%] rounded-xl px-3 py-2 text-sm ${msg.isBot ? 'bg-muted text-foreground' : 'bg-primary text-primary-foreground'}`}>
                    {msg.text}
                  </div>
                </div>
              ))}
            </div>
            <div className="border-t border-border p-3 flex gap-2">
              <Input value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && handleSend()} placeholder="Type a message..." className="text-sm bg-background/50" />
              <button onClick={handleSend} className="p-2 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors">
                <Send className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-primary text-primary-foreground shadow-lg flex items-center justify-center hover:bg-primary/90 transition-colors"
      >
        {isOpen ? <X className="w-6 h-6" /> : <MessageCircle className="w-6 h-6" />}
      </motion.button>
    </>
  );
};

export default ChatbotButton;
