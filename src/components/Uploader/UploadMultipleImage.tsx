import React, { useState, useRef, useCallback } from 'react'
import { createImageFileSchema, validateFileCount, formatFileSize } from '@/utils/zod'
import { RiUploadCloud2Line } from "react-icons/ri";
import { FaTrash } from 'react-icons/fa6'

interface Props {
  onImagesChange?: (files: File[]) => void
  onImagesUpload?: (files: File[]) => void
  acceptedTypes?: string
  maxFiles?: number
  maxSizeInMB?: number
}

const UploadMultipleImage = ({
  onImagesChange,
  onImagesUpload,
  acceptedTypes = "image/*",
  maxFiles = 5,
  maxSizeInMB = 5
}: Props) => {
  const [files, setFiles] = useState<File[]>([])
  const [imagePreviews, setImagePreviews] = useState<string[]>([])
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [isDragging, setIsDragging] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const dropAreaRef = useRef<HTMLDivElement>(null)

  // Create the file schema
  const fileSchema = createImageFileSchema({ maxSizeInMB, acceptedTypes })

  const processFiles = useCallback((newFiles: File[]) => {
    // Clear previous errors
    setErrorMessage(null);

    // Step 1: Validate file count
    const countValidation = validateFileCount(files.length, newFiles.length, maxFiles);
    if (!countValidation.success) {
      setErrorMessage(countValidation.error.errors[0].message);
      return;
    }

    // Step 2: Validate individual files
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

    if (validationFailed) {
      return;
    }

    // All validations passed, update state
    const updatedFiles = [...files, ...validFiles];

    // Generate preview URLs for new files only
    const newPreviews = validFiles.map(file => URL.createObjectURL(file));

    // Add new previews to existing ones
    const updatedPreviews = [...imagePreviews, ...newPreviews];

    setFiles(updatedFiles);
    setImagePreviews(updatedPreviews);

    // Notify parent component if callback exists
    if (onImagesChange) {
      onImagesChange(updatedFiles);
    }
  }, [files, fileSchema, imagePreviews, maxFiles, onImagesChange]);

  // Handle file input change
  const handleFilesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) {
      return;
    }

    const newFiles = Array.from(e.target.files);
    processFiles(newFiles);
    
    // Reset the input value so the same file can be selected again
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Handle drag events
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
      const newFiles = Array.from(e.dataTransfer.files);
      processFiles(newFiles);
    } else if (e.dataTransfer.items) {
      // Handle pasted images from clipboard
      const items = Array.from(e.dataTransfer.items);
      const imageFiles = items
        .filter(item => item.kind === 'file' && item.type.startsWith('image/'))
        .map(item => item.getAsFile())
        .filter((file): file is File => file !== null);
      
      if (imageFiles.length > 0) {
        processFiles(imageFiles);
      }
    }
  };

  // Handle paste event
  const handlePaste = (e: React.ClipboardEvent<HTMLDivElement>) => {
    if (e.clipboardData && e.clipboardData.files.length > 0) {
      e.preventDefault();
      const pastedFiles = Array.from(e.clipboardData.files);
      processFiles(pastedFiles);
    } else if (e.clipboardData && e.clipboardData.items) {
      // Look for image items in clipboard
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
  };

  const handleButtonClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleRemoveImage = (index: number) => {
    // Create new arrays without the removed item
    const newFiles = [...files];
    newFiles.splice(index, 1);

    // Revoke the URL to avoid memory leaks
    URL.revokeObjectURL(imagePreviews[index]);

    const newPreviews = [...imagePreviews];
    newPreviews.splice(index, 1);

    // Update state
    setFiles(newFiles);
    setImagePreviews(newPreviews);

    // Notify parent component if callback exists
    if (onImagesChange) {
      onImagesChange(newFiles);
    }
  };

  const handleUpload = () => {
    if (files.length === 0) {
      setErrorMessage('Please select at least one file to upload');
      return;
    }

    if (onImagesUpload) {
      onImagesUpload(files);
    }
  };

  return (
    <div className="w-full">
      <div className="mb-4">
        <label className={`${files.length > 0 ? 'hidden' : 'block'} text-sm font-medium text-gray-700 mb-2`}>
          Upload Images (Max {maxFiles} files, {maxSizeInMB}MB each)
        </label>

        {errorMessage && (
          <p className="mt-2 text-sm text-red-600">{errorMessage}</p>
        )}
      </div>

      <div className="flex flex-col h-full gap-4">
        <div className="">
          {imagePreviews.length > 0 && (
  <div>
    <div className="flex justify-between items-center mb-2">
      <h3 className="text-sm font-medium">
        Selected images: {files.length}/{maxFiles}
      </h3>
      <button
        type="button"
        onClick={() => {
          // Clear all previews
          imagePreviews.forEach(url => URL.revokeObjectURL(url));
          setImagePreviews([]);
          setFiles([]);
          if (onImagesChange) onImagesChange([]);
        }}
        className="text-xs text-red-600 hover:text-red-800"
      >
        Clear all
      </button>
    </div>

    <div className="grid grid-cols-2 gap-4">
      {imagePreviews.map((image, index) => (
        <div key={index} className="relative group">
          <div className="w-full h-24 md:h-32 rounded-md overflow-hidden bg-gray-100">
            <img
              src={image}
              alt={`Preview ${index}`}
              className="w-full h-full object-cover"
            />
          </div>

          <div className="mt-1 text-xs text-gray-500">
            <p className="truncate">{files[index].name}</p>
            <p>{formatFileSize(files[index].size)}</p>
          </div>

          <button
            type="button"
            onClick={() => handleRemoveImage(index)}
            className="absolute right-1 top-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-all duration-200 hover:bg-red-600"
          >
            <FaTrash className="w-3 h-3" />
          </button>
        </div>
      ))}
    </div>
  </div>
)}

        </div>
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
            className={`h-28 ${files.length >= 5 ? 'hidden' : 'flex'} flex-col items-center justify-center border-2 rounded-md transition-colors duration-200 cursor-pointer focus:outline-none focus:ring-2 focus:ring-gray-500 ${
              isDragging ? 'border-blue-500 bg-blue-50' : 'border-gray-300 dark:border-neutral-900 dark:bg-neutral-800'
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
            
          
          {/* Upload button */}
          {files.length > 0 && (
            <div className="mt-4 w-full flex">
              <button
                type="button"
                onClick={handleUpload}
                className="px-4 py-2 dark:bg-white-50 bg-neutral-800 hover:bg-neutral-700 w-full transition-all duration-300 cursor-pointer text-white dark:text-neutral-900 rounded-md dark:hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                Upload {files.length} {files.length === 1 ? 'File' : 'Files'}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default UploadMultipleImage