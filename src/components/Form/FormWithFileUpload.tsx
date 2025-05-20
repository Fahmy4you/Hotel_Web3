import { Form } from '@heroui/react';
import React from 'react';
import UploadMultipleImage from '../Uploader/UploadMultipleImage';
import UploadSingleImage from '../Uploader/UploadSingleImage';

interface MultipleProps {
  type: 'multiple';
  children: React.ReactNode;
  previewsCurrentlyImage?: string[];
  onImagesChange?: (files: File[]) => void;
  onImageChange?: never;
  isPreview?: boolean;
  onUpload?: never;
  onRemoveInitialImage?: (index: number) => void;
}

interface SingleProps {
  type: 'single';
  children?: React.ReactNode;
  previewsCurrentlyImage?: never;
  onImagesChange?: never;
  isPreview?: boolean;
  onImageChange?: (file: File | null) => void;
  onUpload?: () => void;
  onRemoveInitialImage?: never;
}

type Props = MultipleProps | SingleProps;

const FormUploadwImage = ({
  type,
  children,
  onImagesChange,
  onImageChange,
  onUpload,
  previewsCurrentlyImage,
  isPreview,
  onRemoveInitialImage
}: Props) => {
  if (type === 'multiple' && !children) {
    throw new Error('Children wajib disediakan untuk type="multiple"');
  }

  return (
    <Form>
      <div className="flex w-full gap-5 flex-col">
        {type === 'multiple' && children}
        {type === 'single' && children}
        {type === 'multiple' ? (
          <UploadMultipleImage
            forPreview={isPreview}
            initialImages={previewsCurrentlyImage}
            onImagesChange={onImagesChange}
            onRemoveInitialImage={onRemoveInitialImage}
          />
        ) : (
          <UploadSingleImage
            onImageChange={onImageChange}
            handleUpload={onUpload}
          />
        )}
      </div>
    </Form>
  );
};

export default FormUploadwImage;