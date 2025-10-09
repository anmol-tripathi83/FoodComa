import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import axiosInstance from "../../Helpers/axiosInstance";
import toast from "react-hot-toast";

// we need three thunks first which add product to the cart, second which will remove the product from cart, third which will fethc the cart's details
const initialState = {
    cartsData: ''
}

// 1.Adding product to the cart thunk
export const addProductToCart = createAsyncThunk('cart/addProduct', async (productId) =>{
    try{
        const response = axiosInstance.post(`/carts/add/${productId}`);
        toast.promise(response, {
            loading: 'Adding Product to cart...',
            error: "Something went wrong, Can't add product to cart", 
            success: 'Product added successfully'
        });
        const apiResponse = await response;
        return apiResponse;
    } catch(error){
        console.log(error);
        toast.error('Something went wrong');
    }
});

// 2.Removing product from the cart thunk
export const removeProductFromCart = createAsyncThunk('cart/removeProduct', async (productId) =>{
    try{
        const response = axiosInstance.post(`/carts/remove/${productId}`);
        toast.promise(response, {
            loading: 'Removing Product from cart...',
            error: "Something went wrong, Can't remove product from cart", 
            success: 'Product removed successfully'
        });
        const apiResponse = await response;
        return apiResponse;
    } catch(error){
        console.log(error);
        toast.error('Something went wrong');
    }
});

// 3. Get Cart details thunk
export const getCartDetails = createAsyncThunk('cart/getDetails', async () =>{
    try{
        const response = axiosInstance.get(`/carts`);
        toast.promise(response, {
            loading: 'Fetching cart details...',
            error: "Something went wrong, Can't fetch cart details", 
            success: 'Cart fetched successfully'
        });
        const apiResponse = await response;
        return apiResponse;
    } catch(error){
        console.log(error);
        if(error?.response?.status === 401){
            toast.error('Please login to view cart details');
            return {
                isUnauthorized: true
            }
        }
        toast.error('Something went wrong');
    }
});

const cartSlice = createSlice({
    name: 'cart',
    initialState,
    reducers: {},
    extraReducers: (builder) =>{
        builder.addCase(getCartDetails.fulfilled, (state, action) =>{
            state.cartsData = action?.payload?.data?.data;
        });
    }
});

export default cartSlice.reducer;