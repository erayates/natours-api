const Tour = require('./../models/tourModel');


// const tours = JSON.parse(fs.readFileSync(`${__dirname}/../dev-data/data/tours-simple.json`));

exports.aliasTopTours = async(req,res,next) => {
    req.query.limit = '5';
    req.query.sort = '-ratingsAverage,price';
    req.query.fields = 'name,price,ratingsAverage, summary, difficulty';
    next();
}


exports.getAllTours = async (req,res) => {
    try{
        // BUILD QUERY

        // 1) Filtering
        const queryObj = {...req.query};
        const excludedFields = ['page', 'sort', 'limit', 'fields'];
        excludedFields.forEach(el => delete queryObj[el]);
        // const tours = await Tour.find(queryObj);
        /* OR
        const tours = await Tour.find().where('duration').equals(5).where('difficulty').equals('easy');
        */

        // 2) Advanced Filtering
        let queryStr = JSON.stringify(queryObj);
        queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, match => `$${match}`);

        // 3) Sorting
      
        let query = Tour.find(JSON.parse(queryStr));
        if(req.query.sort){
            const sortBy = req.query.sort.split(',').join(' ');
            query = query.sort(sortBy);

        }else{
            query.sort('-createdAt');
        }

        // 4) Field Limiting
        if(req.query.fields){
            const fields = req.query.fields.split(',').join(' ');
            query = query.select(fields);
        }else{
            query = query.select('-__v');
        }

        // 5) Pagination
        const page = req.query.page * 1 || 1;
        const limit = req.query.limit * 1 || 100;
        const skip = (page - 1) * limit;

        query = query.skip(skip).limit(limit);

        if(req.query.page){
            const numTours = await Tour.countDocuments(); // Tour.countDocuments() ile toplam tour sayısı bulunur. Bir promise dönderir, o yüzden await kullanılır.
            if(skip >= numTours) throw new Error('This page does not exists.'); // Direkt olarak res.status.404 yani catch bloğuna gider.
        }

        // 6) Aliasing




        // the text has special characters think how you can just get only the words
        // ["I", "love", "teaching", "and", "empowering", "people.", "I", "teach", "HTML,", "CSS,", "JS,", "React,", "Python"]
        // const query = Tour.find(JSON.parse(queryStr))
        

        // EXECUTE QUERY
        const tours = await query;


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

