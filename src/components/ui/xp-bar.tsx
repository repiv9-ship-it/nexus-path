import { cn } from "@/lib/utils";

interface XPBarProps {
  progress: number;
  color?: string;
  size?: "sm" | "md" | "lg";
  className?: string;
  showLabel?: boolean;
}

export function XPBar({ 
  progress, 
  color = "from-primary to-secondary", 
  size = "md",
  className,
  showLabel = false 
}: XPBarProps) {
  const sizeClasses = {
    sm: "h-2",
    md: "h-3",
    lg: "h-4",
  };

  return (
    <div className={cn("w-full", className)}>
      <div className={cn(
        "w-full bg-muted rounded-full overflow-hidden p-0.5",
        sizeClasses[size]
      )}>
        <div 
          className={cn(
            "bg-gradient-to-r h-full rounded-full transition-all duration-1000 ease-out",
            color
          )} 
          style={{ width: `${Math.min(100, Math.max(0, progress))}%` }}
        />
      </div>
      {showLabel && (
        <p className="text-xs font-bold text-muted-foreground mt-1">{progress}% Complete</p>
      )}
    </div>
  );
}
