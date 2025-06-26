'use client'
import { useState, useEffect, useCallback } from "react";
import { addToast } from "@heroui/react";
import { detailDataKamar, KamarData } from "../types/kamarData";
import { getMyHotelKamars } from "@/app/Server/Kamar/GetMyKamarHotel";
import { deleteMyKamarHotels } from "@/app/Server/Kamar/DeleteMyKamarHotels";
import { getKamarById } from "@/app/Server/Kamar/GetKamarByID";
import { z } from "zod";
import { useDebounce } from 'use-debounce';
import { StatusKamar } from "@prisma/client";
import { KamarFormValues, kamarSchema } from "@/utils/zod";

export const useManageKamar = (
  userId: number,
  onEditKamar?: (kamar: KamarData) => void,
  onAddKamar?: (kamar: KamarData) => void
) => {
  const [kamars, setKamars] = useState<KamarData[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [detailDataKamar, setDetailDataKamar] = useState<detailDataKamar | null>(null);
  const [query, setQuery] = useState("");
  const [debouncedQuery] = useDebounce(query, 500);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const itemsPerPage = 10;

  const validateKamar = useCallback((formData: KamarData) => {
    try {
      const dataToValidate: KamarFormValues = {
        ...formData,
        hotel_id: formData.hotel_id || 0,
        kategori_id: formData.kategori_id || 0,
        price: formData.price || 0,
        images: formData.images || [],
        features: Array.isArray(formData.features)
          ? formData.features.map(f => typeof f === 'string' ? { nama_fasilitas: f } : f)
          : [],
        is_kyc: formData.is_kyc || false,
        status: (formData.status as StatusKamar) || StatusKamar.TERSEDIA
      };

      kamarSchema.parse(dataToValidate);
      return { success: true };
    } catch (error) {
      if (error instanceof z.ZodError) {
        error.errors.forEach(err => {
          addToast({
            title: 'Validasi Error',
            description: err.message,
            variant: 'flat',
            color: 'danger',
          });
        });
      }
      return { success: false };
    }
  }, []);

  const fetchKamars = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await getMyHotelKamars({
        search: debouncedQuery,
        page: currentPage,
        userId
      });

      const formattedKamars = (res.formatedResponse || []).map(kamar => ({
        ...kamar,
        kategori: kamar.kategori ?? undefined,
        nama_hotel: kamar.nama_hotel ?? undefined
      }));

      setKamars(formattedKamars);
      setTotalPages(res.totalPages || 1);
      setTotalItems(res.totalKamars || 0);
    } catch (error) {
      console.error("Error fetching kamar:", error);
      addToast({
        title: 'Error',
        description: 'Gagal memuat data kamar',
        variant: 'flat',
        color: 'danger',
      });
    } finally {
      setIsLoading(false);
    }
  }, [debouncedQuery, currentPage, userId]);

  useEffect(() => {
    if (userId) {
      fetchKamars();
    }
  }, [fetchKamars, userId]);

  const getDetailKamar = useCallback(async (kamarId: number) => {
    setIsLoading(true);
    setDetailDataKamar(null);
    try {
      const res = await getKamarById(kamarId);
      setDetailDataKamar(res as detailDataKamar);
    } catch (error) {
      console.error("Error get detail kamar:", error);
      addToast({
        title: 'Error',
        description: 'Gagal memuat detail kamar',
        variant: 'flat',
        color: 'danger',
      });
    } finally {
      setIsLoading(false);
    }
  }, []);

  const deleteKamar = async (kamarId: number) => {
    setDeleting(true);
    try {
      await deleteMyKamarHotels(kamarId);
      await fetchKamars();
      addToast({
        title: 'Berhasil',
        description: 'Kamar berhasil dihapus!',
        variant: 'flat',
        color: 'success',
      });
    } catch (error) {
      addToast({
        title: 'Error',
        description: 'Gagal menghapus kamar',
        variant: 'flat',
        color: 'danger',
      });
    } finally {
      setDeleting(false);
    }
  };

  const submitKamar = async (
    formData: KamarData,
    isEditMode: boolean,
    currentData: KamarData | null,
    closeModal?: () => void
  ) => {
    if (!validateKamar(formData).success) return;

    setIsLoading(true);
    try {
      const formDataToSend = new FormData();
      formDataToSend.append("nama_kamar", formData.nama_kamar);
      formDataToSend.append("desk", formData.desk);
      formDataToSend.append("hotel_id", String(formData.hotel_id));
      formDataToSend.append("kategori_id", String(formData.kategori_id));
      formDataToSend.append("price", String(formData.price));
      formDataToSend.append("is_kyc", String(formData.is_kyc));
      formDataToSend.append("status", formData.status);
      formDataToSend.append("fasilitas", JSON.stringify(formData.features || []));

      const existingImages = formData.images?.filter(img => typeof img === 'string') || [];
      const newFiles = formData.images?.filter(img => img instanceof File) as File[] || [];

      if (existingImages.length > 0) {
        formDataToSend.append("existing_images", JSON.stringify(existingImages));
      }

      newFiles.forEach(file => {
        formDataToSend.append("files", file);
      });

      const endpoint = isEditMode && currentData?.id
        ? `/api/kamar/${currentData.id}`
        : "/api/kamar";

      const response = await fetch(endpoint, {
        method: isEditMode ? "PUT" : "POST",
        body: formDataToSend,
      });
      
      if (!response.ok) {
        throw new Error(await response.text());
      }

      const responseData = await response.json();
      addToast({
        title: 'Berhasil',
        description: isEditMode ? 'Kamar berhasil diperbarui!' : 'Kamar berhasil ditambahkan!',
        variant: 'flat',
        color: 'success',
      });

      if (isEditMode && currentData?.id) {
        onEditKamar?.({ ...formData, id: currentData.id, images: responseData.kamar.images });
      } else {
        onAddKamar?.({ ...formData, images: responseData.kamar.images });
      }

      await fetchKamars();
      closeModal?.();
    } catch (error) {
      console.error("Error submitting kamar:", error);
      addToast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Terjadi kesalahan',
        variant: 'flat',
        color: 'danger',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return {
    kamars,
    isLoading,
    deleting,
    detailDataKamar,
    query,
    setQuery,
    fetchKamars,
    deleteKamar,
    submitKamar,
    getDetailKamar,
    currentPage,
    setCurrentPage,
    totalPages,
    totalItems,
    itemsPerPage,
  };
};