const Cart = require("../schema/cartSchema");
const BadRequestError = require("../utils/badRequest");
const InternalServerError = require("../utils/internalServerError");

// function to interact with cart DB and create cart
async function createCart(userId){
    try{
        const newCart = await Cart.create({
            user: userId,
        });
        return newCart;
    } catch(error){ 
        if(error.name == 'ValidationError'){    // sent by mongoose(when req info is not sent to the schema..)
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

async function getCartBYUserId(userId){
    try{
        const cart = await Cart.findOne({
            user: userId
        }).populate("items.product");      // now by this product details will be populate(fetched and attached instead pf only productID into the cart schema) in the cart => populate property inside in array of schema mongoose
        return cart;
    } catch(error){
        console.log(error);
        throw new InternalServerError();
    }
}

module.exports = {
    createCart,
    getCartBYUserId
}