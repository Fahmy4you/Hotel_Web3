export interface KategoriData {
    id?: number;
    kategori: string;
    hotel_id?: number;
    is_banned?: boolean;
    kamar_count?: number;
    nama_hotel?: string;
    _count?: {
    kamar: number;
  };
}