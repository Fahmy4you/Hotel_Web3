'use client'
import React, { useEffect, useState, useCallback } from 'react';
import { Button, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, Skeleton } from '@heroui/react';
import { LuBedDouble } from 'react-icons/lu';
import { useHooksUser } from '@/hooks/useHooksUser';
import { useManageKamar } from '@/hooks/useManageKamar';
import { KamarData, detailDataKamar } from '@/types/kamarData';
import EditKamarForm from '@/components/Form/Kamar/KamarForm';
import { StatusKamar } from '@prisma/client';
import { addToast } from '@heroui/react';

interface EditKamarProps {
  selectedIdKamar?: number | null;
  isOpen: boolean;
  onClose: () => void;
}

const initialFormData: KamarData = {
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

const EditKamarModal = ({ isOpen, onClose, selectedIdKamar }: EditKamarProps) => {
  const { user } = useHooksUser();
  const {
    getDetailKamar,
    submitKamar,
    detailDataKamar,
    isLoading,
    fetchKamars
  } = useManageKamar(user?.id || 0);

  const [formData, setFormData] = useState<KamarData>(initialFormData);
  const [editMode, setEditMode] = useState(false);

  const resetFormData = useCallback(() => {
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

  useEffect(() => {
    if (isOpen && selectedIdKamar) {
      getDetailKamar(selectedIdKamar);
      setEditMode(false);
    }
  }, [isOpen, selectedIdKamar, getDetailKamar]);

  useEffect(() => {
    resetFormData();
  }, [resetFormData]);

  const handleSave = async (data: KamarData) => {
    try {
      await submitKamar(data, true, formData, onClose);
      setEditMode(false);
    } catch (error) {
      addToast({
        title: 'Error',
        description: 'Gagal menyimpan data kamar',
        variant: 'flat',
        color: 'danger',
      });
    }
  };

  const toggleEditMode = () => {
    if (editMode) {
      resetFormData();
    }
    setEditMode(!editMode);
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
              edit={editMode}
              formData={formData}
              setFormData={setFormData}
              onSave={handleSave}
              isLoading={isLoading}
            />
          )}
        </ModalBody>

        <ModalFooter className="border-t pt-3 flex justify-between">
          <div>
            {!editMode ? (
              <Button color="primary" variant="solid" onPress={toggleEditMode}>
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
                <Button color="danger" variant="flat" onPress={toggleEditMode}>
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