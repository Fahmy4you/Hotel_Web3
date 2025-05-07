import React, { useState, ReactNode } from 'react';
import { IoCloseSharp } from "react-icons/io5";

interface AddUpdateModalProps<T> {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: T) => void;
  mode: 'add' | 'edit';
  title: string;
  icon: ReactNode;
  initialData: T;
  children: (props: {
    formData: T;
    handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    setFormData: React.Dispatch<React.SetStateAction<T>>;
    isPending: boolean;
  }) => ReactNode;
  isPending?: boolean;
  error?: string | null;
}

const AddUpdateModal = <T extends Record<string, any>>({
  isOpen,
  onClose,
  onSubmit,
  mode,
  title,
  icon,
  initialData,
  children,
  isPending = false,
  error = null,
}: AddUpdateModalProps<T>) => {
  const [formData, setFormData] = useState<T>(initialData);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = () => {
    onSubmit(formData);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" onClick={onClose}></div>

      <div className="relative bg-white dark:bg-gray-900 rounded-xl shadow-xl w-full max-w-md mx-4 overflow-hidden border border-gray-200 dark:border-gray-700">
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white flex items-center">
            {icon}
            {title}
          </h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
            <IoCloseSharp className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="px-6 py-4">
          {error && (
            <div className="mb-4 p-3 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 rounded-lg">
              {error}
            </div>
          )}

          {children({
            formData,
            handleChange,
            setFormData,
            isPending
          })}

          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              disabled={isPending}
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSubmit}
              disabled={isPending}
              className={`px-6 py-2 bg-gradient-to-r from-purple-600 to-purple-800 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 ${isPending ? 'opacity-70 cursor-not-allowed' : 'hover:from-purple-700 hover:to-purple-900'}`}
            >
              {isPending ? 'Processing...' : mode === 'add' ? `Add ${title}` : 'Save Changes'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddUpdateModal;