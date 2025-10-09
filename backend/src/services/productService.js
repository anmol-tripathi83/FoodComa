const cloudinary = require('../config/cloudinaryConfig');
const fs = require('fs/promises');
const ProductRepository = require('../repositories/productRepo');
const InternalServerError = require('../utils/internalServerError');
const NotFoundError = require('../utils/notFoundError');

// It will create brand new product it the database
async function createProduct(productDetails){
    // 1. We should check if an image is coming to craete the product, then we should first upload it to the cloudinary
    const imagePath = productDetails.imagePath;
    if(imagePath){
        try{
            const cloudinaryResponse = await cloudinary.uploader.upload(imagePath);
            var productImage = cloudinaryResponse.secure_url;
            console.log(process.cwd()+"/"+imagePath);   // process.cmd() gives the current working directory(root directory) then reaching to the opload folder to unlink the images(delete) 
            await fs.unlink(process.cwd()+"/"+imagePath);    // process.cmd() gives the current working directory(root directory) then reaching to the opload folder to unlink the images(delete) 
        } catch(error){
            console.log(error);
            throw new InternalServerError();
        }
    }
    // 2. Then use the url from cloudinary and other product details to add product in the DB
    const product = await ProductRepository.createProduct({
        ...productDetails,
        productImage : productImage
    });

    return product;
}

async function getProductById(productId){
    const response = await ProductRepository.getProductById(productId);

    if(!response){
        throw new NotFoundError('Product');
    }
    return response;
}

async function getAllProductsData(){
    const response = await ProductRepository.getAllProducts();

    if(!response){
        throw new NotFoundError('Product');
    }
    return response;
}

async function deleteProductById(productId){
    const response = await ProductRepository.deleteProductById(productId);

    if(!response){
        throw new NotFoundError('Product');
    }
    return response;
}

module.exports = {
    createProduct,
    getProductById,
    getAllProductsData,
    deleteProductById
};