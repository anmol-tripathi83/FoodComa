import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../Helpers/axiosInstance";
import toast from "react-hot-toast";

// steps to make a slice in Redux

// first give the initial state of the state
const initialState = {
    isLoggedIn: localStorage.getItem('isLoggedIn') == 'true' || false,   // IF localStorage contain the isLoggedIn status property then it is okay otherwise False
    role: localStorage.getItem('role') || '',   // IF localStorage contain role property then it is okay otherwise NULL
    data: (() => {
        try {
            const data = localStorage.getItem('data');
            return data && data !== 'undefined' ? JSON.parse(data) : {};
        } catch (error) {
            console.warn('Error parsing localStorage data:', error);
            return {};
        }
    })(),   // As data is stored in key-value pair in localStorage in the form of string and we want to get in the form of object therefore we are using JSON.parse function
};

// Now we call this thunk for signup which will give an asynchronous action(delayed action)
export const createAccount = createAsyncThunk('/auth/createAccount', async (data, { rejectWithValue }) =>{
    console.log("Incoming data to the thunk", data);
    try{
        const response = await axiosInstance.post('/users', data);
        //one of the option=> like this if(response.data.success){ toast.success(response.data.message); } else { toast.error(response.data.message); }  other best option shown below
        toast.promise(Promise.resolve(response), {          // promise based toast(see we have removed await form above response because it handles it) 
            success: (resolvedPromise) => {
                return resolvedPromise?.data?.message;
            },
            loading: 'Hold back tight, we are registering your id... ',
            error: 'Ohh No!, Something went worng. Please try again.',
        });
        return response;
    } catch(error){
        console.log("Error in thunk", error);
        toast.error(error.response?.data?.message || 'Signup failed. Please try again.');
        return rejectWithValue(error.response?.data || { message: 'Signup failed' });
    }
});

// Now we call this thunk for login which will give an asynchronous action(delayed action)
export const login = createAsyncThunk('/auth/login', async (data, { rejectWithValue }) =>{
    console.log("Incoming data to the thunk", data);
    try{
        const response = await axiosInstance.post('/auth/login', data);
        toast.promise(Promise.resolve(response), {          // promise based toast(see we have removed await form above response because it handles it) 
            success: (resolvedPromise) => {
                return resolvedPromise?.data?.message;
            },
            loading: 'Hold back tight, we are trying to login you... ',
            error: 'Ohh No!, Something went worng. Please try again.',
        });
        return response;
    } catch(error){
        console.log("Error in thunk", error);
        toast.error(error.response?.data?.message || 'Login failed. Please try again.');
        return rejectWithValue(error.response?.data || { message: 'Login failed' });
    }
});

// we call this thunk when we logging out
export const logout = createAsyncThunk('/auth/logout', async () =>{
    console.log("Incoming data to the thunk");
    try{
        const response = axiosInstance.post('/auth/logout');
        toast.promise(response, {          // promise based toast(see we have removed await form above response because it handles it) 
            success: (resolvedPromise) => {
                return resolvedPromise?.data?.message;
            },
            loading: 'Logging out...',
            error: 'Ohh No!, Something went worng. Please try again.',
        });
        const apiResponse = await response;
        return apiResponse;
    } catch(error){
        console.log("Error in thunk", error);
    }
});

// Now start creating the Slice(initialState and reducers are in one place called Slice)
const AuthSlice = createSlice({
    name: 'auth',   //  jo iska name doge wo state ka name ban jayega
    initialState,
    reducers: {},   // As of now we are not adding reducer yet because we have to fetch the data then we have to update the state
    extraReducers: (builder) =>{       // we write here those reducer which are coming from async thunk (builder object=> reducx will automatically pass this object)  => we have to execute these reducer when we want to update the state on the basis of thunks(these reducers are not made by default instead mede on the basis of thunk)
        builder
        .addCase(createAccount.fulfilled, (state, action) => {
            // Handle successful signup - user is automatically logged in
            if(action.payload?.data?.success) {
                state.isLoggedIn = true;
                state.role = action?.payload?.data?.data?.userRole || 'USER';
                state.data = action?.payload?.data?.data?.userData || {};

                localStorage.setItem('isLoggedIn', true);
                localStorage.setItem('role', action?.payload?.data?.data?.userRole || 'USER');
                localStorage.setItem('data', JSON.stringify(action?.payload?.data?.data?.userData || {}));
            }
        })
        .addCase(createAccount.rejected, (state, action) => {
            // Handle signup failure
            state.isLoggedIn = false;
            state.role = '';
            state.data = {};
        })
        .addCase(login.fulfilled, (state, action)=>{   // if login thunk successfull then kon sa reducer dalna chahte h second argument tells us
            // reducer which will execute when the login thunk is fullfilled
            if(action.payload?.data?.success) {
                state.isLoggedIn = true;
                state.role = action?.payload?.data?.data?.userRole;    // ? these are check if not have then set undefined
                state.data = action?.payload?.data?.data?.userData;

                localStorage.setItem('isLoggedIn', true);              // to persist the these condn in local storage so that after machine closed(or tab closed) user remains logged in
                localStorage.setItem('role', action?.payload?.data?.data?.userRole);
                localStorage.setItem('data', JSON.stringify(action?.payload?.data?.data?.userData));
            }
        })
        .addCase(login.rejected, (state, action) => {
            // Handle login failure
            state.isLoggedIn = false;
            state.role = '';
            state.data = {};
        })
        .addCase(logout.fulfilled, (state) =>{     // no need of action here
            // reducer which will execute when the logout thunk is fullfilled
            // localStorage.clear(); OR
            localStorage.setItem('isLoggedIn', false);           
            localStorage.setItem('role', '');
            localStorage.setItem('data', JSON.stringify({}));
            // also update the state value
            state.isLoggedIn = false;
            state.role = '';
            state.data = {};
        });
    }
});

export default AuthSlice.reducer;