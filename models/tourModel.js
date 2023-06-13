const mongoose = require('mongoose');

const slugify = require('slugify');

const validator = require('validator');


const tourSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'A tour must have a name.'],
        unique: true,
        trim: true,
        maxlength: [40, 'A tour name must have less or equal then 40 charachters.'],
        minlength: [10, 'A tour name must have more or equal then 10 charachters.'],
        validate: [validator.isAlpha, 'Tour name must only contain characters.'] // Şuan da tur arasındaki boşlukları kabul etmiyor.
    },
    slug: String,
    durations: {
        type: Number,
        require: [true, 'A tour must have a duration.'],
    },
    maxGroupSize: {
        type: Number,
        required: [true, 'A tour must have a group size.'],
    },
    difficulty: {
        type: String,
        required: [true, 'A tour must have a difficulty.'],
        enum: {
            values: ['easy', 'medium', 'difficult'],
            message: 'Difficulty is either: easy, medium, difficult'
        }
    },
    ratingsAverage: {
        type: Number,
        default: 4.5,
        min: [1, 'Rating must be above 1.0'],
        max: [5, 'Rating must be below 5.0'],

    },
    ratingsQuantity: {
        type: Number,
        default: 0
    },
    price: {
        type: Number,
        required: [true, 'A tour must have a price.']
    },
    priceDiscount: {
        type: Number,
        validate: {
            validator: function (val) {
                // this only points to current doc on NEW document creation (will not work on UPDATE)
                return val < this.price;
            },
            message: 'Discount price ({VALUE}) should be below regular price.}'

        }
    },
    summary: {
        type: String,
        trim: true,
    },
    description: {
        type: String,
        trim: true,
        required: [true, 'A tour must have a description.']
    },
    imageCover: {
        type: String,
        required: [true, 'A tour must have a cover image.']
    },
    images: [String],
    createdAt: {
        type: Date,
        default: Date.now(),
        select: false
    },
    startDates: [Date],
    secretTour: {
        type: Boolean,
        default: false
    },
    startLocation: {
        type: {
            type: String,
            default: 'Point',
            enum: ['Point']
        },
        coordinates: [Number], // [longitude, latitude]
        address: String,
        description: String,

    },
    locations: [
        {
         type: {
          type: String,
          default: 'Point',
          enum: ['Point']  
         },
         coordinates: [Number],
         address: String,
         description: String,
         day: Number
        }
    ]
}, {
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
})

tourSchema.virtual('durationWeeks').get(function () { return this.durations / 7 });

// Document middleware: runs before .save() and .create() but not on insertMany() trigger the save method
tourSchema.pre('save', function (next) {
    this.slug = slugify(this.name, { lower: true });
    next();
})

tourSchema.post('save', function (doc, next) {
    console.log(doc);
    next();
})

// Query Middleware
tourSchema.pre(/^find/, function (next) {
    this.find({ secretTour: { $ne: true } });
    this.start = Date.now();
    next();
})

tourSchema.post(/^find/, function (docs, next) {
    // console.log(docs)
    console.log(`Query took ${Date.now() - this.start} milliseconds`);
    next();
})


// Aggregation Middleware
tourSchema.pre('aggregate', function (next) {
    this.pipeline().unshift({ $match: { $secretTour: { $ne: true } } });

    console.log(this.pipeline());
    next();
})

// tourSchema.pre('findOne', function(next){ // Tekli turda arama yaptığımızda getAllTour değil getTour middleware'ı çalışır. Bu yüzden secretTour'lar ortaya çıkabilir.
// this.find({secretTour} : {$ne: true});
//next();
// })

const Tour = mongoose.model('Tour', tourSchema);




module.exports = Tour;
