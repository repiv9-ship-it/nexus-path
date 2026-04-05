import { useState } from 'react';
import { Building2, Users, BookOpen, BarChart3, CreditCard, Headphones, Layout, Tag, CheckCircle2, XCircle, Clock, Eye, MessageSquare, Send, ChevronRight, ArrowLeft, Search, Plus, DollarSign, TrendingUp, AlertTriangle, Shield, Globe, Percent, Image, FileText, Star, Zap, Filter, MoreVertical, ExternalLink } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';

interface SuperAdminDashboardProps {
  activeSection: string;
}

// ──── Mock Data ────
const MOCK_UNIVERSITIES = [
  { id: '1', name: 'Université de Tunis', slug: 'utunis', status: 'active', plan: 'Premium', price: 2500, seats: 500, activeSeats: 342, storageUsed: 28.5, storageLimit: 100, email: 'admin@utunis.tn', country: 'Tunisia', city: 'Tunis', createdAt: '2024-09-15', revenue: 45000 },
  { id: '2', name: 'ESPRIT', slug: 'esprit', status: 'active', plan: 'Enterprise', price: 5000, seats: 2000, activeSeats: 1856, storageUsed: 72.3, storageLimit: 200, email: 'admin@esprit.tn', country: 'Tunisia', city: 'Ariana', createdAt: '2024-06-01', revenue: 125000 },
  { id: '3', name: 'ENIT', slug: 'enit', status: 'active', plan: 'Basic', price: 800, seats: 300, activeSeats: 189, storageUsed: 12.1, storageLimit: 50, email: 'admin@enit.tn', country: 'Tunisia', city: 'Tunis', createdAt: '2025-01-10', revenue: 9600 },
  { id: '4', name: 'Université de Sfax', slug: 'usfax', status: 'suspended', plan: 'Basic', price: 800, seats: 400, activeSeats: 0, storageUsed: 5.2, storageLimit: 50, email: 'admin@usfax.tn', country: 'Tunisia', city: 'Sfax', createdAt: '2024-11-20', revenue: 4800 },
  { id: '5', name: 'ISG Tunis', slug: 'isg', status: 'pending', plan: 'Premium', price: 2500, seats: 600, activeSeats: 0, storageUsed: 0, storageLimit: 100, email: 'admin@isg.tn', country: 'Tunisia', city: 'Tunis', createdAt: '2026-03-10', revenue: 0 },
];

const MOCK_SUBMISSIONS = [
  { id: '1', title: 'Introduction to AI', university: 'ESPRIT', instructor: 'Dr. Ben Ali', category: 'Computer Science', price: 49.99, status: 'pending', submittedAt: '2026-03-12', description: 'A comprehensive introduction to artificial intelligence covering machine learning, neural networks, and practical applications.' },
  { id: '2', title: 'Marketing Digital', university: 'ISG Tunis', instructor: 'Prof. Trabelsi', category: 'Business', price: 29.99, status: 'pending', submittedAt: '2026-03-14', description: 'Digital marketing strategies for the modern era.' },
  { id: '3', title: 'Résistance des Matériaux', university: 'ENIT', instructor: 'Dr. Chaabane', category: 'Engineering', price: 0, status: 'approved', submittedAt: '2026-03-01', description: 'Course on material resistance and structural analysis.' },
  { id: '4', title: 'Advanced Databases', university: 'ESPRIT', instructor: 'Prof. Mejri', category: 'Computer Science', price: 39.99, status: 'rejected', submittedAt: '2026-02-28', rejectionReason: 'Audio quality too low in Section 3. Please re-record lectures 5-8.', description: 'Advanced database concepts.' },
];

const MOCK_TICKETS = [
  { id: '1', university: 'ESPRIT', subject: 'Storage limit increase request', category: 'billing', priority: 'high', status: 'open', createdAt: '2026-03-15', message: 'We are running low on storage. Can we upgrade our plan?' },
  { id: '2', university: 'ENIT', subject: 'Unable to upload video content', category: 'technical', priority: 'urgent', status: 'open', createdAt: '2026-03-16', message: 'Getting 500 error when uploading videos larger than 500MB.' },
  { id: '3', university: 'Université de Tunis', subject: 'Invoice discrepancy', category: 'billing', priority: 'normal', status: 'resolved', createdAt: '2026-03-10', message: 'March invoice shows incorrect amount.' },
];

const MOCK_BANNERS = [
  { id: '1', title: 'Back to School 2026', subtitle: '20% off all courses', isActive: true, position: 1 },
  { id: '2', title: 'New: AI Courses', subtitle: 'Explore the future of AI', isActive: true, position: 2 },
  { id: '3', title: 'Summer Sale', subtitle: 'Up to 50% off', isActive: false, position: 3 },
];

