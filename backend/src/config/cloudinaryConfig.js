const { CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET } = require('./serverConfig');

const cloudinary = require('cloudinary').v2;  // cloudinary package provide a v2 object

// Configuring cloudinary     // in simple we are fetching an cloudinary obj in which we configured all api keys and using this obj we upload the file 
cloudinary.config({            // sending these to authenticate that i want to upload an img in cloudinary
    cloud_name: CLOUDINARY_CLOUD_NAME,
    api_key: CLOUDINARY_API_KEY,
    api_secret: CLOUDINARY_API_SECRET
});

module.exports = cloudinary;