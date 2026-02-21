const express = require('express');
const router = express.Router();
const tripController = require('../controllers/tripController');

router.post('/', tripController.createTrip);
router.get('/', tripController.getAllTrips);
router.put('/:id/complete', tripController.completeTrip);
router.get('/:id', tripController.getTripById);

module.exports = router;