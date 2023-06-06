const express = require('express');
const app = express();
const morgan = require('morgan');

const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp = require('hpp');

const AppError = require('./utilities/appError'); 
const globalErrorHandler = require('./controllers/errorController');
const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');

// 1) GLOBAL MIDDLEWARES

// Set security HTTP headers
app.use(helmet());


// Development logging
if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'))
}

// Limit requests from same API 
const limiter = rateLimit({
    max: 100,
    windowMs: 60 * 60 * 1000, // 1 hour
    message: 'Too many request from this IP, please try again in an hour.'
});

app.use('/api', limiter);

// Body parser, reading data from body into req.body
app.use(express.json({limit: '10kb'}));


// Data sanitization against NoSQL query injection
app.use(mongoSanitize());


// Data sanitization against XSS
app.use(xss());


// Prevent parameter pollution
app.use(hpp({
    whitelist: ['duration', 'ratingsQuantity', 'ratingsAverage', 'maxGroupSize', 'difficulty', 'price']
}));


// Serving static files
app.use(express.static(`${__dirname}/public`))


// Test Middleware
app.use((req,res,next)=>{
    req.requestTime = new Date().toUTCString();
    next();
}
);

// 2) ROUTE HANDLERS
// They are now in controllers folder

// 3) ROUTES
// They are now in routes folder



app.use('/api/v1/tours', tourRouter);
// These middlewares goes into middleware stack
app.use('/api/v1/users', userRouter);
// When these middlewares are called, they will be executed in order
app.all('*', (req,res,next) => {
    // res.status(404).json({
        //     status: 'fail',
        //     message: `Can't find ${req.originalUrl} on this server!`
        // })
        next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
    })

app.use(globalErrorHandler)


// 4) START SERVER

module.exports = app;
