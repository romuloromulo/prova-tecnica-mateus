import { useState, useEffect } from 'react';

export type FontSizeOption = 'normal' | 'lg' | 'xl';

export function useA11y() {
  const [fontSize, setFontSize] = useState<FontSizeOption>(() => {
    return (localStorage.getItem('a11y-font-size') as FontSizeOption) || 'normal';
  });

  const [highContrast, setHighContrast] = useState<boolean>(() => {
    return localStorage.getItem('a11y-high-contrast') === 'true';
  });

  useEffect(() => {
    const body = document.body;
    body.classList.remove('font-size-lg', 'font-size-xl');
    if (fontSize === 'lg') {
      body.classList.add('font-size-lg');
    } else if (fontSize === 'xl') {
      body.classList.add('font-size-xl');
    }
    localStorage.setItem('a11y-font-size', fontSize);
  }, [fontSize]);

  useEffect(() => {
    const body = document.body;
    if (highContrast) {
      body.classList.add('high-contrast');
    } else {
      body.classList.remove('high-contrast');
    }
    localStorage.setItem('a11y-high-contrast', String(highContrast));
  }, [highContrast]);

  const increaseFont = () => {
    if (fontSize === 'normal') setFontSize('lg');
    else if (fontSize === 'lg') setFontSize('xl');
  };

  const decreaseFont = () => {
    if (fontSize === 'xl') setFontSize('lg');
    else if (fontSize === 'lg') setFontSize('normal');
  };

  const resetFont = () => {
    setFontSize('normal');
  };

  const toggleHighContrast = () => {
    setHighContrast((prev) => !prev);
  };

  return {
    fontSize,
    highContrast,
    increaseFont,
    decreaseFont,
    resetFont,
    toggleHighContrast,
  };
}
