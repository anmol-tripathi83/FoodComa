const mongoose = require('mongoose');

// This Schema is based on our app perspective
const productSchema = new mongoose.Schema({
    productName:{
        type: String,
        required: [ true, "Product name is required"],
        minLength: [5, "Product name must be atleast 5 character long"],
        trim: true
    },
    description :{
        type: String,
        minLength: [5, "Product description must be atleast 5 character long"]
    },
    productImage: {
        type: String,
    }, 
    quantity: {
        type: Number,
        required: true,
        default: 10     // default we hava atleast 10 product each
    },
    price:{
        type: Number,
        required: [true, "Price is required"],
    },
    category:{
        type: String,
        enum: ['veg', 'non-veg', 'drinks', 'sides'],    // property which tells that category can be either of four choices in the array
        default: 'veg'    // if category is not provided then 'veg' is default category
    },
    inStock: {
        type: Boolean,
        required: [true, "In stock status is required"],
        default: true
    } 
} , { timestamps: true });

const Product = mongoose.model("Product", productSchema);

module.exports = Product;