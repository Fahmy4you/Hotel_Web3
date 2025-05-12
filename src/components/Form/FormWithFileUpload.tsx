import { Form, Input } from '@heroui/react'
import React from 'react'
import UploadMultipleImage from '../Uploader/UploadMultipleImage'
import UploadSingleImage from '../Uploader/UploadSingleImage'

interface Props {
  type: 'multiple' | 'single'
  children: React.ReactNode
  onImagesChange?: (files: File[]) => void
}

const FormUploadwImage = ({ type, children, onImagesChange }: Props) => {
  return (
    <Form>
      <div className='flex w-full gap-5 flex-col'>
        {children}
      </div>
      {type === 'multiple' ? (
        <UploadMultipleImage onImagesChange={onImagesChange} />
      ) : (
        <UploadSingleImage onImagesChange={onImagesChange} />
      )}
    </Form>
  )
}

export default FormUploadwImage