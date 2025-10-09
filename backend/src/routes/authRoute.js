// Resource - login user
// /users

const express = require('express');
const { login, logout } = require('../controllers/authController');

// We have to initialise a router object to add routes in a new file
// Routers are used for segregating your routes in different modules
const authRouter = express.Router();

// localhost:5002/users -> POST
// This is a route for login
authRouter.post('/login',login);      // This is a route for login

// This is a route for log Out
authRouter.post('/logout', logout);      // This is a route for logout

module.exports = authRouter;           // exporting the router