import { useState, useEffect } from "react";
import { getMyHotels } from "@/app/Server/Hotel/Owner/GettMyHotels";
import { deleteHotel } from "@/app/Server/Hotel/Owner/DeleteHotel";
import { HotelData } from "../../types/hotelData";
import { hotelSchema } from "@/utils/zod";
import { addToast } from "@heroui/react";

export const useManageHotel = (
    userID: number,
    onEditHotel?: (hotel: HotelData) => void,
    onAddHotel?: (hotel: HotelData) => void
) => {
    const [hotels, setHotels] = useState<HotelData[]>([]);
    const [deleting, setDeleting] = useState(false);
    const [loading, setLoading] = useState(false);
    const [query, setQuery] = useState<string>("");

    const fetchHotels = async () => {
        setLoading(true);
        try {
            const res = await getMyHotels({ search: query, page: 1 });
            setHotels(res.hotels || []);
        } catch (error) {
            console.error("Error fetching hotels:", error);
        } finally {
            setLoading(false);
            setDeleting(false);
        }
    };

    useEffect(() => {
        fetchHotels();
    }, [query]);

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
                })
            }
        } catch (error) {
            addToast({
                title: 'Error',
                description: 'Terjadi Error saat menghapus Hotel!',
                variant: 'flat',
                color: 'danger',
            })
            console.error("Error deleting hotel:", error);
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
            formDataToSend.append("nama_hotel", formData.nama_hotel);
            formDataToSend.append("lokasi", formData.lokasi);
            formDataToSend.append("user_id", String(userID));

            const existingImages = formData.images?.filter(img => typeof img === 'string') || [];
            const newFiles = formData.images?.filter(img => img instanceof File) as File[] || [];

            if (existingImages.length > 0) {
                formDataToSend.append("existing_images", JSON.stringify(existingImages));
            }

            newFiles.forEach(file => {
                formDataToSend.append("files", file);
            });

            const totalImages = existingImages.length + newFiles.length;
            const validated = hotelSchema.safeParse({
                nama_hotel: formData.nama_hotel,
                lokasi: formData.lokasi,
                images: totalImages,
                user_id: userID
            });

            if (!validated.success) {
                const errors = validated.error.flatten().fieldErrors;
                addToast({
                    title: 'Error',
                    description: Object.values(errors).flat().join(', '),
                    variant: 'flat',
                    color: 'danger',
                })
                console.log(errors);
                return errors;
            }

            const endpoint = isEditMode && currentData?.id
                ? `/api/hotel/${currentData.id}`
                : "/api/upload/hotels";

            const method = isEditMode ? "PUT" : "POST";

            const res = await fetch(endpoint, {
                method,
                body: formDataToSend,
            });

            if (!res.ok || res.status !== 200) {
                 const errorData = await res.json().catch(() => ({}));
                addToast({
                    title: isEditMode ? 'Terjadi Error saat mengedit Kamar!' : 'Terjadi Error saat menambahkan Kamar!',
                    description: errorData.message,
                    variant: 'flat',
                    color: 'danger',
                })
                throw new Error("Failed to submit hotel");
            }

            const resData = await res.json();
            addToast({
                title: 'Berhasil',
                description: 'Berhasil Menambahkan Hotel!',
                variant: 'flat',
                color: 'success',
            })
            if (isEditMode && currentData?.id) {
                onEditHotel?.({ ...formData, id: currentData.id, images: resData.hotel.images });
            } else {
                onAddHotel?.({ ...formData, images: resData.hotel.images });
            }

            await fetchHotels();
            closeModal();
        } catch (error : any) {
            addToast({
                title: 'Error',
                description: error.message,
                variant: 'flat',
                color: 'danger',
            })
            console.error("Error submitting hotel:", error);
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
    };
};