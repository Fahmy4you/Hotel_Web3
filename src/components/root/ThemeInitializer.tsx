"use client";
import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../../../libs/store";
import { setSystemMode, updateSystemTheme } from "../../../libs/slices/themeSlices";

export function ThemeInitializer({ children }: { children: React.ReactNode }) {
  const { darkMode, systemMode } = useSelector((state: RootState) => state.theme);
  const dispatch = useDispatch();

  useEffect(() => {
    const root = document.documentElement;

    const applyTheme = (isDark: boolean) => {
      if (isDark) {
        root.classList.add("dark");
      } else {
        root.classList.remove("dark");
      }
    };

    if (systemMode) {
      const isSystemDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
      applyTheme(isSystemDark);
      dispatch(updateSystemTheme(isSystemDark));

      const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
      const listener = (e: MediaQueryListEvent) => {
        applyTheme(e.matches);
        dispatch(updateSystemTheme(e.matches));
      };
      mediaQuery.addEventListener("change", listener);

      return () => mediaQuery.removeEventListener("change", listener);
    } else {
      applyTheme(darkMode);
    }
  }, [darkMode, systemMode, dispatch]);

  return <>{children}</>;
}