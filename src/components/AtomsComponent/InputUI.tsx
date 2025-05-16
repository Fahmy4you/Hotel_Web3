import React from 'react';
import { Input } from '@heroui/react';
import { useSelector } from 'react-redux';
import { RootState } from '../../../libs/store';
import { IconType } from 'react-icons';

interface InputUIProps {
  type?: string;
  icon?: IconType;
  placeholder?: string;
  label?: string;
  value?: string;
  onValueChange?: (value: string) => void;
  onClear?: () => void;
  isClearable?: boolean;
  isDisabled?: boolean;
  className?: string;
  startContent?: React.ReactNode;
  endContent?: React.ReactNode;
}

const InputUI: React.FC<InputUIProps> = ({
  type = "text",
  icon: Icon,
  placeholder = "",
  label = "",
  value = "",
  onValueChange = () => {},
  onClear = () => {},
  isClearable = false,
  isDisabled = false,
  className = "",
  startContent,
  endContent,
}) => {
  const darkMode = useSelector((state: RootState) => state.theme.darkMode);

  // Buat startContent otomatis jika ada Icon yang disediakan
  const renderStartContent = () => {
    if (startContent) return startContent;
    if (Icon) {
      return (
        <Icon 
          className={darkMode ? "text-gray-300 text-md" : "text-gray-700 text-md"} 
        />
      );
    }
    return null;
  };

  return (
    <div className={`${className}`}>
      {label && (
        <label className={`block mb-2 ${darkMode ? 'text-white' : 'text-gray-700'}`}>
          {label}
        </label>
      )}
      <Input
        type={type}
        isClearable={isClearable}
        isDisabled={isDisabled}
        classNames={{
          base: "w-full",
          inputWrapper: `${darkMode 
            ? '!bg-neutral-900 hover:!bg-neutral-800 focus:!bg-neutral-800' 
            : '!bg-slate-100 hover:bg-gray-50 focus:bg-gray-50'} transition-colors`,
          input: `${darkMode 
            ? '!text-white' 
            : 'text-black'}`,
          clearButton: `${darkMode 
            ? 'text-gray-300 hover:text-white' 
            : 'text-gray-500 hover:text-black'}`,
          label: `${darkMode ? 'text-white' : 'text-gray-700'}`,
        }}
        placeholder={placeholder}
        startContent={renderStartContent()}
        endContent={endContent}
        value={value}
        onClear={isClearable ? onClear : undefined}
        onValueChange={onValueChange}
      />
    </div>
  );
};

export default InputUI;