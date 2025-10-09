import { Route, Routes } from 'react-router-dom';
import './App.css'
import Home from './Pages/Home';
import SignUp from './Pages/Auth/Signup';
import Login from './Pages/Auth/Login';
import NotFound from './Pages/NotFound';
import Denied from './Pages/Denied';
import AddProduct from './Pages/Admin/Addproduct';
import ProductDetails from './Pages/Products/ProductDetails';
import CartDetails from './Pages/Cart/CartDetails';
import Order from './Pages/Order/Order';
import OrderSuccess from './Pages/Order/OrderSuccess';
import RequireAuth from './Components/Auth/RequiredAuth';
import RequireAuthRole from './Components/Auth/RequireAuthAdmin';

function App() {

  return (
      <div>
        <Routes>
          <Route path="/" element={ <Home/> } />

          <Route path="/denied" element={ <Denied/> } />
          {/** Auth routes */}
          <Route path="/auth/signup" element={<SignUp/>} />
          <Route path="/auth/login" element={<Login/>} />

          {/**Protected Routes which require auth before accessing them*/}
          <Route element={<RequireAuth/>}>
              <Route path='/order' element={ <Order/> }/>
              <Route path='/order/success' element={ <OrderSuccess/> }/>
              <Route path='/cart' element={<CartDetails/>}/>
          </Route>

          {/**Protected Routes which require auth and admin role before accessing them*/}
          {/** Admin can add product to the menu */}
          <Route element={<RequireAuthRole requiredRole="ADMIN"/>}>
              <Route path="/admin/addProduct" element={<AddProduct/>} />
          </Route>

          {/** Product details page */}
          <Route path="/product/:productId" element={<ProductDetails/>} />

          {/**When all above pagenot work then this Not found page directed */}
          <Route path="*" element={<NotFound/>} />
        </Routes>
      </div>
  );
}

export default App;
