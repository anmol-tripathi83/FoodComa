import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";

// function to check if the user is Admin in or not to avoid the user to access the protected routes odf Admin
// if the user is Admin then allow to access the protected routes => with the use of Outlet component provided by react-router-dom
// outlet component is used to render the child routes of the protected route
function RequireAuthRole(requiredRole) {
    const { isLoggedIn,  role} = useSelector((state) => state.auth);

    return isLoggedIn && role == requiredRole ? <Outlet /> : <Navigate to="/denied" />; 
}

export default RequireAuthRole;