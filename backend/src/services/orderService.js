const { getCartBYUserId } = require("../repositories/cartRepo");
const { createNewOrder, getOrdersByUserId, getOrderById, updateOrderStatus } = require("../repositories/orderRepo");
const { findUser } = require("../repositories/userRepository");
const BadRequestError = require("../utils/badRequest");
const InternalServerError = require("../utils/internalServerError");
const NotFoundError = require("../utils/notFoundError");
const { clearCart } = require("./cartService");

async function createOrder(userId, paymentMethod){
    // we fetch the user cart by using their userID
    const cart = await getCartBYUserId(userId);
    const user = await findUser({_id: cart.user});
    // console.log(cart);
    console.log(user);
    if(!cart){
        throw new NotFoundError('Cart');
    }
    
    // if no items in the cart then no order can be placed
    if(cart.items.length == 0){
        throw new BadRequestError(["Cart is empty, please add some items in the cart"]);
    }

    // start building new orderObject
    const orderObject = {};
    orderObject.user = cart.user;
    // doing it in such a way because in this way product(which is populated) property not assign to the orderObject 
    orderObject.items = cart.items.map(cartItem =>{
        return {product: cartItem.product._id, quantity: cartItem.quantity}
    });
    orderObject.status = "ORDERED";
    // now calculate the total price of the order by just iteration over the items price
    orderObject.totalPrice = 0;

    cart.items.forEach((cartItem) =>{
        orderObject.totalPrice += cartItem.quantity * cartItem.product.price;
    });
    // now fetch the address of user from fetching the user
    orderObject.address = user.address;
    orderObject.paymentMethod = paymentMethod;

    // now create a new order by using the orderObject
    const order = await createNewOrder(orderObject);
    if(!order){
        throw new InternalServerError();
    }
    // now we need to clear the cart after order is placed
    await clearCart(userId);
    return order;
}

async function getAllOrdersCreatedByUser(userId){
    const orders = await getOrdersByUserId(userId);
    if(!orders){
        throw new NotFoundError("Orders");
    }
    return orders;
}

async function getOrderDetailsById(orderId){
    const order = await getOrderById(orderId);
    if(!order){
        throw new NotFoundError("Order");
    }   
    return order;
}

async function updateOrder(orderId, status){
    const order = await updateOrderStatus(orderId,status);
    if(!order){
        throw new NotFoundError("Order");
    }
    return order;
}

module.exports = {
    createOrder,
    getAllOrdersCreatedByUser,
    getOrderDetailsById,
    updateOrder
}