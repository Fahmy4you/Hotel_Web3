'use client'
import { useState, useEffect } from "react";
import { addToast } from "@heroui/react";
import { KamarData } from "../../types/kamarData";
import { getMyHotelKamars } from "@/app/Server/Kamar/GetMyKamarHotel";
import { deleteMyKamarHotels } from "@/app/Server/Kamar/DeleteMyKamarHotels";
import { getKamarById } from "@/app/Server/Kamar/GetKamarByID";


export const useManageKamar = (
  UserId : number,
  onAddKamar?: (kamar: KamarData) => void,
  onEditKamar?: (kamar: KamarData) => void,
) => {
  const [kamars, setKamars] = useState<KamarData[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [query, setQuery] = useState("");

  const fetchKamars = async () => {
    setIsLoading(true);
    try {
      const res = await getMyHotelKamars({ search: query, page: 1, userId: UserId });
      setKamars(res.kamars || []);
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
  };

  useEffect(() => {
    fetchKamars();
  }, [query, UserId]);

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

  const getDetailKamar = async (kamarId: number) => {
    setIsLoading(true);
      try {
        const res = await getKamarById(kamarId);
        setKamars(res ? [res] : []);
      } catch (error) {
        console.error("Error get detail kamar:", error);
        addToast({
          title: 'Error',
          description: 'Gagal memuat detail kamar',
          variant: 'flat',
          color: 'danger',
        })
      }
  }
  const submitKamar = async (
    formData: KamarData,
    isEditMode: boolean,
    currentData: KamarData | null,
    closeModal: () => void
  ) => {
    setIsLoading(true);
    try {
      const formDataToSend = new FormData();
      
      // Append basic fields
      formDataToSend.append("nama_kamar", formData.nama_kamar);
      formDataToSend.append("desk", formData.desk);
      formDataToSend.append("hotel_id", String(formData.hotel_id));
      formDataToSend.append("kategori_id", String(formData.kategori_id));
      formDataToSend.append("price", String(formData.price));
      formDataToSend.append("is_kyc", String(formData.is_kyc));
      formDataToSend.append("status", formData.status);

      // Handle images
      const existingImages = formData.images?.filter(img => typeof img === 'string') || [];
      const newFiles = formData.images?.filter(img => img instanceof File) as File[] || [];
      
      if (existingImages.length > 0) {
        formDataToSend.append("existing_images", JSON.stringify(existingImages));
      }
      
      newFiles.forEach(file => {
        formDataToSend.append("files", file);
      });

      // Handle Features
      const allFasilitas = formData.features || [];
      formDataToSend.append("fasilitas", JSON.stringify(allFasilitas));

      const endpoint = isEditMode && currentData?.id 
        ? `/api/kamar/${currentData.id}`
        : "/api/kamar";

      const method = isEditMode ? "PUT" : "POST";

      const response = await fetch(endpoint, {
        method,
        body: formDataToSend,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'Request failed');
      }

      const responseData = await response.json();
      
      addToast({
        title: 'Berhasil',
        description: isEditMode ? 'Kamar berhasil diperbarui!' : 'Kamar berhasil ditambahkan!',
        variant: 'flat',
        color: 'success',
      });

      if (isEditMode && currentData?.id && onEditKamar) {
        onEditKamar({ ...responseData, id: currentData.id });
      } else if (onAddKamar) {
        onAddKamar(responseData);
      }

      await fetchKamars();
      closeModal();
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
    query,
    setQuery,
    fetchKamars,
    deleteKamar,
    submitKamar,
    getDetailKamar
  };
};