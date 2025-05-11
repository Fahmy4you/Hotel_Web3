import { useState, useEffect } from "react";
import { getMyHotels } from "@/app/Server/Hotel/Owner/GettMyHotels";
import { deleteHotel } from "@/app/Server/Hotel/Owner/DeleteHotel";
import { HotelData } from "../../types/hotelData";
import { hotelSchema } from "@/utils/zod";
import { error } from "console";

export const useManageHotel = (
    userID: number,
    onEditHotel?: (hotel: HotelData) => void,
    onAddHotel?: (hotel: HotelData) => void
) => {
    const [hotels, setHotels] = useState<HotelData[]>([]);
    const [deleting, setDeleting] = useState(false);
    const [query, setQuery] = useState<string>("");

    const fetchHotels = async () => {
        try {
            const res = await getMyHotels({ search: query, page: 1 });
            setHotels(res.hotels || []);
        } catch (error) {
            console.error("Error fetching hotels:", error);
        } finally {
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
            }
        } catch (error) {
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
                images: totalImages
            });

            if(!validated.success) {
                const errors = validated.error.flatten().fieldErrors;
                return errors;
            }


            // const endpoint = isEditMode && currentData?.id
            //     ? `/api/hotel/${currentData.id}`
            //     : "/api/upload/hotels";

            // const method = isEditMode ? "PUT" : "POST";

            // const res = await fetch(endpoint, {
            //     method,
            //     body: formDataToSend,
            // });

            // if (!res.ok) {
            //     const errorData = await res.json().catch(() => ({}));
            //     throw new Error(errorData.error || "Failed to upload");
            // }

            // const resData = await res.json();

            // if (isEditMode && currentData?.id) {
            //     onEditHotel?.({ ...formData, id: currentData.id, images: resData.hotel.images });
            // } else {
            //     onAddHotel?.({ ...formData, images: resData.hotel.images });
            // }

            // await fetchHotels();
            // closeModal();
        } catch (error) {
            console.error("Error submitting hotel:", error);
        }
    };


    return {
        hotels,
        deleting,
        setQuery,
        query,
        deleteMyHotel,
        submitHotel,
    };
};
