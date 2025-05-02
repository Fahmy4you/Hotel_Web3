import React from 'react';
import { Dropdown, DropdownTrigger, DropdownMenu, DropdownItem, Button } from '@heroui/react';
import { FaSortDown } from 'react-icons/fa';
import { useSelector } from 'react-redux';
import { RootState } from '../../libs/store';

// Helper function untuk kapitalisasi string
const capitalize = (str: string): string => {
    return str.charAt(0).toUpperCase() + str.slice(1);
};

interface DropdownOption {
  uid: string;
  name: string;
}

interface FilterDropdownProps {
  label: string;
  options: DropdownOption[];
  selectedKeys: Set<string> | "all";
  onSelectionChange: (keys: Set<string> | "all") => void;
  className?: string;
  buttonVariant?: "flat" | "bordered" | "solid" | "light";
  disableCapitalize?: boolean;
  icon?: React.ReactNode;
}

const FilterDropdown: React.FC<FilterDropdownProps> = ({
  label,
  options,
  selectedKeys,
  onSelectionChange,
  className = "",
  buttonVariant,
  disableCapitalize = false,
  icon = <FaSortDown className="text-xl mb-2" />
}) => {
  // Mengambil state darkMode dari Redux store
  const darkMode = useSelector((state: RootState) => state.theme.darkMode);

  // Menentukan variant button berdasarkan darkMode jika tidak ada variant yang diberikan
  const variant = buttonVariant || (darkMode ? "bordered" : "flat");

  // Menentukan class untuk button berdasarkan darkMode
  const buttonClass = darkMode ? "text-white border-gray-600" : "";

  return (
    <Dropdown>
      <DropdownTrigger className="hidden sm:flex">
        <Button
          endContent={icon}
          variant={variant}
          className={`${buttonClass} ${className}`}
        >
          {label}
        </Button>
      </DropdownTrigger>
      <DropdownMenu
        disallowEmptySelection
        aria-label={`${label} Dropdown`}
        closeOnSelect={false}
        selectedKeys={selectedKeys}
        selectionMode="multiple"
        onSelectionChange={(keys) => {
          const adaptedKeys =
            keys === "all"
              ? "all"
              : new Set(Array.from(keys as Set<unknown>).map(String));
          onSelectionChange(adaptedKeys);
        }}
        className={darkMode ? "dark-dropdown" : ""}
      >
        {options.map((option) => (
          <DropdownItem key={option.uid} className={disableCapitalize ? "" : "capitalize"}>
            {disableCapitalize ? option.name : capitalize(option.name)}
          </DropdownItem>
        ))}
      </DropdownMenu>
    </Dropdown>
  );
};

export default FilterDropdown;