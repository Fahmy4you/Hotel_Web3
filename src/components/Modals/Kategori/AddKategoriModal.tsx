import {Modal,ModalContent,ModalHeader,ModalBody,ModalFooter,Button,Input,Select,SelectItem,addToast} from "@heroui/react";
import React, { useState, useEffect } from "react";
import { FaTags } from "react-icons/fa6";
import { KategoriData } from "../../../../types/kategoriData";
import { useManageHotel } from "@/hooks/useManageHotel";
import { useSelector } from "react-redux";
import { RootState } from "../../../../libs/store";
import { validateKategori } from "@/utils/zod";


interface AddKategoriModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (category: KategoriData) => void;
  initialData?: KategoriData | null;
  isEdit: boolean;
}

export default function AddKategoriModal({
  isOpen,
  onClose,
  onSubmit,
  initialData,
  isEdit = false,
}: AddKategoriModalProps) {
  const user_id = useSelector((state: RootState) => state.users.id) || 0;
  const [category, setCategory] = useState<KategoriData>({
    id: 0,
    kategori: '',
    hotel_id: 0,
  });
  const validateResult = validateKategori(category);
  const { hotels, loading } = useManageHotel(user_id);

  useEffect(() => {
    if (isOpen) {
      if (isEdit && initialData) {
        setCategory(initialData);
      } else {
        setCategory({
          id: 0,
          kategori: '',
          hotel_id: 0
        });
      }
    }
  }, [isOpen, initialData, isEdit, hotels]);

  const handleSubmit = () => {
    if (!category.kategori.trim() || !category.hotel_id) {
      addToast({
        title: 'Error',
        description: 'Mohon Isi Semua Data',
        variant: 'flat',
        color: 'danger',
      });
      return;
    }

    if (!validateResult.success) {
      const errors = validateResult.error.flatten();
      addToast({
        title: 'Error',
        description: Object.values(errors.fieldErrors).flat().join(', '),
        variant: 'flat',
        color: 'danger',
      });
      return;
      
    }
    onSubmit(validateResult.data);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onOpenChange={onClose} placement="top-center">
      <ModalContent>
        {() => (
          <>
            <ModalHeader className="flex flex-col gap-1">
              {isEdit ? "Edit Kategori" : "Tambah Kategori Baru!"}
            </ModalHeader>
            <ModalBody>
              <Input
                endContent={<FaTags className="text-2xl text-default-400" />}
                label="Kategori"
                placeholder="Input Kategori"
                type="text"
                variant="bordered"
                value={category.kategori}
                onChange={(e) =>
                  setCategory({ ...category, kategori: e.target.value })
                }
                autoFocus
              />

              <Select
                selectedKeys={category.hotel_id ? [category.hotel_id.toString()] : []}
                onSelectionChange={(keys) => {
                  const selectedKey = Array.from(keys)[0];
                  setCategory({ 
                    ...category, 
                    hotel_id: selectedKey ? Number(selectedKey) : 0 
                  });
                }}
                variant="bordered"
                label="Pilih Hotel"
                disabled={loading}
              >
                {hotels.map((hotel) => (
                  <SelectItem key={hotel.id.toString()} textValue={hotel.nama_hotel}>
                    {hotel.nama_hotel}
                  </SelectItem>
                ))}
              </Select>
            </ModalBody>
            <ModalFooter>
              <Button color="danger" variant="flat" onPress={onClose}>
                Batal
              </Button>
              <Button color="primary" onPress={handleSubmit}>
                {isEdit ? "Update" : "Simpan"}
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
}