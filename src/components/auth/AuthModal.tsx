import { useState } from 'react';
import { Zap, X, User, Mail, Lock, Building2, ChevronRight, ArrowLeft, GraduationCap, Eye, EyeOff, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ROLES, FIELDS, LEVELS } from '@/lib/constants';
import type { User as UserType } from '@/lib/constants';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAuth: (user: UserType) => void;
  initialMode?: 'login' | 'signup';
}

type Step = 'choice' | 'personal' | 'university' | 'welcome';
type JoinType = 'free' | 'invited' | 'professor' | 'university_admin';

interface FormErrors {
  name?: string;
  email?: string;
  password?: string;
  university?: string;
  field?: string;
  level?: string;
}

function validateEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function validatePassword(password: string): { valid: boolean; message: string } {
  if (password.length < 8) return { valid: false, message: 'At least 8 characters required' };
  if (!/[A-Z]/.test(password)) return { valid: false, message: 'Include at least one uppercase letter' };
  if (!/[0-9]/.test(password)) return { valid: false, message: 'Include at least one number' };
  return { valid: true, message: '' };
}

export function AuthModal({ isOpen, onClose, onAuth, initialMode = 'signup' }: AuthModalProps) {
  const [mode, setMode] = useState<'login' | 'signup'>(initialMode);
  const [step, setStep] = useState<Step>(initialMode === 'login' ? 'personal' : 'choice');
  const [joinType, setJoinType] = useState<JoinType | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});
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

  const validateLoginForm = (): boolean => {
    const newErrors: FormErrors = {};
    if (!formData.email) newErrors.email = 'Email is required';
    else if (!validateEmail(formData.email)) newErrors.email = 'Enter a valid email address';
    if (!formData.password) newErrors.password = 'Password is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validatePersonalForm = (): boolean => {
    const newErrors: FormErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.email) newErrors.email = 'Email is required';
    else if (!validateEmail(formData.email)) newErrors.email = 'Enter a valid email address';
    if (!formData.password) newErrors.password = 'Password is required';
    else {
      const pwResult = validatePassword(formData.password);
      if (!pwResult.valid) newErrors.password = pwResult.message;
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateUniversityForm = (): boolean => {
    const newErrors: FormErrors = {};
    if (!formData.university.trim()) newErrors.university = 'University name is required';
    if (!formData.field) newErrors.field = 'Select a field of study';
    if (!formData.level) newErrors.level = 'Select your level';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleLogin = async () => {
    if (!validateLoginForm()) return;
    setIsLoading(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    let role: string = ROLES.STUDENT;
    if (formData.email.includes('prof')) role = ROLES.PROFESSOR;
    else if (formData.email.includes('admin')) role = ROLES.UNIVERSITY_ADMIN;
    
    setIsLoading(false);
    onAuth({
      name: formData.email.split('@')[0],
      role,
      xp: 1240,
      streak: 12,
      gems: 350,
      university: 'MIT Tech-Nexus',
    });
  };

  const handlePersonalNext = () => {
    if (!validatePersonalForm()) return;
    if (joinType === 'invited') {
      setStep('university');
    } else {
      handleCreateAccount();
    }
  };

  const handleCreateAccount = async () => {
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1200));
    setIsLoading(false);
    setStep('welcome');
  };

  const handleUniversitySubmit = async () => {
    if (!validateUniversityForm()) return;
    await handleCreateAccount();
  };

  const handleComplete = () => {
    let role: string = ROLES.STUDENT;
    switch (joinType) {
      case 'professor': role = ROLES.PROFESSOR; break;
      case 'university_admin': role = ROLES.UNIVERSITY_ADMIN; break;
      case 'invited': role = ROLES.STUDENT; break;
      default: role = ROLES.GUEST;
    }
    onAuth({
      name: formData.name || 'New User',
      role,
      xp: 0,
      streak: 0,
      gems: 100,
      university: joinType !== 'free' ? formData.university || undefined : undefined,
    });
  };

  const updateField = (field: string, value: string) => {
    setFormData({ ...formData, [field]: value });
    if (errors[field as keyof FormErrors]) {
      setErrors({ ...errors, [field]: undefined });
    }
  };

  const resetToMode = (newMode: 'login' | 'signup') => {
    setMode(newMode);
    setStep(newMode === 'login' ? 'personal' : 'choice');
    setErrors({});
    setJoinType(null);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-background/80 backdrop-blur-sm" onClick={onClose} />

      <div className="relative w-full max-w-md bg-card rounded-2xl sm:rounded-3xl shadow-2xl border border-border overflow-hidden animate-scale-in max-h-[90vh] overflow-y-auto">
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 z-10 w-9 h-9 bg-muted rounded-lg flex items-center justify-center hover:bg-muted/80 transition-colors"
        >
          <X size={18} />
        </button>

        <div className="p-6 sm:p-8">
          {/* Logo */}
          <div className="flex justify-center mb-6">
            <div className="w-14 h-14 gradient-primary rounded-xl flex items-center justify-center glow-primary">
              <Zap className="text-primary-foreground fill-primary-foreground" size={28} />
            </div>
          </div>

          {/* LOGIN MODE */}
          {mode === 'login' && step === 'personal' && (
            <div className="space-y-5">
              <div className="text-center">
                <h2 className="text-2xl font-black italic tracking-tighter">Welcome Back</h2>
                <p className="text-muted-foreground text-sm mt-1">Sign in to continue your journey</p>
              </div>

              <div className="space-y-3">
                <InputField
                  icon={<Mail size={18} />}
                  type="email"
                  placeholder="Email Address"
                  value={formData.email}
                  onChange={(v) => updateField('email', v)}
                  error={errors.email}
                />
                <InputField
                  icon={<Lock size={18} />}
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Password"
                  value={formData.password}
                  onChange={(v) => updateField('password', v)}
                  error={errors.password}
                  suffix={
                    <button type="button" onClick={() => setShowPassword(!showPassword)} className="text-muted-foreground hover:text-foreground transition-colors">
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  }
                />
              </div>

              <div className="text-right">
                <button className="text-xs font-bold text-primary hover:underline">
                  Forgot password?
                </button>
              </div>

              <Button 
                onClick={handleLogin}
                disabled={isLoading}
                className="w-full h-12 gradient-primary text-primary-foreground font-black rounded-xl shadow-lg"
              >
                {isLoading ? (
                  <span className="flex items-center gap-2">
                    <span className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                    Signing in...
                  </span>
                ) : 'Sign In'}
              </Button>

              <p className="text-center text-sm text-muted-foreground">
                Don't have an account?{' '}
                <button onClick={() => resetToMode('signup')} className="text-primary font-bold hover:underline">
                  Sign Up
                </button>
              </p>
            </div>
          )}

          {/* SIGNUP - CHOICE */}
          {mode === 'signup' && step === 'choice' && (
            <div className="space-y-5">
              <div className="text-center">
                <h2 className="text-2xl font-black italic tracking-tighter">Join UNILINGO</h2>
                <p className="text-muted-foreground text-sm mt-1">Choose how you want to join</p>
              </div>

              <div className="space-y-2.5">
                {[
                  { type: 'free' as JoinType, icon: User, title: 'Free User', desc: 'Access free courses', borderHover: 'hover:border-primary' },
                  { type: 'invited' as JoinType, icon: Building2, title: 'University Student', desc: 'Enrolled at a university', borderHover: 'hover:border-primary' },
                  { type: 'professor' as JoinType, icon: GraduationCap, title: 'Professor', desc: 'Create and manage courses', borderHover: 'hover:border-secondary' },
                  { type: 'university_admin' as JoinType, icon: Building2, title: 'University Admin', desc: 'Manage your institution', borderHover: 'hover:border-warning' },
                ].map((option) => (
                  <button
                    key={option.type}
                    onClick={() => { setJoinType(option.type); setStep('personal'); }}
                    className={`w-full p-4 rounded-xl border-2 border-border ${option.borderHover} bg-card text-left transition-all group`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-muted rounded-lg flex items-center justify-center group-hover:gradient-primary transition-all">
                        <option.icon className="text-muted-foreground group-hover:text-primary-foreground transition-colors" size={20} />
                      </div>
                      <div className="flex-1">
                        <p className="font-black text-sm">{option.title}</p>
                        <p className="text-xs text-muted-foreground">{option.desc}</p>
                      </div>
                      <ChevronRight className="text-muted-foreground group-hover:text-primary" size={18} />
                    </div>
                  </button>
                ))}
              </div>

              <p className="text-center text-sm text-muted-foreground">
                Already have an account?{' '}
                <button onClick={() => resetToMode('login')} className="text-primary font-bold hover:underline">
                  Sign In
                </button>
              </p>
            </div>
          )}

          {/* SIGNUP - PERSONAL INFO */}
          {mode === 'signup' && step === 'personal' && (
            <div className="space-y-5">
              <button 
                onClick={() => setStep('choice')}
                className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
              >
                <ArrowLeft size={16} />
                <span className="text-sm font-bold">Back</span>
              </button>

              <div className="text-center">
                <h2 className="text-2xl font-black italic tracking-tighter">Create Account</h2>
                <p className="text-muted-foreground text-sm mt-1">Enter your information</p>
              </div>

              <div className="space-y-3">
                <InputField
                  icon={<User size={18} />}
                  placeholder="Full Name"
                  value={formData.name}
                  onChange={(v) => updateField('name', v)}
                  error={errors.name}
                />
                <InputField
                  icon={<Mail size={18} />}
                  type="email"
                  placeholder="Email Address"
                  value={formData.email}
                  onChange={(v) => updateField('email', v)}
                  error={errors.email}
                />
                <InputField
                  icon={<Lock size={18} />}
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Password"
                  value={formData.password}
                  onChange={(v) => updateField('password', v)}
                  error={errors.password}
                  suffix={
                    <button type="button" onClick={() => setShowPassword(!showPassword)} className="text-muted-foreground hover:text-foreground transition-colors">
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  }
                />
                {formData.password && (
                  <PasswordStrength password={formData.password} />
                )}
              </div>

              <Button 
                onClick={handlePersonalNext}
                disabled={isLoading}
                className="w-full h-12 gradient-primary text-primary-foreground font-black rounded-xl shadow-lg"
              >
                {isLoading ? (
                  <span className="flex items-center gap-2">
                    <span className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                    Creating account...
                  </span>
                ) : (
                  <>
                    {joinType === 'invited' ? 'Continue' : 'Create Account'}
                    <ChevronRight size={18} className="ml-2" />
                  </>
                )}
              </Button>
            </div>
          )}

          {/* SIGNUP - UNIVERSITY INFO */}
          {mode === 'signup' && step === 'university' && (
            <div className="space-y-5">
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

              <div className="space-y-3">
                <InputField
                  placeholder="University Name"
                  value={formData.university}
                  onChange={(v) => updateField('university', v)}
                  error={errors.university}
                />
                <div>
                  <select
                    value={formData.field}
                    onChange={(e) => updateField('field', e.target.value)}
                    className={`w-full h-12 px-4 rounded-xl border bg-background font-bold text-sm ${errors.field ? 'border-destructive' : 'border-input'}`}
                  >
                    <option value="">Select Field of Study</option>
                    {FIELDS.map(f => <option key={f} value={f}>{f}</option>)}
                  </select>
                  {errors.field && <p className="text-destructive text-xs font-bold mt-1 flex items-center gap-1"><AlertCircle size={12} />{errors.field}</p>}
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <select
                      value={formData.level}
                      onChange={(e) => updateField('level', e.target.value)}
                      className={`w-full h-12 px-4 rounded-xl border bg-background font-bold text-sm ${errors.level ? 'border-destructive' : 'border-input'}`}
                    >
                      <option value="">Level</option>
                      {LEVELS.map(l => <option key={l} value={l}>{l}</option>)}
                    </select>
                    {errors.level && <p className="text-destructive text-xs font-bold mt-1 flex items-center gap-1"><AlertCircle size={12} />{errors.level}</p>}
                  </div>
                  <Input 
                    placeholder="Group (optional)"
                    className="h-12 rounded-xl font-bold"
                    value={formData.group}
                    onChange={(e) => updateField('group', e.target.value)}
                  />
                </div>
              </div>

              <Button 
                onClick={handleUniversitySubmit}
                disabled={isLoading}
                className="w-full h-12 gradient-primary text-primary-foreground font-black rounded-xl shadow-lg"
              >
                {isLoading ? (
                  <span className="flex items-center gap-2">
                    <span className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                    Creating account...
                  </span>
                ) : (
                  <>Complete Registration<ChevronRight size={18} className="ml-2" /></>
                )}
              </Button>
            </div>
          )}

          {/* WELCOME SCREEN */}
          {step === 'welcome' && (
            <div className="space-y-5 text-center">
              <div className="w-20 h-20 mx-auto gradient-primary rounded-2xl flex items-center justify-center glow-primary animate-pulse-glow">
                <Zap className="text-primary-foreground fill-primary-foreground" size={40} />
              </div>

              <div>
                <h2 className="text-2xl font-black italic tracking-tighter">Welcome, {formData.name}!</h2>
                <p className="text-muted-foreground mt-1 text-sm">
                  {joinType === 'professor' ? 'Your teaching journey begins now' : 
                   joinType === 'university_admin' ? 'Ready to manage your institution' :
                   'Your learning adventure starts here'}
                </p>
              </div>

              <div className="glass-card p-5 rounded-xl text-left space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 bg-success/10 rounded-lg flex items-center justify-center text-success font-bold text-sm">✓</div>
                  <p className="font-bold text-sm">Account created successfully</p>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 bg-warning/10 rounded-lg flex items-center justify-center text-sm">🎯</div>
                  <p className="font-bold text-sm">
                    {joinType === 'professor' ? 'Course creation tools unlocked' : 
                     joinType === 'university_admin' ? 'Admin dashboard ready' :
                     'Achievement system activated'}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 bg-primary/10 rounded-lg flex items-center justify-center text-sm">💎</div>
                  <p className="font-bold text-sm">100 welcome gems awarded</p>
                </div>
              </div>

              <Button 
                onClick={handleComplete}
                className="w-full h-12 gradient-primary text-primary-foreground font-black rounded-xl shadow-lg"
              >
                Go to Dashboard
                <ChevronRight size={18} className="ml-2" />
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// Reusable Input Component
function InputField({ 
  icon, type = 'text', placeholder, value, onChange, error, suffix 
}: { 
  icon?: React.ReactNode; 
  type?: string; 
  placeholder: string; 
  value: string; 
  onChange: (v: string) => void; 
  error?: string;
  suffix?: React.ReactNode;
}) {
  return (
    <div>
      <div className="relative">
        {icon && (
          <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground">{icon}</div>
        )}
        <Input 
          type={type}
          placeholder={placeholder}
          className={`${icon ? 'pl-11' : ''} ${suffix ? 'pr-11' : ''} h-12 rounded-xl font-bold ${error ? 'border-destructive focus-visible:ring-destructive' : ''}`}
          value={value}
          onChange={(e) => onChange(e.target.value)}
        />
        {suffix && (
          <div className="absolute right-3.5 top-1/2 -translate-y-1/2">{suffix}</div>
        )}
      </div>
      {error && (
        <p className="text-destructive text-xs font-bold mt-1 flex items-center gap-1">
          <AlertCircle size={12} />{error}
        </p>
      )}
    </div>
  );
}

// Password Strength Indicator
function PasswordStrength({ password }: { password: string }) {
  const checks = [
    { label: '8+ characters', met: password.length >= 8 },
    { label: 'Uppercase letter', met: /[A-Z]/.test(password) },
    { label: 'Number', met: /[0-9]/.test(password) },
  ];
  const strength = checks.filter(c => c.met).length;
  
  return (
    <div className="space-y-2">
      <div className="flex gap-1">
        {[1, 2, 3].map((level) => (
          <div
            key={level}
            className={`h-1 flex-1 rounded-full transition-all ${
              strength >= level 
                ? strength === 1 ? 'bg-destructive' : strength === 2 ? 'bg-warning' : 'bg-success'
                : 'bg-muted'
            }`}
          />
        ))}
      </div>
      <div className="flex flex-wrap gap-x-3 gap-y-0.5">
        {checks.map((check, i) => (
          <span key={i} className={`text-[10px] font-bold ${check.met ? 'text-success' : 'text-muted-foreground'}`}>
            {check.met ? '✓' : '○'} {check.label}
          </span>
        ))}
      </div>
    </div>
  );
}
