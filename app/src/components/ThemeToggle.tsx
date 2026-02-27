import { motion } from 'framer-motion';
import { Sun, Moon, Monitor } from 'lucide-react';
import { useTheme } from '../hooks/useTheme';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';

export function ThemeToggle() {
  const { theme, resolvedTheme, setTheme } = useTheme();

  const icons = {
    light: Sun,
    dark: Moon,
    system: Monitor,
  };

  const Icon = icons[theme];

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className="gap-2">
          <motion.div
            initial={false}
            animate={{ rotate: resolvedTheme === 'dark' ? 180 : 0 }}
            transition={{ duration: 0.3 }}
          >
            <Icon className="w-4 h-4" />
          </motion.div>
          <span className="hidden md:inline text-sm capitalize">{theme}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem
          onClick={() => setTheme('light')}
          className="gap-2 cursor-pointer"
        >
          <Sun className="w-4 h-4" />
          <span>Light</span>
          {theme === 'light' && <span className="ml-auto text-xs text-indigo-500">✓</span>}
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => setTheme('dark')}
          className="gap-2 cursor-pointer"
        >
          <Moon className="w-4 h-4" />
          <span>Dark</span>
          {theme === 'dark' && <span className="ml-auto text-xs text-indigo-500">✓</span>}
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => setTheme('system')}
          className="gap-2 cursor-pointer"
        >
          <Monitor className="w-4 h-4" />
          <span>System</span>
          {theme === 'system' && <span className="ml-auto text-xs text-indigo-500">✓</span>}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
