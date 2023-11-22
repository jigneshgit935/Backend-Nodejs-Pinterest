const multer = require('multer');
const { v4: uuidv4 } = require('uuid');
const path = require('path');
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './public/images/uploads'); //Destination folder for uploads
  },

  filename: function (req, file, cb) {
    file.originalname;
    const uniqueFilename = uuidv4(); //Generate unique filename using uuid
    cb(null, uniqueFilename + path.extname(file.originalname)); //use the unique filename for the upload file
  },
});

const upload = multer({ storage: storage });

module.exports = upload;
