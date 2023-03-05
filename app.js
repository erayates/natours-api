const express = require('express');

const app = express();

const morgan = require('morgan');

const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');


// 1) MIDDLEWARES

if(process.env.NODE_ENV === 'development'){
    app.use(morgan('dev'))
}

app.use(express.json());

app.use(express.static(`${__dirname}/public`))

app.use((req,res,next) => {
    next();
});

app.use((req,res,next) => {
    req.requestTime = new Date().toUTCString();
    next();    
});


// 2) ROUTE HANDLERS
// They are now in controllers folder

// 3) ROUTES
// They are now in routes folder

app.use('/api/v1/tours',tourRouter); // These middlewares goes into middleware stack
app.use('/api/v1/users',userRouter); // When these middlewares are called, they will be executed in order

// 4) START SERVER

module.exports = app;