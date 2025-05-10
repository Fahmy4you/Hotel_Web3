import { Radio, cn } from '@heroui/react';
import React from 'react';

interface Props {
  value: string;
  title: string;
  description: string;
  isSelected: boolean;
}

const RadioCard: React.FC<Props> = ({ value, title, description, isSelected }) => {
  return (
    <div className={cn(
      "flex items-center w-full p-4 border rounded-xl shadow-md gap-3",
      isSelected ? "border-primary" : "border-default"
    )}>
      <Radio value={value} className="flex-shrink-0" />
      <div className="flex flex-col">
        <span className="font-semibold text-lg">{title}</span>
        <span className="text-sm text-gray-500">{description}</span>
      </div>
    </div>
  );
};

export default RadioCard;
