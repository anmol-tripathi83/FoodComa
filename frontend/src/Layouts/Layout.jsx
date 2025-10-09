import { useDispatch, useSelector } from "react-redux";
import Pizzalogo from "../assets/Images/pizza-app_logo.png";
import CartIcon from "../assets/Images/cart.svg";
import Footer from "../Components/Footer";
import { Link, useNavigate } from "react-router-dom";
import { logout } from "../Redux/Slices/AuthSlice";
import { useEffect } from "react";
import { getCartDetails } from "../Redux/Slices/CartSlice";

// eslint-disable-next-line react/props-types
function Layout({children}){    // children props
    // Reading the Logged in condn of user using state which we have maintained 
    // => if user is loggined the  we will show logout buttun in tha navbatr (accessing state value using useSelector hook)
    const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);

    const { cartsData } = useSelector((state) => state.cart);   // now want to implement a btn for cart in the navbar so that user can access his/her cart

    const dispatch = useDispatch();
    const navigate = useNavigate();

    async function handleLogout(e){
        e.preventDefault();
        // dispatch the logout action
        dispatch(logout());
    }

    async function fetchCartDetails(){
        const res = await dispatch(getCartDetails());
        if(res?.payload?.isUnauthorized){  // if user is not logged in then dispatch the logout action
            dispatch(logout());
        }
    }

    useEffect(() => {
        if(isLoggedIn)  // if user is not logged in then no need to fetch the cart details
            fetchCartDetails();  // fetch cart details and update state while first rendering the layout component
    },[]);

    return (
        <div>
            {/** Navbar */}
            <nav className="flex items-center justify-around h-16 text-[#687280] font-mono border-none shadow-md">
                <div className="flex items-center justify-center"
                    onClick={() => navigate('/')}
                >
                    <p>Pizza App</p>
                    <img src={Pizzalogo} alt="Pizza logo" width={70} height={70} />
                </div>
                <div className="hidden md:block">
                    <ul className="flex gap-4">
                        <li className="hover:text-[#FF9110]">
                            { ' ' }
                            <p>Menu {' '}</p>
                        </li>
                        <li className="hover:text-[#FF9110]">
                            { ' ' }
                            <p>Services {' '}</p>
                        </li>
                        <li className="hover:text-[#FF9110]">
                            { ' ' }
                            <p>About {' '}</p>
                        </li>
                    </ul>
                </div>
                <div>
                    {/** Implemented Login and logout btn */}
                    <ul className="flex gap-4">
                        <li className="hover:text-[#FF9110]">
                            {isLoggedIn ? (   
                                <Link onClick={handleLogout}>Logout</Link>
                            ) : (
                                <Link to={'/auth/login'} >Login</Link>
                            )}
                        </li>

                        {/** Implementing cart Icon */}
                        {isLoggedIn && (
                            <Link to={'/cart'}>   {/** when we clicked goes to another page which will show the cart details */}
                                <li>
                                    <img src={CartIcon} className='w-8 h-8 inline' />
                                    {' '}
                                    <p className='text-black inline'>{cartsData?.items?.length}</p>
                                </li>
                            </Link>
                        )}
                    </ul>
                </div>
            </nav>

            {children}

            {/** Footer */}
            <Footer/>
        </div>
    );
}

export default Layout;