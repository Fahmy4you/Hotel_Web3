'use client';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../../../../libs/store';
import { setDarkMode, setLightMode, setSystemMode } from '../../../../../libs/slices/themeSlices';


interface ThemeSelectorProps {
  currentTheme: 'light' | 'dark' | 'system';
}

const ThemeSelector: React.FC<ThemeSelectorProps> = ({ currentTheme }) => {
  const dispatch = useDispatch();
  const { darkMode, systemMode } = useSelector((state: RootState) => state.theme);

  const themes = [
    {
      id: 'light',
      label: 'Terang',
      onClick: () => dispatch(setLightMode()),
      isActive: currentTheme === 'light',
      preview: (
        <div className="mb-3 bg-white rounded-md shadow-sm h-20 w-full overflow-hidden">
          <div className="h-4 bg-gray-100 flex items-center px-2 border-b">
            <div className="w-2 h-2 rounded-full bg-gray-300 mr-1"></div>
            <div className="w-2 h-2 rounded-full bg-gray-300 mr-1"></div>
            <div className="w-2 h-2 rounded-full bg-gray-300"></div>
          </div>
          <div className="p-2">
            <div className="h-2 bg-gray-200 rounded-full w-3/4 mb-1"></div>
            <div className="h-2 bg-gray-200 rounded-full w-1/2"></div>
          </div>
        </div>
      ),
    },
    {
      id: 'dark',
      label: 'Gelap',
      onClick: () => dispatch(setDarkMode()),
      isActive: currentTheme === 'dark',
      preview: (
        <div className="mb-3 bg-neutral-800 rounded-md shadow-sm h-20 w-full overflow-hidden">
          <div className="h-4 bg-neutral-900 flex items-center px-2 border-b border-neutral-700">
            <div className="w-2 h-2 rounded-full bg-neutral-500 mr-1"></div>
            <div className="w-2 h-2 rounded-full bg-neutral-500 mr-1"></div>
            <div className="w-2 h-2 rounded-full bg-neutral-500"></div>
          </div>
          <div className="p-2">
            <div className="h-2 bg-neutral-700 rounded-full w-3/4 mb-1"></div>
            <div className="h-2 bg-neutral-700 rounded-full w-1/2"></div>
          </div>
        </div>
      ),
    },
    {
      id: 'system',
      label: 'Sistem',
      onClick: () => dispatch(setSystemMode()),
      isActive: currentTheme === 'system',
      preview: (
        <div className="mb-3 bg-gradient-to-r from-white to-neutral-800 rounded-md shadow-sm h-20 w-full overflow-hidden">
          <div className="h-4 bg-gradient-to-r from-gray-100 to-neutral-900 flex items-center px-2 border-b">
            <div className="w-2 h-2 rounded-full bg-gray-400 mr-1"></div>
            <div className="w-2 h-2 rounded-full bg-gray-400 mr-1"></div>
            <div className="w-2 h-2 rounded-full bg-gray-400"></div>
          </div>
          <div className="p-2">
            <div className="h-2 bg-gradient-to-r from-gray-200 to-neutral-700 rounded-full w-3/4 mb-1"></div>
            <div className="h-2 bg-gradient-to-r from-gray-200 to-neutral-700 rounded-full w-1/2"></div>
          </div>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium text-gray-900 dark:text-white flex items-center gap-2">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
        </svg>
        Tema
      </h3>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {themes.map((theme) => (
          <div
            key={theme.id}
            className={`relative p-4 rounded-lg border cursor-pointer transition-all duration-200 ${
              theme.isActive
                ? 'border-blue-500 bg-blue-200 dark:bg-blue-900/20'
                : 'border-gray-200 dark:border-neutral-700 hover:border-gray-300 dark:hover:border-neutral-600'
            }`}
            onClick={theme.onClick}
            onKeyDown={(e) => e.key === 'Enter' && theme.onClick()}
            tabIndex={0}
            role="button"
            aria-label={`Set ${theme.label.toLowerCase()} theme`}
          >
            {theme.preview}
            <div className="flex items-center justify-between">
              <div className="text-sm font-medium text-gray-900 dark:text-white">
                {theme.label}
              </div>
              {theme.isActive && (
                <div className="flex-shrink-0 h-5 w-5 text-blue-600">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ThemeSelector;