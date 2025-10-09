class AppError extends Error {     // extens inbuilt Error class in JS
    constructor(message, statusCode){
        super(message);
        this.statusCode = statusCode;
        Error.captureStackTrace(this, this.constructor);    // function
    }
}

module.exports = AppError;