const { getCart, modifyCart, clearCart } = require("../services/cartService");
const AppError = require("../utils/appError");

async function getCartByUser(req,res){
    try{
        const cart = await getCart(req.user.id);
        return res.status(200).json({
            success: true,
            message: "Successfully fetched the cart",
            error: {},
            data: cart
        })
    } catch(error){
        console.log(error);
        if(error instanceof AppError){
            return res.status(error.statusCode).json({
                success: false,
                message: error.message,
                error: error,
                data: {}
            });
        }
        return res.status(500).json({
            success: false,
            message: "Something went wrong",   
            error: error,
            data: {}
        });
    }
}


async function modifyProductToCart(req,res){
    try{
        const cart = await modifyCart(req.user.id, req.params.productId, req.params.operation == "add");
        const msg = (req.params.operation == "add") ? "Successfully Added to the cart" : "Successfully deleted from the cart";
        return res.status(200).json({
            success: true,
            message: msg,
            error: {},
            data: cart
        })
    } catch(error){
        console.log(error);
        if(error instanceof AppError){
            return res.status(error.statusCode).json({
                success: false,
                message: error.message,
                error: error,
                data: {}
            });
        }
        return res.status(500).json({
            success: false,
            message: "Something went wrong",   
            error: error,
            data: {}
        });
    }
}

async function clearProductCart(req,res){
    try{
        const cart = await clearCart(req.user.id);
        return res.status(200).json({
            success: true,
            message: "SuccessFully cleared the product from the cart",
            data : cart,
            error: {}
        });
    } catch(error){
        console.log(error);
        if(error instanceof AppError){
            return res.status(error.statusCode).json({
                success: false,
                message: error.message,
                error: error,
                data: {}
            });
        }
        return res.status(500).json({
            success: false,
            message: "Something went wrong",   
            error: error,
            data: {}
        });
    }
}

module.exports = {
    getCartByUser,
    modifyProductToCart,
    clearProductCart
}