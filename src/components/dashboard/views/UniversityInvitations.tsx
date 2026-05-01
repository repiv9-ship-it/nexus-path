import { useState } from 'react';
import { CheckCircle, XCircle, Mail, Building2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useMyInvitations } from '@/hooks/useSupabaseData';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';

export function UserInvitations() {
  const { refreshUser } = useAuth();
  const { data: invitations, loading, refetch } = useMyInvitations();
  const [busyId, setBusyId] = useState<string | null>(null);

  const handleAccept = async (id: string) => {
    setBusyId(id);
    const { error } = await supabase.rpc('accept_university_invitation', { _invitation_id: id });
    if (error) toast.error(error.message);
    else {
      toast.success('Invitation accepted');
      await refreshUser();
      await refetch();
    }
    setBusyId(null);
  };

  const handleDecline = async (id: string) => {
    setBusyId(id);
    const { error } = await supabase
      .from('university_invitations')
      .update({ status: 'declined', responded_at: new Date().toISOString() })
      .eq('id', id);
    if (error) toast.error(error.message);
    else {
      toast.success('Invitation declined');
      await refetch();
    }
    setBusyId(null);
  };

  const list = invitations || [];
  const pending = list.filter((i: any) => i.status === 'pending');
  const history = list.filter((i: any) => i.status !== 'pending');

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h3 className="text-lg font-bold flex items-center gap-2">
          <Mail size={18} className="text-primary" /> University Invitations
        </h3>
        <p className="text-muted-foreground text-sm mt-1">
          Accept an invitation to access your university's courses, schedule and resources.
        </p>
      </div>

      {loading ? (
        <div className="text-center py-12">
          <div className="animate-spin w-7 h-7 border-2 border-primary border-t-transparent rounded-full mx-auto" />
        </div>
      ) : (
        <>
          {pending.length > 0 ? (
            <div className="space-y-3">
              <h4 className="font-semibold text-xs text-muted-foreground uppercase tracking-wider">Pending</h4>
              {pending.map((inv: any) => (
                <div key={inv.id} className="glass-card p-4 rounded-xl flex flex-col sm:flex-row sm:items-center gap-4 border-primary/20">
                  <div className="w-12 h-12 gradient-primary rounded-xl flex items-center justify-center text-primary-foreground font-black text-lg shrink-0">
                    {inv.universities?.name?.charAt(0) || <Building2 size={20} />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-base">{inv.universities?.name || 'University'}</p>
                    <p className="text-muted-foreground text-sm">
                      {inv.role === 'professor' ? 'Professor' : inv.role === 'staff' ? 'Staff' : 'Student'}
                      {inv.classes?.name && ` · ${inv.classes.name}`}
                    </p>
                    <p className="text-muted-foreground text-xs mt-0.5">
                      Invited on {new Date(inv.created_at).toLocaleDateString()}
                    </p>
                    {inv.message && <p className="text-xs mt-1 italic">"{inv.message}"</p>}
                  </div>
                  <div className="flex gap-2 shrink-0">
                    <Button
                      onClick={() => handleAccept(inv.id)}
                      disabled={busyId === inv.id}
                      className="gradient-primary font-bold rounded-xl text-sm h-10 px-5"
                    >
                      <CheckCircle size={15} className="mr-1.5" /> Accept
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => handleDecline(inv.id)}
                      disabled={busyId === inv.id}
                      className="font-semibold rounded-xl text-sm h-10"
                    >
                      <XCircle size={15} className="mr-1.5" /> Decline
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="glass-card p-8 rounded-xl text-center">
              <Mail size={32} className="mx-auto text-muted-foreground/30 mb-3" />
              <p className="font-semibold text-muted-foreground">No pending invitations</p>
              <p className="text-xs text-muted-foreground mt-1">When a university invites you, it will appear here.</p>
            </div>
          )}

          {history.length > 0 && (
            <div className="space-y-3">
              <h4 className="font-semibold text-xs text-muted-foreground uppercase tracking-wider">History</h4>
              {history.map((inv: any) => (
                <div key={inv.id} className="glass-card p-3 rounded-xl flex items-center gap-3 opacity-75">
                  <div className="w-9 h-9 bg-muted rounded-lg flex items-center justify-center font-bold text-sm">
                    {inv.universities?.name?.charAt(0) || 'U'}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-sm">{inv.universities?.name}</p>
                    <p className="text-muted-foreground text-xs">
                      {inv.role}{inv.classes?.name && ` · ${inv.classes.name}`}
                    </p>
                  </div>
                  <span className={`text-xs font-bold px-2 py-1 rounded-lg ${
                    inv.status === 'accepted' ? 'bg-success/10 text-success' : 'bg-destructive/10 text-destructive'
                  }`}>
                    {inv.status}
                  </span>
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}
