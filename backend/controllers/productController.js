const Product = require("../model/productModel");
const ErrorHandler = require("../utils/errorHandler");
const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const ApiFeatures = require("../utils/apiFeatures");
const cloudinary = require("cloudinary");


// Create Product ---Admin
module.exports.createProducts = catchAsyncErrors(async(req,res,next) => {
    let images = [];
    if(typeof req.body.images === "string") {       // matlab ki image ka url sirf ek hi hai
        images.push(req.body.images)
    } else {
        images = req.body.images;
    }
    const imagesLinks = [];
    for(let i = 0; i < images.length; i++){
        const result = await cloudinary.v2.uploader.upload(images[i],{
            folder: "products"
        })
        imagesLinks.push({
            public_id: result.public_id,
            url: result.secure_url
        })
    }
    req.body.images = imagesLinks;
    req.body.user = req.user.id;
const product = await Product.create(req.body);
res.status(201).json({
    success: true,
    product
})
});

// Get All Products
exports.getAllProducts = catchAsyncErrors(async(req,res) => {
const resultPerPage = 8;
const productCount = await Product.countDocuments();
const apiFeature = new ApiFeatures(Product.find(),req.query)
.search()
.filter()
.pagination(resultPerPage);
let products = await apiFeature.query;
let filteredProductsCount = products.length;
// products = await apiFeature.query;  (bug hai yeh)
     res.status(200).json({
        success:true,
        products,
        productCount,
        resultPerPage,
        filteredProductsCount
    })
});

// Get All Products (Admin)
exports.getAdminProducts = catchAsyncErrors(async(req,res) => {
   const products = await Product.find();
         res.status(200).json({
            success:true,
            products
        })
    });
    
// Update Product --- Admin
module.exports.updateProduct = catchAsyncErrors(async(req,res,next) => {
let product = await Product.findById(req.params.id);
if(!product){
    return next(new ErrorHandler("Product Not Found", 404));
}

// Images start here
let images = [];
    if(typeof req.body.images === "string") {       // matlab ki image ka url sirf ek hi hai
        images.push(req.body.images)
    } else {
        images = req.body.images;
    }
    if (images !== undefined){
        // Deleting Images form cloudinary
    for (let i = 0; i < product.images.length; i++) {
        await cloudinary.v2.uploader.destroy(product.images[i].public_id);
    }
    }

    // Uploading new images in cloudinary
    const imagesLinks = [];
    for(let i = 0; i < images.length; i++){
        const result = await cloudinary.v2.uploader.upload(images[i],{
            folder: "products"
        })
        imagesLinks.push({
            public_id: result.public_id,
            url: result.secure_url
        })
    }
    req.body.images = imagesLinks;
product = await Product.findByIdAndUpdate(req.params.id,req.body,{
    new:true,
    runValidators:true,
    useFindAndModify:false
});
res.status(200).json({
    success:true,
    message:"Product updated Successfully",
    product
})
});
// Get Product Details
exports.getProductDetails = catchAsyncErrors(async(req,res,next) => {
    const product = await Product.findById(req.params.id);
    if(!product){
        return next(new ErrorHandler("Product Not Found", 404));
}
res.status(200).json({
    success:true,
    product

})
});
// Delete Product ---Admin
exports.deleteProduct = catchAsyncErrors(async(req,res,next) => {
    const product = await Product.findById(req.params.id);
    if(!product){
        return next(new ErrorHandler("Product Not Found", 404));
}
// Deleting Images form cloudinary
    for (let i = 0; i < product.images.length; i++) {
  await cloudinary.v2.uploader.destroy(product.images[i].public_id);
        
    }
   await product.remove();

   res.status(200).json({
       success:true,
       message:"Product Deleted Successfully"
   
   })
});
// Create new review or update the review
exports.createProductReview = catchAsyncErrors(async(req,res,next)=>{
    const {rating,comment,productId} = req.body;
    const review = {
        user: req.user._id,
        name: req.user.name,
        rating: Number(rating),
        comment
    }
    const product = await Product.findById(productId);
    const isReviewed = product.reviews.find(
        (rev)=> rev.user.toString()=== req.user._id.toString()
        );
    if(isReviewed){
    product.reviews.forEach((rev) =>{
        if(rev.user.toString()=== req.user._id.toString())
        (rev.rating = rating),(rev.comment = comment)
    })
    }
    else {
        product.reviews.push(review);
        product.numOfReviews = product.reviews.length
    }
    let avg = 0;
    product.reviews.forEach((rev) =>{
    avg += parseInt(rev.rating); 
    })
    
    product.ratings = avg / product.reviews.length;
    
    await product.save({validateBeforeSave:false});

    res.status(200).json({
        success: true
 })
}) 
// Get All Reviews of a product
exports.getProductReviews = catchAsyncErrors(async(req,res,next)=>{
    const product = await Product.findById(req.query.id); // isme req.params.id se product kyo nai mil raha
    if(!product){
        return next(new ErrorHandler("Product Not Found", 404));
}
res.status(200).json({
    success:true,
    reviews: product.reviews

})
})
// Delete Review
exports.deleteReview = catchAsyncErrors(async(req,res,next)=>{
    const product = await Product.findById(req.query.productId);
    if(!product){
        return next(new ErrorHandler("Product Not Found",404));
    }
    // (filter) naya review koi aaya to yeh reviews me daal dega filter karke
    const reviews = product.reviews.filter((rev)=> rev._id.toString() !== req.query.id.toString()); // req.query.id ye reviewId aa rahi hai frontend se
    let avg = 0;
    reviews.forEach((rev)=>{
        avg += rev.rating;
    })
    let ratings = 0;
    if(reviews.length === 0){
        ratings = 0;
    } else {
        ratings = avg/reviews.length;
 }
    const numOfReviews = reviews.length;

    await Product.findByIdAndUpdate(req.query.productId,{
    reviews,
    ratings,
    numOfReviews
    },
    {new:true,
    runValidators:true,
    useFindAndModify:false
    }
)
res.status(200).json({
    success:true
})
})
 
