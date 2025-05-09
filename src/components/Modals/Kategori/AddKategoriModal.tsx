import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Input,
} from "@heroui/react";
import React, { useState, useEffect } from "react";
import { FaTags } from "react-icons/fa6";
import { KategoriData } from "../../../../types/kategoriData";

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
  const [category, setCategory] = useState<KategoriData | null>();

  useEffect(() => {
    if (isOpen) {
      if (isEdit && initialData) {
        setCategory(initialData);
      } else {
        setCategory(null);
      }
    }
  }, [isOpen, initialData, isEdit]);

  const handleSubmit = () => {
    if (!category?.kategori.trim()) return;
    onSubmit(category);
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
                value={category?.kategori}
                onChange={(e) =>
                  setCategory({ ...category, kategori: e.target.value })
                }
                autoFocus
              />
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