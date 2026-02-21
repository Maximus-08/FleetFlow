const express = require('express');
const router = express.Router();
const expenseController = require('../controllers/expenseController');

// Add expense (fuel log)
router.post('/', expenseController.createExpense);

// Get expenses by vehicle
router.get('/:vehicle_id', expenseController.getVehicleExpenses);

module.exports = router;