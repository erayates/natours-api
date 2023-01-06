const express = require('express');
const app = express();
const fs = require('fs');

const port = 3000;


app.use(express.json())



// GET Request
// app.get('/', (req,res) => {
//     res.status(200).json(
//         {message: 'Hello from the server side!', app: 'Natours'}
//     );
// })

// POST
// app.post('/', (req,res) => {
//     res.send('You can post to this endpoint...')
// })

const tours = JSON.parse(fs.readFileSync(`${__dirname}/dev-data/data/tours-simple.json`));


app.get('/api/v1/tours', (req,res) => {
    res.status(200).json({
        status: 'success',
        results: tours.length,
        data: {
            tours
        }
    })
})

app.get('/api/v1/tours/:id', (req,res) => {
    console.log(req.params)
 
    const tour = tours.find(el => el.id === parseInt(req.params.id))
    if(!tour) return res.status(404).json({
        status: 'fail',
        message: 'There is no tour with that ID.'
    })
    res.status(200).json({
        status: 'success',
        data: {
            tour
        }
    })
})





app.post('/api/v1/tours', (req,res) => {
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

    // Always send a response
})


app.listen(port,() => {
    console.log(`App running on port ${port}...`)
})