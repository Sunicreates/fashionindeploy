import React from 'react';
import { Moon, Sun, Palette } from 'lucide-react';
import { useTheme } from './ui/theme-provider';
import { Button } from './ui/button';
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';

const ThemeToggle: React.FC = () => {
  const { theme, setTheme } = useTheme();

  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
          <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          <span className="sr-only">Toggle theme</span>
        </Button>
      </DropdownMenu.Trigger>
      <DropdownMenu.Content 
        align="end" 
        className="glass-effect rounded-xl p-2 shadow-xl border border-pink-200/30 dark:border-pink-800/30 min-w-[160px]"
      >
        <DropdownMenu.Item
          onClick={() => setTheme('light')}
          className="flex items-center gap-2 px-3 py-2 rounded-lg cursor-pointer hover:bg-pink-50 dark:hover:bg-pink-900/20 transition-colors"
        >
          <Sun className="h-4 w-4" />
          <span className="text-sm font-medium">Light</span>
          {theme === 'light' && <div className="ml-auto w-2 h-2 bg-pink-500 rounded-full" />}
        </DropdownMenu.Item>
        <DropdownMenu.Item
          onClick={() => setTheme('dark')}
          className="flex items-center gap-2 px-3 py-2 rounded-lg cursor-pointer hover:bg-pink-50 dark:hover:bg-pink-900/20 transition-colors"
        >
          <Moon className="h-4 w-4" />
          <span className="text-sm font-medium">Dark</span>
          {theme === 'dark' && <div className="ml-auto w-2 h-2 bg-pink-500 rounded-full" />}
        </DropdownMenu.Item>
        <DropdownMenu.Item
          onClick={() => setTheme('system')}
          className="flex items-center gap-2 px-3 py-2 rounded-lg cursor-pointer hover:bg-pink-50 dark:hover:bg-pink-900/20 transition-colors"
        >
          <Palette className="h-4 w-4" />
          <span className="text-sm font-medium">System</span>
          {theme === 'system' && <div className="ml-auto w-2 h-2 bg-pink-500 rounded-full" />}
        </DropdownMenu.Item>
      </DropdownMenu.Content>
    </DropdownMenu.Root>
  );
};

export default ThemeToggle;