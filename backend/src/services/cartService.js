const { getCartBYUserId } = require("../repositories/cartRepo");
const { getProductById } = require("../repositories/productRepo");
const AppError = require("../utils/appError");
const BadRequestError = require("../utils/badRequest");
const InternalServerError = require("../utils/internalServerError");
const NotFoundError = require("../utils/notFoundError");

async function getCart(userId){
    const cart = await getCartBYUserId(userId);
    if(!cart){
        throw new NotFoundError("Cart");
    }
    return cart;
}

// Now this function will do both work either adding or deletion of product from cart according to shouldAdd value
async function modifyCart(userId, productId, shouldAdd = true){   // shouldAdd default value is true which signifies that addition of product will be done in the cart
    const quantityValue = (shouldAdd==true)? 1 : -1;
    const cart = await getCart(userId);
    const product = await getProductById(productId);
    if(!product){     // product not found in the productlist
        throw new NotFoundError("Product");
    }

    if(!product.inStock && product.quantity <= 0){
        throw new BadRequestError("Product is out of stock");
    }

    // Now may be the product is already in the cart(then increase its quantity) otherwise push it into the cart.items
    let foundProduct = false;
    cart.items.forEach(item => {
        if(item.product._id == productId){    // as cart.product is an object and productId is string
            if((shouldAdd && product.quantity >= item.quantity + 1) || (!shouldAdd && item.quantity!=0)){
                item.quantity += quantityValue;
                if(item.quantity == 0){
                    cart.items = cart.items.filter(item => item.product._id != productId);
                    foundProduct = true;
                    return;
                }
            }
            else{
                throw new AppError("The qunatity of the item requested is not available",404);
            }
            foundProduct = true;
        } 
    });
    // if product is not found in the cart
    if(!foundProduct){
        if(shouldAdd){
            cart.items.push({
                product: productId,
                quantity: 1
            });
        } else{
            throw new NotFoundError("Product in the cart");
        }
    }
    // to save the changes in updated cart of the user
    await cart.save();

    return cart;
}

async function clearCart(userId){
    try{
        const cart = await getCart(userId);
        if(!cart){
            throw new NotFoundError("Cart");
        }
        // clear the cart.items array
        cart.items = [];
        // save the changes in the DB
        await cart.save();
        // return the cart
        return cart;
    } catch(error) {
        console.log(error);
        throw new InternalServerError();
    }
}

module.exports = {
    getCart,
    modifyCart,
    clearCart
}