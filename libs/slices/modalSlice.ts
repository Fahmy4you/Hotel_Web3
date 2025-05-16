import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface ModalState {
   [key : string] : boolean
}

const initialState: ModalState = {
   filter : false,
   add : false,
   edit : false,
   detail : false,
   delete : false,
   allKamar : false,
   notification : false,
   pengaturan : false,
   addProfilePicture : false
}


const modalSlice = createSlice({
    name : 'modals',
    initialState,
    reducers : {
        openModals : (state, action : PayloadAction<string>) => {
            state[action.payload] = true;
        },
        closeModals : (state, action : PayloadAction<string>) => {
            state[action.payload] = false;
        },
        toggleModal : (state, action : PayloadAction<string>) => {
            state[action.payload] = !state[action.payload];
        }
    }
})

export const { openModals, closeModals, toggleModal } = modalSlice.actions;
export default modalSlice.reducer;