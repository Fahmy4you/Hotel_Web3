import {z} from 'zod';

export const bookingSchema = z.object({
    nama: z.string().min(3, "Nama Booking minimal 4 karakter"),
    wa: z.string().min(10, "Nomor Wa minimal 10 digit"),
    startDate: z.string(),
    endDate: z.string()
}).refine((data) => data.startDate != data.endDate, {
    message: "Tanggal Checkin dan Checkout tidak boleh sama",
    path: ["startDate"]
});
export type BookingDataType = z.infer<typeof bookingSchema>;