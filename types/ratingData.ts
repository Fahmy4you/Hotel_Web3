export interface RatingDataType {
    id: number;
    komentar: string;
    user_id: string;
    hotel_id: string;
    bintang: number;
    createdAt: Date;
    updatedAt: Date;
}

export interface HotelRating {
    rating_id: number;
    bintang: number;
    komentar: string;
    createdAt: Date;
    nama_hotel: string;
    nama: string;
    profile: string;
    role: string;
};
