const express = require('express');
const { isLoggedIn, isAdmin } = require('../validation/authValidator');
const { createNewOrder, getAllOrdersByUser, getOrder, cancelOrder, changeOrderStatus } = require('../controllers/orderController');

const orderRouter = express.Router();

// place the order
orderRouter.post('/',isLoggedIn , createNewOrder);
// fetch the all orders
orderRouter.get('/',isLoggedIn , getAllOrdersByUser);
// fetch the details of particular order
orderRouter.get('/:orderId',isLoggedIn , getOrder);
// cancel the order
orderRouter.put('/:orderId/cancel',isLoggedIn , cancelOrder);
// change the status of order by admin
orderRouter.put('/:orderId/status',isLoggedIn, isAdmin, changeOrderStatus);

module.exports = orderRouter;