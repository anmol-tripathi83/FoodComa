const multer = require('multer');    // return a function
const path = require('path');   // preinstalled return a object which have many function, extname is one of them which will give the extension name from the sended file name

// Now we want to full control over storing files to disk then DiskStorage come into the picture
const storageConfiguration = multer.diskStorage({     // this is function we got after requiring multer which will return a middleware on calling and it require dest(destination) as argument where you want to store data(upload folder for now) which will came through uploader
    destination: (req, file, next) =>{
        next(null, 'uploads/')
    },
    filename: (req, file, next) =>{       // a callback(middleware) which is used to setup the name of file saved in the destination 
        console.log(file);   // showing the file object
        next(null, `${Date.now()}${path.extname(file.originalname)}`);       // next(error, filename)
    }
});

const uploader = multer({storage: storageConfiguration});

module.exports = uploader;