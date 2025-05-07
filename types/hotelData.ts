export interface HotelData {
    id?: number;
    nama_hotel: string;
    desk: string;
    user_id? : number;
    lokasi: string;
    is_banned?: boolean;
    images?: (string | File)[]; 
}

