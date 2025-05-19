import { Button, Chip, Form, Input, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, Textarea, RadioGroup, Radio } from "@heroui/react"
import { useManageKamar } from "@/hooks/useManageKamar"
import { useHooksUser } from "@/hooks/useHooksUser"
import { useEffect, useState } from "react"
import { StatusKamar } from "@prisma/client"
import { KamarData } from "../../../../types/kamarData"
import { LuBedDouble } from "react-icons/lu"
import FormUploadwImage from "@/components/Form/FormWithFileUpload"

export interface EditKamarProps {
  selectedIdKamar?: number | null
  isOpen: boolean
  onClose: () => void
  onEditKamar?: (data: KamarData) => void
}

const roomStatusOptions = [
  { value: StatusKamar.TERSEDIA, label: "Tersedia" },
  { value: StatusKamar.DIPESAN, label: "Dipesan" },
  { value: StatusKamar.DIBERSIHKAN, label: "Dibersihkan" },
  { value: StatusKamar.DIPERBAIKI, label: "Diperbaiki" }
];

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
  nama_hotel: ''
};

const EditKamarModal = ({ isOpen, onClose, selectedIdKamar, onEditKamar }: EditKamarProps) => {
  const { user } = useHooksUser();
  const [currentFasilitas, setCurrentFasilitas] = useState('');
  const [removedImages, setRemovedImages] = useState<string[]>([]);
  const { 
    getDetailKamar, 
    submitKamar, 
    detailDataKamar, 
    isLoading, 
    fetchKamars 
  } = useManageKamar(user?.id || 0, undefined, onEditKamar);
  
  const [formData, setFormData] = useState<KamarData>(initialFormData);
  const [edit, setEdit] = useState(false);
  
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
        nama_hotel: detailDataKamar.hotel
      });
      setRemovedImages([]);
    }
  }, [detailDataKamar]);

  const handleAddFasilitas = () => {
    if (currentFasilitas.trim() && !(formData.features || []).includes(currentFasilitas.trim())) {
      setFormData(prev => ({
        ...prev,
        features: [...(prev.features || []), currentFasilitas.trim()]
      }));
      setCurrentFasilitas('');
    }
  };

  const handleRemoveFasilitas = (index: number) => {
    setFormData(prev => ({
      ...prev,
      features: (prev.features || []).filter((_, i) => i !== index)
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
        ...Array.from(files)
      ]
    }));
  };

  const handleRemoveImage = (index: number) => {
  // Dapatkan semua gambar yang string (existing images)
  const stringImages = formData.images?.filter(img => typeof img === 'string') as string[];
  
  // Pastikan index valid
  if (index >= 0 && index < stringImages.length) {
    const removedImage = stringImages[index];
    
    // Update state
    setRemovedImages(prev => [...prev, removedImage]);
    setFormData(prev => ({
      ...prev,
      // Hapus gambar dari array images
      images: prev.images?.filter(img => img !== removedImage) || []
    }));
  }
};

  const handleSave = async () => {
  try {
    // 1. Hapus gambar dari server
    if (removedImages.length > 0) {
      await Promise.all(
        removedImages.map(async (imagePath) => {
          try {
            const response = await fetch('/api/delete-image-kamar', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ imagePath }),
            });
            
            if (!response.ok) {
              throw new Error(`Gagal menghapus gambar: ${imagePath}`);
            }
          } catch (error) {
            console.error(`Error deleting image ${imagePath}:`, error);
            // Tetap lanjutkan proses meskipun ada error penghapusan gambar
          }
        })
      );
    }

    // 2. Siapkan data untuk submit
    const dataToSubmit = {
      ...formData,
      // Pastikan hanya menyertakan gambar yang tidak dihapus
      images: formData.images?.filter(img => 
        typeof img !== 'string' || !removedImages.includes(img)
      ) || [],
    };

    // 3. Submit ke API
    await submitKamar(
      dataToSubmit,
      true, // isEdit
      detailDataKamar ? {
        ...detailDataKamar,
        desk: detailDataKamar.deskripsi,
        price: detailDataKamar.harga_kamar,
        is_kyc: false
      } : null,
      onClose
    );

    setEdit(false);
    setRemovedImages([]);

  } catch (error : any) {
    console.error('Error saving kamar:', error);
  }
};

  const toggleEdit = () => {
    setEdit(!edit);
    if (!edit === false) {
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
          nama_hotel: detailDataKamar.hotel
        });
        setRemovedImages([]);
      }
    }
  };

  useEffect(() => {
    try {
      if (selectedIdKamar && isOpen) {
        getDetailKamar(selectedIdKamar);
      }
    } catch (error) {
      console.error(error);
    }
  }, [selectedIdKamar, isOpen, getDetailKamar]);

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="2xl" scrollBehavior="inside">
      <ModalContent>
        <ModalHeader className="flex items-center gap-3 border-b pb-3">
          <div className="flex items-center justify-center w-8 h-8 rounded-full bg-neutral-800 dark:bg-blue-900/30 text-white dark:text-blue-400">
            <LuBedDouble className="w-4 h-4" />
          </div>
          <span>Edit Kamar: {detailDataKamar?.nama_kamar}</span>
        </ModalHeader>

        <ModalBody className="flex flex-col gap-4 py-4">
          <FormUploadwImage
            isPreview={!edit}
            type="multiple"
            previewsCurrentlyImage={formData.images?.filter(img => 
              typeof img === 'string' && !removedImages.includes(img)
            ) as string[]}
            onImagesChange={handleImagesChange}
            onRemoveInitialImage={handleRemoveImage}
          >
            <Input 
              isDisabled={!edit} 
              variant="bordered" 
              value={formData.nama_kamar} 
              onChange={(e) => setFormData({ ...formData, nama_kamar: e.target.value })}
              labelPlacement="outside" 
              label="Nama Kamar" 
              isRequired
            />

            <div className="flex flex-col gap-3">
              <div className="flex gap-3">
                <Input
                  isDisabled={!edit}
                  value={formData.hotel_id ? formData.nama_hotel : ''}
                  labelPlacement="outside"
                  label="Hotel"
                  isReadOnly
                />
                <Input
                  isDisabled={!edit}
                  value={formData.kategori_id ? formData.kategori : ''}
                  labelPlacement="outside"
                  label="Kategori"
                  isReadOnly
                />
              </div>

              <Input
                isDisabled={!edit}
                value={formData.price.toString()}
                onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) || 0 })}
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
                    onChange={(e) => setCurrentFasilitas(e.target.value)}
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
                <label className="text-sm font-medium text-gray-700 mb-2 block">
                  Fasilitas Kamar
                </label>
                <div className="flex flex-wrap gap-2">
                  {(formData.features || []).map((feature, index) => (
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
                  {(formData.features || []).length === 0 && (
                    <span className="text-sm text-gray-500 italic">Tidak ada fasilitas</span>
                  )}
                </div>
              </div>

              {edit && (
                <RadioGroup
                  label="Status Kamar"
                  orientation="horizontal"
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value as StatusKamar })}
                  className="mt-2"
                >
                  {roomStatusOptions.map((status) => (
                    <Radio key={status.value} value={status.value}>
                      {status.label}
                    </Radio>
                  ))}
                </RadioGroup>
              )}

              {!edit && (
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 block">
                    Status Kamar
                  </label>
                  <Chip
                    variant="flat"
                    color={
                      formData.status === StatusKamar.TERSEDIA ? "success" :
                      formData.status === StatusKamar.DIPESAN ? "warning" :
                      formData.status === StatusKamar.DIBERSIHKAN ? "warning" : "danger"
                    }
                  >
                    {roomStatusOptions.find(opt => opt.value === formData.status)?.label || formData.status}
                  </Chip>
                </div>
              )}

              {edit && (
                <RadioGroup
                  label="Know your customers (KYC)?"
                  orientation="horizontal"
                  value={formData.is_kyc ? 'true' : 'false'}
                  onChange={(e) => setFormData({ ...formData, is_kyc: e.target.value === 'true' })}
                >
                  <Radio value="true">Iya</Radio>
                  <Radio value="false">Tidak</Radio>
                </RadioGroup>
              )}

              {!edit && (
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 block">
                    KYC Required
                  </label>
                  <Chip
                    variant="flat"
                    color={formData.is_kyc ? "primary" : "default"}
                  >
                    {formData.is_kyc ? "Iya" : "Tidak"}
                  </Chip>
                </div>
              )}

              <Textarea
                isDisabled={!edit}
                value={formData.desk}
                onChange={(e) => setFormData({ ...formData, desk: e.target.value })}
                labelPlacement="outside"
                label="Deskripsi"
                minRows={3}
              />
            </div>
          </FormUploadwImage>
        </ModalBody>

        <ModalFooter className="border-t pt-3 flex justify-between">
          <div>
            {!edit ? (
              <Button
                color="primary"
                variant="solid"
                onPress={toggleEdit}
              >
                Edit
              </Button>
            ) : (
              <div className="flex gap-2">
                <Button
                  color="primary"
                  variant="solid"
                  onPress={handleSave}
                  isLoading={isLoading}
                >
                  Simpan
                </Button>
                <Button
                  color="danger"
                  variant="flat"
                  onPress={toggleEdit}
                >
                  Batal
                </Button>
              </div>
            )}
          </div>
          <Button variant="light" onPress={onClose}>Tutup</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default EditKamarModal;