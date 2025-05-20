import React, { useEffect, useState } from 'react';
import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Skeleton,
} from '@heroui/react';
import { LuBedDouble } from 'react-icons/lu';
import { useHooksUser } from '@/hooks/useHooksUser';
import { useManageKamar } from '@/hooks/useManageKamar';
import { KamarData, detailDataKamar } from '@/types/kamarData';
import EditKamarForm from '@/components/Form/Kamar/EditKamarForm';
import { StatusKamar } from '@prisma/client';
import { addToast } from '@heroui/react';

interface EditKamarProps {
  selectedIdKamar?: number | null;
  isOpen: boolean;
  onClose: () => void;
  onEditKamar?: (data: KamarData) => void;
  onSuccess?: () => void;
}

const initialFormData: Required<KamarData> = {
  id: 0,
  nama_kamar: '',
  desk: '',
  hotel_id: 0,
  kategori_id: 0,
  is_active: true,
  price: 0,
  is_kyc: false,
  status: StatusKamar.TERSEDIA,
  features: [],
  images: [],
  kategori: '',
  nama_hotel: '',
};

const EditKamarModal: React.FC<EditKamarProps> = ({
  isOpen,
  onClose,
  selectedIdKamar,
  onEditKamar,
  onSuccess,
}) => {
  const { user } = useHooksUser();
  const {
    getDetailKamar,
    submitKamar,
    detailDataKamar,
    isLoading,
    fetchKamars,
  } = useManageKamar(user?.id || 0, undefined, (data: KamarData) => {
    if (onEditKamar) onEditKamar(data);
    fetchKamars();
    onClose();
    if (onSuccess) onSuccess();
  });

  const [formData, setFormData] = useState<KamarData>(initialFormData);
  const [edit, setEdit] = useState(false);

  useEffect(() => {
    if (isOpen && selectedIdKamar) {
      getDetailKamar(selectedIdKamar);
    }
  }, [isOpen, selectedIdKamar, getDetailKamar]);

  useEffect(() => {
    if (detailDataKamar) {
      setFormData({
        id: detailDataKamar.id,
        nama_kamar: detailDataKamar.nama_kamar,
        desk: detailDataKamar.deskripsi,
        hotel_id: detailDataKamar.hotel_id,
        kategori_id: detailDataKamar.kategori_id,
        is_active: detailDataKamar.is_active,
        price: detailDataKamar.harga_kamar,
        is_kyc: false,
        status: detailDataKamar.status as StatusKamar,
        features: [...(detailDataKamar.features || [])],
        images: [...(detailDataKamar.images || [])],
        kategori: detailDataKamar.kategori,
        nama_hotel: detailDataKamar.hotel,
      });
    }
  }, [detailDataKamar]);

  const handleSave = async (formData: KamarData) => {
    try {
      const mappedDetailData = detailDataKamar ? {
        ...detailDataKamar,
        desk: detailDataKamar.deskripsi,
        price: detailDataKamar.harga_kamar,
        is_kyc: false
      } : null;
      await submitKamar(formData, true, mappedDetailData, onClose);
      setEdit(false);
    } catch (error: any) {
      console.error('Error saving kamar:', error);
      addToast({
        title: 'Error',
        description: 'Gagal menyimpan data kamar',
        variant: 'flat',
        color: 'danger',
      });
    }
  };

  const toggleEdit = () => {
    setEdit(prev => {
      if (prev && detailDataKamar) {
        setFormData({
          id: detailDataKamar.id,
          nama_kamar: detailDataKamar.nama_kamar,
          desk: detailDataKamar.deskripsi,
          hotel_id: detailDataKamar.hotel_id,
          kategori_id: detailDataKamar.kategori_id,
          is_active: detailDataKamar.is_active,
          price: detailDataKamar.harga_kamar,
          is_kyc: false,
          status: detailDataKamar.status as StatusKamar,
          features: [...(detailDataKamar.features || [])],
          images: [...(detailDataKamar.images || [])],
          kategori: detailDataKamar.kategori,
          nama_hotel: detailDataKamar.hotel,
        });
      }
      return !prev;
    });
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="2xl" scrollBehavior="inside">
      <ModalContent>
        <ModalHeader className="flex items-center gap-3 border-b pb-3">
          <div className="flex items-center justify-center w-8 h-8 rounded-full bg-neutral-800 dark:bg-blue-900/30 text-white dark:text-blue-400">
            <LuBedDouble className="w-4 h-4" />
          </div>
          <span>
            Edit Kamar:{' '}
            {isLoading ? (
              <Skeleton className="inline-block w-32 h-4" />
            ) : (
              detailDataKamar?.nama_kamar || 'Kamar'
            )}
          </span>
        </ModalHeader>

        <ModalBody className="flex flex-col gap-4 py-4">
          {isLoading ? (
            <div className="space-y-4">
              <Skeleton className="w-full h-12" />
              <Skeleton className="w-full h-12" />
              <Skeleton className="w-full h-24" />
              <Skeleton className="w-full h-12" />
            </div>
          ) : (
            <EditKamarForm
              edit={edit}
              formData={formData}
              setFormData={setFormData}
              onSave={handleSave}
              isLoading={isLoading}
            />
          )}
        </ModalBody>

        <ModalFooter className="border-t pt-3 flex justify-between">
          <div>
            {!edit ? (
              <Button color="primary" variant="solid" onPress={toggleEdit}>
                Edit
              </Button>
            ) : (
              <div className="flex gap-2">
                <Button
                  color="primary"
                  variant="solid"
                  onPress={() => handleSave(formData)}
                  isLoading={isLoading}
                >
                  Simpan
                </Button>
                <Button color="danger" variant="flat" onPress={toggleEdit}>
                  Batal
                </Button>
              </div>
            )}
          </div>
          <Button variant="light" onPress={onClose}>
            Tutup
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default EditKamarModal;