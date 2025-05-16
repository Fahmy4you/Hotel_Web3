export interface HotelData {
    id?: number;
    nama_hotel: string;
    user_id? : number;
    lokasi: string;
    is_banned?: boolean;
    images?: (File | string)[]; 
    rating?: number,
    jumlah_kamar?: number
}

export interface HotelShowData {
    id?: number;
    nama_hotel: string;
    user_id? : number;
    lokasi: string;
    is_banned?: boolean;
    images?: (File | string)[]; 
    rating?: number,
    jumlah_kamar?: number,
    _count: {kamars: number};
    ratingAvg: {bintang: number | null};
}

