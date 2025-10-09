const mongoose = require("mongoose");
const cloudinary  = require('../config/cloudinaryConfig');
const Product = require('../schema/productSchema');
const BadRequestError = require('../utils/badRequest');
const InternalServerError = require('../utils/internalServerError');
const NotFoundError = require('../utils/notFoundError');

// interacting with the database(creating a new product with following product details which is in productDetails object)
async function createProduct(ProductDetails){
    try{
        const response = await Product.create(ProductDetails);
        return response; 
    } catch(error){ 
        if(error.name == 'ValidationError'){    // sent by mongoose(when req schema info is not given by the user or incorrect email format etc..)
            const errorMessageList = Object.keys(error.errors).map((property) => {
                return error.errors[property].message;
            });
            throw new BadRequestError(errorMessageList);
        }
        console.log(error);
        // otherwise internalServer error
        throw new InternalServerError();   // DB se related issue
    }
}

// Function to interact with DB and fetching product by their id
async function getProductById(productId){
    try{
        const product = await Product.findById(productId);
        return product;
    } catch(error){
        console.log(error);
        throw new InternalServerError();  // DB se related issue
    }
}

// function to get all products
async function getAllProducts(){
    try{
        const products = await Product.find({});
        return products;
    } catch(error){
        console.log(error);
        throw new InternalServerError();  // DB se related issue
    }
}

//fetching public id(for deleting) from image URL(cloudinary URL)
const getPublicIdFromUrl = (url) => {
    const regex = /\/upload\/(?:v\d+\/)?(.+)\./;
    const match = url.match(regex);
    return match ? match[1] : null;
};

// Function to interact with DB and deleting product by their id
async function deleteProductById(productId){
    const session = await mongoose.startSession();   // start mongodb transaction
    session.startTransaction();
    try{
        // 1. Fetch the product from the database
        const product = await Product.findById(productId);
        if(!product){
            await session.abortTransaction(); // Abort transaction
            session.endSession();
            throw new NotFoundError("Product");
        }
        // 2. Attempt to Delete the product from MongoDB
        const response = await Product.findByIdAndDelete(productId).session(session);

        // 3. if successful, then Delete the image from Cloudinary
        if(product.productImage){
            const publicId = getPublicIdFromUrl(product.productImage);  // getting public id from cloudinary
            if(publicId){
                const cloudinaryResponse = await cloudinary.uploader.destroy(publicId);
            }
        }
        // 4. Commit transaction
        await session.commitTransaction();
        return response;
    } catch(error){
        await session.abortTransaction();
        console.log(error);
        throw new InternalServerError();   // DB se related 
    } finally {
        session.endSession(); // End session
    }
}

module.exports = {
    createProduct,
    getProductById,
    getAllProducts,
    deleteProductById
};