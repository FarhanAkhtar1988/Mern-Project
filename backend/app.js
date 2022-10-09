const express = require("express");
const app = express();
const errorMiddleware = require("./middleware/error");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const fileUpload = require("express-fileupload");
const dotenv = require("dotenv");
const paypal = require("paypal-rest-sdk");
// const passport = require('passport');
const cors = require('cors');


app.use(express.json());
app.use(cookieParser());
app.use(bodyParser.urlencoded({extended: true}));
app.use(fileUpload());
// app.use(passport.initialize());
app.use(cors());


// config
dotenv.config({path:"backend/config/config.env"});
dotenv.config();
require('./middleWare/googleAuth')
//integration Paypal
paypal.configure({
    'mode': 'sandbox', //sandbox or live
    'client_id': 'Ab1kl_iveTdc2NaFzfraJmP1cBk7EH8tqrPEhQYuywQk3tY_Hw2v5oOMiD6f1-TEvQEXNckNYgi7VJvi',
    'client_secret': 'EIQU0UeuIzLb1bI80vG1OjrMnFM9O1kZqGsIjCwvp-jgjK-dYqpk9x0RqL2IfLWvxC1642tyNY3i4aJx'
  });

// Route Imports
const product = require("./routes/productRoute");
const user = require("./routes/userRoute"); 
const order = require("./routes/orderRoute");
const payment = require("./routes/paymentRoute");

app.use("/api/v1",product);
app.use("/api/v1",user);
app.use("/api/v1",order);
app.use("/api/v1",payment);

// Middleware for error
app.use(errorMiddleware);

// app.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

// app.get('/google/callback', passport.authenticate('google', { failureRedirect: '/failed' }),
//   function(req, res) {
//     res.redirect('/login');
//   }
// );


module.exports = app