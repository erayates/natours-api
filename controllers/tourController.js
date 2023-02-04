const fs = require('fs');

const tours = JSON.parse(fs.readFileSync(`${__dirname}/../dev-data/data/tours-simple.json`));

exports.getAllTours = (req,res) => {
    res.status(200).json({
        status: 'success',
        requestedAt: req.requestTime,
        results: tours.length,
        data: {
            tours
        }
    })
}

exports.checkID = (req, res, next, val)=> {
    console.log(`Tour id is: ${val}`);
    if(req.params.id > tours.length - 1) return res.status(404).json({
        status: 'fail',
        message: 'There is no tour with that ID.'
    })
    next();
}

exports.checkBody = (req,res,next) => {
    if(!req.body.name || !req.body.price) return res.status(400).json({
        status: 'fail',
        message: 'Missing name or price'
    });
    next();
}


// GET Request with ID

exports.getTour = (req,res) => {
    const tour = tours.find(el => el.id === parseInt(req.params.id));
    // if(!tour) return res.status(404).json({
    //     status: 'fail',
    //     message: 'There is no tour with that ID.'
    // })
    res.status(200).json({
        status: 'success',
        data: {
            tour
        }
    })
}

// POST Request

exports.createTour = (req,res) => {
    const newId = tours[tours.length - 1].id + 1;
    const newTour = Object.assign({id: newId}, req.body);

    tours.push(newTour);
    fs.writeFile(`${__dirname}/dev-data/data/tours-simple.json`, JSON.stringify(tours), err => {
        res.status(201).json({
            status: 'success',
            data: {
                tour: newTour
            }
        })
    })
}

// PATCH REQUEST

exports.updateTour = (req,res) => {
    res.status(200).json({
        status: 'success',
        data: {
            tour: '<Update tour here...>'
        }
    })
}

exports.deleteTour = (req,res) => {
    res.status(204).json({
        status: 'success',
        data: null
    })
}

