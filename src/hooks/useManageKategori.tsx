import { useState, useEffect } from "react";
import { getMyKategori } from "@/app/Server/Hotel/Owner/Kategori/GetMyKategori";
import { deleteMyKategori } from "@/app/Server/Hotel/Owner/Kategori/DeleteMyKategori";
import { KategoriData } from "../../types/kategoriData";
import { updateMyKategori } from "@/app/Server/Hotel/Owner/Kategori/UpdateMyKategori";
import { addKategori } from "@/app/Server/Hotel/Owner/Kategori/AddKategori";
import { addToast } from "@heroui/react";

export const useManageKategori = (
    userID: string,
    selectedHotelId?: string
) => {
    const [kategori, setKategori] = useState<KategoriData[]>([]);
    const [deleting, setDeleting] = useState(false);
    const [query, setQuery] = useState<string>("");

    const fetchKategori = async () => {
        try {
            const res = await getMyKategori(userID);
            setKategori(res || []);
        } catch (error) {
            console.error("Error fetching kategori:", error);
        } finally {
            setDeleting(false);
        }
    };

    useEffect(() => {
        fetchKategori();
    }, [query]);

    const handleDeleteKategori = async (kategoriId: number) => {
        setDeleting(true);
        try {
            await deleteMyKategori(kategoriId);
            addToast({
                title: 'Berhasil',
                description: 'Berhasil Menghapus Kategori!',
                variant: 'flat',
                color: 'success',
            })
            await fetchKategori();
        } catch (error) {
            addToast({
                title: 'Error',
                description: 'Terjadi Error saat menghapus Kategori!',
                variant: 'flat',
                color: 'danger',
            })
            console.error("Error deleting hotel:", error);
        } finally {
            setDeleting(false);
        }
    };

    const editKategori = async (kategori: KategoriData) => {
        try {
            if (!kategori) return console.error("Kategori is null or undefined");
            const parsedId = Number(kategori.id);
            const res = await updateMyKategori(parsedId, kategori.kategori);
            if (res) {
                addToast({
                    title: 'Berhasil',
                    description: 'Berhasil Update Kategori!',
                    variant: 'flat',
                    color: 'success',
                })
                await fetchKategori();
            } else {
                addToast({
                    title: 'Gagal',
                    description: 'Gagal Update Kategori!',
                    variant: 'flat',
                    color: 'danger',
                })
                console.error("Failed to update kategori");
            }
        } catch (error) {
            addToast({
                title: 'Error',
                description: 'Terjadi Error saat update Kategori!',
                variant: 'flat',
                color: 'danger',
            })
            console.error("Error editing kategori:", error);
        } finally {
            setDeleting(false);
        }
    }
    const submitKategori = async (
        kategoriName: string,
        hotelId: number,
        closeModal: () => void
    ) => {
        try {
            await addKategori(kategoriName, hotelId.toString());
            await fetchKategori();
            closeModal();
            addToast({
                title: 'Berhasil',
                description: 'Berhasil Menambahkan Kategori',
                variant: 'flat',
                color: 'success',
            });
        } catch (error) {
            console.error("Error submitting kategori:", error);
            addToast({
                title: 'Error',
                description: 'Terjadi Error saat menambahkan Kategori',
                variant: 'flat',
                color: 'danger',
            });
        }
    };

    return {
        kategori,
        deleting,
        setQuery,
        query,
        editKategori,
        handleDeleteKategori,
        submitKategori,
    };
};
