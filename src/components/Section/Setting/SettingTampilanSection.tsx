'use client';
import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import FontSizeSelector from './AtomSetting/FontSizeSelector';
import ThemeSelector from './AtomSetting/ThemeSelector';
import OtherSettings from './AtomSetting/OtherSetting';
import { RootState } from '../../../../libs/store';


interface Settings {
  fontSize: 'small' | 'medium' | 'large' | 'x-large';
}

const SettingTampilanSection: React.FC = () => {
  const { darkMode, systemMode } = useSelector((state: RootState) => state.theme);
  const [settings, setSettings] = useState<Settings>({
    fontSize: 'medium',
  });
  const currentTheme = systemMode ? 'system' : darkMode ? 'dark' : 'light';

  return (
    <div className="p-6 dark:bg-neutral-800 bg-white rounded-lg shadow-sm border dark:border-neutral-700 border-gray-200">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            Pengaturan Tampilan
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            Sesuaikan tampilan aplikasi dengan preferensi Anda
          </p>
        </div>

        {/* Setting Konten */}
        <div className="space-y-8">
          <ThemeSelector currentTheme={currentTheme} />
          <FontSizeSelector
            fontSize={settings.fontSize}
            setFontSize={(fontSize) =>
              setSettings((prev) => ({ ...prev, fontSize }))
            }
          />
          <OtherSettings />
        </div>
      </div>
    </div>
  );
};

export default SettingTampilanSection;