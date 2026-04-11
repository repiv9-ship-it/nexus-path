import { useState } from 'react';
import { CheckCircle, ChevronRight, ChevronLeft, Upload, GraduationCap, Building2, User, FileText, Send, Globe, BookOpen, Briefcase, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

type ApplicationType = 'professor' | 'university';

interface ApplicationWizardProps {
  type: ApplicationType;
  onClose: () => void;
}

const PROFESSOR_STEPS = [
  { title: 'Personal Info', icon: User, description: 'Tell us about yourself' },
  { title: 'Expertise', icon: GraduationCap, description: 'Your teaching background' },
  { title: 'Courses', icon: BookOpen, description: 'What will you teach?' },
  { title: 'Review & Submit', icon: Send, description: 'Confirm your application' },
];

const UNIVERSITY_STEPS = [
  { title: 'Institution Info', icon: Building2, description: 'About your organization' },
  { title: 'Contact & Admin', icon: User, description: 'Primary administrator' },
  { title: 'Programs', icon: GraduationCap, description: 'Departments & programs' },
  { title: 'Review & Submit', icon: Send, description: 'Submit for approval' },
];

export function ApplicationWizard({ type, onClose }: ApplicationWizardProps) {
  const [step, setStep] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const steps = type === 'professor' ? PROFESSOR_STEPS : UNIVERSITY_STEPS;

  const [profData, setProfData] = useState({
    fullName: '', email: '', phone: '', bio: '',
    expertise: [] as string[], yearsExp: '', degree: '',
    courseTitle: '', courseDesc: '', courseCategory: '', coursePrice: '',
  });

  const [uniData, setUniData] = useState({
    name: '', city: '', country: '', website: '', type: '',
    adminName: '', adminEmail: '', adminPhone: '',
    departments: [] as string[], studentCount: '',
  });

  const EXPERTISE_OPTIONS = ['Computer Science', 'Data Science', 'Mathematics', 'Business', 'Design', 'Engineering', 'Languages', 'Medicine'];
  const DEPT_OPTIONS = ['Computer Science', 'Business Administration', 'Engineering', 'Mathematics', 'Languages', 'Medicine', 'Law', 'Arts & Design'];

  const handleNext = () => {
    if (step < steps.length - 1) setStep(step + 1);
    else { setSubmitted(true); }
  };

  if (submitted) {
    return (
      <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm flex items-center justify-center p-4">
        <div className="bg-card border border-border rounded-2xl shadow-2xl w-full max-w-lg p-8 text-center animate-fade-in">
          <div className="w-20 h-20 gradient-primary rounded-full flex items-center justify-center mx-auto mb-5">
            <CheckCircle size={40} className="text-primary-foreground" />
          </div>
          <h2 className="text-2xl font-black tracking-tight">Application Submitted!</h2>
          <p className="text-muted-foreground mt-2 text-sm leading-relaxed">
            {type === 'professor'
              ? "Your professor application has been received. Our team will review it within 2-3 business days. You'll receive an email notification once approved."
              : "Your university workspace request has been submitted. Our team will contact you within 5 business days to finalize the setup."
            }
          </p>
          <Button onClick={onClose} className="gradient-primary mt-6 font-bold rounded-xl h-11 px-8 text-sm">
            Back to Dashboard
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-card border border-border rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto animate-fade-in">
        {/* Header */}
        <div className="p-5 border-b border-border">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {type === 'professor' ? (
                <div className="w-10 h-10 gradient-primary rounded-xl flex items-center justify-center">
                  <GraduationCap size={20} className="text-primary-foreground" />
                </div>
              ) : (
                <div className="w-10 h-10 gradient-primary rounded-xl flex items-center justify-center">
                  <Building2 size={20} className="text-primary-foreground" />
                </div>
              )}
              <div>
                <h2 className="font-black text-lg tracking-tight">
                  {type === 'professor' ? 'Become an Instructor' : 'Register Your Institution'}
                </h2>
                <p className="text-muted-foreground text-xs">Step {step + 1} of {steps.length}</p>
              </div>
            </div>
            <button onClick={onClose} className="text-muted-foreground hover:text-foreground text-sm font-bold">Cancel</button>
          </div>

          {/* Progress steps */}
          <div className="flex items-center gap-1 mt-4">
            {steps.map((s, i) => (
              <div key={i} className="flex-1 flex items-center gap-1">
                <div className={`flex items-center gap-2 flex-1 ${i <= step ? '' : 'opacity-40'}`}>
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 text-xs font-black ${
                    i < step ? 'bg-success text-success-foreground' : i === step ? 'gradient-primary text-primary-foreground' : 'bg-muted text-muted-foreground'
                  }`}>
                    {i < step ? <CheckCircle size={14} /> : i + 1}
                  </div>
                  <div className="hidden sm:block min-w-0">
                    <p className="text-xs font-bold truncate">{s.title}</p>
                  </div>
                </div>
                {i < steps.length - 1 && <div className={`h-0.5 w-4 sm:w-8 shrink-0 rounded ${i < step ? 'bg-success' : 'bg-muted'}`} />}
              </div>
            ))}
          </div>
        </div>

        {/* Step Content */}
        <div className="p-5 space-y-5">
          <div>
            <h3 className="font-bold text-base flex items-center gap-2">
              {(() => { const StepIcon = steps[step].icon; return <StepIcon size={18} className="text-primary" />; })()}
              {steps[step].title}
            </h3>
            <p className="text-muted-foreground text-sm mt-0.5">{steps[step].description}</p>
          </div>

          {/* PROFESSOR STEPS */}
          {type === 'professor' && step === 0 && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-sm font-semibold mb-1 block">Full Name</label>
                  <Input value={profData.fullName} onChange={e => setProfData(p => ({ ...p, fullName: e.target.value }))} placeholder="Dr. John Doe" className="h-11 rounded-xl" />
                </div>
                <div>
                  <label className="text-sm font-semibold mb-1 block">Email</label>
                  <Input value={profData.email} onChange={e => setProfData(p => ({ ...p, email: e.target.value }))} placeholder="john@example.com" className="h-11 rounded-xl" />
                </div>
              </div>
              <div>
                <label className="text-sm font-semibold mb-1 block">Phone Number</label>
                <Input value={profData.phone} onChange={e => setProfData(p => ({ ...p, phone: e.target.value }))} placeholder="+216 XX XXX XXX" className="h-11 rounded-xl" />
              </div>
              <div>
                <label className="text-sm font-semibold mb-1 block">Short Bio</label>
                <textarea
                  value={profData.bio}
                  onChange={e => setProfData(p => ({ ...p, bio: e.target.value }))}
                  className="w-full h-24 rounded-xl border border-input bg-background px-3 py-2 text-sm resize-none"
                  placeholder="Tell us about yourself, your passion for teaching..."
                />
              </div>
              <div className="glass-card p-4 rounded-xl border-dashed border-2 border-border text-center cursor-pointer hover:border-primary/30 transition-colors">
                <Upload size={24} className="mx-auto text-muted-foreground mb-2" />
                <p className="text-sm font-semibold">Upload your CV or Resume</p>
                <p className="text-xs text-muted-foreground">PDF, DOC up to 10MB</p>
              </div>
            </div>
          )}

          {type === 'professor' && step === 1 && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-sm font-semibold mb-1 block">Highest Degree</label>
                  <select
                    value={profData.degree}
                    onChange={e => setProfData(p => ({ ...p, degree: e.target.value }))}
                    className="w-full h-11 rounded-xl border border-input bg-background px-3 text-sm"
                  >
                    <option value="">Select...</option>
                    <option>Bachelor's</option>
                    <option>Master's</option>
                    <option>PhD / Doctorate</option>
                    <option>Professor (Habilitation)</option>
                  </select>
                </div>
                <div>
                  <label className="text-sm font-semibold mb-1 block">Years of Experience</label>
                  <Input value={profData.yearsExp} onChange={e => setProfData(p => ({ ...p, yearsExp: e.target.value }))} placeholder="e.g. 5" type="number" className="h-11 rounded-xl" />
                </div>
              </div>
              <div>
                <label className="text-sm font-semibold mb-2 block">Areas of Expertise</label>
                <div className="flex flex-wrap gap-2">
                  {EXPERTISE_OPTIONS.map(e => (
                    <button
                      key={e}
                      onClick={() => setProfData(p => ({
                        ...p,
                        expertise: p.expertise.includes(e) ? p.expertise.filter(x => x !== e) : [...p.expertise, e]
                      }))}
                      className={`px-3 py-2 rounded-xl text-sm font-semibold transition-all ${
                        profData.expertise.includes(e)
                          ? 'gradient-primary text-primary-foreground shadow-sm'
                          : 'glass-card text-muted-foreground hover:text-foreground'
                      }`}
                    >
                      {e}
                    </button>
                  ))}
                </div>
              </div>
              <div className="glass-card p-4 rounded-xl border-dashed border-2 border-border text-center cursor-pointer hover:border-primary/30 transition-colors">
                <Upload size={24} className="mx-auto text-muted-foreground mb-2" />
                <p className="text-sm font-semibold">Upload certificates or diplomas</p>
                <p className="text-xs text-muted-foreground">PDF, JPG up to 10MB each</p>
              </div>
            </div>
          )}

          {type === 'professor' && step === 2 && (
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">Describe the first course you'd like to publish on UniLingo.</p>
              <div>
                <label className="text-sm font-semibold mb-1 block">Course Title</label>
                <Input value={profData.courseTitle} onChange={e => setProfData(p => ({ ...p, courseTitle: e.target.value }))} placeholder="e.g. Introduction to Machine Learning" className="h-11 rounded-xl" />
              </div>
              <div>
                <label className="text-sm font-semibold mb-1 block">Description</label>
                <textarea
                  value={profData.courseDesc}
                  onChange={e => setProfData(p => ({ ...p, courseDesc: e.target.value }))}
                  className="w-full h-24 rounded-xl border border-input bg-background px-3 py-2 text-sm resize-none"
                  placeholder="What will students learn? Who is it for?"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-sm font-semibold mb-1 block">Category</label>
                  <select
                    value={profData.courseCategory}
                    onChange={e => setProfData(p => ({ ...p, courseCategory: e.target.value }))}
                    className="w-full h-11 rounded-xl border border-input bg-background px-3 text-sm"
                  >
                    <option value="">Select...</option>
                    {EXPERTISE_OPTIONS.map(c => <option key={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-sm font-semibold mb-1 block">Price (USD)</label>
                  <Input value={profData.coursePrice} onChange={e => setProfData(p => ({ ...p, coursePrice: e.target.value }))} placeholder="0 for Free" type="number" className="h-11 rounded-xl" />
                </div>
              </div>
            </div>
          )}

          {type === 'professor' && step === 3 && (
            <div className="space-y-4">
              <div className="glass-card p-4 rounded-xl space-y-3">
                <h4 className="font-bold text-sm">Application Summary</h4>
                {[
                  { label: 'Name', value: profData.fullName || '—' },
                  { label: 'Email', value: profData.email || '—' },
                  { label: 'Degree', value: profData.degree || '—' },
                  { label: 'Experience', value: profData.yearsExp ? `${profData.yearsExp} years` : '—' },
                  { label: 'Expertise', value: profData.expertise.join(', ') || '—' },
                  { label: 'Course', value: profData.courseTitle || '—' },
                  { label: 'Price', value: profData.coursePrice ? `$${profData.coursePrice}` : 'Free' },
                ].map((item, i) => (
                  <div key={i} className="flex justify-between items-center py-1.5 border-b border-border/50 last:border-0">
                    <span className="text-sm text-muted-foreground">{item.label}</span>
                    <span className="text-sm font-semibold">{item.value}</span>
                  </div>
                ))}
              </div>
              <div className="glass-card p-4 rounded-xl bg-primary/5 border-primary/20">
                <p className="text-sm leading-relaxed">
                  <strong>What happens next?</strong> Our team will review your application within 2-3 business days. 
                  Once approved, you'll get access to the instructor dashboard where you can publish and manage courses.
                </p>
              </div>
            </div>
          )}

          {/* UNIVERSITY STEPS */}
          {type === 'university' && step === 0 && (
            <div className="space-y-4">
              <div>
                <label className="text-sm font-semibold mb-1 block">Institution Name</label>
                <Input value={uniData.name} onChange={e => setUniData(p => ({ ...p, name: e.target.value }))} placeholder="e.g. ESPRIT, ISG Tunis" className="h-11 rounded-xl" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-sm font-semibold mb-1 block">City</label>
                  <Input value={uniData.city} onChange={e => setUniData(p => ({ ...p, city: e.target.value }))} placeholder="Tunis" className="h-11 rounded-xl" />
                </div>
                <div>
                  <label className="text-sm font-semibold mb-1 block">Country</label>
                  <Input value={uniData.country} onChange={e => setUniData(p => ({ ...p, country: e.target.value }))} placeholder="Tunisia" className="h-11 rounded-xl" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-sm font-semibold mb-1 block">Website</label>
                  <Input value={uniData.website} onChange={e => setUniData(p => ({ ...p, website: e.target.value }))} placeholder="https://..." className="h-11 rounded-xl" />
                </div>
                <div>
                  <label className="text-sm font-semibold mb-1 block">Institution Type</label>
                  <select
                    value={uniData.type}
                    onChange={e => setUniData(p => ({ ...p, type: e.target.value }))}
                    className="w-full h-11 rounded-xl border border-input bg-background px-3 text-sm"
                  >
                    <option value="">Select...</option>
                    <option>University</option>
                    <option>Engineering School</option>
                    <option>Business School</option>
                    <option>Formation Center</option>
                    <option>Research Institute</option>
                  </select>
                </div>
              </div>
              <div className="glass-card p-4 rounded-xl border-dashed border-2 border-border text-center cursor-pointer hover:border-primary/30 transition-colors">
                <Upload size={24} className="mx-auto text-muted-foreground mb-2" />
                <p className="text-sm font-semibold">Upload institution logo</p>
                <p className="text-xs text-muted-foreground">PNG, JPG up to 5MB</p>
              </div>
            </div>
          )}

          {type === 'university' && step === 1 && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-sm font-semibold mb-1 block">Admin Full Name</label>
                  <Input value={uniData.adminName} onChange={e => setUniData(p => ({ ...p, adminName: e.target.value }))} placeholder="Full name" className="h-11 rounded-xl" />
                </div>
                <div>
                  <label className="text-sm font-semibold mb-1 block">Admin Email</label>
                  <Input value={uniData.adminEmail} onChange={e => setUniData(p => ({ ...p, adminEmail: e.target.value }))} placeholder="admin@university.edu" className="h-11 rounded-xl" />
                </div>
              </div>
              <div>
                <label className="text-sm font-semibold mb-1 block">Admin Phone</label>
                <Input value={uniData.adminPhone} onChange={e => setUniData(p => ({ ...p, adminPhone: e.target.value }))} placeholder="+216 XX XXX XXX" className="h-11 rounded-xl" />
              </div>
              <div>
                <label className="text-sm font-semibold mb-1 block">Estimated Student Count</label>
                <Input value={uniData.studentCount} onChange={e => setUniData(p => ({ ...p, studentCount: e.target.value }))} placeholder="e.g. 500" type="number" className="h-11 rounded-xl" />
              </div>
            </div>
          )}

          {type === 'university' && step === 2 && (
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">Select the departments your institution offers:</p>
              <div className="grid grid-cols-2 gap-2">
                {DEPT_OPTIONS.map(d => (
                  <button
                    key={d}
                    onClick={() => setUniData(p => ({
                      ...p,
                      departments: p.departments.includes(d) ? p.departments.filter(x => x !== d) : [...p.departments, d]
                    }))}
                    className={`px-4 py-3 rounded-xl text-sm font-semibold transition-all text-left ${
                      uniData.departments.includes(d)
                        ? 'gradient-primary text-primary-foreground shadow-sm'
                        : 'glass-card text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    {d}
                  </button>
                ))}
              </div>
            </div>
          )}

          {type === 'university' && step === 3 && (
            <div className="space-y-4">
              <div className="glass-card p-4 rounded-xl space-y-3">
                <h4 className="font-bold text-sm">Application Summary</h4>
                {[
                  { label: 'Institution', value: uniData.name || '—' },
                  { label: 'Location', value: [uniData.city, uniData.country].filter(Boolean).join(', ') || '—' },
                  { label: 'Type', value: uniData.type || '—' },
                  { label: 'Admin', value: uniData.adminName || '—' },
                  { label: 'Admin Email', value: uniData.adminEmail || '—' },
                  { label: 'Students', value: uniData.studentCount || '—' },
                  { label: 'Departments', value: uniData.departments.join(', ') || '—' },
                ].map((item, i) => (
                  <div key={i} className="flex justify-between items-center py-1.5 border-b border-border/50 last:border-0">
                    <span className="text-sm text-muted-foreground">{item.label}</span>
                    <span className="text-sm font-semibold text-right max-w-[60%]">{item.value}</span>
                  </div>
                ))}
              </div>
              <div className="glass-card p-4 rounded-xl bg-primary/5 border-primary/20">
                <p className="text-sm leading-relaxed">
                  <strong>What happens next?</strong> Our onboarding team will review your application and contact you 
                  within 5 business days to set up your workspace, configure departments, and onboard your staff.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-5 border-t border-border flex justify-between">
          <Button
            variant="outline"
            onClick={() => step > 0 ? setStep(step - 1) : onClose()}
            className="rounded-xl h-11 font-semibold text-sm"
          >
            <ChevronLeft size={16} className="mr-1" />
            {step > 0 ? 'Back' : 'Cancel'}
          </Button>
          <Button onClick={handleNext} className="gradient-primary rounded-xl h-11 font-bold text-sm px-6">
            {step === steps.length - 1 ? 'Submit Application' : 'Continue'}
            {step < steps.length - 1 && <ChevronRight size={16} className="ml-1" />}
          </Button>
        </div>
      </div>
    </div>
  );
}
