export interface KamarData {
    id?: number
    nama_kamar: string
    kategori_id?: number
    desk: string
    hotel_id?: number
    price: number
    is_kyc: boolean
    status: string
    images?: (File | string)[]
    features?: string[]
    is_active ?: boolean
    kategori? : string
    nama_hotel? : string
}