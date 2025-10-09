const jwt = require("jsonwebtoken");
const { JWT_SECRET, FRONTEND_URL, COOKIE_SECURE } = require("../config/serverConfig");
const UnAuthorisedError = require("../utils/unauthorisedError");

// Middleware which is used to protect the route to check whether the user is loggedIn or not i.e have sended the token or not
// client -> middleware -> controller 
async function isLoggedIn(req, res, next){
   const token = req.cookies['authToken'];    // accessing the token which have been sended by httpOny cookie
   
   // If user have not sended the token 
   if(!token){
    return res.status(401).json({
        success: false,
        data: {},
        error: "Not authenticated",
        message: "No auth token provided"
    });
   }

   try{
       // decoded will contain the payload
       const decoded = jwt.verify(token, JWT_SECRET);
       console.log("Decoded token: ", decoded);    // this will contain the payload which we have sended while creating the token in authController.js

       if(!decoded){
        throw new UnAuthorisedError();
       }

        // If reached here that means the user is authenticated allow them to access the api
        // Also set the user property in the req obj which takes the above payload in the decoded object so that at any point we want to know which user is accessing the api we can know
        req.user = {
            email: decoded.email,
            id: decoded.id,
            role: decoded.role
        }
        next();
   } catch(error){    // If token is tempered(not having payload) i.e invalid token 
         // or expired token
        if(error.name == "TokenExpiredError"){
            // Extract domain from FRONTEND_URL for cookie domain
            let cookieDomain = undefined; // undefined means current domain
            if (FRONTEND_URL) {
                try {
                    const url = new URL(FRONTEND_URL);
                    cookieDomain = url.hostname;
                } catch (error) {
                    console.log("Invalid FRONTEND_URL, using default domain:", error.message);
                }
            }
            
            res.cookie("authToken", "", {
                httpOnly: true,
                sameSite: "lax",    // this is used to set the cookie to be sent in cross origin request
                secure: COOKIE_SECURE === 'true',    // before deploying it to production set it to true becuase in production we will be using https and not http therefore we have to set it to true
                maxAge: 0,           // Set to 0 to expire the cookie immediately
                domain: cookieDomain      // this is used to set the cookie to be sent in cross origin request
            });
            return res.status(200).json({
               success: true,
               message: "Log out successfull",
               data: {},
               error: {}
            });
        }
       return res.status(401).json({
           success: false,
           data: {},
           error: error,
           message: "Invalid token provided"
       });
   }
}

/**
 * This function checks if the authenticated user is admin or not?
 * because we will call isadmin after isLoggedin thats why we will receive user details
 */
async function isAdmin(req,res,next){
    const loggedInUser = req.user;    // this is updated req object(updated by isloggedin middleware) which having user as a project(contain role as a property)
    if(loggedInUser.role == "ADMIN"){
        next();
    }
    else{
        return res.status(401).json({
            success: false,
            data: {},
            message: "You are not authorised for this action",
            error: {
                statusCode: 401,
                reason: "Unauthorised user for this action"
            }
        })
    }
}

module.exports = {
    isLoggedIn,
    isAdmin
}