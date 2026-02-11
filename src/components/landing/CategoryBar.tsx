import { CATEGORIES } from '@/lib/constants';

interface CategoryBarProps {
  selected: string;
  onSelect: (category: string) => void;
}

export function CategoryBar({ selected, onSelect }: CategoryBarProps) {
  return (
    <div className="border-b border-border bg-card/50 sticky top-16 z-30 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex gap-1 overflow-x-auto py-3 scrollbar-hide">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => onSelect(cat)}
              className={`px-4 py-1.5 text-xs sm:text-sm font-semibold rounded-lg whitespace-nowrap transition-colors ${
                selected === cat
                  ? 'bg-primary text-primary-foreground'
                  : 'text-muted-foreground hover:bg-muted hover:text-foreground'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
