import React, { useState, useRef, useCallback, useEffect } from 'react';
import { createImageFileSchema, validateFileCount, formatFileSize } from '@/utils/zod';
import { RiUploadCloud2Line } from 'react-icons/ri';
import { FaTrash } from 'react-icons/fa6';

interface Props {
  onImagesChange?: (files: File[]) => void;
  onImagesUpload?: (files: File[]) => void;
  acceptedTypes?: string;
  maxFiles?: number;
  maxSizeInMB?: number;
  initialImages?: string[];
  forPreview?: boolean;
  onRemoveInitialImage?: (index: number) => void;
}

const UploadMultipleImage = ({
  onImagesChange,
  onImagesUpload,
  acceptedTypes = 'image/*',
  maxFiles = 5,
  maxSizeInMB = 5,
  initialImages = [],
  forPreview = false,
  onRemoveInitialImage,
}: Props) => {
  const [files, setFiles] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [existingImages, setExistingImages] = useState<string[]>([]);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const dropAreaRef = useRef<HTMLDivElement>(null);

  const fileSchema = createImageFileSchema({ maxSizeInMB, acceptedTypes });

  // Sync existingImages with initialImages only if they differ
  useEffect(() => {
    if (JSON.stringify(existingImages) !== JSON.stringify(initialImages)) {
      setExistingImages(initialImages);
    }
  }, [initialImages, existingImages]);

  const processFiles = useCallback(
    (newFiles: File[]) => {
      setErrorMessage(null);

      const totalImagesCount = files.length + existingImages.length;
      const countValidation = validateFileCount(totalImagesCount, newFiles.length, maxFiles);
      if (!countValidation.success) {
        setErrorMessage(countValidation.error.errors[0].message);
        return;
      }

      let validFiles: File[] = [];
      let validationFailed = false;

      for (const file of newFiles) {
        const result = fileSchema.safeParse(file);
        if (!result.success) {
          setErrorMessage(result.error.errors[0].message);
          validationFailed = true;
          break;
        }
        validFiles.push(file);
      }

      if (validationFailed) return;

      const updatedFiles = [...files, ...validFiles];
      const newPreviews = validFiles.map(file => URL.createObjectURL(file));
      const updatedPreviews = [...imagePreviews, ...newPreviews];

      setFiles(updatedFiles);
      setImagePreviews(updatedPreviews);

      if (onImagesChange && JSON.stringify(updatedFiles) !== JSON.stringify(files)) {
        onImagesChange(updatedFiles); // Only call if files have changed
      }
    },
    [files, imagePreviews, maxFiles, onImagesChange, existingImages.length, fileSchema]
  );

  const handleFilesChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    const newFiles = Array.from(e.target.files);
    processFiles(newFiles);
    if (fileInputRef.current) fileInputRef.current.value = '';
  }, [processFiles]);

  const handleDragEnter = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const newFiles = Array.from(e.dataTransfer.files);
      processFiles(newFiles);
    } else if (e.dataTransfer.items) {
      const items = Array.from(e.dataTransfer.items);
      const imageFiles = items
        .filter(item => item.kind === 'file' && item.type.startsWith('image/'))
        .map(item => item.getAsFile())
        .filter((file): file is File => file !== null);

      if (imageFiles.length > 0) processFiles(imageFiles);
    }
  }, [processFiles]);

  const handlePaste = useCallback((e: React.ClipboardEvent<HTMLDivElement>) => {
    if (e.clipboardData && e.clipboardData.files.length > 0) {
      e.preventDefault();
      const pastedFiles = Array.from(e.clipboardData.files);
      processFiles(pastedFiles);
    } else if (e.clipboardData && e.clipboardData.items) {
      const items = Array.from(e.clipboardData.items);
      const imageFiles = items
        .filter(item => item.kind === 'file' && item.type.startsWith('image/'))
        .map(item => item.getAsFile())
        .filter((file): file is File => file !== null);

      if (imageFiles.length > 0) {
        e.preventDefault();
        processFiles(imageFiles);
      }
    }
  }, [processFiles]);

  const handleButtonClick = useCallback(() => {
    if (fileInputRef.current) fileInputRef.current.click();
  }, []);

  const handleRemoveImage = useCallback((index: number) => {
    const newFiles = [...files];
    newFiles.splice(index, 1);
    URL.revokeObjectURL(imagePreviews[index]);
    const newPreviews = [...imagePreviews];
    newPreviews.splice(index, 1);
    setFiles(newFiles);
    setImagePreviews(newPreviews);
    if (onImagesChange && JSON.stringify(newFiles) !== JSON.stringify(files)) {
      onImagesChange(newFiles);
    }
  }, [files, imagePreviews, onImagesChange]);

  const handleRemoveExistingImage = useCallback((index: number) => {
    if (onRemoveInitialImage) {
      onRemoveInitialImage(index);
    }
  }, [onRemoveInitialImage]);

  const totalImagesCount = files.length + existingImages.length;
  const shouldHideUploadArea = totalImagesCount >= maxFiles;

  return (
    <div className="w-full">
      <div className="mb-4">
        <label className={`${totalImagesCount > 0 ? 'hidden' : 'block'} text-sm font-medium text-gray-700 mb-2`}>
          Upload Images (Max {maxFiles} files, {maxSizeInMB}MB each)
        </label>

        {errorMessage && (
          <p className="mt-2 text-sm text-red-600">{errorMessage}</p>
        )}
      </div>

      <div className="flex flex-col h-full gap-4">
        <div>
          {(existingImages.length > 0 || imagePreviews.length > 0) && (
            <div>
              <div className="flex justify-between items-center mb-2">
                <h3 className="text-sm font-medium">
                  Selected images: {totalImagesCount}/{maxFiles}
                </h3>
                {!forPreview && (
                  <button
                    type="button"
                    onClick={() => {
                      imagePreviews.forEach(url => URL.revokeObjectURL(url));
                      setImagePreviews([]);
                      setFiles([]);
                      setExistingImages([]);
                      if (onImagesChange) onImagesChange([]);
                    }}
                    className="text-xs text-red-600 hover:text-red-800"
                  >
                    Clear all
                  </button>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                {existingImages.map((image, index) => (
                  <div key={`existing-${index}`} className="relative group">
                    <div className="w-full h-24 md:h-32 rounded-md overflow-hidden bg-gray-100">
                      <img
                        src={`/uploads/kamars/${image}`}
                        alt={`Existing ${index}`}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="mt-1 text-xs text-gray-500">
                      <p className="truncate">{image || `Image ${index + 1}`}</p>
                      <p className="text-blue-500">Previously uploaded</p>
                    </div>
                    {!forPreview && (
                      <button
                        type="button"
                        onClick={() => handleRemoveExistingImage(index)}
                        className="absolute right-1 top-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-all duration-200 hover:bg-red-600"
                      >
                        <FaTrash className="w-3 h-3" />
                      </button>
                    )}
                  </div>
                ))}

                {imagePreviews.map((image, index) => (
                  <div key={`new-${index}`} className="relative group">
                    <div className="w-full h-24 md:h-32 rounded-md overflow-hidden bg-gray-100">
                      <img
                        src={image}
                        alt={`Preview ${index}`}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="mt-1 text-xs text-gray-500">
                      <p className="truncate">{files[index]?.name || `Image ${index + 1}`}</p>
                      <p>{files[index] ? formatFileSize(files[index].size) : ''}</p>
                    </div>
                    {!forPreview && (
                      <button
                        type="button"
                        onClick={() => handleRemoveImage(index)}
                        className="absolute right-1 top-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-all duration-200 hover:bg-red-600"
                      >
                        <FaTrash className="w-3 h-3" />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {!forPreview && (
          <div className="w-full">
            <input
              type="file"
              ref={fileInputRef}
              multiple
              accept={acceptedTypes}
              onChange={handleFilesChange}
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
              className={`h-28 ${shouldHideUploadArea ? 'hidden' : 'flex'} flex-col items-center justify-center border-2 rounded-md transition-colors duration-200 cursor-pointer focus:outline-none focus:ring-2 focus:ring-gray-500 ${isDragging ? 'border-blue-500 bg-blue-50' : 'border-gray-300 dark:border-neutral-900 dark:bg-neutral-800'
                }`}
            >
              <div className="text-center p-6 justify-center items-center flex flex-col">
                <RiUploadCloud2Line className="w-8 h-8 mb-2 text-neutral-800 dark:text-white" />
                <p className="mb-2 text-sm font-medium dark:text-white-50 text-gray-800">
                  Click to select files, or drag and drop
                </p>
                <p className="text-xs dark:text-gray-400 text-gray-500">
                  You can also paste images from clipboard
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default UploadMultipleImage;