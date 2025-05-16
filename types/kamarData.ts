enum StatusKamar {
  TERSEDIA,
  DIPESAN,
  DIBERSIHKAN,
  DIPERBAIKI
}

export interface KamarData {
    id?: number
    kamar: string
    kategori_id?: number
    _count?: {
        booking: number
    }
    booking: number
}

export interface KamarDataDetail {
    id: number;
    nama_kamar: string;
    desk: string;
    price: number;
    is_active: boolean;
    status: StatusKamar;
    is_kyc: boolean;
    kategori_id: number;
    hotel_id: number;
    features: string[];
    images: string[];
}

export interface KamarDataByHotel {
    id: number;
    nama_kamar: string;
    images: string[];
    price: number;
    createdat: Date;
    features: string[];
    is_kyc: boolean;
    kategori_id: number;
    kategori: string;
}