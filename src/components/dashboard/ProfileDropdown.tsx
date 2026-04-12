import { useState, useRef, useEffect } from 'react';
import { User, Settings, Key, LogOut, Shield, HelpCircle, ChevronRight } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';

export function ProfileDropdown() {
  const { user, signOut, updatePassword } = useAuth();
  const [open, setOpen] = useState(false);
  const [showResetPw, setShowResetPw] = useState(false);
  const [newPw, setNewPw] = useState('');
  const [confirmPw, setConfirmPw] = useState('');
  const [pwError, setPwError] = useState('');
  const [pwSuccess, setPwSuccess] = useState(false);
  const [pwLoading, setPwLoading] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
        setShowResetPw(false);
      }
    }
    if (open) document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [open]);

  if (!user) return null;

  const handleUpdatePassword = async () => {
    setPwError('');
    if (newPw.length < 8) { setPwError('Password must be at least 8 characters'); return; }
    if (newPw !== confirmPw) { setPwError('Passwords do not match'); return; }
    setPwLoading(true);
    const { error } = await updatePassword(newPw);
    setPwLoading(false);
    if (error) { setPwError(error); } else { setPwSuccess(true); setNewPw(''); setConfirmPw(''); }
  };

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => { setOpen(!open); setShowResetPw(false); setPwSuccess(false); }}
        className="hidden sm:block w-10 h-10 md:w-12 md:h-12 rounded-lg sm:rounded-xl gradient-primary p-0.5 shadow-lg hover:scale-105 transition-transform cursor-pointer"
      >
        <div className="w-full h-full rounded-[0.4rem] sm:rounded-[0.6rem] bg-card overflow-hidden flex items-center justify-center">
          <span className="font-black text-base sm:text-lg gradient-text">{user.name.charAt(0)}</span>
        </div>
      </button>

      {open && (
        <div className="absolute right-0 top-14 w-72 bg-card border border-border rounded-2xl shadow-2xl z-50 overflow-hidden animate-fade-in">
          {!showResetPw ? (
            <>
              <div className="p-4 border-b border-border">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 gradient-primary rounded-xl flex items-center justify-center text-primary-foreground font-black text-lg">
                    {user.name.charAt(0)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-sm truncate">{user.name}</p>
                    <p className="text-muted-foreground text-xs">{user.email}</p>
                    <p className="text-primary text-xs font-semibold capitalize">{user.activeRole.replace('_', ' ')}</p>
                  </div>
                </div>
              </div>

              <div className="p-2">
                {[
                  { icon: Key, label: 'Reset Password', desc: 'Change your password', action: () => setShowResetPw(true) },
                  { icon: Shield, label: 'Privacy & Security', desc: 'Data and permissions' },
                  { icon: HelpCircle, label: 'Help Center', desc: 'FAQs and guides' },
                ].map((item, i) => (
                  <button
                    key={i}
                    onClick={item.action || (() => {})}
                    className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-muted/50 transition-colors text-left group"
                  >
                    <div className="w-8 h-8 bg-muted rounded-lg flex items-center justify-center shrink-0 group-hover:bg-primary/10">
                      <item.icon size={15} className="text-muted-foreground group-hover:text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-sm">{item.label}</p>
                      <p className="text-muted-foreground text-xs">{item.desc}</p>
                    </div>
                    <ChevronRight size={14} className="text-muted-foreground" />
                  </button>
                ))}
              </div>

              <div className="border-t border-border p-2">
                <button
                  onClick={signOut}
                  className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-destructive/10 transition-colors text-left group"
                >
                  <div className="w-8 h-8 bg-destructive/10 rounded-lg flex items-center justify-center shrink-0">
                    <LogOut size={15} className="text-destructive" />
                  </div>
                  <p className="font-semibold text-sm text-destructive">Sign Out</p>
                </button>
              </div>
            </>
          ) : (
            <div className="p-5 space-y-4">
              <div className="flex items-center gap-2">
                <button onClick={() => { setShowResetPw(false); setPwError(''); setPwSuccess(false); }} className="w-7 h-7 rounded-lg bg-muted flex items-center justify-center hover:bg-muted/80">
                  <ChevronRight size={14} className="rotate-180" />
                </button>
                <h3 className="font-bold text-sm">Reset Password</h3>
              </div>
              {pwSuccess ? (
                <div className="p-3 rounded-xl bg-success/10 border border-success/30 text-success text-sm font-semibold">
                  Password updated successfully!
                </div>
              ) : (
                <div className="space-y-3">
                  <div>
                    <label className="text-xs font-semibold text-muted-foreground mb-1 block">New Password</label>
                    <input type="password" value={newPw} onChange={e => setNewPw(e.target.value)} className="w-full h-10 rounded-xl border border-input bg-background px-3 text-sm" placeholder="••••••••" />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-muted-foreground mb-1 block">Confirm New Password</label>
                    <input type="password" value={confirmPw} onChange={e => setConfirmPw(e.target.value)} className="w-full h-10 rounded-xl border border-input bg-background px-3 text-sm" placeholder="••••••••" />
                  </div>
                  {pwError && <p className="text-destructive text-xs font-bold">{pwError}</p>}
                  <button onClick={handleUpdatePassword} disabled={pwLoading} className="w-full gradient-primary text-primary-foreground h-10 rounded-xl font-bold text-sm">
                    {pwLoading ? 'Updating...' : 'Update Password'}
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
