const AppError = require("../utilities/appError");
const catchAsync = require("../utilities/catchAsync");
const Review = require('../models/reviewModel');

exports.getAllReviews = catchAsync(async (req,res) => {
    const reviews = await Review.find({});
    res.status(200).json({
        status: 'success',
        results: reviews.length,
        data: {
            reviews
        }

    })

    next();
});

exports.createReview = catchAsync(async(req,res) => {
    // Allow nested routes
    
    if(!req.body.tour) req.body.tour = req.params.tourId;
    if(!req.body.user) req.body.user = req.params.id

    
    
    const newReview = await Review.create(req.body)
    newReview.save();
    res.status(200).json({
        status: 'success',
        data: {
            review: newReview
        }
    })
});