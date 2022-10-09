const catchAsyncErrors =  require("../middleware/catchAsyncErrors");
// const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

// exports.processPayment = catchAsyncErrors(async(req,res,next)=>{
//     const myPayment = await stripe.paymentIntents.create({
//         amount: req.body.amount,
//         currency: "inr",
//         // metaData: {
//             // company:"Ecommerce"
//         // }
//     })
//     res.status(200).json({
//         success: true,
//         client_secret: myPayment.client_secret
//     })
// })

exports.processPayment = catchAsyncErrors(async(req,res,next)=> {
        const create_payment_json = {
          "intent": "sale",
          "payer": {
              "payment_method": "paypal"
          },
          "redirect_urls": {
              "return_url": "http://localhost:3000/success",
              "cancel_url": "http://localhost:3000/cancel"
          },
          "transactions": [{
              "item_list": {
                  "items": [{
                      "name": "Red Sox Hat",
                      "sku": "001",
                      "price": "25.00",
                      "currency": "INR",
                      "quantity": 1
                  }]
              },
              "amount": {
                  "currency": "INR",
                  "total": "25.00"
              },
              "description": "Hat for the best team ever"
          }]
      };
      
      paypal.payment.create(create_payment_json, function (error, payment) {
        if (error) {
            throw error;
        } else {
            for(let i = 0;i < payment.links.length;i++){
              if(payment.links[i].rel === 'approval_url'){
                res.redirect(payment.links[i].href);
              }
            }
        }
      });
})

exports.sendStripeApiKey = catchAsyncErrors(async(req,res,next)=>{
    res.status(200).json({
        stripeApiKey: process.env.STRIPE_API_KEY
    })
})