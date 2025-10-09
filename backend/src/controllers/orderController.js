const { createOrder, getAllOrdersCreatedByUser, getOrderDetailsById, updateOrder } = require("../services/orderService");
const AppError = require("../utils/appError");

async function createNewOrder(req, res){
    try{
        const order = await createOrder(req.user.id, req.body.paymentMethod);
        return res.status(201).json({
            message: "Order created successfully",
            success: true,
            error: {},
            data: order
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

// Function to fetch all the orders created by the user using their userId
async function getAllOrdersByUser(req, res){
    try{
        const orders = await getAllOrdersCreatedByUser(req.user.id);
        return res.status(200).json({
            message: "Successfully fetched the Orders",
            success: true,
            error: {},
            data: orders
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

// function to fetch the order details using orderId 
async function getOrder(req,res){
    try{
        const order = await getOrderDetailsById(req.params.orderId);
        return res.status(200).json({
            message: "Successfully fetched the Order",
            success: true,
            error: {},
            data: order
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

// this method can be called by either by user or admin to cancel the order
async function cancelOrder(req,res){
    try{
        const order = await updateOrder(req.params.orderId, "CANCELLED");
        return res.status(200).json({
            message: "Successfully updated the Order",
            success: true,
            error: {},
            data: order
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

// Generic changeOrderStatus function which is call by the admin to change the order status
async function changeOrderStatus(req,res){
    try{
        const order = await updateOrder(req.params.orderId, req.body.status);
        return res.status(200).json({
            message: "Successfully updated the Order",
            success: true,
            error: {},
            data: order
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

module.exports = {
    createNewOrder,
    getAllOrdersByUser,
    getOrder,
    cancelOrder,
    changeOrderStatus
}