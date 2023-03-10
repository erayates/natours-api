const Tour = require('../models/tourModel');

const APIFeatures = require('../utilities/apiFeatures');

// const tours = JSON.parse(fs.readFileSync(`${__dirname}/../dev-data/data/tours-simple.json`));

exports.aliasTopTours = async(req,res,next) => {
    req.query.limit = '5';
    req.query.sort = '-ratingsAverage,price';
    req.query.fields = 'name,price,ratingsAverage, summary, difficulty';
    next();
}




exports.getAllTours = async (req,res) => {
    try{
        // EXECUTE QUERY
        const features = new APIFeatures(Tour.find(), req.query)
            .filter()
            .sort()
            .limitFields()
            .pagination();
        const tours = await features.query;


        res.status(200).json({
            status: 'success',
            results: tours.length,
            data: {
                tours
            }
        })
    }catch(err){
        res.status(404).json({
            status: 'fail',
            message: err
        })
    }

 
}

// exports.checkID = (req, res, next, val)=> {
//     console.log(`Tour id is: ${val}`);
//     if(req.params.id > tours.length - 1) return res.status(404).json({
//         status: 'fail',
//         message: 'There is no tour with that ID.'
//     })
//     next();
// }

// exports.checkBody = (req,res,next) => {
//     if(!req.body.name || !req.body.price) return res.status(400).json({
//         status: 'fail',
//         message: 'Missing name or price'
//     });
//     next();
// }


// GET Request with ID

exports.getTour = async (req,res) => {
  
    // if(!tour) return res.status(404).json({
    //     status: 'fail',
    //     message: 'There is no tour with that ID.'
    // })

    try{
        const tour = await Tour.findById(req.params.id)
        res.status(200).json({
            status: 'success',
            data: {
                tour
            }
        })
    } catch(err){
        res.status(404).json({
            status: 'fail',
            message: "There is no tour with that ID."
        })
    }
}

// POST Request

exports.createTour = async (req,res) => {
    try{
        const newTour = await Tour.create(req.body)
        res.status(201).json({
            status: 'success',
            data:{
                tour: newTour
            }
        })
    }catch(err){
        res.status(400).json({
            status: 'fail',
            message: "Invalid data sent!"
        })
    }
   
    
    
    
    // const newId = tours[tours.length - 1].id + 1;
    // const newTour = Object.assign({id: newId}, req.body);

    // tours.push(newTour);
    // fs.writeFile(`${__dirname}/dev-data/data/tours-simple.json`, JSON.stringify(tours), err => {
    //     res.status(201).json({
    //         status: 'success',
    //         data: {
    //             tour: newTour
    //         }
    //     })
    // })

}

// PATCH REQUEST

exports.updateTour = (req,res) => {
    try{
        const tour = Tour.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true // Şemada bulunan validatorları çalıştırır. (price, number olmak zorunda gibi)
        })
        res.status(200).json({
            status: 'success',
            data: {
                tour
            }
        })
    }catch(err){
        res.status(404).json({
            status: 'fail',
            message: 'There is no tour with that ID.'
        })
    }
    res.status(200).json({
        status: 'success',
        data: {
            tour: '<Update tour here...>'
        }
    })
}

exports.deleteTour = async (req,res) => {
    try{ 
        await Tour.findByIdAndDelete(req.params.id)
        res.status(204).json({
            status: 'success',
            data: null
        })
    }catch(err){
        res.status(404).json({
            status: 'fail',
            message: 'There is no tour with that ID.'
        })
    }
}

// Aggregation Pipeline
exports.getTourStats = async (req,res) => {
    try{
        
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
    }
    catch(err){
        res.status(404).json({
            status: 'fail',
            message: err
        })
    }
}
exports.getMonthlyPlan = async (req, res) => {
    try {
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
    } catch (err) {
      res.status(404).json({
        status: 'fail',
        message: err
      });
    }
  };

