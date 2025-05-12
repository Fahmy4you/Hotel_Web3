import React from 'react'
interface Props {
  onImagesChange?: (files: File[]) => void
}

const UploadSingleImage = ({onImagesChange} : Props) => {
  return (
    <div>UploadSingleImage</div>
  )
}

export default UploadSingleImage