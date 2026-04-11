import { useState } from 'react';
import { Building2, CheckCircle, XCircle, Clock, Mail, Users, ChevronRight, Plus, Search, UserPlus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

// ── User side: see invitations from universities ──
interface Invitation {
  id: string;
  university: string;
  logo: string;
  department: string;
  className: string;
  invitedAt: string;
  status: 'pending' | 'accepted' | 'declined';
}

const MOCK_INVITATIONS: Invitation[] = [
  { id: '1', university: 'ESPRIT', logo: 'E', department: 'Computer Science', className: 'ING2-A', invitedAt: '2026-04-08', status: 'pending' },
  { id: '2', university: 'ISG Tunis', logo: 'I', department: 'Business Administration', className: 'L2-Management', invitedAt: '2026-04-05', status: 'pending' },
  { id: '3', university: 'ENIT', logo: 'N', department: 'Engineering', className: 'ING3-B', invitedAt: '2026-03-20', status: 'accepted' },
];

export function UserInvitations() {
  const [invitations, setInvitations] = useState(MOCK_INVITATIONS);

  const handleAction = (id: string, action: 'accepted' | 'declined') => {
    setInvitations(prev => prev.map(inv => inv.id === id ? { ...inv, status: action } : inv));
  };

  const pending = invitations.filter(i => i.status === 'pending');
  const history = invitations.filter(i => i.status !== 'pending');

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-bold flex items-center gap-2">
          <Mail size={18} className="text-primary" /> University Invitations
        </h3>
        <p className="text-muted-foreground text-sm mt-1">
          Accept an invitation to access your university's courses, schedule, and resources.
        </p>
      </div>

      {pending.length > 0 && (
        <div className="space-y-3">
          <h4 className="font-semibold text-sm text-muted-foreground uppercase tracking-wider">Pending Invitations</h4>
          {pending.map(inv => (
            <div key={inv.id} className="glass-card p-4 rounded-xl flex flex-col sm:flex-row sm:items-center gap-4 border-primary/20">
              <div className="w-12 h-12 gradient-primary rounded-xl flex items-center justify-center text-primary-foreground font-black text-lg shrink-0">
                {inv.logo}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-bold text-base">{inv.university}</p>
                <p className="text-muted-foreground text-sm">{inv.department} · {inv.className}</p>
                <p className="text-muted-foreground text-xs mt-0.5">
                  Invited on {new Date(inv.invitedAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                </p>
              </div>
              <div className="flex gap-2 shrink-0">
                <Button
                  onClick={() => handleAction(inv.id, 'accepted')}
                  className="gradient-primary font-bold rounded-xl text-sm h-10 px-5"
                >
                  <CheckCircle size={15} className="mr-1.5" /> Accept
                </Button>
                <Button
                  variant="outline"
                  onClick={() => handleAction(inv.id, 'declined')}
                  className="font-semibold rounded-xl text-sm h-10"
                >
                  <XCircle size={15} className="mr-1.5" /> Decline
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      {pending.length === 0 && (
        <div className="glass-card p-8 rounded-xl text-center">
          <Mail size={32} className="mx-auto text-muted-foreground/30 mb-3" />
          <p className="font-semibold text-muted-foreground">No pending invitations</p>
          <p className="text-xs text-muted-foreground mt-1">When a university invites you, it will appear here.</p>
        </div>
      )}

      {history.length > 0 && (
        <div className="space-y-3">
          <h4 className="font-semibold text-sm text-muted-foreground uppercase tracking-wider">History</h4>
          {history.map(inv => (
            <div key={inv.id} className="glass-card p-3 rounded-xl flex items-center gap-3 opacity-75">
              <div className="w-9 h-9 bg-muted rounded-lg flex items-center justify-center font-bold text-sm">{inv.logo}</div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-sm">{inv.university}</p>
                <p className="text-muted-foreground text-xs">{inv.department} · {inv.className}</p>
              </div>
              <span className={`text-xs font-bold px-2 py-1 rounded-lg ${
                inv.status === 'accepted' ? 'bg-success/10 text-success' : 'bg-destructive/10 text-destructive'
              }`}>
                {inv.status === 'accepted' ? 'Accepted' : 'Declined'}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ── University side: add students ──
interface StudentEntry {
  id: string;
  name: string;
  email: string;
  className: string;
  status: 'invited' | 'active';
  invitedAt: string;
}

const MOCK_STUDENTS_UNI: StudentEntry[] = [
  { id: '1', name: 'Alice Chen', email: 'alice@unilinguo.com', className: 'ING2-A', status: 'active', invitedAt: '2026-03-01' },
  { id: '2', name: 'Bob Smith', email: 'bob@unilinguo.com', className: 'ING2-A', status: 'active', invitedAt: '2026-03-01' },
  { id: '3', name: 'Carol Davis', email: 'carol@unilinguo.com', className: 'ING2-B', status: 'invited', invitedAt: '2026-04-08' },
  { id: '4', name: 'David Lee', email: 'david@unilinguo.com', className: 'ING3-A', status: 'invited', invitedAt: '2026-04-09' },
];

const UNI_CLASSES = ['ING1-A', 'ING1-B', 'ING2-A', 'ING2-B', 'ING3-A', 'ING3-B'];

export function UniversityStudentManager() {
  const [students] = useState(MOCK_STUDENTS_UNI);
  const [showInvite, setShowInvite] = useState(false);
  const [search, setSearch] = useState('');
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteClass, setInviteClass] = useState('');

  const filtered = students.filter(s =>
    s.name.toLowerCase().includes(search.toLowerCase()) ||
    s.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h3 className="text-lg font-bold flex items-center gap-2">
            <Users size={18} className="text-primary" /> Student Management
          </h3>
          <p className="text-muted-foreground text-sm">Invite students by UniLingo ID or email and assign them to a class.</p>
        </div>
        <Button onClick={() => setShowInvite(!showInvite)} className="gradient-primary font-bold rounded-xl text-sm h-10">
          <UserPlus size={15} className="mr-1.5" /> Invite Student
        </Button>
      </div>

      {/* Invite Form */}
      {showInvite && (
        <div className="glass-card p-4 rounded-xl border-primary/20 space-y-3 animate-fade-in">
          <h4 className="font-bold text-sm">Send Invitation</h4>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="sm:col-span-1">
              <label className="text-xs font-semibold text-muted-foreground mb-1 block">UniLingo Email or ID</label>
              <Input value={inviteEmail} onChange={e => setInviteEmail(e.target.value)} placeholder="student@email.com" className="h-10 rounded-xl text-sm" />
            </div>
            <div>
              <label className="text-xs font-semibold text-muted-foreground mb-1 block">Assign to Class</label>
              <select
                value={inviteClass}
                onChange={e => setInviteClass(e.target.value)}
                className="w-full h-10 rounded-xl border border-input bg-background px-3 text-sm"
              >
                <option value="">Select class...</option>
                {UNI_CLASSES.map(c => <option key={c}>{c}</option>)}
              </select>
            </div>
            <div className="flex items-end">
              <Button className="gradient-primary font-bold rounded-xl text-sm h-10 w-full">
                <Mail size={14} className="mr-1.5" /> Send Invite
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Search */}
      <div className="relative">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
        <Input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search students..." className="pl-9 h-10 rounded-xl text-sm" />
      </div>

      {/* Student List */}
      <div className="space-y-2">
        {filtered.map(s => (
          <div key={s.id} className="glass-card p-3 rounded-xl flex items-center gap-3">
            <div className="w-9 h-9 gradient-primary rounded-lg flex items-center justify-center text-primary-foreground font-bold text-xs shrink-0">
              {s.name.split(' ').map(n => n[0]).join('')}
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-sm">{s.name}</p>
              <p className="text-muted-foreground text-xs">{s.email}</p>
            </div>
            <span className="text-xs font-semibold bg-muted px-2 py-1 rounded-lg">{s.className}</span>
            <span className={`text-xs font-bold px-2 py-1 rounded-lg ${
              s.status === 'active' ? 'bg-success/10 text-success' : 'bg-warning/10 text-warning'
            }`}>
              {s.status === 'active' ? 'Active' : 'Invited'}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
