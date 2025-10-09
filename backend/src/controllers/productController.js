const { createProduct, getProductById, deleteProductById, getAllProductsData } = require("../services/productService");
const AppError = require("../utils/appError");

async function addProduct(req, res){
    try {
        const product = await createProduct({
            productName : req.body.productName,
            description : req.body.description,  
            imagePath: req.file?.path,            
            price : req.body.price,
            category : req.body.category,    // if category is undefined veg will be stored(default)
            inStock : req.body.inStock       // if instock is undefined then true will be stored
        });
        return res.status(201).json({
            success: true,
            message : "Product Added Successfully",
            data: product,
            error: {}
        })
    } catch(error){
        if(error instanceof AppError){    // error from handled error
            return res.status(error.statusCode).json({
                success: false,
                message: error.message,
                data: {},
                error: error
            });
        }
        // if error is occurred but not handled by us through error handleling then simply print the error and 500 statuscode with message as "something ... "
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Something went wrong",
            data: {},
            error: error
        });
    }
}

async function getProduct(req,res){
    try{
        const response = await getProductById(req.params.id);
        return res.status(200).json({
            success: true,
            message: "Successfully fetched the Product",
            error: {},
            data: response
        });
    } catch(error){
        if(error instanceof AppError){    // error from handled error
            return res.status(error.statusCode).json({
                success: false,
                message: error.message,
                data: {},
                error: error
            });
        }
        // if error is occurred but not handled by us through error handleling then simply print the error and 500 statuscode with message as "something ... "
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Something went wrong",
            data: {},
            error: error
        });
    }
}

async function getProducts(req,res){
    try{
        const response = await getAllProductsData();
        return res.status(200).json({
            success: true,
            message: "Successfully fetched All the Products",
            error: {},
            data: response
        });
    } catch(error){
        if(error instanceof AppError){    // error from handled error
            return res.status(error.statusCode).json({
                success: false,
                message: error.message,
                data: {},
                error: error
            });
        }
        // if error is occurred but not handled by us through error handleling then simply print the error and 500 statuscode with message as "something ... "
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Something went wrong",
            data: {},
            error: error
        });
    }
}

async function deleteProduct(req,res){
    try{
        const response = await deleteProductById(req.params.id);
        return res.status(200).json({
            success: true,
            message: "Successfully deleted the Product",
            error: {},
            data: response
        });
    } catch(error){
        if(error instanceof AppError){    // error from handled error
            return res.status(error.statusCode).json({
                success: false,
                message: error.message,
                data: {},
                error: error
            });
        }
        // if error is occurred but not handled by us through error handleling then simply print the error and 500 statuscode with message as "something ... "
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Something went wrong",
            data: {},
            error: error
        });
    }
}

module.exports = { 
    addProduct,      // now it is returning function
    getProduct,
    getProducts,
    deleteProduct
};             