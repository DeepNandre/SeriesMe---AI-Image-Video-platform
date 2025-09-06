import { useLocation } from 'react-router-dom';
import { Plus, FolderOpen, Info } from 'lucide-react';
import { cn } from '@/lib/utils';

interface NavItem {
  href: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  isPrimary?: boolean;
}

const navItems: NavItem[] = [
  { href: '/create', label: 'Create', icon: Plus, isPrimary: true },
  { href: '/library', label: 'Library', icon: FolderOpen },
  { href: '/about', label: 'About', icon: Info },
];

export default function Navigation() {
  const location = useLocation();

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-background border-t border-border safe-area-inset z-50">
      <div className="max-w-md mx-auto px-4">
        <div className="flex justify-around py-2">
          {navItems.map((item) => {
            const isActive = location.pathname === item.href;
            const Icon = item.icon;
            
            return (
              <a
                key={item.href}
                href={item.href}
                className={cn(
                  "flex flex-col items-center py-2 px-3 rounded-lg transition-all duration-200 touch-target",
                  isActive 
                    ? "text-primary bg-primary/10" 
                    : "text-muted-foreground hover:text-foreground hover:bg-muted/50",
                  item.isPrimary && !isActive && "text-primary/70"
                )}
              >
                <Icon className={cn(
                  "h-6 w-6 mb-1",
                  item.isPrimary && "h-7 w-7"
                )} />
                <span className={cn(
                  "text-xs font-medium",
                  item.isPrimary && "text-sm font-semibold"
                )}>
                  {item.label}
                </span>
              </a>
            );
          })}
        </div>
      </div>
    </nav>
  );
}