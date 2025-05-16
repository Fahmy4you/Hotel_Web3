'use client';
import React from 'react';

interface FontSizeSelectorProps {
  fontSize: 'small' | 'medium' | 'large' | 'x-large';
  setFontSize: (fontSize: 'small' | 'medium' | 'large' | 'x-large') => void;
}

const FontSizeSelector: React.FC<FontSizeSelectorProps> = ({ fontSize, setFontSize }) => {
  const fontSizes = [
    { value: 'small', label: 'Kecil' },
    { value: 'medium', label: 'Sedang' },
    { value: 'large', label: 'Besar' },
    { value: 'x-large', label: 'Sangat Besar' },
  ];

  const getFontSizeClass = (size: string) => {
    switch (size) {
      case 'small':
        return 'text-sm';
      case 'medium':
        return 'text-base';
      case 'large':
        return 'text-lg';
      case 'x-large':
        return 'text-xl';
      default:
        return 'text-base';
    }
  };

  return (
    <div className="space-y-4 border-t dark:border-neutral-700 pt-8">
      <h3 className="text-lg font-medium text-gray-900 dark:text-white flex items-center gap-2">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fillRule="evenodd"
            d="M10 2a.75.75 0 01.75.75v.25h1.5a.75.75 0 010 1.5h-1.5v.25a.75.75 0 01-1.5 0v-.25h-1.5a.75.75 0 010-1.5h1.5v-.25A.75.75 0 0110 2zM3 6a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 3a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 3a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
            clipRule="evenodd"
          />
        </svg>
        Ukuran Font
      </h3>
      <div className="space-y-6">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {fontSizes.map((size) => (
            <div
              key={size.value}
              className={`relative p-4 flex flex-col items-center justify-center rounded-lg border cursor-pointer transition-all duration-200 ${
                fontSize === size.value
                  ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                  : 'border-gray-200 dark:border-neutral-700 hover:border-gray-300 dark:hover:border-neutral-600'
              }`}
              onClick={() => setFontSize(size.value as 'small' | 'medium' | 'large' | 'x-large')}
              onKeyDown={(e) =>
                e.key === 'Enter' &&
                setFontSize(size.value as 'small' | 'medium' | 'large' | 'x-large')
              }
              tabIndex={0}
              role="button"
              aria-label={`Set font size to ${size.label.toLowerCase()}`}
            >
              <input
                type="radio"
                id={`font-size-${size.value}`}
                name="fontSize"
                value={size.value}
                className="sr-only"
                checked={fontSize === size.value}
                onChange={() =>
                  setFontSize(size.value as 'small' | 'medium' | 'large' | 'x-large')
                }
              />
              <label
                htmlFor={`font-size-${size.value}`}
                className="w-full h-full cursor-pointer flex flex-col items-center"
              >
                <span
                  className={`${getFontSizeClass(
                    size.value
                  )} font-medium text-gray-900 dark:text-white mb-2`}
                >
                  Aa
                </span>
                <span className="text-xs text-gray-600 dark:text-gray-400">{size.label}</span>
              </label>
              {fontSize === size.value && (
                <div className="absolute top-2 right-2 flex-shrink-0 h-4 w-4 text-blue-600">
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
          ))}
        </div>

        {/* Preview text */}
        <div className="bg-gray-50 dark:bg-neutral-900 rounded-lg p-4 border border-gray-200 dark:border-neutral-700">
          <h4 className="font-medium text-gray-900 dark:text-white mb-2">Preview</h4>
          <p className={`${getFontSizeClass(fontSize)} text-gray-600 dark:text-gray-300`}>
            Ini adalah contoh teks dengan ukuran{' '}
            {fontSizes.find((size) => size.value === fontSize)?.label.toLowerCase()}. Pengaturan
            ini akan mengubah ukuran font di seluruh aplikasi.
          </p>
        </div>
      </div>
    </div>
  );
};

export default FontSizeSelector;