import { useState } from 'react';
import { MessageCircle, X, Send, Minimize2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'support';
  time: string;
}

const INITIAL_MESSAGES: Message[] = [
  { id: '1', text: "Hi there! 👋 Welcome to UniLingo support. How can we help you today?", sender: 'support', time: '10:00' },
];

export function SupportChatBubble() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>(INITIAL_MESSAGES);
  const [input, setInput] = useState('');

  const handleSend = () => {
    if (!input.trim()) return;
    const userMsg: Message = { id: Date.now().toString(), text: input, sender: 'user', time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    
    // Auto-reply after a short delay
    setTimeout(() => {
      const reply: Message = {
        id: (Date.now() + 1).toString(),
        text: "Thanks for reaching out! Our team will get back to you shortly. In the meantime, feel free to browse our FAQ section.",
        sender: 'support',
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages(prev => [...prev, reply]);
    }, 1200);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {isOpen && (
        <div className="mb-3 w-80 sm:w-96 bg-card border border-border rounded-2xl shadow-2xl overflow-hidden animate-fade-in">
          {/* Header */}
          <div className="gradient-primary px-4 py-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-primary-foreground/20 rounded-full flex items-center justify-center">
                <MessageCircle size={16} className="text-primary-foreground" />
              </div>
              <div>
                <p className="text-primary-foreground font-bold text-sm">UniLingo Support</p>
                <p className="text-primary-foreground/70 text-xs">We typically reply in minutes</p>
              </div>
            </div>
            <button onClick={() => setIsOpen(false)} className="text-primary-foreground/70 hover:text-primary-foreground">
              <Minimize2 size={16} />
            </button>
          </div>

          {/* Messages */}
          <div className="h-72 overflow-y-auto p-4 space-y-3 bg-background/50">
            {messages.map(msg => (
              <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[80%] px-3 py-2 rounded-2xl ${
                  msg.sender === 'user'
                    ? 'gradient-primary text-primary-foreground rounded-br-md'
                    : 'bg-muted text-foreground rounded-bl-md'
                }`}>
                  <p className="text-sm leading-relaxed">{msg.text}</p>
                  <p className={`text-[10px] mt-1 ${msg.sender === 'user' ? 'text-primary-foreground/60' : 'text-muted-foreground'}`}>{msg.time}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Input */}
          <div className="p-3 border-t border-border flex gap-2">
            <Input
              placeholder="Type a message..."
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleSend()}
              className="h-10 rounded-xl text-sm"
            />
            <Button onClick={handleSend} size="icon" className="gradient-primary h-10 w-10 rounded-xl shrink-0">
              <Send size={16} />
            </Button>
          </div>
        </div>
      )}

      {/* Floating button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-14 h-14 gradient-primary rounded-full flex items-center justify-center shadow-xl hover:scale-110 transition-transform glow-primary"
      >
        {isOpen ? <X size={22} className="text-primary-foreground" /> : <MessageCircle size={22} className="text-primary-foreground" />}
      </button>
    </div>
  );
}
