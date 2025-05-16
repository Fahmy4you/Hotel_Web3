// components/SwitchThemeButton.tsx
'use client';
import { FiSun } from 'react-icons/fi';
import { AiFillMoon } from 'react-icons/ai';
import { MdSettingsSystemDaydream } from 'react-icons/md';
import { useSelector, useDispatch } from 'react-redux';
import { useEffect, useState } from 'react';
import { RootState } from '../../../libs/store';
import { setDarkMode, setLightMode, setSystemMode } from '../../../libs/slices/themeSlices';

const SwitchThemeButton: React.FC = () => {
  const dispatch = useDispatch();
  const { darkMode, systemMode } = useSelector((state: RootState) => state.theme);
  const hideThemeToggle = useSelector((state: RootState) => state.settings.hideThemeToggle);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
  }, [darkMode, systemMode]);

  const handleToggle = () => {
   if (darkMode && !systemMode) {
      dispatch(setLightMode());
    } else if (!darkMode && !systemMode) {
      dispatch(setSystemMode());
    } else {
      dispatch(setDarkMode());
    }
  };

  const getIconComponent = () => {
    if (systemMode) {
      return <MdSettingsSystemDaydream size={20} />;
    } else if (darkMode) {
      return <AiFillMoon size={20} />;
    } else {
      return <FiSun size={20} />;
    }
  };

  if (!mounted || hideThemeToggle) return null;

  return (
    <button
      className={`iconMode ${systemMode ? 'system' : darkMode ? 'active' : ''}`}
      onClick={handleToggle}
      aria-label="Toggle theme"
      title={systemMode ? 'System theme' : darkMode ? 'Dark theme' : 'Light theme'}
    >
      {getIconComponent()}
    </button>
  );
};

export default SwitchThemeButton;