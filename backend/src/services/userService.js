const { findUser, createUser } = require("../repositories/userRepository");
const { createCart } = require("../repositories/cartRepo");

// It will create brand new user it the database
async function registerUser(userDetails){
    
    // 1. We need to check if the user with this email, mobile number already exists or not
    const user = await findUser({
        email: userDetails.email,
        mobileNumber: userDetails.mobileNumber
    });
    // If user already exists, we will throw an error
    if(user){
        throw { reason: 'User with the given email and mobile number already exist', statusCode: 400};     // client error
    }

    // 2. If not then Create the user in the database
    const newUser = await createUser({       // this is sended by manually writing because let say userDetails have extra details on it but we will send only relevant details to store in the database
        email : userDetails.email,
        password : userDetails.password,              // here bcrypt not applied because it is not guranteed that bcrypted password fullfill the constraints which is done by mongoose scema layer so this can be done by using pre hook to bcrypt the password before user created
        firstName : userDetails.firstName,
        lastName : userDetails.lastName,
        mobileNumber : userDetails.mobileNumber
    });
    // if user by server mistake can't be created then throw err
    if(!newUser){
        throw {reason: "Something went wrong, can't create user", StatusCode: 500};  // internal server error
    }

    // when user is created then make user's cart as well just after the new user registered
    await createCart(newUser._id);
    // 3. return the details of created user
    return newUser;
}


module.exports = {
    registerUser
};