const Expense = require('../models/Expense');
const { isEmpty, isPositiveNumber, sendSuccess, sendError } = require('../utils/helpers');

exports.createExpense = async (req, res) => {
  try {
    const { vehicle_id, liters, cost } = req.body;

    if (isEmpty(vehicle_id)) {
      return sendError(res, "Vehicle ID is required", 400);
    }

    if (!isPositiveNumber(liters) || !isPositiveNumber(cost)) {
      return sendError(res, "Liters and cost must be positive numbers", 400);
    }

    const expense = await Expense.create(req.body);

    return sendSuccess(res, expense, "Expense recorded successfully", 201);

  } catch (error) {
    return sendError(res, error.message);
  }
};

exports.getVehicleExpenses = async (req, res) => {
  try {
    const expenses = await Expense.findByVehicle(req.params.vehicle_id);
    res.json(expenses);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};