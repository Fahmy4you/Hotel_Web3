import { useState } from 'react';
import FormUploadwImage from '@/components/Form/FormWithFileUpload';
import { useSelector } from 'react-redux';
import { RootState } from '../../../../libs/store';
import { addToast, Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button } from '@heroui/react';
import { ModalProps } from '../../../../types/TypesPropModal';

export const UploadProfileModals = ({ isOpen, onClose }: ModalProps) => {
  const userId = useSelector((state: RootState) => state.users.id) || 0;
  const [profilePicture, setProfilePicture] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);

  const handleImageUpload = async (file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    try {
      const response = await fetch(`/api/upload/profile-pict/${userId}`, {
        method: 'POST',
        body: formData,
      });
      const data = await response.json();
      if (response.ok) {
        setProfilePicture(data.profilePicture.profile_pict);
        addToast({
          title: 'Berhasil',
          description: 'Foto Profil berhasil diunggah',
          variant: 'flat',
          color: 'success',
        });
      } else {
        addToast({
          title: 'Gagal',
          description: data.error,
          variant: 'flat',
          color: 'danger',
        });
        throw new Error(data.error);
      }
    } catch (error) {
      addToast({
        title: 'Error',
        description: 'Error saat mengunggah foto profil',
        variant: 'flat',
        color: 'danger',
      });
      throw error;
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalContent>
        <ModalHeader>Upload Profile Picture</ModalHeader>
        <ModalBody>
          <FormUploadwImage
            type="single"
            onImageChange={(selectedFile) => {
              setFile(selectedFile);
              setProfilePicture(selectedFile ? URL.createObjectURL(selectedFile) : null);
            }}
            onUpload={() => {
              if (file) {
                handleImageUpload(file);
              }
            }}
          />
        </ModalBody>
        <ModalFooter>
          <Button
            color="success"
            variant="solid"
            onPress={async () => {
              try {
                if (file) {
                  await handleImageUpload(file);
                  onClose();
                }
              } catch (error) {
                // Modal remains open on error
              }
            }}
          >
            Unggah
          </Button>
          <Button color="danger" variant="solid" onPress={onClose}>
            Batal
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};