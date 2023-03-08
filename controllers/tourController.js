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
 


    res.status(200).json({
        status: 'success',
        // data: {
        //     tour
        // }
    })
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

