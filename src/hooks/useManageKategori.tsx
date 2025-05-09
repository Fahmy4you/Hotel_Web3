import { useState, useEffect } from "react";
import { getMyKategori } from "@/app/Server/Hotel/Owner/Kategori/GetMyKategori";
import { deleteMyKategori } from "@/app/Server/Hotel/Owner/Kategori/DeleteMyKategori";
import { KategoriData } from "../../types/kategoriData";
import { updateMyKategori } from "@/app/Server/Hotel/Owner/Kategori/UpdateMyKategori";
import { addKategori } from "@/app/Server/Hotel/Owner/Kategori/AddKategori";

export const useManageKategori = (
    userID: string,
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
            await fetchKategori();
        } catch (error) {
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
                await fetchKategori();
            } else {
                console.error("Failed to update kategori");
            }
        } catch (error) {
            console.error("Error editing kategori:", error);
        } finally {
            setDeleting(false);
        }
    }
    const submitKategori = async (
        userId : string,
        propsKategori : string,
        closeModal: () => void
    ) => {
        try {
            await addKategori(propsKategori, userId);
            // console.log("res", res);
            await fetchKategori();
            closeModal();
        } catch (error) {
            console.error("Error submitting hotel:", error);
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
