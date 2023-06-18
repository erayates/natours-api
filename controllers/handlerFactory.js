const APIFeatures = require("../utilities/apiFeatures");
const AppError = require("../utilities/appError");
const catchAsync = require("../utilities/catchAsync");

exports.deleteOne = Model => catchAsync (async (req,res,next) => {
    const doc = await Model.findByIdAndDelete(req.params.id)
    if(!doc){
        return next(new AppError('There is no document with that ID.', 404));
    }
    
    res.status(204).json({
        status: 'success',
        data: null
    })
   
});

exports.updateOne = Model => catchAsync(async (req,res,next) => {
    const doc = Model.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true // Şemada bulunan validatorları çalıştırır. (price, number olmak zorunda gibi)
    })

    if(!doc){
        return next(new AppError('There is no document with that ID.', 404));
    }

    res.status(200).json({
        status: 'success',
        data: {
            data: document
        }
    })
    
});

exports.createOne = Model => catchAsync(async (req,res,next) => {
    const doc = await Model.create(req.body)
    res.status(201).json({
        status: 'success',
        data:{
            data: doc
        }
    })
});

exports.getOne = (Model, popOptions) => catchAsync (async (req,res,next) => {
    let query = await Model.findById(req.params.id);
    if(popOptions) query = query.populate(popOptions);
    const doc = await query;


    if(!doc){
        return next(new AppError('There is no document with that ID.', 404));
    }
    
    res.status(200).json({
        status: 'success',
        data: {
            data: doc
        }
    })

});


exports.getAll = Model => catchAsync(async (req,res) => {
    // To allow for nested GET reviews on tour (hack)
    let filter = {};
    if(req.params.tourId) filter = {tour: req.params.tourId};

    // EXECUTE QUERY
    const features = new APIFeatures(Model.find(filter), req.query)
         .filter()
         .sort()
         .limitFields()
         .pagination();
     const doc = await features.query;
     
     res.status(200).json({
         status: 'success',
         results: doc.length,
         data: {
             doc
         }
     })
  
});

