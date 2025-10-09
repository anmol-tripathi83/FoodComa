import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import axiosInstance from "../../Helpers/axiosInstance";
import toast from "react-hot-toast";

// we want to add some product in home page to show products so we download the products from backend when app loaded and maintain the state so that in each arrival in homepage of site, data need not to be downloaded again and again(which can reduce out website speed) 
// Step:1
const initialState = {
    productsData: [], // array of data
}

// step-4: creating thunk   now step-5 is in home page where we have to dispatch this delayed action(thunk)
export const getAllProducts = createAsyncThunk('/products/getAll', async () =>{
    try{
        const products = axiosInstance.get('/products');
        toast.promise(products, {
            loading: 'Loading all the products...',
            error: "Something went wrong, Can't load products", 
            success: 'Product loaded successfully'
        });
        const apiResponse = await products;
        return apiResponse;
    } catch(error){
        console.log(error);
        toast.error('Something went wrong');
    }
});

// Thunks for fetching details for simgle products
export const getProductDetails = createAsyncThunk('/products/getDetails', async (id) =>{
    try{
        const product = axiosInstance.get(`/products/${id}`);
        toast.promise(product, {
            loading: 'Loading the product...',
            error: "Something went wrong, Can't load product", 
            success: 'Product loaded successfully'
        });
        const apiResponse = await product;
        return apiResponse;
    } catch(error){
        console.log(error);
        toast.error('Something went wrong');
    }
});

// Step:2 now step 3 in store.js
const productSlice = createSlice({
    name: 'product',
    initialState,
    reducers: {},
    // step-6: storing fetched products in a state now step-7(in home page) to access this state data in anywhere(homePage) using useSelector hook
    extraReducers: (builder) =>{
       builder.addCase(getAllProducts.fulfilled, (state, action) =>{
            // console.log(action.payload);
            state.productsData = action?.payload?.data?.data;
       }); 
    }
});

export default productSlice.reducer;