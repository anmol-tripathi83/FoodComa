import { useState } from "react";
import toast from "react-hot-toast";
import SignupPresentation from "./SignupPresentation";
import { useDispatch } from "react-redux";
import { createAccount } from "../../Redux/Slices/AuthSlice";
import { useNavigate } from "react-router-dom";

// Container components for the Signup page   [container + Presentational way of writing code => good practice]
function Signup() {
    // need to make Api call, and as we know Api calls are asynchronous way of communication
    // and for that we dont have to block the UI therefore although it can be done directly using fetch or Axios 
    // but Redux toolkit provided a best to do it and the best part is that we can manage the state(for that we have dispatch the action in redux) on the basis of response coming from Api 
    // => redux Thunks(a piece of code that does some delayed work) => help to build the asynchronous action and when it finished then we update the state
    const dispatch = useDispatch();

    const navigate = useNavigate();   // used to go back to login page if user is registered we want he or she login with those registered details

    const [signUpState, setSignUpState] = useState({
        firstName: '',
        email: '',
        mobileNumber: '',
        password: '',
    });

    function handleUserInput(e){
        const {name, value} = e.target;
        setSignUpState({
            ...signUpState,
            [name]: value

        });
    }

    async function handleFormSubmit(e){
        e.preventDefault();  // prevent the form  from reloading the page
        console.log(signUpState);

        // Add validation for the form input
        if(!signUpState.email || !signUpState.mobileNumber || !signUpState.password || !signUpState.firstName){
            toast.error("Missing values from the form");
            return;
        }

        // FirstName validation
        if(signUpState.firstName.length < 5 || signUpState.firstName.length > 20){
            toast.error("First name should be atleast 5 character and maximum 20 character long")
        }

        // Email Validation
        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        if(!emailRegex.test(signUpState.email)){
            toast.error("Invalid email");
        }

        // MobileNumber validation: lenght should be between 10 to 12 digit long
        if(signUpState.mobileNumber.length > 12 || signUpState.mobileNumber.length < 10){
            toast.error("Mobile number should be between 10-12 characters");
        }

        const apiResponse = await dispatch(createAccount(signUpState));
        console.log("API response is ",apiResponse);

        // when user succesfully signuped then navigate to login page
        if(apiResponse.payload?.data?.success){
            navigate('/auth/login');
        }

    }

    return (
        <SignupPresentation 
            handleUserInput={handleUserInput} 
            handleFormSubmit={handleFormSubmit}
        />
    );
}



export default Signup;