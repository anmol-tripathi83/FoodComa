const Order = require("../schema/orderSchema");
const BadRequestError = require("../utils/badRequest");
const InternalServerError = require("../utils/internalServerError");

async function createNewOrder(orderDetails){
    try{
        const order = await Order.create(orderDetails);
        return order;
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

// function to fetch all orders by user using their userId
async function getOrdersByUserId(userId){
    try{
        const orders = await Order.find({user: userId}).populate('items.product');
        return orders;
    } catch(error){
        console.log(error);
        throw new InternalServerError();
    }
}

// function to fetch specific order using their orderId
async function getOrderById(orderId){
    try{
        const order = await Order.findById(orderId).populate('items.product');
        return order;
    } catch(error){
        console.log(error);
        throw new InternalServerError();
    }
}
   
async function updateOrderStatus(orderId, status){
    try{
        const order = await Order.findByIdAndUpdate(orderId, {status: status}, {new: true});  // new: true because of now after updation the updated order will return instead of unupdated 
        return order;
    } catch(error){
        console.log(error);
        throw InternalServerError();
    }

}

module.exports = {
    createNewOrder,
    getOrdersByUserId,
    getOrderById,
    updateOrderStatus
}