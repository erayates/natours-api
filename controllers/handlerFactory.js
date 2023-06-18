const AppError = require("../utilities/appError");
const catchAsync = require("../utilities/catchAsync");

exports.deleteOne = Model => catchAsync (async (req,res,next) => {
    const document = await Model.findByIdAndDelete(req.params.id)
    if(!document){
        return next(new AppError('There is no document with that ID.', 404));
    }
    
    res.status(204).json({
        status: 'success',
        data: null
    })
   
});

exports.updateOne = Model => catchAsync(async (req,res,next) => {
    const document = Model.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true // Şemada bulunan validatorları çalıştırır. (price, number olmak zorunda gibi)
    })

    if(!document){
        return next(new AppError('There is no document with that ID.', 404));
    }

    res.status(200).json({
        status: 'success',
        data: {
            data: document
        }
    })
    
});