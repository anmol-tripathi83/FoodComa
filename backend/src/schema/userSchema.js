const mongoose = require('mongoose');
const bcrypt = require('bcrypt'); 

const userSchema = new mongoose.Schema({
    firstName : {
        type : String,
        required : [true, "First Name is required"],           // first input is in array is telling that this property is req field or mandatory to fill. whereas second element defines that whenever user doesn't fill this field then that message used as an error displayed in the screen
        minlength : [5, "First Name must be atleast 5 charcter long"],
        lowercase : true,
        trim: true,       // if the user gives extra spaces then it will automatically remove it
        maxlength : [20, "First Name should be less than or equal to 20 characters"]
    },
    lastName : {
        type : String,
        // required : [true, "Last Name is required"],           // first input is in array is telling that this property is req field or mandatory to fill. whereas second element defines that whenever user doesn't fill this field then that message used as an error displayed in the screen
        minlength : [5, "Last Name must be atleast 5 charcter long"],
        lowercase : true,
        trim: true,       // if the user gives extra spaces then it will automatically remove it
        maxlength : [20, "Last Name should be less than or equal to 20 characters"]
    },
    mobileNumber: {
        type: String,
        trim: true,
        unique : [true, "Phone number is already in use"],
        required : [true, "Mobile Number should be provided"],
        maxlength : [10, "Phone number should be of length 10"],
        minlength : [10, "Phone number should be of length 10"],
    },
    email : {
        type : String,
        required : [true, "Email is required"],
        unique : [true, "Email is already in use"],
        match : [/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z ]{2,}$/,"Please fill a valid address"]
    },
    password : {           // basic password validation 
        type : String,
        required : [true, "Password is required"],  
        minlength : [8, "Password must be atleast 8 character long"],
        trim: true,       // if the user gives extra spaces then it will automatically remove it
    },
    role:{    // For authorization
        type:String,
        enum: ["USER", "ADMIN"],
        default: "USER"
    },
    address: {
        type: String,
        trim: true,
    }
},{
    timestamps : true       // it will automatically create property that is "createdAt" and "upadatedAt" this will automatically added in our defined schema as a property 
});

// pre hook to bcrypt the user password before the user created 
userSchema.pre('save', async function (){
    // here you can modify your user before it is saved in mongoDB
    // console.log(this);  // because of normal function(not an arrow function) this will refer to callset and this is called by userSchema and it have access of user 
    const hashPassword = await bcrypt.hash(this.password, 10);
    this.password = hashPassword;
});

// collection ko mongoose ki duniya me model kehte h, collection name is here - 'User and we have given the collection schema in next argument(it will create the collection object name User with userSchema as a schema)
const User = mongoose.model('User', userSchema);

module.exports = User;