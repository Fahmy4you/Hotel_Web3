'use client'
import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../../libs/store';

export function ThemeInitializer({ children }: { children: React.ReactNode }) {
  const darkMode = useSelector((state: RootState) => state.theme.darkMode);

  useEffect(() => {
    const root = document.documentElement;
    if (darkMode) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [darkMode]);

  return <>{children}</>;
}