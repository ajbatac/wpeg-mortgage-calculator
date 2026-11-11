import { useEffect, useRef, useState } from 'react';
import { Palette, Check, ChevronDown } from 'lucide-react';
import { COLOR_THEMES, getAuthoredVars } from '@/shared/themes';
import { useColorTheme } from '@/react-app/hooks/useColorTheme';

interface SelectorEntry {
  id: string | null;
  name: string;
  /** Four preview swatches: background, primary, accent, first chart colour. */
  swatches: string[];
}

/** WPEG brand default, shown first; previews use fixed brand values. */
const WPEG_ENTRY: SelectorEntry = {
  id: null,
  name: 'WPEG',
  swatches: ['hsl(252 33% 97%)', 'hsl(256 31% 47%)', 'hsl(341 56% 66%)', 'hsl(256 31% 47%)'],
};

const ENTRIES: readonly SelectorEntry[] = [
  WPEG_ENTRY,
  ...COLOR_THEMES.map((theme) => {
    const vars = getAuthoredVars(theme);
    return {
      id: theme.id,
      name: theme.name,
      swatches: [
        `hsl(${vars.background})`,
        `hsl(${vars.primary})`,
        `hsl(${vars.accent})`,
        `hsl(${vars.charts[0]})`,
      ],
    };
  }),
];

export default function ColorThemeSelector() {
  const { themeId, setColorTheme } = useColorTheme();
  const [showMenu, setShowMenu] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const itemRefs = useRef<(HTMLButtonElement | null)[]>([]);

  const activeName = ENTRIES.find((entry) => entry.id === themeId)?.name ?? 'WPEG';

  useEffect(() => {
    if (!showMenu) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setShowMenu(false);
        triggerRef.current?.focus();
        return;
      }

      if (event.key === 'Tab') {
        setShowMenu(false);
        return;
      }

      const activeElement = document.activeElement as HTMLElement | null;
      const currentIndex = itemRefs.current.findIndex((btn) => btn === activeElement);

      if (event.key === 'ArrowDown') {
        event.preventDefault();
        const nextIndex = currentIndex < 0 || currentIndex === ENTRIES.length - 1 ? 0 : currentIndex + 1;
        itemRefs.current[nextIndex]?.focus();
      } else if (event.key === 'ArrowUp') {
        event.preventDefault();
        const prevIndex = currentIndex <= 0 ? ENTRIES.length - 1 : currentIndex - 1;
        itemRefs.current[prevIndex]?.focus();
      } else if (event.key === 'Home') {
        event.preventDefault();
        itemRefs.current[0]?.focus();
      } else if (event.key === 'End') {
        event.preventDefault();
        itemRefs.current[ENTRIES.length - 1]?.focus();
      }
    };

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [showMenu]);

  // Focus active theme button when menu opens
  useEffect(() => {
    if (showMenu) {
      const selectedIndex = ENTRIES.findIndex((entry) => entry.id === themeId);
      const targetIndex = selectedIndex >= 0 ? selectedIndex : 0;
      requestAnimationFrame(() => {
        itemRefs.current[targetIndex]?.focus();
      });
    }
  }, [showMenu, themeId]);

  const select = (id: string | null) => {
    setColorTheme(id);
    setShowMenu(false);
    triggerRef.current?.focus();
  };

  return (
    <div className="relative" ref={menuRef}>
      <button
        ref={triggerRef}
        type="button"
        onClick={() => setShowMenu(!showMenu)}
        className="flex items-center gap-1.5 px-3 theme-button cursor-pointer"
        aria-label={`Color theme menu. Current theme: ${activeName}`}
        aria-expanded={showMenu}
        aria-haspopup="menu"
      >
        <Palette className="w-4 h-4" />
        <span className="hidden sm:inline">{activeName}</span>
        <ChevronDown className="w-3.5 h-3.5 opacity-70" aria-hidden="true" />
      </button>

      {showMenu && (
        <>
          {/* Backdrop */}
          <div className="fixed inset-0 z-10" onClick={() => setShowMenu(false)} aria-hidden="true" />

          {/* Menu */}
          <div
            role="menu"
            aria-label="Color themes"
            className="absolute right-0 mt-2 w-60 theme-surface border border-border rounded-[var(--radius)] shadow-xl z-20 max-h-[70vh] overflow-y-auto toc-scroll"
          >
            <div className="py-2">
              {ENTRIES.map((entry, index) => {
                const isSelected = themeId === entry.id;
                return (
                  <button
                    key={entry.id ?? 'wpeg'}
                    ref={(el) => { itemRefs.current[index] = el; }}
                    type="button"
                    role="menuitemcheckbox"
                    aria-checked={isSelected}
                    tabIndex={showMenu ? 0 : -1}
                    onClick={() => select(entry.id)}
                    className={`w-full min-h-[44px] px-3 py-2 text-left flex items-center gap-3 transition-colors cursor-pointer outline-none focus:bg-muted ${
                      isSelected ? 'bg-muted/60' : 'hover:bg-muted/50'
                    }`}
                  >
                    <span
                      className="flex items-center gap-1 p-1 rounded-md border border-border flex-shrink-0"
                      aria-hidden="true"
                    >
                      {entry.swatches.map((swatch, sIdx) => (
                        <span key={sIdx} className="w-3 h-3 rounded-[3px]" style={{ background: swatch }} />
                      ))}
                    </span>
                    <span className="flex-1 text-sm font-medium text-foreground truncate">{entry.name}</span>
                    {isSelected && <Check className="w-4 h-4 text-primary flex-shrink-0" />}
                  </button>
                );
              })}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
