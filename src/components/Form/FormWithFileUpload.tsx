import { Form } from '@heroui/react';
import React from 'react';
import UploadMultipleImage from '../Uploader/UploadMultipleImage';
import UploadSingleImage from '../Uploader/UploadSingleImage';

interface MultipleProps {
  type: 'multiple';
  children: React.ReactNode;
  onImagesChange?: (files: File[]) => void;
  onImageChange?: never;
  onUpload?: never;
}

interface SingleProps {
  type: 'single';
  children?: React.ReactNode;
  onImagesChange?: never;
  onImageChange?: (file: File | null) => void;
  onUpload?: () => void;
}

type Props = MultipleProps | SingleProps;

const FormUploadwImage = ({ type, children, onImagesChange, onImageChange, onUpload }: Props) => {
  if (type === 'multiple' && !children) {
    throw new Error('Children wajib disediakan untuk type="multiple"');
  }

  return (
    <Form>
      <div className="flex w-full gap-5 flex-col">
        {type === 'multiple' && children}
        {type === 'single' && children}
        {type === 'multiple' ? (
          <UploadMultipleImage onImagesChange={onImagesChange} />
        ) : (
          <UploadSingleImage onImageChange={onImageChange} handleUpload={onUpload} />
        )}
      </div>
    </Form>
  );
};

export default FormUploadwImage;