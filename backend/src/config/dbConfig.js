const mongoose = require('mongoose');
const ServerConfig = require('./serverConfig');

/**
 * Below function helps us to a mongoDB server
 */
async function connectDB(){
    try{
        await mongoose.connect(ServerConfig.DB_URL);
        console.log("Successfully connected to the mongoDB server....")
    } catch(error){
        console.log("Not able to connect to the mongoDB server");
        console.log(error);
    }
}

module.exports = connectDB;