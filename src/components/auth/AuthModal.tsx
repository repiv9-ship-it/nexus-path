import { useState } from 'react';
import { Zap, X, User, Mail, Lock, Building2, ChevronRight, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { XPBar } from '@/components/ui/xp-bar';
import type { User as UserType } from '@/lib/constants';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAuth: (user: UserType) => void;
  initialMode?: 'login' | 'signup';
}

type Step = 'choice' | 'personal' | 'university' | 'welcome';

export function AuthModal({ isOpen, onClose, onAuth, initialMode = 'signup' }: AuthModalProps) {
  const [mode, setMode] = useState<'login' | 'signup'>(initialMode);
  const [step, setStep] = useState<Step>(initialMode === 'login' ? 'personal' : 'choice');
  const [joinType, setJoinType] = useState<'free' | 'invited' | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    university: '',
    field: '',
    level: '',
    group: '',
  });

  if (!isOpen) return null;

  const handleSubmit = () => {
    if (mode === 'login') {
      onAuth({
        name: formData.name || 'Student',
        role: 'Vanguard',
        xp: 1240,
        streak: 12,
        gems: 350,
      });
    } else {
      setStep('welcome');
    }
  };

  const handleComplete = () => {
    onAuth({
      name: formData.name || 'New Vanguard',
      role: joinType === 'invited' ? 'Vanguard' : 'Wanderer',
      xp: 0,
      streak: 0,
      gems: 100,
    });
  };

  const stepIndex = ['choice', 'personal', 'university', 'welcome'].indexOf(step);
  const totalSteps = joinType === 'invited' ? 4 : 3;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-sidebar/90 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative w-full max-w-md bg-card rounded-4xl shadow-2xl overflow-hidden animate-scale-in">
        {/* Close Button */}
        <button 
          onClick={onClose}
          className="absolute top-6 right-6 z-10 w-10 h-10 bg-muted rounded-xl flex items-center justify-center hover:bg-muted/80 transition-colors"
        >
          <X size={20} />
        </button>

        {/* Progress Bar (signup only) */}
        {mode === 'signup' && step !== 'welcome' && (
          <div className="p-6 pb-0">
            <XPBar progress={(stepIndex / (totalSteps - 1)) * 100} size="sm" />
            <p className="text-xs font-bold text-muted-foreground mt-2 uppercase tracking-widest">
              Step {stepIndex + 1} of {totalSteps}
            </p>
          </div>
        )}

        <div className="p-8">
          {/* Logo */}
          <div className="flex justify-center mb-8">
            <div className="w-16 h-16 gradient-primary rounded-2xl flex items-center justify-center glow-primary">
              <Zap className="text-primary-foreground fill-primary-foreground" size={32} />
            </div>
          </div>

          {/* Login Mode */}
          {mode === 'login' && (
            <div className="space-y-6">
              <div className="text-center">
                <h2 className="text-2xl font-black italic tracking-tighter">Welcome Back, Vanguard</h2>
                <p className="text-muted-foreground text-sm mt-1">Enter the Nexus</p>
              </div>

              <div className="space-y-4">
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
                  <Input 
                    type="email"
                    placeholder="Email Address"
                    className="pl-12 h-14 rounded-xl font-bold"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  />
                </div>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
                  <Input 
                    type="password"
                    placeholder="Secret Key"
                    className="pl-12 h-14 rounded-xl font-bold"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  />
                </div>
              </div>

              <Button 
                onClick={handleSubmit}
                className="w-full h-14 gradient-primary text-primary-foreground font-black rounded-xl shadow-xl"
              >
                Enter the Nexus
              </Button>

              <p className="text-center text-sm text-muted-foreground">
                Don't have an account?{' '}
                <button 
                  onClick={() => { setMode('signup'); setStep('choice'); }}
                  className="text-primary font-bold hover:underline"
                >
                  Sign Up
                </button>
              </p>
            </div>
          )}

          {/* Signup - Step 1: Choice */}
          {mode === 'signup' && step === 'choice' && (
            <div className="space-y-6">
              <div className="text-center">
                <h2 className="text-2xl font-black italic tracking-tighter">Initiate Protocol</h2>
                <p className="text-muted-foreground text-sm mt-1">Choose your path</p>
              </div>

              <div className="space-y-4">
                <button
                  onClick={() => { setJoinType('free'); setStep('personal'); }}
                  className="w-full p-6 rounded-2xl border-2 border-border hover:border-primary bg-card text-left transition-all group"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-muted rounded-xl flex items-center justify-center group-hover:gradient-primary transition-all">
                      <User className="group-hover:text-primary-foreground" size={24} />
                    </div>
                    <div className="flex-1">
                      <p className="font-black">I'm a Free User</p>
                      <p className="text-sm text-muted-foreground">Access free courses</p>
                    </div>
                    <ChevronRight className="text-muted-foreground group-hover:text-primary" />
                  </div>
                </button>

                <button
                  onClick={() => { setJoinType('invited'); setStep('personal'); }}
                  className="w-full p-6 rounded-2xl border-2 border-border hover:border-primary bg-card text-left transition-all group"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-muted rounded-xl flex items-center justify-center group-hover:gradient-primary transition-all">
                      <Building2 className="group-hover:text-primary-foreground" size={24} />
                    </div>
                    <div className="flex-1">
                      <p className="font-black">I Was Invited by a University</p>
                      <p className="text-sm text-muted-foreground">Enter invitation code</p>
                    </div>
                    <ChevronRight className="text-muted-foreground group-hover:text-primary" />
                  </div>
                </button>
              </div>

              <p className="text-center text-sm text-muted-foreground">
                Already enrolled?{' '}
                <button 
                  onClick={() => { setMode('login'); setStep('personal'); }}
                  className="text-primary font-bold hover:underline"
                >
                  Log In
                </button>
              </p>
            </div>
          )}

          {/* Signup - Step 2: Personal Info */}
          {mode === 'signup' && step === 'personal' && (
            <div className="space-y-6">
              <button 
                onClick={() => setStep('choice')}
                className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
              >
                <ArrowLeft size={16} />
                <span className="text-sm font-bold">Back</span>
              </button>

              <div className="text-center">
                <h2 className="text-2xl font-black italic tracking-tighter">Personal Info</h2>
                <p className="text-muted-foreground text-sm mt-1">Tell us about yourself</p>
              </div>

              <div className="space-y-4">
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
                  <Input 
                    placeholder="Your Codename"
                    className="pl-12 h-14 rounded-xl font-bold"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  />
                </div>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
                  <Input 
                    type="email"
                    placeholder="Email Address"
                    className="pl-12 h-14 rounded-xl font-bold"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  />
                </div>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
                  <Input 
                    type="password"
                    placeholder="Create Secret Key"
                    className="pl-12 h-14 rounded-xl font-bold"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  />
                </div>
              </div>

              <Button 
                onClick={() => joinType === 'invited' ? setStep('university') : handleSubmit()}
                className="w-full h-14 gradient-primary text-primary-foreground font-black rounded-xl shadow-xl"
              >
                {joinType === 'invited' ? 'Continue' : 'Create Account'}
                <ChevronRight size={18} className="ml-2" />
              </Button>
            </div>
          )}

          {/* Signup - Step 3: University Info (invited only) */}
          {mode === 'signup' && step === 'university' && (
            <div className="space-y-6">
              <button 
                onClick={() => setStep('personal')}
                className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
              >
                <ArrowLeft size={16} />
                <span className="text-sm font-bold">Back</span>
              </button>

              <div className="text-center">
                <h2 className="text-2xl font-black italic tracking-tighter">University Details</h2>
                <p className="text-muted-foreground text-sm mt-1">Link your academic profile</p>
              </div>

              <div className="space-y-4">
                <Input 
                  placeholder="University Name"
                  className="h-14 rounded-xl font-bold"
                  value={formData.university}
                  onChange={(e) => setFormData({ ...formData, university: e.target.value })}
                />
                <Input 
                  placeholder="Field / Filière"
                  className="h-14 rounded-xl font-bold"
                  value={formData.field}
                  onChange={(e) => setFormData({ ...formData, field: e.target.value })}
                />
                <div className="grid grid-cols-2 gap-4">
                  <Input 
                    placeholder="Level (L1, L2...)"
                    className="h-14 rounded-xl font-bold"
                    value={formData.level}
                    onChange={(e) => setFormData({ ...formData, level: e.target.value })}
                  />
                  <Input 
                    placeholder="Group"
                    className="h-14 rounded-xl font-bold"
                    value={formData.group}
                    onChange={(e) => setFormData({ ...formData, group: e.target.value })}
                  />
                </div>
              </div>

              <Button 
                onClick={handleSubmit}
                className="w-full h-14 gradient-primary text-primary-foreground font-black rounded-xl shadow-xl"
              >
                Complete Registration
                <ChevronRight size={18} className="ml-2" />
              </Button>
            </div>
          )}

          {/* Welcome Screen */}
          {step === 'welcome' && (
            <div className="space-y-6 text-center">
              <div className="w-24 h-24 mx-auto gradient-primary rounded-3xl flex items-center justify-center glow-primary animate-pulse-glow">
                <Zap className="text-primary-foreground fill-primary-foreground" size={48} />
              </div>

              <div>
                <h2 className="text-3xl font-black italic tracking-tighter">Welcome, {formData.name || 'Vanguard'}!</h2>
                <p className="text-muted-foreground mt-2">Your journey begins now</p>
              </div>

              <div className="glass-card p-6 rounded-2xl text-left space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-success/10 rounded-xl flex items-center justify-center text-success">✓</div>
                  <p className="font-bold">XP Bar activated</p>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-warning/10 rounded-xl flex items-center justify-center">🏆</div>
                  <p className="font-bold">Badges unlocked</p>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center">💎</div>
                  <p className="font-bold">100 starter gems</p>
                </div>
              </div>

              <Button 
                onClick={handleComplete}
                className="w-full h-14 gradient-primary text-primary-foreground font-black rounded-xl shadow-xl"
              >
                Enter Dashboard
                <ChevronRight size={18} className="ml-2" />
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
