import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";

// function to check if the user is logged in or not to avoid the user to access the protected routes
// if the user is not logged in then redirect to the login page
// if the user is logged in then allow to access the protected routes => with the use of Outlet component provided by react-router-dom
// outlet component is used to render the child routes of the protected route
function RequireAuth() {
    const { isLoggedIn } = useSelector((state) => state.auth);

    return isLoggedIn ? <Outlet /> : <Navigate to="/auth/login" />; 
}

export default RequireAuth;