// Resource - Product

const { isAdmin, isLoggedIn } = require('../validation/authValidator');

const uploader = require('../middleware/multerMiddleware');

const express = require('express');
const { addProduct, getProduct, deleteProduct, getProducts } = require('../controllers/productController');


// We have to initialise a router object to add routes in a new file
// Routers are used for segregating your routes in different modules
const ProductRouter = express.Router();

// localhost:5002/user/product -> POST   => middleware first check whether is user logined(authentication) then check whether the user is ADMIN then it will go to the product controller
ProductRouter.post('/', isLoggedIn, isAdmin, uploader.single('productImage') ,addProduct);      // uploader.single(key) process the key to which the image is sended from the frontened 

// Get /products/:id
ProductRouter.get('/:id', getProduct);

// Get /products/
ProductRouter.get('/', getProducts);

// delete /products/:id
ProductRouter.delete('/:id', isLoggedIn, isAdmin, deleteProduct);

module.exports = ProductRouter;         // exporting the router