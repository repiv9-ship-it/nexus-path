import { useState } from 'react';
import { Zap, X, Mail, Lock, Eye, EyeOff, AlertCircle, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/hooks/useAuth';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialMode?: 'login' | 'signup';
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

function PasswordStrength({ password }: { password: string }) {
  const checks = [
    { label: '8+ characters', pass: password.length >= 8 },
    { label: 'Uppercase letter', pass: /[A-Z]/.test(password) },
    { label: 'Number', pass: /[0-9]/.test(password) },
  ];
  const strength = checks.filter(c => c.pass).length;
  return (
    <div className="space-y-2">
      <div className="flex gap-1">
        {[1, 2, 3].map(i => (
          <div key={i} className={`h-1.5 flex-1 rounded-full transition-colors ${
            i <= strength ? (strength === 3 ? 'bg-success' : strength === 2 ? 'bg-warning' : 'bg-destructive') : 'bg-muted'
          }`} />
        ))}
      </div>
      <div className="flex flex-wrap gap-x-3 gap-y-1">
        {checks.map(c => (
          <span key={c.label} className={`text-xs font-semibold ${c.pass ? 'text-success' : 'text-muted-foreground'}`}>
            {c.pass ? '✓' : '○'} {c.label}
          </span>
        ))}
      </div>
    </div>
  );
}

function InputField({ icon, type = 'text', placeholder, value, onChange, error, suffix }: {
  icon?: React.ReactNode; type?: string; placeholder: string; value: string;
  onChange: (v: string) => void; error?: string; suffix?: React.ReactNode;
}) {
  return (
    <div>
      <div className="relative">
        {icon && <div className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground">{icon}</div>}
        <input
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={e => onChange(e.target.value)}
          className={`w-full h-12 ${icon ? 'pl-11' : 'pl-4'} ${suffix ? 'pr-11' : 'pr-4'} rounded-xl border bg-background font-semibold text-sm transition-colors ${
            error ? 'border-destructive' : 'border-input focus:border-primary'
          }`}
        />
        {suffix && <div className="absolute right-4 top-1/2 -translate-y-1/2">{suffix}</div>}
      </div>
      {error && (
        <p className="text-destructive text-xs font-bold mt-1 flex items-center gap-1">
          <AlertCircle size={12} />{error}
        </p>
      )}
    </div>
  );
}

export function AuthModal({ isOpen, onClose, initialMode = 'signup' }: AuthModalProps) {
  const { signIn, signUp } = useAuth();
  const [mode, setMode] = useState<'login' | 'signup'>(initialMode);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const [signUpSuccess, setSignUpSuccess] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
  });

  if (!isOpen) return null;

  const updateField = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setErrors(prev => ({ ...prev, [field]: '' }));
    setServerError(null);
  };

  const resetToMode = (newMode: 'login' | 'signup') => {
    setMode(newMode);
    setErrors({});
    setServerError(null);
    setSignUpSuccess(false);
  };

  const handleLogin = async () => {
    const newErrors: Record<string, string> = {};
    if (!formData.email) newErrors.email = 'Email is required';
    else if (!validateEmail(formData.email)) newErrors.email = 'Enter a valid email address';
    if (!formData.password) newErrors.password = 'Password is required';
    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    setIsLoading(true);
    setServerError(null);
    const { error } = await signIn(formData.email, formData.password);
    setIsLoading(false);
    if (error) {
      setServerError(error);
    } else {
      onClose();
    }
  };

  const handleSignUp = async () => {
    const newErrors: Record<string, string> = {};
    if (!formData.firstName.trim()) newErrors.firstName = 'First name is required';
    if (!formData.email) newErrors.email = 'Email is required';
    else if (!validateEmail(formData.email)) newErrors.email = 'Enter a valid email address';
    if (!formData.password) newErrors.password = 'Password is required';
    else {
      const pw = validatePassword(formData.password);
      if (!pw.valid) newErrors.password = pw.message;
    }
    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    setIsLoading(true);
    setServerError(null);
    const { error } = await signUp(formData.email, formData.password, formData.firstName, formData.lastName);
    setIsLoading(false);
    if (error) {
      setServerError(error);
    } else {
      setSignUpSuccess(true);
    }
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

          {/* Sign Up Success */}
          {signUpSuccess && (
            <div className="space-y-5 text-center">
              <div className="w-16 h-16 bg-success/10 rounded-2xl flex items-center justify-center mx-auto">
                <Mail size={28} className="text-success" />
              </div>
              <h2 className="text-2xl font-black italic tracking-tighter">Check Your Email</h2>
              <p className="text-muted-foreground text-sm">
                We've sent a verification link to <strong className="text-foreground">{formData.email}</strong>. 
                Please click the link to activate your account.
              </p>
              <Button onClick={() => resetToMode('login')} className="w-full h-12 gradient-primary text-primary-foreground font-black rounded-xl">
                Back to Sign In
              </Button>
            </div>
          )}

          {/* LOGIN */}
          {!signUpSuccess && mode === 'login' && (
            <div className="space-y-5">
              <div className="text-center">
                <h2 className="text-2xl font-black italic tracking-tighter">Welcome Back</h2>
                <p className="text-muted-foreground text-sm mt-1">Sign in to continue your journey</p>
              </div>

              {serverError && (
                <div className="p-3 rounded-xl bg-destructive/10 border border-destructive/30 text-destructive text-sm font-semibold flex items-center gap-2">
                  <AlertCircle size={16} /> {serverError}
                </div>
              )}

              <div className="space-y-3">
                <InputField
                  icon={<Mail size={18} />}
                  type="email"
                  placeholder="Email Address"
                  value={formData.email}
                  onChange={v => updateField('email', v)}
                  error={errors.email}
                />
                <InputField
                  icon={<Lock size={18} />}
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Password"
                  value={formData.password}
                  onChange={v => updateField('password', v)}
                  error={errors.password}
                  suffix={
                    <button type="button" onClick={() => setShowPassword(!showPassword)} className="text-muted-foreground hover:text-foreground">
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  }
                />
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

          {/* SIGNUP */}
          {!signUpSuccess && mode === 'signup' && (
            <div className="space-y-5">
              <div className="text-center">
                <h2 className="text-2xl font-black italic tracking-tighter">Join UNILINGO</h2>
                <p className="text-muted-foreground text-sm mt-1">Create your account to start learning</p>
              </div>

              {serverError && (
                <div className="p-3 rounded-xl bg-destructive/10 border border-destructive/30 text-destructive text-sm font-semibold flex items-center gap-2">
                  <AlertCircle size={16} /> {serverError}
                </div>
              )}

              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <InputField
                    placeholder="First Name"
                    value={formData.firstName}
                    onChange={v => updateField('firstName', v)}
                    error={errors.firstName}
                  />
                  <InputField
                    placeholder="Last Name"
                    value={formData.lastName}
                    onChange={v => updateField('lastName', v)}
                  />
                </div>
                <InputField
                  icon={<Mail size={18} />}
                  type="email"
                  placeholder="Email Address"
                  value={formData.email}
                  onChange={v => updateField('email', v)}
                  error={errors.email}
                />
                <InputField
                  icon={<Lock size={18} />}
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Password"
                  value={formData.password}
                  onChange={v => updateField('password', v)}
                  error={errors.password}
                  suffix={
                    <button type="button" onClick={() => setShowPassword(!showPassword)} className="text-muted-foreground hover:text-foreground">
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  }
                />
                {formData.password && <PasswordStrength password={formData.password} />}
              </div>

              <Button
                onClick={handleSignUp}
                disabled={isLoading}
                className="w-full h-12 gradient-primary text-primary-foreground font-black rounded-xl shadow-lg"
              >
                {isLoading ? (
                  <span className="flex items-center gap-2">
                    <span className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                    Creating account...
                  </span>
                ) : 'Create Account'}
              </Button>

              <p className="text-center text-sm text-muted-foreground">
                Already have an account?{' '}
                <button onClick={() => resetToMode('login')} className="text-primary font-bold hover:underline">
                  Sign In
                </button>
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
