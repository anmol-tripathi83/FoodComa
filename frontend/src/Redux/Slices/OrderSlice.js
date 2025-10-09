import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import axiosInstance from "../../Helpers/axiosInstance";
import toast from "react-hot-toast";

const initialState = {
    orders: null
}


export const placeOrder = createAsyncThunk('order/placeOrder', async () =>{
    try{
        const response = axiosInstance.post('/orders');
        toast.promise(response, {
            loading: 'Creating Order...',
            error: "Something went wrong, Can't place order", 
            success: 'Order placed successfully'
        });
        const apiResponse = await response;
        return apiResponse;
    } catch(error){
        console.log(error);
        toast.error('Something went wrong');
    }
});

const OrderSlice = createSlice({
    name: 'order',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder.addCase(placeOrder.fulfilled, (state, action) => {
            state.orders = action?.payload?.data;
        });
    }
});

export default OrderSlice.reducer;
