import { useState } from 'react';
import { Building2, Users, BookOpen, BarChart3, CreditCard, Headphones, Layout, Tag, CheckCircle2, XCircle, Clock, Eye, MessageSquare, Send, ChevronRight, ArrowLeft, Search, Plus, DollarSign, TrendingUp, AlertTriangle, Shield, Percent } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';
import { useUniversities, useCourseSubmissions, useAllSupportTickets, usePlatformBanners, usePlatformDiscounts, usePlatformPayouts, useProfiles } from '@/hooks/useSupabaseData';
import { supabase } from '@/integrations/supabase/client';

interface SuperAdminDashboardProps {
  activeSection: string;
}

const statusColors: Record<string, string> = {
  active: 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20',
  pending: 'bg-amber-500/10 text-amber-500 border-amber-500/20',
  suspended: 'bg-destructive/10 text-destructive border-destructive/20',
  approved: 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20',
  rejected: 'bg-destructive/10 text-destructive border-destructive/20',
  open: 'bg-amber-500/10 text-amber-500 border-amber-500/20',
  resolved: 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20',
};

const priorityColors: Record<string, string> = {
  urgent: 'bg-destructive/10 text-destructive border-destructive/20',
  high: 'bg-orange-500/10 text-orange-500 border-orange-500/20',
  normal: 'bg-primary/10 text-primary border-primary/20',
  low: 'bg-muted text-muted-foreground border-border',
};

