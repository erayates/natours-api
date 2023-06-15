/* Review Model
    - reviewSchema 
    - rating
    - createdAt
    - Ref to tour
    - ref to user
    

*/

const { mongoose } = require("mongoose");

const reviewSchema = new mongoose.Schema({
    review: {
        type: String,
        required: [true, 'Review cannot be empty.']
    },
    rating: {
        type: Number,
        min: 1,
        max: 5,
        required: [true, 'Review must have a rating.'],
    },
    createdAt: {
        type: Date,
        default: Date.now(),
    },
    tour: {
        type: Schema.ObjectId,
        ref: 'Tour',
        required: [true, 'Review must belong to a tour.']
    },
    user: {
        type: Schema.ObjectId,
        ref: 'User',
        required: [true, 'Review must belong to a user.']
    },

},{
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
})

reviewSchema.pre(/^find/, function(next){
    
    // We dont want to see the tour details again because we already have the tour details
    
    // this.populate({
    //     path: 'tour',
    //     select: 'name'
    // })

    this.populate({
        path: 'user',
        select: 'name photo'
    })
})

const Review = mongoose.model('Review', reviewSchema);

module.exports = Review;