import { HotelData } from "./hotelData";

export interface ManageHotelData {
    userID : number;
    onEditHotel? : (hotel : HotelData) => void;
    onAddHotel? : (hotel : HotelData) => void;
}

export interface ManageHotelHook {
    hotels: HotelData[];
    formData: HotelData;
    isEditMode: boolean;
    currentData: HotelData | null;
    submitHotel: (hotel: HotelData, editMode : boolean, currentData : HotelData | null) => Promise<void>;
    closeModal: () => void;
}