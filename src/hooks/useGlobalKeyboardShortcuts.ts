import { useEffect, useRef } from 'react';
import { logger } from '@/utils/logger';

interface KeyboardShortcut {
  keys: string[];
  handler: (e: KeyboardEvent) => void;
  description?: string;
}

export const useGlobalKeyboardShortcuts = (shortcuts: KeyboardShortcut[] = []) => {
  const registeredShortcutsRef = useRef<KeyboardShortcut[]>([]);

  useEffect(() => {
    // Default shortcuts
    const defaultShortcuts: KeyboardShortcut[] = [
      {
        keys: ['Meta', 'k'],
        handler: (e: KeyboardEvent) => {
          e.preventDefault();
          const searchInput = document.querySelector('[data-testid="search-visual-input"]') as HTMLInputElement;
          if (searchInput && document.activeElement !== searchInput) {
            const navbarSearch = document.querySelector('[role="searchbox"]') as HTMLInputElement;
            if (navbarSearch) {
              navbarSearch.focus();
              logger.debug('Focused search input via Cmd+K');
            }
          }
        },
        description: 'Focus search (⌘K / Ctrl+K)'
      },
      {
        keys: ['Control', 'k'],
        handler: (e: KeyboardEvent) => {
          e.preventDefault();
          const navbarSearch = document.querySelector('[role="searchbox"]') as HTMLInputElement;
          if (navbarSearch && document.activeElement !== navbarSearch) {
            navbarSearch.focus();
            logger.debug('Focused search input via Ctrl+K');
          }
        },
        description: 'Focus search (Ctrl+K)'
      },
      {
        keys: ['Escape'],
        handler: (e: KeyboardEvent) => {
          const activeInput = document.activeElement as HTMLInputElement;
          if (activeInput?.type === 'text' || activeInput?.type === 'search') {
            activeInput.blur();
            logger.debug('Closed search input via Escape');
          }
        },
        description: 'Close search (Esc)'
      }
    ];

    registeredShortcutsRef.current = [...defaultShortcuts, ...shortcuts];

    const handleKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement;
      const isFormElement = ['INPUT', 'TEXTAREA', 'SELECT'].includes(target.tagName);

      for (const shortcut of registeredShortcutsRef.current) {
        const keys = shortcut.keys.map(k => k.toLowerCase());
        const pressedKeys = [
          e.ctrlKey && 'control',
          e.metaKey && 'meta',
          e.shiftKey && 'shift',
          e.altKey && 'alt',
          e.key.toLowerCase()
        ].filter(Boolean);

        const isMatch = keys.length === pressedKeys.length &&
          keys.every(key => pressedKeys.includes(key));

        if (isMatch) {
          if (isFormElement && !['meta', 'control'].some(k => keys.includes(k))) {
            continue;
          }
          shortcut.handler(e);
          break;
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown, { capture: false });

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [shortcuts]);

  return registeredShortcutsRef.current;
};
