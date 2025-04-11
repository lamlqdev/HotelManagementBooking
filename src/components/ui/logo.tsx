import { cn } from "@/lib/utils";

interface LogoProps {
  className?: string;
  showDot?: boolean;
}

export const Logo = ({ className, showDot = true }: LogoProps) => {
  return (
    <div className={cn("flex items-center gap-1", className)}>
      <span className="text-2xl font-bold bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
        Book
      </span>
      <span className="text-2xl font-bold text-foreground">It</span>
      {showDot && (
        <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse mt-1"></div>
      )}
    </div>
  );
};
