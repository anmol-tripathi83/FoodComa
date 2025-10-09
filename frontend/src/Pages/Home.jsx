// file name is start with capital letter because of react recommend to name the file in such a way for the jsx componenets(Ui in reusable element)
import CircleArrowRight from "../Components/Icons/CircleArrowRight";
import PizzaImage from "../assets/Images/pizza2.png";
import CookingImage from "../assets/Images/cooking1.png";
import CheckBadgeStroke12 from "../Components/Icons/checkBadgeStroke12";
import OrderFood from "../assets/Images/orderFood.png";
import Pickup from "../assets/Images/pickup.png";
import Enjoy from "../assets/Images/enjoy.png";
import Layout from "../Layouts/Layout.jsx";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { getAllProducts } from "../Redux/Slices/ProductSlice.js";
import { Link } from "react-router-dom";

function Home(){
    // step-5: dispatch the getAllproduct thunk now step-6 is on ProductSlice.js => to store the loaded products in a state using extraReducer
    const dispatch = useDispatch();
    useEffect(() =>{
        //this will be called when the component mounts
        dispatch(getAllProducts());

    }, []); // dependency arr empty that means this calls when first time page loads

    // step-7 : accessing products state using useSelector hook
    const { productsData } = useSelector((state) => state.product);

    return (
        <Layout>    {/**Navbar + footer */}
        <div>
            {/** hero section */}
            <section className="flex flex-col-reverse items-center justify-center py-5 md:flex-row md:gap-7 bg-gradient-to-r from-amber-50 to-orange-300">     {/** We start to style considering in mind that ui for phone as well therefore md is used */}
                <div className="w-4/6 ml-4 text-center md:w-2/6 md:text-left">
                    {/* Heading */}
                    <div className="flex justify-center text-4xl md:justify-normal">
                        <h1 className="pb-5 font-bold text-transparent bg-gradient-to-r from-orange-500 to-orange-400 bg-clip-text">
                            Enjoy the Slice {' '}
                        </h1>
                        <h1>
                            😋
                        </h1>
                    </div>

                    <p className="pb-4 text-[#687280]">
                        The Pizz App lets you order your favourite pizza from the comfort of your home.
                        Enjoy the best pizza in town with just a few clicks.
                    </p>

                    <button className="flex items-center px-4 py-2 text-white bg-orange-500 rounded-md hover:bg-orange-600 group">
                        Order Now
                        {/* https://reactsvgicons.com/search?q=arrow  => react comaptible icons */}
                        <span className="inline-block ml-2 transition-transform ease-in-out group-hover:translate-x-2"> 
                            <CircleArrowRight/>
                        </span>
                    </button>
                </div>
                <div>
                    <img 
                        src={PizzaImage} 
                        alt="Pizza" 
                        width={550}
                        height={550}
                    />
                </div>
            </section>

            {/**Service Section */}
            <section className="py-4 mt-6 bg-gradient-to-r from-amber-50 to-orange-300">
                <div className="container flex flex-col md:flex-row">   {/** You can study about container class in Tailwind which fixes the width if you give breakpoint otherwise take 100% width */}
                    <div className="flex flex-col items-center justify-center rounded-lg lg:w-1/2">   {/**lg: we are doing for large screen and md: means we are doing for medium screen */}
                        <img 
                            src={CookingImage}
                            alt="Cooking"
                            width={500}
                            className="rounded-lg"
                        />
                    </div>

                    <div className="flex flex-col flex-wrap text-center lg:py-6 lg:w-3/4 lg:pl-1 lg:text-left">
                        <div className="flex flex-col items-center">
                            <div className="flex flex-col items-center lg:items-start">
                                <div>
                                    <h2 className="mb-2 text-5xl font-extrabold text-transparent title-font bg-gradient-to-r from-orange-600 to-orange-400 bg-clip-text">
                                        Cooked by the best <br/> chefs in the world!
                                    </h2>
                                    <p className="text-base leading-relaxed text-[#687280]">
                                        There are many benefits regarding to that but the main ones are:
                                    </p>
                                </div>
                            </div>
                            {/**Benefits points */}
                            <div className="p-1">
                                <div className="flex items-center h-full p-2 text-2xl rounded">
                                    <CheckBadgeStroke12 className="text-green-500 w-10 h-10 mr-2"/>
                                    <span className="font-bold title-font">Order Pizza, Effortlessly</span>
                                </div>
                            </div>
                            <div className="p-1">
                                <div className="flex items-center h-full p-2 text-2xl rounded">
                                    <CheckBadgeStroke12 className="text-green-500 w-10 h-10 mr-2"/>
                                    <span className="font-bold title-font">Food hygeine guaranteed</span>
                                </div>
                            </div>
                            <div className="p-1">
                                <div className="flex items-center h-full p-2 text-2xl rounded">
                                    <CheckBadgeStroke12 className="text-green-500 w-10 h-10 mr-2"/>
                                    <span className="font-bold title-font">Delicious Pizza, Delivered Fast</span>
                                </div>
                            </div>
                        </div>

                        {/**orderFood, pickupFood, EnjoyFood Icons*/}
                        <div className="px-5 py-4 mx-auto">
                            <div className="flex justify-center py-4">
                                <div className="inline-flex w-16 h-1 bg-yellow-500 rounded-full"></div>
                            </div>

                            <div className="flex flex-wrap space-y-6 md:space-y-0">
                                <div className="flex flex-col items-center text-center p-4 md:w-1/3">
                                    <div className="inline-flex items-center justify-center flex-shrink-0 w-20 h-20 mb-5 bg-yellow-100 rounded-full">
                                        <img src={OrderFood} alt="OrderFood"/>
                                    </div>
                                    <div className="flex-grow">
                                        <h2 className="mb-3 text-lg font-bold text-gray-900 title-font">
                                            order Food
                                        </h2>
                                        <p>
                                            As easy as 1, 2, 3. Just select your favourite pizza and place your order.
                                        </p>
                                    </div>
                                </div>
                                <div className="flex flex-col items-center text-center p-4 md:w-1/3">
                                    <div className="inline-flex items-center justify-center flex-shrink-0 w-20 h-20 mb-5 bg-yellow-100 rounded-full">
                                        <img src={Pickup} alt="PickupFood"/>
                                    </div>
                                    <div className="flex-grow">
                                        <h2 className="mb-3 text-lg font-bold text-gray-900 title-font">
                                            Pickup Food
                                        </h2>
                                        <p>
                                            Pick up your order from the nearest store or get it delivered to your doorstep.
                                        </p>
                                    </div>
                                </div>
                                <div className="flex flex-col items-center text-center p-4 md:w-1/3">
                                    <div className="inline-flex items-center justify-center flex-shrink-0 w-20 h-20 mb-5 bg-yellow-100 rounded-full">
                                        <img src={Enjoy} alt="EnjoyFood"/>
                                    </div>
                                    <div className="flex-grow">
                                        <h2 className="mb-3 text-lg font-bold text-gray-900 title-font">
                                            Enjoy Food
                                        </h2>
                                        <p>
                                            As soon as you get your order, enjoy the delicious pizza with your loved ones.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            {/** Products list => concept of pagination -> eventhough you can implement that only letsay 20 products will show and there is load more btn which will load more 20 product this can be done using mangoose filters properties such as limit() property which can apply in the backened while finding all products and there is skip() property i.e skip(20) means after skipping 20 products all get fetched*/}
            <div className="mx-auto">
                <div className="flex flex-wrap justify-center">
                    {productsData && productsData.length > 0 ? productsData.map((item, key) =>{
                        return (
                            item.inStock && (
                                <div className="p-4 md:w-1/3" key={item._id}>       {/** Key property to avoid re redering in list */}
                                    <Link to={`/product/${item._id}`}>
                                        <div className="overflow-hidden border rounded-lg border-opacity-60">
                                            <img 
                                                src={item.productImage} 
                                                alt="Pizza Image"
                                                className="object-cover object-center w-full lg:h-48 md:h-36"
                                            />
                                            <div className="p-6 border">
                                                <h2 className="text-xs font-medium tracking-widest text-gray-400 title-font">
                                                    {item.category}
                                                </h2>
                                                <h1 className="mb-3 text-lg font-medium text-gray-900 title-font">
                                                    {item.productName}
                                                </h1>
                                                <p className="mb-4 text-base leading-relaxed">
                                                    {item.description}
                                                </p>
                                                <p className="text-lg font-medium text-gray-900 title-font">
                                                    ${item.price}
                                                </p>
                                            </div>
                                        </div>
                                    </Link>
                                </div>
                            )
                        );
                    }) : (
                        <div className="w-full text-center py-8">
                            <p className="text-gray-500">No products available at the moment.</p>
                        </div>
                    )}
                </div>
            </div>
            
        </div>
        </Layout>    
    )
}

export default Home;