import React, { useState, useRef, useCallback } from 'react';
import { createImageFileSchema, formatFileSize } from '@/utils/zod';
import { RiUploadCloud2Line } from 'react-icons/ri';
import { FaTrash } from 'react-icons/fa6';

interface Props {
  onImageChange?: (file: File | null) => void;
  onImageUpload?: (file: File) => void;
  acceptedTypes?: string;
  maxSizeInMB?: number;
  handleUpload?: () => void;
}

const UploadSingleImage = ({
  onImageChange,
  onImageUpload,
  acceptedTypes = 'image/*',
  maxSizeInMB = 5,
  handleUpload: externalHandleUpload,
}: Props) => {
  const [file, setFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const dropAreaRef = useRef<HTMLDivElement>(null);

  const fileSchema = createImageFileSchema({ maxSizeInMB, acceptedTypes });

  const processFile = useCallback(
    (newFile: File) => {
      setErrorMessage(null);

      const result = fileSchema.safeParse(newFile);
      if (!result.success) {
        setErrorMessage(result.error.errors[0].message);
        return;
      }

      if (imagePreview) {
        URL.revokeObjectURL(imagePreview);
      }

      setFile(newFile);
      const previewUrl = URL.createObjectURL(newFile);
      setImagePreview(previewUrl);

      if (onImageChange) {
        onImageChange(newFile);
      }
    },
    [fileSchema, imagePreview, onImageChange]
  );

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) {
      return;
    }

    const newFile = e.target.files[0];
    processFile(newFile);

    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleDragEnter = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const newFile = e.dataTransfer.files[0];
      processFile(newFile);
    } else if (e.dataTransfer.items) {
      const items = Array.from(e.dataTransfer.items);
      const imageFile = items
        .filter((item) => item.kind === 'file' && item.type.startsWith('image/'))
        .map((item) => item.getAsFile())
        .filter((file): file is File => file !== null)[0];

      if (imageFile) {
        processFile(imageFile);
      }
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLDivElement>) => {
    if (e.clipboardData && e.clipboardData.files.length > 0) {
      e.preventDefault();
      const pastedFile = e.clipboardData.files[0];
      processFile(pastedFile);
    } else if (e.clipboardData && e.clipboardData.items) {
      const items = Array.from(e.clipboardData.items);
      const imageFile = items
        .filter((item) => item.kind === 'file' && item.type.startsWith('image/'))
        .map((item) => item.getAsFile())
        .filter((file): file is File => file !== null)[0];

      if (imageFile) {
        e.preventDefault();
        processFile(imageFile);
      }
    }
  };

  const handleButtonClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleRemoveImage = () => {
    if (imagePreview) {
      URL.revokeObjectURL(imagePreview);
    }

    setFile(null);
    setImagePreview(null);

    if (onImageChange) {
      onImageChange(null);
    }
  };

  const handleUpload = async () => {
    if (!file) {
      setErrorMessage('Harap pilih satu file untuk diunggah');
      return;
    }

    if (onImageUpload) {
      await onImageUpload(file);
    }

    if (externalHandleUpload) {
      externalHandleUpload();
    }
  };

  return (
    <div className="w-full">
      <div className="mb-4">
        <label
          className={`${file ? 'hidden' : 'block'} text-sm font-medium text-gray-700 mb-2`}
        >
          Unggah Gambar (Maks {maxSizeInMB}MB)
        </label>

        {errorMessage && <p className="mt-2 text-sm text-red-600">{errorMessage}</p>}
      </div>

      <div className="flex flex-col h-full gap-4">
        <div>
          {imagePreview && (
            <div>
              <div className="flex justify-between items-center mb-2">
                <h3 className="text-sm font-medium">Gambar terpilih: 1/1</h3>
                <button
                  type="button"
                  onClick={handleRemoveImage}
                  className="text-xs text-red-600 hover:text-red-800"
                >
                  Hapus
                </button>
              </div>

              <div className="relative group">
                <div className="w-full h-24 md:h-32 rounded-md overflow-hidden bg-gray-100">
                  <img
                    src={imagePreview}
                    alt="Pratinjau"
                    className="w-full h-full object-cover"
                  />
                </div>

                {file && (
                  <div className="mt-1 text-xs text-gray-500">
                    <p className="truncate">{file.name}</p>
                    <p>{formatFileSize(file.size)}</p>
                  </div>
                )}

                <button
                  type="button"
                  onClick={handleRemoveImage}
                  className="absolute right-1 top-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-all duration-200 hover:bg-red-600"
                >
                  <FaTrash className="w-3 h-3" />
                </button>
              </div>
            </div>
          )}
        </div>
        <div className="w-full">
          <input
            type="file"
            ref={fileInputRef}
            accept={acceptedTypes}
            onChange={handleFileChange}
            className="hidden"
          />

          <div
            ref={dropAreaRef}
            onDragEnter={handleDragEnter}
            onDragLeave={handleDragLeave}
            onDragOver={handleDragOver}
            onDrop={handleDrop}
            onPaste={handlePaste}
            onClick={handleButtonClick}
            tabIndex={0}
            className={`h-28 ${
              file ? 'hidden' : 'flex'
            } flex-col items-center justify-center border-2 rounded-md transition-colors duration-200 cursor-pointer focus:outline-none focus:ring-2 focus:ring-gray-500 ${
              isDragging
                ? 'border-blue-500 bg-blue-50'
                : 'border-gray-300 dark:border-neutral-900 dark:bg-neutral-800'
            }`}
          >
            <div className="text-center p-6 justify-center items-center flex flex-col">
              <RiUploadCloud2Line className="w-8 h-8 mb-2 text-neutral-800 dark:text-white" />
              <p className="mb-2 text-sm font-medium dark:text-white-50 text-gray-800">
                Klik untuk memilih file, atau seret dan lepas
              </p>
              <p className="text-xs dark:text-gray-400 text-gray-500">
                Anda juga bisa menempelkan gambar dari clipboard
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UploadSingleImage;