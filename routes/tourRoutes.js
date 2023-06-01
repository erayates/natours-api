const express = require('express');
const tourController = require('../controllers/tourController');
const authController = require('../controllers/authController');


const router = express.Router();


// router.param('id', tourController.checkID)

// Create a checkBody middleware
// Check if body contains the name and price property
// If not, send back 400 (bad request)
// Add it to the post handler stack


// Routes
router
    .route('/top-5-cheap')
    .get(tourController.aliasTopTours, tourController.getAllTours)
    

router.route('/monthly-plan/:year').get(tourController.getMonthlyPlan);



router
    .route('/tour-stats')
    .get(tourController.getTourStats)

router
    .route('/')
    .get(authController.protect, tourController.getAllTours)
    .post(tourController.createTour) // This is a middleware stack (chaining multiple middleware functions) // tourController.checkBody deleted.
    // First tourController.checkBody is executed, then tourController.createTour
    // If tourController.checkBody returns next(), then tourController.createTour is executed
    

router
    .route('/:id')
    .get(tourController.getTour)
    .patch(tourController.updateTour)
    .delete(tourController.deleteTour)

module.exports = router;