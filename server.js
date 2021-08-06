const express = require('express');
const dotenv = require("dotenv");
const connectDatabase  = require("./helpers/database/connectDatabase")
const customErrorHandler = require("./middlewares/error/customErrorHandler")
const path = require("path");
const routers = require("./routers/index"); // burda tam olarak dosyanın yolunu belirtmemizin nedeni "index" dosyası ana dosya oldugu için kendiliğinden bu dosyayı alıcaktır 

// ENVİROMENT VARİABLES
dotenv.config({
    "path": "./config/env/config.env"
});
// MONGODB CONNECTİON
connectDatabase();

const app = express();

// Express - Body Midlleware
app.use(express.json());
const PORT = process.env.PORT;

// Router Midlleware
app.use("/api",routers);

// Error Handler 
app.use(customErrorHandler);

// Statcic Files
app.use(express.static(path.join(__dirname,"public")));
app.listen(PORT,() => {  
    console.log(`App Started on ${PORT} : ${process.env.NODE_ENV}`);
});




