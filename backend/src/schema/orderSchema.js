const mongoose = require("mongoose");

// Order Schema
const orderSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    items: [    // hum on the spot cart totalprice nikalenge with the use of productid and its quantity
            {          // items ek array hoga
                product: {  // product ek object hoga
                    type: mongoose.Schema.Types.ObjectId,
                    required: true,
                    ref: 'Product'
                },
                quantity: {  
                    type: Number,
                    required: true,
                    default: 1
                }
            }
        ],
    totalPrice: {
        type: Number,
        required: true,
    },
    status: {
        type: String,
        default: "ORDERED",
        enum: ["ORDERED","CANCELED","DELIVERED","PROCESSING","OUT_FOR_DELIVERY"]
    },
    address: {
        type: String,
        minLength: [10,"Address should be of atleast 10 characters"]
    },
    paymentMethod: {
        type: String,
        enum: ["ONLINE","CASH"],
        default: "CASH"
    }
},{
    timestamps: true
});

const Order = mongoose.model("Order",orderSchema);

module.exports = Order;
