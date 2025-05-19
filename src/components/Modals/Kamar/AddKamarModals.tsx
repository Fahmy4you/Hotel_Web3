import FormUploadwImage from '@/components/Form/FormWithFileUpload'
import { LuBedDouble } from "react-icons/lu";
import { KamarData } from '../../../../types/kamarData';
import { ModalBody, RadioGroup, Radio, ModalContent, Textarea, ModalHeader, ModalFooter, Modal, Input, Select, SelectItem, Button, Chip, addToast } from '@heroui/react'
import { useEffect, useState } from 'react'
import { useManageHotel } from '@/hooks/useManageHotel';
import { useSelector } from 'react-redux';
import { RootState } from '../../../../libs/store';
import { getKategoriByHotelID } from '@/app/Server/Kategori/GetKategoriByHotelID';
import { KategoriData } from '../../../../types/kategoriData';
import { useManageKamar } from '@/hooks/useManageKamar';
import { StatusKamar } from '@prisma/client';
interface AddKamarModalsProps {
  isOpen: boolean;
  onClose: () => void;
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

const AddKamarModals = ({ isOpen, onClose }: AddKamarModalsProps) => {
  const userId = useSelector((state: RootState) => state.users.id) || 0;
  const { submitKamar } = useManageKamar(userId);
  const [selectedHotelId, setSelectedHotelId] = useState<string | null>(null);
  const { hotels } = useManageHotel(userId);
  const [formData, setFormData] = useState<KamarData>(initialFormData);
  const [typeRooms, setTypeRooms] = useState<KategoriData[]>([]);
  const [currentFasilitas, setCurrentFasilitas] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchKategori = async () => {
      try {
        if (selectedHotelId) {
          const res = await getKategoriByHotelID(selectedHotelId);
          setTypeRooms(res || []);
          setFormData(prev => ({ 
            ...prev, 
            hotel_id: Number(selectedHotelId),
            kategori_id: 0
          }));
        } else {
          setTypeRooms([]);
        }
      } catch (error) {
        console.error("Error fetching kategori kamar hotels:", error);
        setTypeRooms([]);
      }
    };

    fetchKategori();
  }, [selectedHotelId]);

  const handleAddFasilitas = () => {
    if (currentFasilitas.trim() && !(formData.features ?? []).includes(currentFasilitas.trim())) {
      setFormData(prev => ({
        ...prev,
        features: [...(prev.features ?? []), currentFasilitas.trim()]
      }));
      setCurrentFasilitas('');
    }
  };

  const handleHotelSelection = (keys: any) => {
    const hotelId = Array.from(keys).length > 0 ? Array.from(keys)[0] as string : null;
    setSelectedHotelId(hotelId);
    
    if (hotelId) {
      setFormData(prev => ({ 
        ...prev, 
        hotel_id: Number(hotelId),
        kategori_id: 0
      }));
    }
  };

  const handleRemoveFasilitas = (index: number) => {
    setFormData(prev => ({
      ...prev,
      features: (prev.features ?? []).filter((_, i) => i !== index)
    }));
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddFasilitas();
    }
  };

  const handleSubmit = async () => {
    if (!formData.hotel_id) {
      addToast({
        title: 'Error',
        description: 'Silakan pilih hotel terlebih dahulu',
        variant: 'flat',
        color: 'danger',
      });
      return;
    }

    setIsSubmitting(true);
    try {
      await submitKamar(formData, false, null, onClose);
    } catch (error) {
      console.error("Error submitting kamar:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFilesChange = (files: File[]) => {
    setFormData(prev => ({
      ...prev,
      images: files
    }));
  };

  return (
    <Modal 
      placement='bottom' 
      isOpen={isOpen} 
      backdrop='blur' 
      onClose={onClose} 
      size='2xl' 
      scrollBehavior='inside'
    >
      <ModalContent>
        <ModalHeader className='flex items-center gap-3'>
          <div className="flex items-center justify-center w-8 h-8 rounded-full bg-neutral-800 dark:bg-blue-900/30 text-white dark:text-blue-400">
            <LuBedDouble className="w-4 h-4" />
          </div>
          Tambah Kamar Baru
        </ModalHeader>
        <ModalBody>
          <FormUploadwImage 
            type='multiple' 
            onImagesChange={handleFilesChange}
          >
            <Select 
              labelPlacement='outside' 
              label="Pilih Hotel" 
              placeholder="Pilih Hotel" 
              isRequired
              selectedKeys={selectedHotelId ? new Set([selectedHotelId]) : new Set([])}
              onSelectionChange={handleHotelSelection}
              selectionMode="single"
            >
              {hotels.map((hotel) => (
                <SelectItem key={hotel.id?.toString() ?? ''}>
                  {hotel.nama_hotel}
                </SelectItem>
              ))}
            </Select>
            
            <Input 
              value={formData.nama_kamar} 
              onChange={(e) => setFormData({ ...formData, nama_kamar: e.target.value })} 
              labelPlacement='outside' 
              label="Nama Kamar" 
              placeholder="Masukkan Nama Kamar" 
              isRequired 
            />
            
            <div className='space-y-2'>
              <div className='flex justify-center items-center gap-3'>
                <Input
                  value={currentFasilitas}
                  onChange={(e) => setCurrentFasilitas(e.target.value)}
                  onKeyDown={handleKeyDown}
                  labelPlacement='outside'
                  label="Fasilitas"
                  placeholder="Masukkan fasilitas (contoh: AC, WiFi)"
                />
                <Button 
                  color='primary'
                  className='mt-5' 
                  onPress={handleAddFasilitas}
                  isDisabled={!currentFasilitas.trim()}
                >
                  Tambah
                </Button>
              </div>
              
              <div className='flex flex-wrap gap-2 mt-2'>
                {(formData.features ?? []).map((item, index) => (
                  <Chip 
                    key={index} 
                    onClose={() => handleRemoveFasilitas(index)}
                    variant="flat"
                    color="primary"
                  >
                    {item}
                  </Chip>
                ))}
              </div>
            </div>
            
            <Input 
              value={formData.price.toString()}
              onChange={(e) => setFormData({ 
                ...formData, 
                price: Number(e.target.value) || 0 
              })}
              labelPlacement='outside' 
              label="Harga" 
              type="number" 
              placeholder="Masukkan Harga Kamar per malam" 
              isRequired 
              min="0"
            />
            
            <Select 
              isDisabled={!selectedHotelId || typeRooms.length === 0}
              labelPlacement="outside" 
              label="Tipe Kamar" 
              placeholder={
                !selectedHotelId 
                  ? "Pilih hotel terlebih dahulu" 
                  : typeRooms.length === 0 
                    ? "Tidak ada tipe kamar tersedia" 
                    : "Pilih Tipe Kamar"
              }
              selectedKeys={formData.kategori_id ? new Set([formData.kategori_id.toString()]) : new Set([])}
              onSelectionChange={(keys) => {
                const keyArray = Array.from(keys);
                const kategoriId = keyArray.length > 0 ? Number(keyArray[0]) : 0;
                setFormData({ 
                  ...formData, 
                  kategori_id: kategoriId
                });
              }}
              isRequired
            >
              {typeRooms.map((type) => (
                <SelectItem key={type.id?.toString() ?? ''}>
                  {type.kategori}
                </SelectItem>
              ))}
            </Select>
            
            <RadioGroup 
              label="Status Kamar" 
              orientation="horizontal"
              value={formData.status}
              onChange={(e) => setFormData({ 
                ...formData, 
                status: e.target.value as StatusKamar 
              })}
            >
              {roomStatusOptions.map((status) => (
                <Radio key={status.value} value={status.value}>
                  {status.label}
                </Radio>
              ))}
            </RadioGroup>
            
            <RadioGroup 
              label="Know your customers?" 
              orientation="horizontal"
              value={formData.is_kyc ? 'true' : 'false'}
              onChange={(e) => setFormData({ 
                ...formData, 
                is_kyc: e.target.value === 'true' 
              })}
            >
              <Radio value="true">Iya</Radio>
              <Radio value="false">Tidak</Radio>
            </RadioGroup>
            
            <Textarea
              value={formData.desk}
              onChange={(e) => setFormData({ 
                ...formData, 
                desk: e.target.value 
              })}
              isRequired
              label="Deskripsi"
              labelPlacement="outside"
              placeholder="Masukkan deskripsi kamar"
              minRows={3}
            />
          </FormUploadwImage>
        </ModalBody>
        <ModalFooter>
          <Button color="danger" variant="light" onPress={onClose}>
            Batal
          </Button>
          <Button 
            color="primary" 
            onPress={handleSubmit}
            isLoading={isSubmitting}
            isDisabled={!formData.hotel_id || !formData.kategori_id}
          >
            Simpan
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default AddKamarModals;