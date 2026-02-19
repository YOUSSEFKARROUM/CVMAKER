import { useEffect, useCallback } from 'react';

interface ShortcutConfig {
  key: string;
  ctrl?: boolean;
  shift?: boolean;
  alt?: boolean;
  meta?: boolean;
  handler: () => void;
  preventDefault?: boolean;
}

export function useKeyboardShortcuts(shortcuts: ShortcutConfig[]) {
  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      for (const shortcut of shortcuts) {
        const keyMatch = event.key.toLowerCase() === shortcut.key.toLowerCase();
        const ctrlMatch = !!shortcut.ctrl === event.ctrlKey;
        const shiftMatch = !!shortcut.shift === event.shiftKey;
        const altMatch = !!shortcut.alt === event.altKey;
        const metaMatch = !!shortcut.meta === event.metaKey;

        if (keyMatch && ctrlMatch && shiftMatch && altMatch && metaMatch) {
          if (shortcut.preventDefault !== false) {
            event.preventDefault();
          }
          shortcut.handler();
          break;
        }
      }
    },
    [shortcuts]
  );

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);
}

// Common shortcuts
export function useNavigationShortcuts(
  onNext: () => void,
  onBack: () => void,
  canGoNext: boolean = true,
  canGoBack: boolean = true
) {
  useKeyboardShortcuts([
    {
      key: 'ArrowRight',
      alt: true,
      handler: () => canGoNext && onNext(),
      preventDefault: true,
    },
    {
      key: 'ArrowLeft',
      alt: true,
      handler: () => canGoBack && onBack(),
      preventDefault: true,
    },
  ]);
}

export function useFormShortcuts(
  onSave: () => void,
  onCancel: () => void
) {
  useKeyboardShortcuts([
    {
      key: 's',
      ctrl: true,
      handler: onSave,
      preventDefault: true,
    },
    {
      key: 'Escape',
      handler: onCancel,
      preventDefault: true,
    },
  ]);
}

export function useGlobalShortcuts(
  onUndo: () => void,
  onRedo: () => void,
  canUndo: boolean,
  canRedo: boolean
) {
  useKeyboardShortcuts([
    {
      key: 'z',
      ctrl: true,
      handler: () => canUndo && onUndo(),
      preventDefault: true,
    },
    {
      key: 'z',
      ctrl: true,
      shift: true,
      handler: () => canRedo && onRedo(),
      preventDefault: true,
    },
    {
      key: 'y',
      ctrl: true,
      handler: () => canRedo && onRedo(),
      preventDefault: true,
    },
  ]);
}
