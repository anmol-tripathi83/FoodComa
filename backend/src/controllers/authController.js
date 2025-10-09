const { COOKIE_SECURE, FRONTEND_URL } = require("../config/serverConfig");
const { loginUser } = require("../services/authService");

async function login(req, res){
    try {
        console.log("Login controller called with payload:", req.body);
        const loginPayload = req.body;
        
        // Auth Service
        console.log("Calling loginUser service...");
        const response = await loginUser(loginPayload);
        console.log("LoginUser service response:", response);
        
        // Now sending token from httpOnly cookie to the user to use it for further process he wants such as order placing which require token to send it for authorization
        console.log("Setting cookie...");
        
        // Extract domain from FRONTEND_URL for cookie domain
        let cookieDomain = undefined; // undefined means current domain
        if (FRONTEND_URL) {
            try {
                const url = new URL(FRONTEND_URL);
                cookieDomain = url.hostname;
                console.log("Cookie domain set to:", cookieDomain);
            } catch (error) {
                console.log("Invalid FRONTEND_URL, using default domain:", error.message);
            }
        }
        
        res.cookie("authToken", response.token, {
            httpOnly: true,
            secure: COOKIE_SECURE === 'true', // Convert string to boolean
            sameSite: "lax",
            maxAge: 7 * 24 * 60 * 60 * 1000,          // 7 days converted into msec
            domain: cookieDomain  // Use extracted domain or undefined for current domain
        });
        
        console.log("Sending success response...");
        return res.status(200).json({
            success: true,
            message: "Logged in Successfully",
            data: {
                userRole: response.userRole,
                userData: response.userData
            },
            error: {}
        });
    } catch(error){
        console.log("Error in login controller:", error);
        const statusCode = error.statusCode || 500;
        res.status(statusCode).json({
            success: false,
            data: {},
            message: error.message || 'Internal Server Error',
            error: error
        });
    }
}

async function logout(req,res){
    
    console.log("Cookies from frontend",req.cookies);

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
        secure: COOKIE_SECURE === 'true',    // before deploying it to production set it to true becuase in production we will be using https and not http therefore we have to set it to true
        sameSite: "lax",    // this is used to set the cookie to be sent in cross origin request
        maxAge: 0,           // Set to 0 to expire the cookie immediately
        domain: cookieDomain       // this is used to set the cookie to be sent in cross origin request
    });
    return res.status(200).json({
       success: true,
       message: "Log out successfull",
       data: {},
       error: {}
    });
}

module.exports = {
    login,
    logout
};