const MOCK_DISCOUNTS = [
  { id: '1', name: 'Back to School', code: 'BTS2026', percent: 20, isActive: true, uses: 342, maxUses: 1000, startsAt: '2026-03-01', endsAt: '2026-04-01' },
  { id: '2', name: 'VIP Partners', code: 'VIP50', percent: 50, isActive: false, uses: 12, maxUses: 50, startsAt: '2026-01-01', endsAt: '2026-12-31' },
];

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
  const [selectedUni, setSelectedUni] = useState<typeof MOCK_UNIVERSITIES[0] | null>(null);
  const [selectedSubmission, setSelectedSubmission] = useState<typeof MOCK_SUBMISSIONS[0] | null>(null);
  const [selectedTicket, setSelectedTicket] = useState<typeof MOCK_TICKETS[0] | null>(null);
  const [rejectionDialog, setRejectionDialog] = useState(false);
  const [rejectionReason, setRejectionReason] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [bannerDialog, setBannerDialog] = useState(false);
  const [discountDialog, setDiscountDialog] = useState(false);
  const [ticketReply, setTicketReply] = useState('');

  const totalRevenue = MOCK_UNIVERSITIES.reduce((s, u) => s + u.revenue, 0);
  const totalStudents = MOCK_UNIVERSITIES.reduce((s, u) => s + u.activeSeats, 0);
  const activeUnis = MOCK_UNIVERSITIES.filter(u => u.status === 'active').length;
  const pendingSubmissions = MOCK_SUBMISSIONS.filter(s => s.status === 'pending').length;
  const openTickets = MOCK_TICKETS.filter(t => t.status === 'open').length;

  // ──── OVERVIEW ────
  const renderOverview = () => (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-black tracking-tight">Command Center</h1>
        <p className="text-muted-foreground mt-1">Platform overview and key metrics</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Revenue', value: `${(totalRevenue / 1000).toFixed(0)}K DT`, icon: DollarSign, color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
          { label: 'Active Universities', value: activeUnis, icon: Building2, color: 'text-primary', bg: 'bg-primary/10' },
          { label: 'Total Students', value: totalStudents.toLocaleString(), icon: Users, color: 'text-blue-500', bg: 'bg-blue-500/10' },
          { label: 'Pending Actions', value: pendingSubmissions + openTickets, icon: AlertTriangle, color: 'text-amber-500', bg: 'bg-amber-500/10' },
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

      {/* Quick actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="border-border/50">
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-black flex items-center gap-2">
              <Clock size={16} className="text-amber-500" /> Pending Review
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {MOCK_SUBMISSIONS.filter(s => s.status === 'pending').map(s => (
              <div key={s.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors">
                <div>
                  <p className="font-bold text-sm">{s.title}</p>
                  <p className="text-xs text-muted-foreground">{s.university} · {s.instructor}</p>
                </div>
                <Button size="sm" variant="outline" onClick={() => setSelectedSubmission(s)}>
                  <Eye size={14} className="mr-1" /> Review
                </Button>
              </div>
            ))}
            {pendingSubmissions === 0 && <p className="text-sm text-muted-foreground text-center py-4">No pending submissions</p>}
          </CardContent>
        </Card>

        <Card className="border-border/50">
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-black flex items-center gap-2">
              <Headphones size={16} className="text-destructive" /> Open Tickets
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {MOCK_TICKETS.filter(t => t.status === 'open').map(t => (
              <div key={t.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors">
                <div>
                  <p className="font-bold text-sm">{t.subject}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-xs text-muted-foreground">{t.university}</span>
                    <Badge variant="outline" className={`text-[10px] ${priorityColors[t.priority]}`}>{t.priority}</Badge>
                  </div>
                </div>
                <Button size="sm" variant="outline" onClick={() => setSelectedTicket(t)}>
                  <MessageSquare size={14} className="mr-1" /> View
                </Button>
              </div>
            ))}
            {openTickets === 0 && <p className="text-sm text-muted-foreground text-center py-4">No open tickets</p>}
          </CardContent>
        </Card>
      </div>

      {/* Revenue chart placeholder */}
      <Card className="border-border/50">
        <CardHeader>
          <CardTitle className="text-base font-black flex items-center gap-2">
            <TrendingUp size={16} className="text-emerald-500" /> Monthly Revenue
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-6 gap-2 h-40 items-end">
            {[65, 78, 82, 91, 88, 95].map((v, i) => (
              <div key={i} className="flex flex-col items-center gap-1">
                <div className="w-full bg-primary/20 rounded-t-lg relative overflow-hidden" style={{ height: `${v}%` }}>
                  <div className="absolute inset-0 bg-gradient-to-t from-primary to-primary/60 rounded-t-lg" />
                </div>
                <span className="text-[10px] text-muted-foreground font-bold">
                  {['Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'Mar'][i]}
                </span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );

  // ──── UNIVERSITIES (URM) ────
  const renderUniversities = () => {
    if (selectedUni) {
      return (
        <div className="space-y-6">
          <button onClick={() => setSelectedUni(null)} className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft size={16} /> Back to Universities
          </button>

          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-black">{selectedUni.name}</h2>
              <p className="text-muted-foreground text-sm">{selectedUni.city}, {selectedUni.country} · Since {selectedUni.createdAt}</p>
            </div>
            <Badge variant="outline" className={statusColors[selectedUni.status]}>{selectedUni.status}</Badge>
          </div>

          <Tabs defaultValue="overview">
            <TabsList>
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="billing">Billing</TabsTrigger>
              <TabsTrigger value="resources">Resources</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="mt-4 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <Card className="border-border/50">
                  <CardContent className="p-4">
                    <p className="text-xs text-muted-foreground font-bold uppercase">Plan</p>
                    <p className="text-xl font-black mt-1">{selectedUni.plan}</p>
                    <p className="text-sm text-muted-foreground">{selectedUni.price} DT/month</p>
                  </CardContent>
                </Card>
                <Card className="border-border/50">
                  <CardContent className="p-4">
                    <p className="text-xs text-muted-foreground font-bold uppercase">Seats</p>
                    <p className="text-xl font-black mt-1">{selectedUni.activeSeats} / {selectedUni.seats}</p>
                    <div className="w-full bg-muted rounded-full h-2 mt-2">
                      <div className="bg-primary rounded-full h-2" style={{ width: `${(selectedUni.activeSeats / selectedUni.seats) * 100}%` }} />
                    </div>
                  </CardContent>
                </Card>
                <Card className="border-border/50">
                  <CardContent className="p-4">
                    <p className="text-xs text-muted-foreground font-bold uppercase">Total Revenue</p>
                    <p className="text-xl font-black mt-1">{selectedUni.revenue.toLocaleString()} DT</p>
                  </CardContent>
                </Card>
              </div>

              <div className="flex gap-2">
                {selectedUni.status === 'active' && (
                  <Button variant="destructive" size="sm" onClick={() => toast.success('University suspended')}>
                    <XCircle size={14} className="mr-1" /> Suspend
                  </Button>
                )}
                {selectedUni.status === 'suspended' && (
                  <Button size="sm" className="bg-emerald-600 hover:bg-emerald-700" onClick={() => toast.success('University reactivated')}>
                    <CheckCircle2 size={14} className="mr-1" /> Reactivate
                  </Button>
                )}
                {selectedUni.status === 'pending' && (
                  <>
                    <Button size="sm" className="bg-emerald-600 hover:bg-emerald-700" onClick={() => toast.success('University approved & activated')}>
                      <CheckCircle2 size={14} className="mr-1" /> Approve & Activate
                    </Button>
                    <Button variant="destructive" size="sm" onClick={() => toast.error('Application rejected')}>
                      <XCircle size={14} className="mr-1" /> Reject
                    </Button>
                  </>
                )}
              </div>
            </TabsContent>

            <TabsContent value="billing" className="mt-4 space-y-4">
              <Card className="border-border/50">
                <CardHeader>
                  <CardTitle className="text-sm font-black">Invoice History</CardTitle>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Period</TableHead>
                        <TableHead>Amount</TableHead>
                        <TableHead>Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {['March 2026', 'February 2026', 'January 2026'].map((period, i) => (
                        <TableRow key={period}>
                          <TableCell className="font-medium">{period}</TableCell>
                          <TableCell>{selectedUni.price} DT</TableCell>
                          <TableCell>
                            <Badge variant="outline" className={i === 0 ? statusColors.pending : statusColors.active}>
                              {i === 0 ? 'Due' : 'Paid'}
                            </Badge>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="resources" className="mt-4 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Card className="border-border/50">
                  <CardContent className="p-4">
                    <p className="text-xs text-muted-foreground font-bold uppercase">Storage</p>
                    <p className="text-xl font-black mt-1">{selectedUni.storageUsed} / {selectedUni.storageLimit} GB</p>
                    <div className="w-full bg-muted rounded-full h-3 mt-2">
                      <div
                        className={`rounded-full h-3 transition-all ${
                          (selectedUni.storageUsed / selectedUni.storageLimit) > 0.8 ? 'bg-destructive' : 'bg-primary'
                        }`}
                        style={{ width: `${(selectedUni.storageUsed / selectedUni.storageLimit) * 100}%` }}
                      />
                    </div>
                  </CardContent>
                </Card>
                <Card className="border-border/50">
                  <CardContent className="p-4">
                    <p className="text-xs text-muted-foreground font-bold uppercase">Bandwidth (Monthly)</p>
                    <p className="text-xl font-black mt-1">145 GB</p>
                    <p className="text-xs text-muted-foreground mt-1">Limit: 500 GB</p>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      );
    }

    const filtered = MOCK_UNIVERSITIES.filter(u =>
      u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.city.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div>
            <h2 className="text-2xl font-black">Universities</h2>
            <p className="text-sm text-muted-foreground">{MOCK_UNIVERSITIES.length} tenants · {activeUnis} active</p>
          </div>
          <div className="flex items-center gap-2">
            <div className="relative">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <Input placeholder="Search..." className="pl-9 w-52" value={searchQuery} onChange={e => setSearchQuery(e.target.value)} />
            </div>
          </div>
        </div>

        <div className="grid gap-3">
          {filtered.map(uni => (
            <Card key={uni.id} className="border-border/50 hover:border-primary/30 transition-colors cursor-pointer" onClick={() => setSelectedUni(uni)}>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                      <Building2 className="text-primary" size={20} />
                    </div>
                    <div>
                      <p className="font-black">{uni.name}</p>
                      <p className="text-xs text-muted-foreground">{uni.city}, {uni.country} · {uni.plan}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 text-right">
                    <div className="hidden sm:block">
                      <p className="text-sm font-bold">{uni.activeSeats}/{uni.seats} seats</p>
                      <p className="text-xs text-muted-foreground">{uni.price} DT/mo</p>
                    </div>
                    <Badge variant="outline" className={statusColors[uni.status]}>{uni.status}</Badge>
                    <ChevronRight size={16} className="text-muted-foreground" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  };

  // ──── COURSE GOVERNANCE ────
  const renderCourseGovernance = () => (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-black">Course Governance</h2>
        <p className="text-sm text-muted-foreground">Review and approve course submissions</p>
      </div>

      <Tabs defaultValue="pending">
        <TabsList>
          <TabsTrigger value="pending" className="gap-1">
            <Clock size={14} /> Pending ({pendingSubmissions})
          </TabsTrigger>
          <TabsTrigger value="approved" className="gap-1">
            <CheckCircle2 size={14} /> Approved
          </TabsTrigger>
          <TabsTrigger value="rejected" className="gap-1">
            <XCircle size={14} /> Rejected
          </TabsTrigger>
        </TabsList>

        {['pending', 'approved', 'rejected'].map(status => (
          <TabsContent key={status} value={status} className="mt-4">
            <div className="space-y-3">
              {MOCK_SUBMISSIONS.filter(s => s.status === status).map(s => (
                <Card key={s.id} className="border-border/50">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between flex-wrap gap-3">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-secondary/10 flex items-center justify-center">
                          <BookOpen className="text-secondary" size={20} />
                        </div>
                        <div>
                          <p className="font-black">{s.title}</p>
                          <p className="text-xs text-muted-foreground">{s.university} · {s.instructor} · {s.category}</p>
                          {s.price > 0 && <p className="text-xs font-bold text-primary mt-0.5">{s.price} DT</p>}
                          {s.price === 0 && <p className="text-xs font-bold text-emerald-500 mt-0.5">Free</p>}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {status === 'rejected' && s.rejectionReason && (
                          <p className="text-xs text-destructive max-w-xs hidden md:block">{s.rejectionReason}</p>
                        )}
                        <Button size="sm" variant="outline" onClick={() => setSelectedSubmission(s)}>
                          <Eye size={14} className="mr-1" /> Details
                        </Button>
                        {status === 'pending' && (
                          <>
                            <Button size="sm" className="bg-emerald-600 hover:bg-emerald-700" onClick={() => toast.success(`"${s.title}" approved`)}>
                              <CheckCircle2 size={14} className="mr-1" /> Approve
                            </Button>
                            <Button size="sm" variant="destructive" onClick={() => { setSelectedSubmission(s); setRejectionDialog(true); }}>
                              <XCircle size={14} className="mr-1" /> Reject
                            </Button>
                          </>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
              {MOCK_SUBMISSIONS.filter(s => s.status === status).length === 0 && (
                <p className="text-center text-muted-foreground py-8">No {status} submissions</p>
              )}
            </div>
          </TabsContent>
        ))}
      </Tabs>

      {/* Rejection dialog */}
      <Dialog open={rejectionDialog} onOpenChange={setRejectionDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="font-black">Reject Course Submission</DialogTitle>
          </DialogHeader>
          <div className="space-y-3">
            <p className="text-sm text-muted-foreground">Provide feedback to <span className="font-bold text-foreground">{selectedSubmission?.university}</span> about why <span className="font-bold text-foreground">"{selectedSubmission?.title}"</span> was rejected.</p>
            <Textarea
              placeholder="e.g., Audio quality too low in Section 3. Please re-record lectures 5-8."
              value={rejectionReason}
              onChange={e => setRejectionReason(e.target.value)}
              rows={4}
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setRejectionDialog(false)}>Cancel</Button>
            <Button variant="destructive" onClick={() => { setRejectionDialog(false); setRejectionReason(''); toast.error('Course rejected with feedback'); }}>
              Send Rejection
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Course detail dialog */}
      <Dialog open={!!selectedSubmission && !rejectionDialog} onOpenChange={() => setSelectedSubmission(null)}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="font-black">{selectedSubmission?.title}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <p className="text-xs text-muted-foreground font-bold uppercase">University</p>
                <p className="text-sm font-bold">{selectedSubmission?.university}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground font-bold uppercase">Instructor</p>
                <p className="text-sm font-bold">{selectedSubmission?.instructor}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground font-bold uppercase">Category</p>
                <p className="text-sm font-bold">{selectedSubmission?.category}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground font-bold uppercase">Price</p>
                <p className="text-sm font-bold">{selectedSubmission?.price ? `${selectedSubmission.price} DT` : 'Free'}</p>
              </div>
            </div>
            <div>
              <p className="text-xs text-muted-foreground font-bold uppercase mb-1">Description</p>
              <p className="text-sm">{selectedSubmission?.description}</p>
            </div>
            <Badge variant="outline" className={statusColors[selectedSubmission?.status || 'pending']}>
              {selectedSubmission?.status}
            </Badge>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );

  // ──── ANALYTICS ────
  const renderAnalytics = () => (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-black">Platform Analytics</h2>
        <p className="text-sm text-muted-foreground">Revenue, payouts, and performance metrics</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="border-border/50">
          <CardContent className="p-5">
            <p className="text-xs text-muted-foreground font-bold uppercase">Total Revenue (YTD)</p>
            <p className="text-3xl font-black mt-1">{(totalRevenue / 1000).toFixed(0)}K <span className="text-base text-muted-foreground">DT</span></p>
            <p className="text-xs text-emerald-500 font-bold mt-1">+12% vs last year</p>
          </CardContent>
        </Card>
        <Card className="border-border/50">
          <CardContent className="p-5">
            <p className="text-xs text-muted-foreground font-bold uppercase">Subscription Revenue</p>
            <p className="text-3xl font-black mt-1">{MOCK_UNIVERSITIES.filter(u => u.status === 'active').reduce((s, u) => s + u.price, 0).toLocaleString()} <span className="text-base text-muted-foreground">DT/mo</span></p>
          </CardContent>
        </Card>
        <Card className="border-border/50">
          <CardContent className="p-5">
            <p className="text-xs text-muted-foreground font-bold uppercase">Avg Revenue / University</p>
            <p className="text-3xl font-black mt-1">{activeUnis > 0 ? Math.round(totalRevenue / activeUnis).toLocaleString() : 0} <span className="text-base text-muted-foreground">DT</span></p>
          </CardContent>
        </Card>
      </div>

      {/* Payout table */}
      <Card className="border-border/50">
        <CardHeader>
          <CardTitle className="text-base font-black">University Payouts</CardTitle>
          <CardDescription>Track subscription payments by tenant</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>University</TableHead>
                <TableHead>Plan</TableHead>
                <TableHead>Monthly</TableHead>
                <TableHead>Total Earned</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {MOCK_UNIVERSITIES.filter(u => u.status === 'active').map(uni => (
                <TableRow key={uni.id}>
                  <TableCell className="font-bold">{uni.name}</TableCell>
                  <TableCell>{uni.plan}</TableCell>
                  <TableCell>{uni.price.toLocaleString()} DT</TableCell>
                  <TableCell>{uni.revenue.toLocaleString()} DT</TableCell>
                  <TableCell>
                    <Badge variant="outline" className={statusColors.active}>Up to date</Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Top universities by students */}
      <Card className="border-border/50">
        <CardHeader>
          <CardTitle className="text-base font-black">Top Universities by Students</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[...MOCK_UNIVERSITIES].sort((a, b) => b.activeSeats - a.activeSeats).slice(0, 4).map((uni, i) => (
              <div key={uni.id} className="flex items-center gap-3">
                <span className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center text-xs font-black text-primary">{i + 1}</span>
                <div className="flex-1">
                  <div className="flex justify-between mb-1">
                    <span className="text-sm font-bold">{uni.name}</span>
                    <span className="text-xs text-muted-foreground">{uni.activeSeats} students</span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2">
                    <div className="bg-primary rounded-full h-2" style={{ width: `${(uni.activeSeats / 2000) * 100}%` }} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );

  // ──── SUPPORT ────
  const renderSupport = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-black">Support & Disputes</h2>
          <p className="text-sm text-muted-foreground">{openTickets} open tickets</p>
        </div>
      </div>

      {selectedTicket ? (
        <div className="space-y-4">
          <button onClick={() => setSelectedTicket(null)} className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft size={16} /> Back to Tickets
          </button>

          <Card className="border-border/50">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="font-black">{selectedTicket.subject}</CardTitle>
                  <CardDescription>{selectedTicket.university} · {selectedTicket.createdAt}</CardDescription>
                </div>
                <div className="flex gap-2">
                  <Badge variant="outline" className={priorityColors[selectedTicket.priority]}>{selectedTicket.priority}</Badge>
                  <Badge variant="outline" className={statusColors[selectedTicket.status]}>{selectedTicket.status}</Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-4 bg-muted/50 rounded-xl">
                <p className="text-xs font-bold text-muted-foreground mb-1">Original Message</p>
                <p className="text-sm">{selectedTicket.message}</p>
              </div>

              {/* Reply section */}
              <div className="flex gap-2">
                <Textarea
                  placeholder="Type your reply..."
                  value={ticketReply}
                  onChange={e => setTicketReply(e.target.value)}
                  className="flex-1"
                  rows={3}
                />
              </div>
              <div className="flex gap-2">
                <Button onClick={() => { setTicketReply(''); toast.success('Reply sent'); }}>
                  <Send size={14} className="mr-1" /> Send Reply
                </Button>
                {selectedTicket.status === 'open' && (
                  <Button variant="outline" className="text-emerald-600" onClick={() => toast.success('Ticket resolved')}>
                    <CheckCircle2 size={14} className="mr-1" /> Mark Resolved
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      ) : (
        <div className="space-y-3">
          {MOCK_TICKETS.map(ticket => (
            <Card key={ticket.id} className="border-border/50 hover:border-primary/30 transition-colors cursor-pointer" onClick={() => setSelectedTicket(ticket)}>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`w-2 h-2 rounded-full ${ticket.status === 'open' ? 'bg-amber-500' : 'bg-emerald-500'}`} />
                    <div>
                      <p className="font-bold text-sm">{ticket.subject}</p>
                      <p className="text-xs text-muted-foreground">{ticket.university} · {ticket.createdAt}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className={priorityColors[ticket.priority]}>{ticket.priority}</Badge>
                    <Badge variant="outline" className={statusColors[ticket.status]}>{ticket.status}</Badge>
                    <ChevronRight size={14} className="text-muted-foreground" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );

  // ──── CMS ────
  const renderCMS = () => (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-black">Platform CMS</h2>
        <p className="text-sm text-muted-foreground">Manage banners, featured content, and global discounts</p>
      </div>

      <Tabs defaultValue="banners">
        <TabsList>
          <TabsTrigger value="banners" className="gap-1"><Image size={14} /> Banners</TabsTrigger>
          <TabsTrigger value="discounts" className="gap-1"><Tag size={14} /> Discounts</TabsTrigger>
          <TabsTrigger value="categories" className="gap-1"><Filter size={14} /> Categories</TabsTrigger>
        </TabsList>

        <TabsContent value="banners" className="mt-4 space-y-4">
          <div className="flex justify-end">
            <Button size="sm" onClick={() => setBannerDialog(true)}>
              <Plus size={14} className="mr-1" /> Add Banner
            </Button>
          </div>
          <div className="space-y-3">
            {MOCK_BANNERS.map(b => (
              <Card key={b.id} className="border-border/50">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-20 h-12 rounded-lg bg-gradient-to-r from-primary/20 to-secondary/20 flex items-center justify-center">
                        <Image size={16} className="text-muted-foreground" />
                      </div>
                      <div>
                        <p className="font-bold text-sm">{b.title}</p>
                        <p className="text-xs text-muted-foreground">{b.subtitle}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className={b.isActive ? statusColors.active : 'bg-muted text-muted-foreground'}>
                        {b.isActive ? 'Active' : 'Inactive'}
                      </Badge>
                      <span className="text-xs text-muted-foreground">Pos: {b.position}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="discounts" className="mt-4 space-y-4">
          <div className="flex justify-end">
            <Button size="sm" onClick={() => setDiscountDialog(true)}>
              <Plus size={14} className="mr-1" /> Create Discount
            </Button>
          </div>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Code</TableHead>
                <TableHead>Discount</TableHead>
                <TableHead>Uses</TableHead>
                <TableHead>Period</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {MOCK_DISCOUNTS.map(d => (
                <TableRow key={d.id}>
                  <TableCell className="font-bold">{d.name}</TableCell>
                  <TableCell><code className="px-2 py-1 rounded bg-muted text-xs font-mono">{d.code}</code></TableCell>
                  <TableCell className="font-bold text-primary">{d.percent}%</TableCell>
                  <TableCell>{d.uses}/{d.maxUses}</TableCell>
                  <TableCell className="text-xs text-muted-foreground">{d.startsAt} → {d.endsAt}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className={d.isActive ? statusColors.active : 'bg-muted text-muted-foreground'}>
                      {d.isActive ? 'Active' : 'Inactive'}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TabsContent>

        <TabsContent value="categories" className="mt-4 space-y-4">
          <Card className="border-border/50">
            <CardHeader>
              <CardTitle className="text-base font-black">Course Categories</CardTitle>
              <CardDescription>Manage marketplace categories and featured sections</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {['Computer Science', 'Data Science', 'Business', 'Design', 'Mathematics', 'Engineering', 'Medicine', 'Languages'].map(cat => (
                  <Badge key={cat} variant="outline" className="px-3 py-1.5 text-sm cursor-pointer hover:bg-primary/10 transition-colors">
                    {cat}
                  </Badge>
                ))}
                <Button variant="outline" size="sm" className="h-8">
                  <Plus size={12} className="mr-1" /> Add
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card className="border-border/50">
            <CardHeader>
              <CardTitle className="text-base font-black">Featured Universities</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {MOCK_UNIVERSITIES.filter(u => u.status === 'active').map(u => (
                  <Badge key={u.id} className="px-3 py-1.5 bg-primary/10 text-primary border-primary/20">
                    <Star size={10} className="mr-1" /> {u.name}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Banner dialog */}
      <Dialog open={bannerDialog} onOpenChange={setBannerDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="font-black">Add Banner</DialogTitle>
          </DialogHeader>
          <div className="space-y-3">
            <Input placeholder="Banner title" />
            <Input placeholder="Subtitle" />
            <Input placeholder="Link URL (optional)" />
            <Input type="number" placeholder="Position (1, 2, 3...)" />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setBannerDialog(false)}>Cancel</Button>
            <Button onClick={() => { setBannerDialog(false); toast.success('Banner created'); }}>Create</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Discount dialog */}
      <Dialog open={discountDialog} onOpenChange={setDiscountDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="font-black">Create Discount</DialogTitle>
          </DialogHeader>
          <div className="space-y-3">
            <Input placeholder="Discount name" />
            <Input placeholder="Code (e.g., BTS2026)" />
            <div className="grid grid-cols-2 gap-3">
              <Input type="number" placeholder="Discount %" />
              <Input type="number" placeholder="Max uses" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <Input type="date" placeholder="Start date" />
              <Input type="date" placeholder="End date" />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDiscountDialog(false)}>Cancel</Button>
            <Button onClick={() => { setDiscountDialog(false); toast.success('Discount created'); }}>Create</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );

  // ──── REQUESTS HUB ────
  const renderRequestsHub = () => {
    const MOCK_PROFESSOR_REQUESTS = [
      { id: 'pr1', name: 'John Doe', email: 'john@gmail.com', requestedAt: '2026-03-14', status: 'pending', bio: 'CS instructor with 5 years experience' },
      { id: 'pr2', name: 'Sarah Miller', email: 'sarah@mail.com', requestedAt: '2026-03-12', status: 'pending', bio: 'PhD in Machine Learning from MIT' },
      { id: 'pr3', name: 'Omar Fathi', email: 'omar@edu.tn', requestedAt: '2026-03-08', status: 'approved', bio: 'Mathematics professor at ENIT' },
    ];

    const MOCK_UNI_REQUESTS = [
      { id: 'ur1', name: 'Institut Supérieur de Gestion', city: 'Tunis', email: 'contact@isg.tn', requestedAt: '2026-03-15', status: 'pending', plan: 'Premium' },
      { id: 'ur2', name: 'ISET Nabeul', city: 'Nabeul', email: 'admin@iset-nabeul.tn', requestedAt: '2026-03-10', status: 'pending', plan: 'Basic' },
    ];

    return (
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-black tracking-tight">Requests & Tickets</h1>
          <p className="text-muted-foreground mt-1">Professor promotions, university workspace requests, and support tickets</p>
        </div>

        <Tabs defaultValue="professors">
          <TabsList>
            <TabsTrigger value="professors" className="font-bold">
              Professor Requests
              <Badge variant="secondary" className="ml-2 text-[10px]">{MOCK_PROFESSOR_REQUESTS.filter(r => r.status === 'pending').length}</Badge>
            </TabsTrigger>
            <TabsTrigger value="universities" className="font-bold">
              University Requests
              <Badge variant="secondary" className="ml-2 text-[10px]">{MOCK_UNI_REQUESTS.filter(r => r.status === 'pending').length}</Badge>
            </TabsTrigger>
            <TabsTrigger value="support" className="font-bold">
              Support Tickets
              <Badge variant="secondary" className="ml-2 text-[10px]">{openTickets}</Badge>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="professors" className="mt-4 space-y-3">
            {MOCK_PROFESSOR_REQUESTS.map(req => (
              <Card key={req.id} className="border-border/50">
                <CardContent className="p-4 flex items-center gap-4">
                  <div className="w-10 h-10 bg-warning/10 rounded-lg flex items-center justify-center">
                    <Users size={18} className="text-warning" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-sm">{req.name}</p>
                    <p className="text-xs text-muted-foreground">{req.email} · {req.bio}</p>
                    <p className="text-[10px] text-muted-foreground mt-1">Requested {req.requestedAt}</p>
                  </div>
                  <div className="flex gap-2 shrink-0">
                    {req.status === 'pending' ? (
                      <>
                        <Button size="sm" className="bg-emerald-600 hover:bg-emerald-700 font-bold text-xs h-8" onClick={() => toast.success(`${req.name} promoted to instructor`)}>
                          <CheckCircle2 size={12} className="mr-1" /> Approve
                        </Button>
                        <Button size="sm" variant="destructive" className="font-bold text-xs h-8" onClick={() => toast.error('Request rejected')}>
                          <XCircle size={12} className="mr-1" /> Reject
                        </Button>
                      </>
                    ) : (
                      <Badge variant="outline" className={statusColors[req.status]}>{req.status}</Badge>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </TabsContent>

          <TabsContent value="universities" className="mt-4 space-y-3">
            {MOCK_UNI_REQUESTS.map(req => (
              <Card key={req.id} className="border-border/50">
                <CardContent className="p-4 flex items-center gap-4">
                  <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                    <Building2 size={18} className="text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-sm">{req.name}</p>
                    <p className="text-xs text-muted-foreground">{req.city} · {req.email} · Plan: {req.plan}</p>
                    <p className="text-[10px] text-muted-foreground mt-1">Requested {req.requestedAt}</p>
                  </div>
                  <div className="flex gap-2 shrink-0">
                    {req.status === 'pending' ? (
                      <>
                        <Button size="sm" className="bg-emerald-600 hover:bg-emerald-700 font-bold text-xs h-8" onClick={() => toast.success(`${req.name} workspace created`)}>
                          <CheckCircle2 size={12} className="mr-1" /> Create Workspace
                        </Button>
                        <Button size="sm" variant="destructive" className="font-bold text-xs h-8">
                          <XCircle size={12} className="mr-1" /> Decline
                        </Button>
                      </>
                    ) : (
                      <Badge variant="outline" className={statusColors[req.status]}>{req.status}</Badge>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </TabsContent>

          <TabsContent value="support" className="mt-4 space-y-3">
            {MOCK_TICKETS.map(t => (
              <Card key={t.id} className="border-border/50">
                <CardContent className="p-4 flex items-center gap-4">
                  <div className="w-10 h-10 bg-destructive/10 rounded-lg flex items-center justify-center">
                    <Headphones size={18} className="text-destructive" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-sm">{t.subject}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-xs text-muted-foreground">{t.university}</span>
                      <Badge variant="outline" className={`text-[10px] ${priorityColors[t.priority]}`}>{t.priority}</Badge>
                      <Badge variant="outline" className={`text-[10px] ${statusColors[t.status]}`}>{t.status}</Badge>
                    </div>
                  </div>
                  <Button size="sm" variant="outline" className="font-bold text-xs h-8" onClick={() => setSelectedTicket(t)}>
                    <MessageSquare size={12} className="mr-1" /> View
                  </Button>
                </CardContent>
              </Card>
            ))}
          </TabsContent>
        </Tabs>
      </div>
    );
  };

  // ──── USER MANAGEMENT ────
  const renderUserManagement = () => {
    const MOCK_USERS = [
      { id: '1', name: 'Alice Chen', email: 'alice@gmail.com', role: 'Student', joinedAt: '2025-09-15', status: 'active' },
      { id: '2', name: 'Prof. Ahmed', email: 'ahmed@uni.tn', role: 'Professor', joinedAt: '2024-06-01', status: 'active' },
      { id: '3', name: 'Admin ESPRIT', email: 'admin@esprit.tn', role: 'University Admin', joinedAt: '2024-06-01', status: 'active' },
      { id: '4', name: 'Bob Smith', email: 'bob@mail.com', role: 'Student', joinedAt: '2025-11-20', status: 'suspended' },
    ];

    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-black tracking-tight">User Management</h1>
            <p className="text-muted-foreground mt-1">View and manage all platform users</p>
          </div>
          <div className="relative w-64">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <Input placeholder="Search users..." className="pl-9 h-9 rounded-xl text-sm" />
          </div>
        </div>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>User</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Joined</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {MOCK_USERS.map(u => (
              <TableRow key={u.id}>
                <TableCell>
                  <div>
                    <p className="font-bold text-sm">{u.name}</p>
                    <p className="text-xs text-muted-foreground">{u.email}</p>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant="outline" className="text-xs">{u.role}</Badge>
                </TableCell>
                <TableCell className="text-sm text-muted-foreground">{u.joinedAt}</TableCell>
                <TableCell>
                  <Badge variant="outline" className={`text-[10px] ${statusColors[u.status]}`}>{u.status}</Badge>
                </TableCell>
                <TableCell className="text-right">
                  <Button variant="ghost" size="sm" className="h-7 text-xs">
                    <Eye size={12} className="mr-1" /> View
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    );
  };

  // ──── RENDER ────
  switch (activeSection) {
    case 'sa_universities': return renderUniversities();
    case 'sa_courses': return renderCourseGovernance();
    case 'sa_analytics': return renderAnalytics();
    case 'sa_support': return renderSupport();
    case 'sa_cms': return renderCMS();
    case 'sa_requests': return renderRequestsHub();
    case 'sa_users': return renderUserManagement();
    default: return renderOverview();
  }
}
