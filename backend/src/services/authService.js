const { findUser } = require("../repositories/userRepository");
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { JWT_SECRET, JWT_EXPIRY } = require("../config/serverConfig");

async function loginUser(authDetails){
    try {
        console.log("Login attempt for email:", authDetails.email);
        
        const email = authDetails.email;
        const plainPassword = authDetails.password;

        // 1. check if there is a registered user with the given email
        console.log("Searching for user with email:", email);
        const user = await findUser({ email });
        console.log("User found:", user ? "Yes" : "No");

        if(!user){
            console.log("No user found with email:", email);
            throw {message: "No user found with the given email", statusCode: 404};
        }

        // 2. If the user found we need to compare plain incoming password with the hashed password saved in the DB by using compare function provided by the bcrypt
        console.log("Validating password...");
        const isPasswordValidated = await bcrypt.compare(plainPassword, user.password);
        console.log("Password validation result:", isPasswordValidated);

        if(!isPasswordValidated){
            console.log("Invalid password for user:", email);
            throw {message: "Invalid password, please try again", statusCode: 401};
        }

        // 3. If the password is validated, create a token and return it
        console.log("Creating JWT token...");
        const userRole = user.role? user.role: "USER";   // for authorisation(or checking isuser is only user or admin for accessing product apis)
        const token = jwt.sign({ email: user.email, id: user._id, role: userRole}, JWT_SECRET, { expiresIn: JWT_EXPIRY });
        
        const result = {
            token, 
            userRole, 
            userData: {
                email: user.email,
                firstName: user.firstName,
            }
        };
        
        console.log("Login successful for user:", email);
        return result;
    } catch (error) {
        console.log("Error in loginUser service:", error);
        throw error;
    }
}

module.exports = {
    loginUser
};