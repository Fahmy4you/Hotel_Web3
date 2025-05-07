"use server"
import { prisma } from "@/utils/prisma";

export async function addHotel(formData: FormData, userId : number) {
  const hotelName = formData.get("nama_hotel") as string;
  const hotelAddress = formData.get("lokasi") as string;
  const hotelDescription = formData.get("desk") as string;


  try {
      const newHotel = await prisma.hotel.create({
        data: {
          nama_hotel: hotelName,
          lokasi: hotelAddress,
          user_id: userId,
          is_banned : false,
          desk: hotelDescription,
        },
      });
      
    return {
      success: true,
      message: "Hotel created successfully",
      data: newHotel,
    };
  } catch (error) {
    console.error(error);
    throw new Error("Failed to add hotel");
  }
}
