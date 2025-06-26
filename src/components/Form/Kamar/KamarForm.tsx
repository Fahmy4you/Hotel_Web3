import React, { useState } from 'react';
import {
  Button,
  Chip,
  Input,
  RadioGroup,
  Radio,
  Textarea,
} from '@heroui/react';
import FormUploadwImage from '@/components/Form/FormWithFileUpload';
import { KamarData } from '@/types/kamarData';
import { StatusKamar } from '@prisma/client';

const roomStatusOptions = [
  { value: StatusKamar.TERSEDIA, label: 'Tersedia' },
  { value: StatusKamar.DIPESAN, label: 'Dipesan' },
  { value: StatusKamar.DIBERSIHKAN, label: 'Dibersihkan' },
  { value: StatusKamar.DIPERBAIKI, label: 'Diperbaiki' },
];

interface EditKamarFormProps {
  edit: boolean;
  formData: KamarData;
  setFormData: React.Dispatch<React.SetStateAction<KamarData>>;
  onSave: (formData: KamarData) => Promise<void>;
  isLoading: boolean;
}

const EditKamarForm: React.FC<EditKamarFormProps> = ({
  edit,
  formData,
  setFormData,
  onSave,
  isLoading,
}) => {
  const [currentFasilitas, setCurrentFasilitas] = useState('');
  const [removedImages, setRemovedImages] = useState<string[]>([]);

  const handleAddFasilitas = () => {
    if (currentFasilitas.trim() && !formData.features?.includes(currentFasilitas.trim())) {
      setFormData(prev => ({
        ...prev,
        features: [...(prev.features || []), currentFasilitas.trim()],
      }));
      setCurrentFasilitas('');
    }
  };

  const handleRemoveFasilitas = (index: number) => {
    setFormData(prev => ({
      ...prev,
      features: (prev.features || []).filter((_, i) => i !== index),
    }));
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddFasilitas();
    }
  };

  const handleImagesChange = (files: File[]) => {
    setFormData(prev => ({
      ...prev,
      images: [
        ...(prev.images?.filter(img => typeof img === 'string' && !removedImages.includes(img as string)) || []),
        ...files,
      ],
    }));
  };

  const handleRemoveImage = (index: number) => {
    const stringImages = formData.images?.filter(img => typeof img === 'string') as string[] || [];
    if (index >= 0 && index < stringImages.length) {
      const removedImage = stringImages[index];
      setRemovedImages(prev => [...prev, removedImage]);
      setFormData(prev => ({
        ...prev,
        images: prev.images?.filter(img => img !== removedImage) || [],
      }));
    }
  };

  const handleSaveWithImages = async () => {
    if (removedImages.length > 0) {
      await Promise.all(
        removedImages.map(async imagePath => {
          try {
            const response = await fetch('/api/delete-image-kamar', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ imagePath }),
            });
            if (!response.ok) throw new Error(`Gagal menghapus gambar: ${imagePath}`);
          } catch (error) {
            console.error(`Error deleting image ${imagePath}:`, error);
          }
        }),
      );
    }
    const updatedFormData = {
      ...formData,
      images: formData.images?.filter(img => typeof img !== 'string' || !removedImages.includes(img)) || [],
    };
    await onSave(updatedFormData);
  };

  // Pastikan semua properti memiliki nilai default
  const safeFormData = {
    ...formData,
    nama_kamar: formData.nama_kamar || '',
    nama_hotel: formData.nama_hotel || '',
    kategori: formData.kategori || '',
    price: formData.price || 0,
    desk: formData.desk || '',
    features: formData.features || [],
    images: formData.images || [],
    status: formData.status || StatusKamar.TERSEDIA,
    is_kyc: formData.is_kyc || false,
  };

  return (
    <FormUploadwImage
      isPreview={!edit}
      type="multiple"
      previewsCurrentlyImage={
        safeFormData.images
          ?.filter(img => typeof img === 'string' && !removedImages.includes(img))
          ?.filter((img): img is string => typeof img === 'string') || []
      }
      onImagesChange={handleImagesChange}
      onRemoveInitialImage={handleRemoveImage}
    >
      <Input
        isDisabled={!edit}
        variant="bordered"
        value={safeFormData.nama_kamar}
        onChange={e => setFormData({ ...formData, nama_kamar: e.target.value })}
        labelPlacement="outside"
        label="Nama Kamar"
        isRequired
      />

      <div className="flex flex-col gap-3">
        <div className="flex gap-3">
          <Input
            isDisabled={!edit}
            value={safeFormData.nama_hotel}
            labelPlacement="outside"
            label="Hotel"
            isReadOnly
          />
          <Input
            isDisabled={!edit}
            value={safeFormData.kategori}
            labelPlacement="outside"
            label="Kategori"
            isReadOnly
          />
        </div>

        <Input
          isDisabled={!edit}
          value={safeFormData.price.toString()}
          onChange={e => setFormData({ ...formData, price: Number(e.target.value) || 0 })}
          labelPlacement="outside"
          type="number"
          label="Harga per malam"
          isRequired
          min="0"
        />

        {edit && (
          <div className="flex justify-center items-center gap-3">
            <Input
              value={currentFasilitas}
              onChange={e => setCurrentFasilitas(e.target.value)}
              onKeyDown={handleKeyDown}
              labelPlacement="outside"
              label="Fasilitas"
              placeholder="Masukkan fasilitas (contoh: AC, WiFi)"
            />
            <Button
              color="primary"
              className="mt-5"
              onPress={handleAddFasilitas}
              isDisabled={!currentFasilitas.trim()}
            >
              Tambah
            </Button>
          </div>
        )}

        <div className="mt-2">
          <label className="text-sm font-medium text-gray-700 mb-2 block">Fasilitas Kamar</label>
          <div className="flex flex-wrap gap-2">
            {safeFormData.features.map((feature, index) => (
              <Chip
                key={index}
                variant="flat"
                color="primary"
                onClose={edit ? () => handleRemoveFasilitas(index) : undefined}
                className="transition-all duration-200"
              >
                {feature}
              </Chip>
            ))}
            {safeFormData.features.length === 0 && (
              <span className="text-sm text-gray-500 italic">Tidak ada fasilitas</span>
            )}
          </div>
        </div>

        {edit ? (
          <RadioGroup
            label="Status Kamar"
            orientation="horizontal"
            value={safeFormData.status}
            onChange={e => setFormData({ ...formData, status: e.target.value as StatusKamar })}
            className="mt-2"
          >
            {roomStatusOptions.map(status => (
              <Radio key={status.value} value={status.value}>
                {status.label}
              </Radio>
            ))}
          </RadioGroup>
        ) : (
          <div>
            <label className="text-sm font-medium text-gray-700 mb-2 block">Status Kamar</label>
            <Chip
              variant="flat"
              color={
                safeFormData.status === StatusKamar.TERSEDIA
                  ? 'success'
                  : safeFormData.status === StatusKamar.DIPESAN || safeFormData.status === StatusKamar.DIBERSIHKAN
                  ? 'warning'
                  : 'danger'
              }
            >
              {roomStatusOptions.find(opt => opt.value === safeFormData.status)?.label || safeFormData.status}
            </Chip>
          </div>
        )}

        {edit ? (
          <RadioGroup
            label="Know your customers (KYC)?"
            orientation="horizontal"
            value={safeFormData.is_kyc ? 'true' : 'false'}
            onChange={e => setFormData({ ...formData, is_kyc: e.target.value === 'true' })}
          >
            <Radio value="true">Iya</Radio>
            <Radio value="false">Tidak</Radio>
          </RadioGroup>
        ) : (
          <div>
            <label className="text-sm font-medium text-gray-700 mb-2 block">KYC Required</label>
            <Chip variant="flat" color={safeFormData.is_kyc ? 'primary' : 'default'}>
              {safeFormData.is_kyc ? 'Iya' : 'Tidak'}
            </Chip>
          </div>
        )}

        <Textarea
          isDisabled={!edit}
          value={safeFormData.desk}
          onChange={e => setFormData({ ...formData, desk: e.target.value })}
          labelPlacement="outside"
          label="Deskripsi"
          minRows={3}
        />
      </div>
    </FormUploadwImage>
  );
};

export default EditKamarForm;