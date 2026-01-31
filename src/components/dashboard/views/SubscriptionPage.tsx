import { CheckCircle } from 'lucide-react';
import { SUBSCRIPTION_TIERS } from '@/lib/constants';
import { Button } from '@/components/ui/button';

export function SubscriptionPage() {
  return (
    <div className="space-y-12 animate-fade-in">
      <div className="text-center space-y-4">
        <h2 className="text-5xl font-black italic tracking-tighter">SELECT YOUR CATALYST</h2>
        <p className="text-muted-foreground font-bold uppercase tracking-widest">
          Empower your learning journey with premium perks
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {SUBSCRIPTION_TIERS.map((tier, i) => (
          <div 
            key={i} 
            className={`glass-card p-10 rounded-4xl border-2 flex flex-col relative transition-all hover:scale-[1.02] ${
              tier.popular ? 'border-primary bg-primary/5' : 'border-border'
            }`}
          >
            {tier.popular && (
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 gradient-primary text-primary-foreground px-6 py-1 rounded-full font-black text-xs uppercase tracking-widest">
                Most Popular
              </div>
            )}
            <tier.icon size={48} className="mb-6 text-primary" />
            <h3 className="text-3xl font-black italic">{tier.name}</h3>
            <div className="flex items-baseline gap-1 my-4">
              <span className="text-4xl font-black italic">{tier.price}</span>
              {tier.price !== 'Free' && (
                <span className="text-muted-foreground font-bold text-sm uppercase">/ Month</span>
              )}
            </div>
            <ul className="space-y-4 flex-1 mt-6">
              {tier.features.map((f, j) => (
                <li key={j} className="flex items-center gap-3 font-bold text-muted-foreground">
                  <CheckCircle size={18} className="text-primary" /> {f}
                </li>
              ))}
            </ul>
            <Button 
              className={`w-full mt-10 py-6 rounded-2xl font-black text-lg ${
                tier.popular 
                  ? 'gradient-primary text-primary-foreground shadow-xl' 
                  : 'bg-muted hover:bg-muted/80'
              }`}
            >
              CHOOSE PATH
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
}
