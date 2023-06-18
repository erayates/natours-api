const Tour = require('../models/tourModel');
const catchAsync = require('../utilities/catchAsync');
const factory = require('./handleFactory');

// const tours = JSON.parse(fs.readFileSync(`${__dirname}/../dev-data/data/tours-simple.json`));

exports.aliasTopTours = async(req,res,next) => {
    req.query.limit = '5';
    req.query.sort = '-ratingsAverage,price';
    req.query.fields = 'name,price,ratingsAverage, summary, difficulty';
    next();
}

exports.getAllTours = factory.getAll(Tour);

// GET Request with ID
exports.getTour = factory.getOne(Tour, {path: 'reviews'});

// POST Request
exports.createTour = factory.createOne(Tour);

// PATCH REQUEST
exports.updateTour = factory.updateOne(Tour);

// DELETE request
exports.deleteTour = factory.deleteOne(Tour);

// Aggregation Pipeline
exports.getTourStats = catchAsync (async (req,res) => {
    const stats = await Tour.aggregate([
        {
            $match: {ratingsAverage: {$gte: 4.5}}
        },
        {
            $group: {
                _id: {$toUpper: '$difficulty'},
                // _id: '$ratingsAverage',
                numTours: {$sum: 1},
                numRatings: {$sum: '$ratingsQuantity'},
                avgRating: {$avg: '$ratingsAverage'},
                avgPrice: {$avg: '$price'},
                minPrice: {$min: '$price'},
                maxPrice: {$max: '$price'},
            }
        },
        {
            $sort: {
                avgPrice: 1
            }
        },
        {
            $match: {
                _id: {$ne: 'EASY'}
            }
        }
    ])
    res.status(200).json({
        status: 'success',
        data: {
            stats
        }
    })
    // try{
    
    // }
    // catch(err){
    //     res.status(404).json({
    //         status: 'fail',
    //         message: err
    //     })
    // }
});


exports.getMonthlyPlan = catchAsync (async (req, res) => {
    const year = req.params.year * 1; // 2021
  
    const plan = await Tour.aggregate([
      {
        $unwind: '$startDates'
      },
      {
        $match: {
          startDates: {
            $gte: new Date(`${year}-01-01`),
            $lte: new Date(`${year}-12-31`)
          }
        }
      },
      {
        $group: {
          _id: { $month: '$startDates' },
          numTourStarts: { $sum: 1 },
          tours: { $push: '$name' }
        }
      },
      {
        $addFields: { month: '$_id' }
      },
      {
        $project: {
          _id: 0
        }
      },
      {
        $sort: { numTourStarts: -1 }
      },
      {
        $limit: 12
      }
    ]);

    res.status(200).json({
      status: 'success',
      data: {
        plan
      }
    });
    // try {
    
    // } catch (err) {
    //   res.status(404).json({
    //     status: 'fail',
    //     message: err
    //   });
    // }
  });
