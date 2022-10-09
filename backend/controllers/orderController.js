const Order = require("../model/orderModel");
const Product = require("../model/productModel");
const ErrorHandler = require("../utils/errorHandler");
const catchAsyncErrors = require("../middleware/catchAsyncErrors");

// Create new Order
exports.newOrder = catchAsyncErrors(async(req,res,next)=>{
const {
    shippingInfo,
    orderItems,
    paymentInfo,
    itemsPrice,
    taxPrice,
    shippingPrice,
    totalPrice
} = req.body;
const order = await Order.create({
    shippingInfo,
    orderItems,
    paymentInfo,
    itemsPrice,
    taxPrice,
    shippingPrice,
    totalPrice,
    paidAt: Date.now(),
    user: req.user._id
})
res.status(201).json({
    success: true,
    order
})
})
// Get single order/ OrderId se order dekh sakenge ki kisne order kiya aur kya order kiya
exports.getSingleOrder = catchAsyncErrors(async(req,res,next)=>{
    const order = await Order.findById(req.params.id).populate("user","name email");
    if(!order){
        return next(new ErrorHandler("Order not found with this Id",404));
    }
    res.status(200).json({
        success:true,
        order
    })
})
// Get logged in user orders/ users apne sare orders dekh sakega 
exports.myOrders = catchAsyncErrors(async(req,res,next)=>{
    const orders = await Order.find({user:req.user._id});
    res.status(200).json({
        success:true,
        orders
    })
})
//Get all orders --- Admin / Total Orders
exports.getAllOrders = catchAsyncErrors(async(req,res,next)=>{
    const orders = await Order.find();
    
    let totalAmount = 0;
    orders.forEach((order)=>{
        totalAmount += order.totalPrice;
    })
    res.status(200).json({
        success:true,
        totalAmount,
        orders
    })
})
//Update order status --- Admin
exports.updateOrder = catchAsyncErrors(async(req,res,next)=>{
const order = await Order.findById(req.params.id);
if(!order){
    return next(new ErrorHandler("Order not found with this id",404));
}   
if(order.orderStatus === "Delivered"){
    return next(new ErrorHandler("You have already delivered this order",400))
}
if(req.body.status === "Shipped"){
    order.orderItems.forEach(async(order)=>{
        await updateStock(order.product,order.quantity)
    })
}
order.orderStatus = req.body.status;

if(req.body.status === "Delivered"){
    order.deliveredAt = Date.now();
}
await order.save({validateBeforeSave:false});

res.status(200).json({
        success:true
        })
})
async function updateStock(id,quantity){
    const product = await Product.findById(id);
    product.stock -= quantity;

    await product.save({validateBeforeSave:false});
}
// Delete order ---Admin
exports.deleteOrder = catchAsyncErrors(async(req,res,next)=>{
    const order = await Order.findById(req.params.id);
if(!order){
    return next(new ErrorHandler("Product not found with this id",404));
}
await order.remove();

res.status(200).json({
    success:true
})
})