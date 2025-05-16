import {z} from 'zod';
import { StatusKamar } from '@prisma/client';

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
  user_id: z.number().min(1, "User Id Tidak Ada"),
  images: z.number().min(1, "Minimal ada 1 image").max(3, "Maximal ada 3 image")
});

export const createImageFileSchema = ({
  maxSizeInMB = 5,
  acceptedTypes = "image/*"
}: {
  maxSizeInMB?: number;
  acceptedTypes?: string;
}) => {
  return z.instanceof(File)
    .refine(
      (file) => file.size > 0,
      {
        message: "File cannot be empty"
      }
    )
    .refine(
      (file) => file.size <= maxSizeInMB * 1024 * 1024,
      {
        message: `File size must be less than ${maxSizeInMB}MB`
      }
    )
    .refine(
      (file) => {
        const fileType = file.type.split('/')[0];
        return acceptedTypes === "image/*" 
          ? fileType === 'image'
          : file.type.match(acceptedTypes) !== null;
      },
      {
        message: `Only ${acceptedTypes.replace('*', 'all')} files are accepted`
      }
    );
};

export const validateFileCount = (
  currentCount: number,
  newCount: number,
  maxFiles: number
): z.SafeParseReturnType<any, any> => {
  if (currentCount + newCount > maxFiles) {
    return {
      success: false,
      error: new z.ZodError([{
        code: z.ZodIssueCode.too_big,
        maximum: maxFiles,
        type: 'array',
        inclusive: true,
        exact: false,
        message: `You can only upload up to ${maxFiles} files total. You already have ${currentCount} files.`,
        path: []
      }]),
    };
  }
  
  return { success: true, data: undefined };
};

export const formatFileSize = (bytes: number): string => {
  if (bytes >= 1073741824) {
    return (bytes / 1073741824).toFixed(2) + ' GB';
  }
  if (bytes >= 1048576) {
    return (bytes / 1048576).toFixed(2) + ' MB';
  }
  if (bytes >= 1024) {
    return (bytes / 1024).toFixed(2) + ' KB';
  }
  return bytes + ' bytes';
};


export const kategoriSchema = z.object({
  id: z.number().optional(),
  kategori: z.string()
    .min(3, "Nama kategori minimal 3 karakter")
    .max(50, "Nama kategori maksimal 50 karakter")
    .regex(/^[a-zA-Z0-9\s]+$/, "Hanya boleh mengandung huruf, angka, dan spasi"),
  hotel_id: z.number({
    required_error: "Hotel harus dipilih",
    invalid_type_error: "Hotel harus dipilih"
  }).min(1, "Hotel harus dipilih")
});

export type KategoriFormValues = z.infer<typeof kategoriSchema>;

export const validateKategori = (data: unknown) => {
  return kategoriSchema.safeParse(data);
};


const fileSchema = z.instanceof(File).optional();
const featureSchema = z.object({
  id: z.number().optional(),
  nama_fasilitas: z.string().min(1, "Nama fasilitas harus diisi"),
});
export const kamarSchema = z.object({
  id: z.number().optional(),
  nama_kamar: z.string().min(1, "Nama kamar harus diisi"),
  desk: z.string().min(10, "Deskripsi minimal 10 karakter"),
  hotel_id: z.number().min(1, "Hotel harus dipilih"),
  kategori_id: z.number().min(1, "Kategori harus dipilih"),
  price: z.number().min(10000, "Harga minimal Rp 10.000"),
  is_kyc: z.boolean(),
  status: z.enum([StatusKamar.TERSEDIA, StatusKamar.DIPESAN, StatusKamar.DIBERSIHKAN, StatusKamar.DIPERBAIKI]),
  images: z.array(z.union([z.string(), fileSchema]))
    .min(1, "Minimal 1 gambar harus diupload")
    .max(5, "Maksimal 5 gambar"),
  features: z.array(featureSchema).min(1, "Minimal 1 fasilitas harus ditambahkan"),
}).refine(data => {
  return data.images && data.images.length > 0;
}, {
  message: "Minimal 1 gambar harus diupload",
  path: ["images"]
});

export type KamarFormValues = z.infer<typeof kamarSchema>;

export const profileSchema = z.object({
  nama_user: z.string().min(3, "Nama minimal 3 karakter"),
  email: z.string().email("Email tidak valid"),
  no_whatsapp: z.string().regex(/^\d+$/, "Hanya angka diperbolehkan").min(10)
});

export type ProfileFormValues = z.infer<typeof profileSchema>;