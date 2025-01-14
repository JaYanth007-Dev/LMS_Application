const app = require("./app");
require("dotenv").config();
const connectToDB = require("./config/dbConnection");
const cloudinary = require("cloudinary");

const PORT = process.env.PORT || 5001;

cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});


app.listen(PORT, () => {
  connectToDB();
  console.log(`Server is running on port ${PORT}`);
});
