'use client';
import React from 'react';
import { Switch } from '@heroui/react';
import { useDispatch, useSelector } from 'react-redux';
import { IoSettingsSharp } from 'react-icons/io5';
import { RootState } from '../../../../../libs/store';
import { setHideThemeToggle } from '../../../../../libs/slices/switchThemeSlice';

const OtherSettings: React.FC = () => {
  const dispatch = useDispatch();
  const hideThemeToggle = useSelector((state: RootState) => state.settings.hideThemeToggle);

  const handleHideThemeToggleChange = () => {
    dispatch(setHideThemeToggle(!hideThemeToggle));
  };

  return (
    <div className="space-y-4 border-t dark:border-neutral-700 pt-8">
      <h3 className="text-lg font-medium text-gray-900 dark:text-white flex items-center gap-2">
        <IoSettingsSharp />
        Pengaturan Lainnya
      </h3>
      <div className="space-y-4">
        {/* Hide Theme Toggle Switch */}
        <div className="flex items-center justify-between p-4 rounded-lg border border-gray-200 dark:border-neutral-700 bg-white dark:bg-neutral-800">
          <div>
            <h4 className="font-medium text-gray-900 dark:text-white">Sembunyikan Toggle Tema</h4>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Aktifkan untuk menyembunyikan tombol toggle tema di aplikasi
            </p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <Switch isSelected={hideThemeToggle} onValueChange={handleHideThemeToggleChange} />
          </label>
        </div>
      </div>
    </div>
  );
};

export default OtherSettings;