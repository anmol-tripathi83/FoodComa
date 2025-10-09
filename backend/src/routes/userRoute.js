// Resource - User
// /users

const express = require('express');
const { createUser } = require('../controllers/userController');

// We have to initialise a router object to add routes in a new file
// Routers are used for segregating your routes in different modules
const userRouter = express.Router();

// localhost:5002/users -> POST
userRouter.post('/',createUser);      // This is a route registration

module.exports = userRouter;           // exporting the router