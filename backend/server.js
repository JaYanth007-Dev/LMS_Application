const app = require('./app')
const {config }= require('dotenv');
const connectToDB = require('./config/dbConnection');
config();
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    connectToDB();
    console.log(`Server is running on port ${PORT}`);
    });