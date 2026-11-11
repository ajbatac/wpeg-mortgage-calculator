import { useContext } from 'react';
import { ThemeContext } from '@/react-app/context/themeContextDef';

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}

export type { Theme, ThemeContextType } from '@/react-app/context/themeContextDef';
