import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    status : false,
    userData: null,

}


const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {  
        login: (state,  action) => {
            state.status = true;
            state.userData = action.payload.userData; 
        }
    }
})



// reducer k individual functions bhi export krne hote hai kyuki usse alag alag 
// components un functions ko use krke state wgera jaan leta h ya dispatch kr deta hai un methods se
export default authSlice.reducer;