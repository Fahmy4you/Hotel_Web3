export interface KategoriData {
    id?: number;
    kategori: string;
    user_id?: number;
    _count?: {
    kamar: number;
  };
}

export interface KategoriDataShow {
  id: number;
  kategori: string;
  image: string;
  hotel_id: number;
  nama_hotel: string;
  rating: number;
  total_kamar: number;
}

export interface KategoriDataIdIncludeHotelKamar {
  id: number;
  kategori: string;
  hotel_id: number;
  nama_hotel: string;
  lokasi: string;
  images?: (File | string)[]; 
  rating: number;
}