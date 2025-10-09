const mongoose = require('mongoose');

// Cart schema
const cartSchema = new mongoose.Schema({
    user: {   // association to other schema(it require only the objectid of user schema(ref will govern this))
        type: mongoose.Schema.Types.ObjectId, 
        required: true,
        ref: 'User',
        unique: true    
    },
    items: [    // hum on the spot cart totalprice nikalenge with the use of productid and its quantity
        {          // items ek array hoga
            product: {  // product ek object hoga
                type: mongoose.Schema.Types.ObjectId,
                required: true,
                 ref: 'Product'
            },
            quantity: {  // quantity ek number hoga
                type: Number,
                required: true,
                default: 1
            }
        }
    ],
},{timestamps:true});

const cart = mongoose.model('cart',cartSchema);

module.exports = cart;