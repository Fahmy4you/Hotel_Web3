import {z} from 'zod';

export const bookingSchema = z.object({
    nama: z.string().min(3, "Nama Booking minimal 3 karakter"),
    wa: z.string().min(10, "Nomor Wa minimal 10 digit"),
    startDate: z.string(),
    endDate: z.string()
}).refine((data) => data.startDate != data.endDate, {
    message: "Tanggal Checkin dan Checkout tidak boleh sama",
    path: ["startDate"]
});
export type BookingDataType = z.infer<typeof bookingSchema>;


export const hotelSchema = z.object({
  nama_hotel: z.string().min(1, 'Nama hotel wajib diisi'),
  lokasi: z.string().min(1, 'Lokasi wajib diisi'),
  user_id: z.string().min(1, "User Id Tidak Ada"),
  images: z.number().min(1, "Minimal ada 1 image").max(3, "Maximal ada 3 image")
});