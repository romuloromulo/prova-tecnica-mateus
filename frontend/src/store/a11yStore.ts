import { create } from 'zustand';

export type FontSizeOption = 'normal' | 'lg' | 'xl';

interface A11yState {
  fontSize: FontSizeOption;
  highContrast: boolean;
  increaseFont: () => void;
  decreaseFont: () => void;
  resetFont: () => void;
  toggleHighContrast: () => void;
}

function applyA11yToDOM(fontSize: FontSizeOption, highContrast: boolean) {
  if (typeof document === 'undefined') return;
  const root = document.documentElement;
  const body = document.body;

  root.classList.remove('font-size-lg', 'font-size-xl');
  body.classList.remove('font-size-lg', 'font-size-xl');

  if (fontSize === 'lg') {
    root.classList.add('font-size-lg');
    body.classList.add('font-size-lg');
    root.style.fontSize = '115%';
  } else if (fontSize === 'xl') {
    root.classList.add('font-size-xl');
    body.classList.add('font-size-xl');
    root.style.fontSize = '130%';
  } else {
    root.style.fontSize = '';
  }

  if (highContrast) {
    body.classList.add('high-contrast');
  } else {
    body.classList.remove('high-contrast');
  }

  localStorage.setItem('a11y-font-size', fontSize);
  localStorage.setItem('a11y-high-contrast', String(highContrast));
}

const initialFontSize = (typeof localStorage !== 'undefined'
  ? (localStorage.getItem('a11y-font-size') as FontSizeOption)
  : null) || 'normal';

const initialHighContrast = typeof localStorage !== 'undefined'
  ? localStorage.getItem('a11y-high-contrast') === 'true'
  : false;

// Apply immediately on load
if (typeof document !== 'undefined') {
  applyA11yToDOM(initialFontSize, initialHighContrast);
}

export const useA11yStore = create<A11yState>((set, get) => ({
  fontSize: initialFontSize,
  highContrast: initialHighContrast,

  increaseFont: () => {
    const current = get().fontSize;
    const next: FontSizeOption = current === 'normal' ? 'lg' : 'xl';
    applyA11yToDOM(next, get().highContrast);
    set({ fontSize: next });
  },

  decreaseFont: () => {
    const current = get().fontSize;
    const next: FontSizeOption = current === 'xl' ? 'lg' : 'normal';
    applyA11yToDOM(next, get().highContrast);
    set({ fontSize: next });
  },

  resetFont: () => {
    applyA11yToDOM('normal', get().highContrast);
    set({ fontSize: 'normal' });
  },

  toggleHighContrast: () => {
    const next = !get().highContrast;
    applyA11yToDOM(get().fontSize, next);
    set({ highContrast: next });
  },
}));

// Re-export for compatibility
export const useA11y = useA11yStore;
