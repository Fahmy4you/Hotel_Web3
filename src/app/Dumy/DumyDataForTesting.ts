export interface RoomOption {
  value: string;
  title: string;
  description: string;
}

export const roomOptions: RoomOption[] = [
  {
    value: "standard",
    title: "Hotel Shadewa Group",
    description: "Kamar standar dengan fasilitas dasar"
  },
  {
    value: "deluxe",
    title: "Hotel FK",
    description: "Lebih luas dan fasilitas tambahan"
  }
];
