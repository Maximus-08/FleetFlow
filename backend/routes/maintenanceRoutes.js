const express = require('express');
const router = express.Router();
const maintenanceController = require('../controllers/maintenanceController');

// Add maintenance record
router.post('/', maintenanceController.createMaintenance);

// Get maintenance by vehicle
router.get('/:vehicle_id', maintenanceController.getVehicleMaintenance);

module.exports = router;