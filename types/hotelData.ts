export interface HotelData {
    id?: number;
    nama_hotel: string;
    user_id? : number;
    lokasi: string;
    is_banned?: boolean;
    images?: (File | string)[]; 
}

