const express = require('express');
const router = express.Router();
const vehicleController = require('../controllers/vehicleController');

router.post('/', vehicleController.createVehicle);
router.get('/', vehicleController.getAllVehicles);
router.get('/dashboard/stats', vehicleController.getDashboardStats);
router.get('/:id/fuel-efficiency', vehicleController.getFuelEfficiency);
router.get('/:id/roi', vehicleController.getROI);
router.get('/:id', vehicleController.getVehicleById);
router.put('/:id', vehicleController.updateVehicle);
router.delete('/:id', vehicleController.deleteVehicle);

module.exports = router;