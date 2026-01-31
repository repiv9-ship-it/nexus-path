import { useState } from 'react';
import { ArrowLeft, ArrowRight, BookOpen, FileText, Video, HelpCircle, Plus, Trash2, GripVertical, Check, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { XPBar } from '@/components/ui/xp-bar';
import { FIELDS, LEVELS } from '@/lib/constants';

interface CourseCreationWizardProps {
  onClose: () => void;
}

type Step = 'basics' | 'modules' | 'content' | 'settings' | 'review';

interface Module {
  id: string;
  title: string;
  levels: Level[];
}

interface Level {
  id: string;
  title: string;
  type: 'text' | 'video' | 'quiz';
  xp: number;
}

export function CourseCreationWizard({ onClose }: CourseCreationWizardProps) {
  const [step, setStep] = useState<Step>('basics');
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    field: '',
    level: '',
    classes: [] as string[],
    thumbnail: '',
  });
  const [modules, setModules] = useState<Module[]>([
    { 
      id: '1', 
      title: 'Introduction', 
      levels: [
        { id: '1-1', title: 'Welcome', type: 'text', xp: 50 },
        { id: '1-2', title: 'Overview Video', type: 'video', xp: 100 },
      ] 
    }
  ]);

  const steps: Step[] = ['basics', 'modules', 'content', 'settings', 'review'];
  const stepIndex = steps.indexOf(step);

  const addModule = () => {
    setModules([...modules, {
      id: Date.now().toString(),
      title: `Module ${modules.length + 1}`,
      levels: []
    }]);
  };

  const addLevel = (moduleId: string, type: 'text' | 'video' | 'quiz') => {
    setModules(modules.map(m => {
      if (m.id === moduleId) {
        return {
          ...m,
          levels: [...m.levels, {
            id: `${moduleId}-${Date.now()}`,
            title: `New ${type === 'text' ? 'Scroll' : type === 'video' ? 'Oracle' : 'Boss Fight'}`,
            type,
            xp: type === 'quiz' ? 500 : 100
          }]
        };
      }
      return m;
    }));
  };

  const removeModule = (moduleId: string) => {
    setModules(modules.filter(m => m.id !== moduleId));
  };

  const removeLevel = (moduleId: string, levelId: string) => {
    setModules(modules.map(m => {
      if (m.id === moduleId) {
        return { ...m, levels: m.levels.filter(l => l.id !== levelId) };
      }
      return m;
    }));
  };

  const renderStep = () => {
    switch (step) {
      case 'basics':
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-black italic tracking-tighter">Course Basics</h2>
              <p className="text-muted-foreground font-bold">Define your course identity</p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-black uppercase tracking-widest mb-2">Course Title</label>
                <Input 
                  placeholder="e.g., Advanced Data Structures"
                  className="h-14 rounded-xl font-bold"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                />
              </div>

              <div>
                <label className="block text-sm font-black uppercase tracking-widest mb-2">Description</label>
                <Textarea 
                  placeholder="Describe what students will learn..."
                  className="min-h-32 rounded-xl font-bold resize-none"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-black uppercase tracking-widest mb-2">Field</label>
                  <select 
                    className="w-full h-14 px-4 rounded-xl border border-input bg-background font-bold"
                    value={formData.field}
                    onChange={(e) => setFormData({ ...formData, field: e.target.value })}
                  >
                    <option value="">Select field...</option>
                    {FIELDS.map(f => <option key={f} value={f}>{f}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-black uppercase tracking-widest mb-2">Level</label>
                  <select 
                    className="w-full h-14 px-4 rounded-xl border border-input bg-background font-bold"
                    value={formData.level}
                    onChange={(e) => setFormData({ ...formData, level: e.target.value })}
                  >
                    <option value="">Select level...</option>
                    {LEVELS.map(l => <option key={l} value={l}>{l}</option>)}
                  </select>
                </div>
              </div>
            </div>
          </div>
        );

      case 'modules':
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-black italic tracking-tighter">Build Your Modules</h2>
              <p className="text-muted-foreground font-bold">Structure the learning journey</p>
            </div>

            <div className="space-y-4">
              {modules.map((module, index) => (
                <div key={module.id} className="glass-card p-6 rounded-3xl">
                  <div className="flex items-center gap-4 mb-4">
                    <GripVertical className="text-muted-foreground cursor-grab" size={20} />
                    <div className="w-10 h-10 gradient-primary rounded-xl flex items-center justify-center text-primary-foreground font-black">
                      {index + 1}
                    </div>
                    <Input 
                      value={module.title}
                      onChange={(e) => {
                        setModules(modules.map(m => 
                          m.id === module.id ? { ...m, title: e.target.value } : m
                        ));
                      }}
                      className="flex-1 h-12 rounded-xl font-black text-lg border-none bg-transparent"
                    />
                    <Button 
                      variant="ghost" 
                      size="icon"
                      onClick={() => removeModule(module.id)}
                      className="text-destructive hover:bg-destructive/10"
                    >
                      <Trash2 size={18} />
                    </Button>
                  </div>

                  {/* Levels */}
                  <div className="ml-14 space-y-2">
                    {module.levels.map((level) => (
                      <div key={level.id} className="flex items-center gap-3 p-3 bg-muted/50 rounded-xl group">
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                          level.type === 'text' ? 'bg-primary/10 text-primary' :
                          level.type === 'video' ? 'bg-secondary/10 text-secondary' :
                          'bg-destructive/10 text-destructive'
                        }`}>
                          {level.type === 'text' ? <FileText size={16} /> :
                           level.type === 'video' ? <Video size={16} /> :
                           <HelpCircle size={16} />}
                        </div>
                        <span className="flex-1 font-bold">{level.title}</span>
                        <span className="text-xs font-black text-primary">+{level.xp} XP</span>
                        <Button 
                          variant="ghost" 
                          size="icon"
                          onClick={() => removeLevel(module.id, level.id)}
                          className="opacity-0 group-hover:opacity-100 text-destructive hover:bg-destructive/10 h-8 w-8"
                        >
                          <Trash2 size={14} />
                        </Button>
                      </div>
                    ))}

                    {/* Add Level Buttons */}
                    <div className="flex gap-2 pt-2">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => addLevel(module.id, 'text')}
                        className="rounded-xl"
                      >
                        <FileText size={14} className="mr-1" /> Scroll
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => addLevel(module.id, 'video')}
                        className="rounded-xl"
                      >
                        <Video size={14} className="mr-1" /> Oracle
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => addLevel(module.id, 'quiz')}
                        className="rounded-xl"
                      >
                        <HelpCircle size={14} className="mr-1" /> Boss
                      </Button>
                    </div>
                  </div>
                </div>
              ))}

              <Button 
                variant="outline" 
                onClick={addModule}
                className="w-full py-6 rounded-2xl border-dashed border-2"
              >
                <Plus size={20} className="mr-2" /> Add Module
              </Button>
            </div>
          </div>
        );

      case 'content':
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-black italic tracking-tighter">Add Content</h2>
              <p className="text-muted-foreground font-bold">Upload materials for each level</p>
            </div>

            <div className="glass-card p-12 rounded-4xl text-center">
              <BookOpen size={48} className="mx-auto text-muted-foreground mb-4" />
              <p className="font-bold text-muted-foreground mb-4">
                Content upload will be available after saving the course structure.
              </p>
              <p className="text-sm text-muted-foreground">
                You can add PDFs, videos, and quiz questions from the course editor.
              </p>
            </div>
          </div>
        );

      case 'settings':
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-black italic tracking-tighter">Course Settings</h2>
              <p className="text-muted-foreground font-bold">Configure access and visibility</p>
            </div>

            <div className="space-y-4">
              <div className="glass-card p-6 rounded-3xl">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-black">Require Enrollment</p>
                    <p className="text-sm text-muted-foreground">Students must be enrolled to access</p>
                  </div>
                  <div className="w-12 h-6 bg-primary rounded-full relative cursor-pointer">
                    <div className="w-5 h-5 bg-primary-foreground rounded-full absolute right-0.5 top-0.5" />
                  </div>
                </div>
              </div>

              <div className="glass-card p-6 rounded-3xl">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-black">Sequential Progression</p>
                    <p className="text-sm text-muted-foreground">Levels must be completed in order</p>
                  </div>
                  <div className="w-12 h-6 bg-primary rounded-full relative cursor-pointer">
                    <div className="w-5 h-5 bg-primary-foreground rounded-full absolute right-0.5 top-0.5" />
                  </div>
                </div>
              </div>

              <div className="glass-card p-6 rounded-3xl">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-black">Award Certificate</p>
                    <p className="text-sm text-muted-foreground">Issue certificate on completion</p>
                  </div>
                  <div className="w-12 h-6 bg-muted rounded-full relative cursor-pointer">
                    <div className="w-5 h-5 bg-muted-foreground rounded-full absolute left-0.5 top-0.5" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      case 'review':
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-black italic tracking-tighter">Review & Publish</h2>
              <p className="text-muted-foreground font-bold">Confirm your course details</p>
            </div>

            <div className="glass-card p-8 rounded-4xl space-y-6">
              <div className="flex items-center gap-6">
                <div className="w-24 h-24 gradient-primary rounded-3xl flex items-center justify-center">
                  <BookOpen size={40} className="text-primary-foreground" />
                </div>
                <div>
                  <h3 className="text-2xl font-black italic">{formData.title || 'Untitled Course'}</h3>
                  <p className="text-muted-foreground font-bold">{formData.field} • {formData.level}</p>
                </div>
              </div>

              <p className="text-muted-foreground">{formData.description || 'No description provided.'}</p>

              <div className="grid grid-cols-3 gap-4 pt-4 border-t border-border">
                <div className="text-center">
                  <p className="text-3xl font-black text-primary">{modules.length}</p>
                  <p className="text-xs font-bold text-muted-foreground uppercase">Modules</p>
                </div>
                <div className="text-center">
                  <p className="text-3xl font-black text-secondary">
                    {modules.reduce((acc, m) => acc + m.levels.length, 0)}
                  </p>
                  <p className="text-xs font-bold text-muted-foreground uppercase">Levels</p>
                </div>
                <div className="text-center">
                  <p className="text-3xl font-black text-success">
                    {modules.reduce((acc, m) => acc + m.levels.reduce((a, l) => a + l.xp, 0), 0)}
                  </p>
                  <p className="text-xs font-bold text-muted-foreground uppercase">Total XP</p>
                </div>
              </div>
            </div>

            <div className="flex gap-4">
              <Button variant="outline" className="flex-1 py-6 rounded-2xl font-black">
                Save as Draft
              </Button>
              <Button 
                onClick={onClose}
                className="flex-1 py-6 rounded-2xl gradient-primary font-black shadow-xl"
              >
                <Sparkles size={20} className="mr-2" />
                Publish Course
              </Button>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="max-w-3xl mx-auto animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <button 
          onClick={onClose}
          className="flex items-center gap-2 font-black text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft size={20} /> Exit Wizard
        </button>
        <div className="text-right">
          <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">
            Step {stepIndex + 1} of {steps.length}
          </p>
        </div>
      </div>

      {/* Progress */}
      <div className="mb-12">
        <XPBar progress={(stepIndex / (steps.length - 1)) * 100} />
        <div className="flex justify-between mt-4">
          {steps.map((s, i) => (
            <button
              key={s}
              onClick={() => setStep(s)}
              className={`text-xs font-black uppercase tracking-widest transition-colors ${
                i <= stepIndex ? 'text-primary' : 'text-muted-foreground'
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* Step Content */}
      {renderStep()}

      {/* Navigation */}
      {step !== 'review' && (
        <div className="flex justify-between mt-12">
          <Button
            variant="outline"
            onClick={() => setStep(steps[Math.max(0, stepIndex - 1)])}
            disabled={stepIndex === 0}
            className="rounded-xl font-black"
          >
            <ArrowLeft size={18} className="mr-2" /> Back
          </Button>
          <Button
            onClick={() => setStep(steps[Math.min(steps.length - 1, stepIndex + 1)])}
            className="gradient-primary rounded-xl font-black"
          >
            Next <ArrowRight size={18} className="ml-2" />
          </Button>
        </div>
      )}
    </div>
  );
}
