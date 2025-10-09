const User = require('../schema/userSchema');
const BadRequestError = require('../utils/badRequest');
const InternalServerError = require('../utils/internalServerError');

// interacting with the database(checking any user with following details which is in parameters object)
async function findUser(parameters){
    try{
        const response = await User.findOne({...parameters});
        return response;
    } catch(error){
        console.log("Error in findUser:", error);
        throw new InternalServerError("Database error while finding user");
    }
}

// interacting with the database(creating a new user with following user details which is in userDetails object)
async function createUser(userDetails){
    try{
        const response = await User.create(userDetails);
        return response; 
    } catch(error){
        console.log("Error in createUser:", error);
        
        if(error.name == 'ValidationError'){    // sent by mongoose(when req schema info is not given by the user or incorrect email format etc..)
            const errorMessageList = Object.keys(error.errors).map((property) => {
                return error.errors[property].message;
            });
            throw new BadRequestError(errorMessageList.join(', '));
        }
        
        // Handle duplicate key errors (E11000)
        if(error.code === 11000){
            const field = Object.keys(error.keyPattern)[0];
            const value = error.keyValue[field];
            let message = `${field} is already in use`;
            
            if(field === 'email'){
                message = 'Email is already registered. Please use a different email.';
            } else if(field === 'mobileNumber'){
                message = 'Mobile number is already registered. Please use a different mobile number.';
            }
            
            throw new BadRequestError(message);
        }
        
        // otherwise internalServer error
        throw new InternalServerError("Database error while creating user");
    }
}

module.exports = {
    findUser,
    createUser
};