export function SuperAdminDashboard({ activeSection }: SuperAdminDashboardProps) {
  const { data: universities } = useUniversities();
  const { data: submissions } = useCourseSubmissions();
  const { data: tickets } = useAllSupportTickets();
  const { data: banners } = usePlatformBanners();
  const { data: discounts } = usePlatformDiscounts();
  const { data: payouts } = usePlatformPayouts();
  const { data: allProfiles } = useProfiles();

  const [selectedUniId, setSelectedUniId] = useState<string | null>(null);
  const [selectedSubmission, setSelectedSubmission] = useState<any>(null);
  const [selectedTicket, setSelectedTicket] = useState<any>(null);
  const [ticketReply, setTicketReply] = useState('');
  const [rejectionReason, setRejectionReason] = useState('');
  const [rejectionDialog, setRejectionDialog] = useState(false);

  const unis = universities || [];
  const subs = submissions || [];
  const tix = tickets || [];
  const totalStudents = (allProfiles || []).length;
  const activeUnis = unis.filter((u: any) => u.status === 'active').length;
  const pendingSubmissions = subs.filter((s: any) => s.status === 'pending').length;
  const openTickets = tix.filter((t: any) => t.status === 'open').length;

  const selectedUni = unis.find((u: any) => u.id === selectedUniId);

  const handleApproveSubmission = async (id: string) => {
    await supabase.from('course_submissions').update({ status: 'approved', reviewed_at: new Date().toISOString() }).eq('id', id);
    toast.success('Course approved');
    setSelectedSubmission(null);
  };

  const handleRejectSubmission = async (id: string) => {
    await supabase.from('course_submissions').update({ status: 'rejected', rejection_reason: rejectionReason, reviewed_at: new Date().toISOString() }).eq('id', id);
    toast.success('Course rejected');
    setSelectedSubmission(null);
    setRejectionDialog(false);
    setRejectionReason('');
  };

  const handleReplyTicket = async (ticketId: string) => {
    if (!ticketReply.trim()) return;
    const { data: { user: authUser } } = await supabase.auth.getUser();
    if (!authUser) return;
    await supabase.from('ticket_replies').insert({ ticket_id: ticketId, author_id: authUser.id, author_role: 'super_admin', message: ticketReply });
    toast.success('Reply sent');
    setTicketReply('');
  };

  // ──── OVERVIEW ────
  if (activeSection === 'super_admin' || activeSection === 'sa_analytics') {
    return (
      <div className="space-y-8 animate-fade-in">
        <div>
          <h1 className="text-3xl font-black tracking-tight">Command Center</h1>
          <p className="text-muted-foreground mt-1">Platform overview and key metrics</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label: 'Active Universities', value: activeUnis, icon: Building2, color: 'text-primary', bg: 'bg-primary/10' },
            { label: 'Total Users', value: totalStudents, icon: Users, color: 'text-blue-500', bg: 'bg-blue-500/10' },
            { label: 'Pending Courses', value: pendingSubmissions, icon: BookOpen, color: 'text-amber-500', bg: 'bg-amber-500/10' },
            { label: 'Open Tickets', value: openTickets, icon: Headphones, color: 'text-destructive', bg: 'bg-destructive/10' },
          ].map(s => (
            <Card key={s.label} className="border-border/50">
              <CardContent className="p-5">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider">{s.label}</p>
                    <p className="text-2xl font-black mt-1">{s.value}</p>
                  </div>
                  <div className={`w-12 h-12 rounded-xl ${s.bg} flex items-center justify-center`}>
                    <s.icon className={s.color} size={22} />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card className="border-border/50">
            <CardHeader className="pb-3"><CardTitle className="text-base font-black flex items-center gap-2"><Clock size={16} className="text-amber-500" /> Pending Review</CardTitle></CardHeader>
            <CardContent className="space-y-3">
              {subs.filter((s: any) => s.status === 'pending').slice(0, 5).map((s: any) => (
                <div key={s.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                  <div><p className="font-bold text-sm">{s.title}</p><p className="text-xs text-muted-foreground">{s.instructor_name}</p></div>
                  <Button size="sm" variant="outline" onClick={() => setSelectedSubmission(s)}><Eye size={14} className="mr-1" /> Review</Button>
                </div>
              ))}
              {pendingSubmissions === 0 && <p className="text-sm text-muted-foreground text-center py-4">No pending submissions</p>}
            </CardContent>
          </Card>

          <Card className="border-border/50">
            <CardHeader className="pb-3"><CardTitle className="text-base font-black flex items-center gap-2"><Headphones size={16} className="text-destructive" /> Open Tickets</CardTitle></CardHeader>
            <CardContent className="space-y-3">
              {tix.filter((t: any) => t.status === 'open').slice(0, 5).map((t: any) => (
                <div key={t.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                  <div><p className="font-bold text-sm">{t.subject}</p><p className="text-xs text-muted-foreground">{t.universities?.name || 'User'}</p></div>
                  <Button size="sm" variant="outline" onClick={() => setSelectedTicket(t)}><MessageSquare size={14} className="mr-1" /> View</Button>
                </div>
              ))}
              {openTickets === 0 && <p className="text-sm text-muted-foreground text-center py-4">No open tickets</p>}
            </CardContent>
          </Card>
        </div>

        {/* Submission review dialog */}
        {selectedSubmission && (
          <Dialog open={!!selectedSubmission} onOpenChange={() => setSelectedSubmission(null)}>
            <DialogContent className="max-w-lg">
              <DialogHeader><DialogTitle>{selectedSubmission.title}</DialogTitle></DialogHeader>
              <div className="space-y-3">
                <p className="text-sm text-muted-foreground">{selectedSubmission.description}</p>
                <div className="flex gap-2 flex-wrap text-xs">
                  <Badge variant="outline">{selectedSubmission.category}</Badge>
                  <Badge variant="outline">{selectedSubmission.price} DT</Badge>
                  {selectedSubmission.instructor_name && <Badge variant="outline">{selectedSubmission.instructor_name}</Badge>}
                </div>
              </div>
              <DialogFooter className="gap-2">
                <Button variant="destructive" size="sm" onClick={() => setRejectionDialog(true)}>Reject</Button>
                <Button size="sm" className="bg-emerald-600 hover:bg-emerald-700" onClick={() => handleApproveSubmission(selectedSubmission.id)}>Approve</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        )}

        {/* Rejection dialog */}
        <Dialog open={rejectionDialog} onOpenChange={setRejectionDialog}>
          <DialogContent>
            <DialogHeader><DialogTitle>Rejection Reason</DialogTitle></DialogHeader>
            <Textarea value={rejectionReason} onChange={e => setRejectionReason(e.target.value)} placeholder="Explain why..." />
            <DialogFooter>
              <Button variant="destructive" onClick={() => selectedSubmission && handleRejectSubmission(selectedSubmission.id)}>Confirm Rejection</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Ticket reply dialog */}
        {selectedTicket && (
          <Dialog open={!!selectedTicket} onOpenChange={() => setSelectedTicket(null)}>
            <DialogContent className="max-w-lg">
              <DialogHeader><DialogTitle>{selectedTicket.subject}</DialogTitle></DialogHeader>
              <p className="text-sm text-muted-foreground">{selectedTicket.message}</p>
              <div className="flex gap-2"><Badge variant="outline" className={priorityColors[selectedTicket.priority]}>{selectedTicket.priority}</Badge></div>
              <Textarea value={ticketReply} onChange={e => setTicketReply(e.target.value)} placeholder="Reply..." />
              <DialogFooter>
                <Button onClick={() => handleReplyTicket(selectedTicket.id)}><Send size={14} className="mr-1" /> Send Reply</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        )}
      </div>
    );
  }

  // ──── UNIVERSITIES ────
  if (activeSection === 'sa_universities') {
    if (selectedUni) {
      return (
        <div className="space-y-6 animate-fade-in">
          <button onClick={() => setSelectedUniId(null)} className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"><ArrowLeft size={16} /> Back</button>
          <div className="flex items-center justify-between">
            <div><h2 className="text-2xl font-black">{selectedUni.name}</h2><p className="text-muted-foreground text-sm">{selectedUni.city}, {selectedUni.country}</p></div>
            <Badge variant="outline" className={statusColors[selectedUni.status]}>{selectedUni.status}</Badge>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Card className="border-border/50"><CardContent className="p-4"><p className="text-xs text-muted-foreground font-bold uppercase">Plan</p><p className="text-xl font-black mt-1">{selectedUni.subscription_plan}</p><p className="text-sm text-muted-foreground">{selectedUni.subscription_price} DT/month</p></CardContent></Card>
            <Card className="border-border/50"><CardContent className="p-4"><p className="text-xs text-muted-foreground font-bold uppercase">Seats</p><p className="text-xl font-black mt-1">{selectedUni.active_seats} / {selectedUni.max_seats}</p></CardContent></Card>
            <Card className="border-border/50"><CardContent className="p-4"><p className="text-xs text-muted-foreground font-bold uppercase">Storage</p><p className="text-xl font-black mt-1">{selectedUni.storage_used_gb} / {selectedUni.storage_limit_gb} GB</p></CardContent></Card>
          </div>
          <div className="flex gap-2">
            {selectedUni.status === 'pending' && (
              <>
                <Button size="sm" className="bg-emerald-600 hover:bg-emerald-700" onClick={async () => {
                  await supabase.from('universities').update({ status: 'active', activated_at: new Date().toISOString() }).eq('id', selectedUni.id);
                  toast.success('University activated');
                }}><CheckCircle2 size={14} className="mr-1" /> Approve</Button>
                <Button variant="destructive" size="sm" onClick={async () => {
                  await supabase.from('universities').update({ status: 'suspended', suspended_at: new Date().toISOString() }).eq('id', selectedUni.id);
                  toast.error('University rejected');
                }}><XCircle size={14} className="mr-1" /> Reject</Button>
              </>
            )}
          </div>
        </div>
      );
    }

    return (
      <div className="space-y-6 animate-fade-in">
        <h1 className="text-2xl font-black">Universities</h1>
        {unis.length === 0 ? (
          <div className="text-center py-16 glass-card rounded-2xl"><Building2 size={48} className="mx-auto text-muted-foreground/20 mb-4" /><p className="font-bold text-muted-foreground">No universities registered</p></div>
        ) : (
          <div className="space-y-3">
            {unis.map((u: any) => (
              <Card key={u.id} className="border-border/50 cursor-pointer hover:border-primary/30 transition-all" onClick={() => setSelectedUniId(u.id)}>
                <CardContent className="p-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center"><Building2 size={18} className="text-primary" /></div>
                    <div><p className="font-black text-sm">{u.name}</p><p className="text-xs text-muted-foreground">{u.city} · {u.subscription_plan}</p></div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Badge variant="outline" className={statusColors[u.status]}>{u.status}</Badge>
                    <ChevronRight size={16} className="text-muted-foreground" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    );
  }

  // ──── COURSES ────
  if (activeSection === 'sa_courses') {
    return (
      <div className="space-y-6 animate-fade-in">
        <h1 className="text-2xl font-black">Course Submissions</h1>
        {subs.length === 0 ? (
          <div className="text-center py-16 glass-card rounded-2xl"><BookOpen size={48} className="mx-auto text-muted-foreground/20 mb-4" /><p className="font-bold text-muted-foreground">No submissions</p></div>
        ) : (
          <div className="space-y-3">
            {subs.map((s: any) => (
              <Card key={s.id} className="border-border/50">
                <CardContent className="p-4 flex items-center justify-between">
                  <div><p className="font-bold text-sm">{s.title}</p><p className="text-xs text-muted-foreground">{s.instructor_name} · {s.category} · {s.price} DT</p></div>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className={statusColors[s.status]}>{s.status}</Badge>
                    {s.status === 'pending' && <Button size="sm" variant="outline" onClick={() => setSelectedSubmission(s)}><Eye size={14} /></Button>}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    );
  }

  // ──── SUPPORT ────
  if (activeSection === 'sa_support' || activeSection === 'sa_requests') {
    return (
      <div className="space-y-6 animate-fade-in">
        <h1 className="text-2xl font-black">Support Tickets</h1>
        {tix.length === 0 ? (
          <div className="text-center py-16 glass-card rounded-2xl"><Headphones size={48} className="mx-auto text-muted-foreground/20 mb-4" /><p className="font-bold text-muted-foreground">No tickets</p></div>
        ) : (
          <div className="space-y-3">
            {tix.map((t: any) => (
              <Card key={t.id} className="border-border/50 cursor-pointer hover:border-primary/30" onClick={() => setSelectedTicket(t)}>
                <CardContent className="p-4 flex items-center justify-between">
                  <div><p className="font-bold text-sm">{t.subject}</p><p className="text-xs text-muted-foreground">{t.universities?.name || 'User'} · {new Date(t.created_at).toLocaleDateString()}</p></div>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className={priorityColors[t.priority]}>{t.priority}</Badge>
                    <Badge variant="outline" className={statusColors[t.status]}>{t.status}</Badge>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    );
  }

  // ──── CMS ────
  if (activeSection === 'sa_cms') {
    return (
      <div className="space-y-6 animate-fade-in">
        <h1 className="text-2xl font-black">CMS & Content</h1>
        <Tabs defaultValue="banners">
          <TabsList><TabsTrigger value="banners">Banners</TabsTrigger><TabsTrigger value="discounts">Discounts</TabsTrigger></TabsList>
          <TabsContent value="banners" className="mt-4 space-y-3">
            {(banners || []).length === 0 ? <p className="text-muted-foreground text-center py-8">No banners</p> : (banners || []).map((b: any) => (
              <Card key={b.id} className="border-border/50"><CardContent className="p-4 flex items-center justify-between">
                <div><p className="font-bold text-sm">{b.title}</p>{b.subtitle && <p className="text-xs text-muted-foreground">{b.subtitle}</p>}</div>
                <Badge variant="outline" className={b.is_active ? statusColors.active : statusColors.suspended}>{b.is_active ? 'Active' : 'Inactive'}</Badge>
              </CardContent></Card>
            ))}
          </TabsContent>
          <TabsContent value="discounts" className="mt-4 space-y-3">
            {(discounts || []).length === 0 ? <p className="text-muted-foreground text-center py-8">No discounts</p> : (discounts || []).map((d: any) => (
              <Card key={d.id} className="border-border/50"><CardContent className="p-4 flex items-center justify-between">
                <div><p className="font-bold text-sm">{d.name}</p><p className="text-xs text-muted-foreground">Code: {d.code} · {d.discount_percent}% off · {d.current_uses} uses</p></div>
                <Badge variant="outline" className={d.is_active ? statusColors.active : statusColors.suspended}>{d.is_active ? 'Active' : 'Inactive'}</Badge>
              </CardContent></Card>
            ))}
          </TabsContent>
        </Tabs>
      </div>
    );
  }

  // ──── USERS ────
  if (activeSection === 'sa_users') {
    return (
      <div className="space-y-6 animate-fade-in">
        <h1 className="text-2xl font-black">All Users</h1>
        {(allProfiles || []).length === 0 ? (
          <div className="text-center py-16 glass-card rounded-2xl"><Users size={48} className="mx-auto text-muted-foreground/20 mb-4" /><p className="font-bold text-muted-foreground">No users</p></div>
        ) : (
          <div className="glass-card rounded-2xl overflow-x-auto">
            <table className="w-full text-sm">
              <thead><tr className="border-b"><th className="text-left px-4 py-3 text-xs font-black uppercase text-muted-foreground">Name</th><th className="text-left px-4 py-3 text-xs font-black uppercase text-muted-foreground">Email</th><th className="text-left px-4 py-3 text-xs font-black uppercase text-muted-foreground">Roles</th></tr></thead>
              <tbody>
                {(allProfiles || []).slice(0, 50).map((p: any) => (
                  <tr key={p.id} className="border-b border-border/30">
                    <td className="px-4 py-3 font-bold">{p.first_name} {p.last_name}</td>
                    <td className="px-4 py-3 text-muted-foreground">{p.email}</td>
                    <td className="px-4 py-3">{(p.user_roles || []).map((r: any) => <Badge key={r.role} variant="outline" className="mr-1 text-[10px]">{r.role}</Badge>)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    );
  }

  return <div className="text-center py-16"><p className="text-muted-foreground">Section not found</p></div>;
}
