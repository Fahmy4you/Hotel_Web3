'use client';
import { useState, useEffect } from 'react';
import { getMyHotels } from '@/app/Server/Hotel/Owner/GettMyHotels';
import { deleteHotel } from '@/app/Server/Hotel/Owner/DeleteHotel';
import { HotelData } from '../../types/hotelData';
import { hotelSchema } from '@/utils/zod';
import { addToast } from '@heroui/react';

export const useManageHotel = (
  userID: number,
  onEditHotel?: (hotel: HotelData) => void,
  onAddHotel?: (hotel: HotelData) => void
) => {
  const [hotels, setHotels] = useState<HotelData[]>([]);
  const [deleting, setDeleting] = useState(false);
  const [loading, setLoading] = useState(false);
  const [query, setQuery] = useState<string>('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const itemsPerPage = 10;

  const fetchHotels = async () => {
    setLoading(true);
    try {
      const res = await getMyHotels({ search: query, page: currentPage });
      setHotels(res.hotels || []);
      setTotalPages(res.totalPages || 1);
      setTotalItems(res.totalHotels || 0);
    } catch (error) {
      console.error('Error fetching hotels:', error);
      addToast({
        title: 'Error',
        description: 'Failed to fetch hotels',
        variant: 'flat',
        color: 'danger',
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (userID) {
      fetchHotels();
    }
  }, [userID, query, currentPage]);

  const deleteMyHotel = async (hotelID: number) => {
    setDeleting(true);
    try {
      const res = await deleteHotel(hotelID);
      if (res) {
        await fetchHotels();
        addToast({
          title: 'Berhasil',
          description: 'Berhasil Menghapus Hotel!',
          variant: 'flat',
          color: 'success',
        });
      }
    } catch (error) {
      addToast({
        title: 'Error',
        description: 'Terjadi Error saat menghapus Hotel!',
        variant: 'flat',
        color: 'danger',
      });
      console.error('Error deleting hotel:', error);
    } finally {
      setDeleting(false);
    }
  };

  const submitHotel = async (
    formData: HotelData,
    isEditMode: boolean,
    currentData: HotelData | null,
    closeModal: () => void
  ) => {
    setLoading(true);
    try {
      const formDataToSend = new FormData();
      formDataToSend.append('nama_hotel', formData.nama_hotel);
      formDataToSend.append('lokasi', formData.lokasi);
      formDataToSend.append('user_id', String(userID));

      const existingImages = formData.images?.filter(img => typeof img === 'string') || [];
      const newFiles = (formData.images?.filter(img => img instanceof File) as File[]) || [];

      if (existingImages.length > 0) {
        formDataToSend.append('existing_images', JSON.stringify(existingImages));
      }

      newFiles.forEach(file => {
        formDataToSend.append('files', file);
      });

      const totalImages = existingImages.length + newFiles.length;
      const validated = hotelSchema.safeParse({
        nama_hotel: formData.nama_hotel,
        lokasi: formData.lokasi,
        images: totalImages,
        user_id: userID,
      });

      if (!validated.success) {
        const errors = validated.error.flatten().fieldErrors;
        addToast({
          title: 'Error',
          description: Object.values(errors).flat().join(', '),
          variant: 'flat',
          color: 'danger',
        });
        return errors;
      }

      const endpoint = isEditMode && currentData?.id ? `/api/hotel/${currentData.id}` : '/api/upload/hotels';
      const method = isEditMode ? 'PUT' : 'POST';

      const res = await fetch(endpoint, {
        method,
        body: formDataToSend,
      });

      if (!res.ok || res.status !== 200) {
        const errorData = await res.json().catch(() => ({}));
        addToast({
          title: isEditMode ? 'Terjadi Error saat mengedit Hotel!' : 'Terjadi Error saat menambahkan Hotel!',
          description: errorData.message || 'Unknown error',
          variant: 'flat',
          color: 'danger',
        });
        throw new Error('Failed to submit hotel');
      }

      const resData = await res.json();
      addToast({
        title: 'Berhasil',
        description: isEditMode ? 'Berhasil Mengedit Hotel!' : 'Berhasil Menambahkan Hotel!',
        variant: 'flat',
        color: 'success',
      });

      if (isEditMode && currentData?.id) {
        onEditHotel?.({ ...formData, id: currentData.id, images: resData.hotel.images });
      } else {
        onAddHotel?.({ ...formData, images: resData.hotel.images });
      }

      await fetchHotels();
      closeModal();
    } catch (error: any) {
      addToast({
        title: 'Error',
        description: error.message || 'Unknown error',
        variant: 'flat',
        color: 'danger',
      });
      console.error('Error submitting hotel:', error);
      return { general: ['Failed to submit hotel'] };
    } finally {
      setLoading(false);
    }
  };

  return {
    hotels,
    loading,
    deleting,
    setQuery,
    query,
    deleteMyHotel,
    submitHotel,
    currentPage,
    setCurrentPage,
    totalPages,
    totalItems,
    itemsPerPage,
  };
};