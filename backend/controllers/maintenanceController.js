const Maintenance = require('../models/Maintenance');
const { isEmpty, isPositiveNumber, sendSuccess, sendError } = require('../utils/helpers');

exports.createMaintenance = async (req, res) => {
  try {
    const { vehicle_id, cost } = req.body;

    if (isEmpty(vehicle_id)) {
      return sendError(res, "Vehicle ID is required", 400);
    }

    if (!isPositiveNumber(cost)) {
      return sendError(res, "Cost must be positive", 400);
    }

    const record = await Maintenance.create(req.body);

    return sendSuccess(res, record, "Maintenance record added", 201);

  } catch (error) {
    return sendError(res, error.message);
  }
};

exports.getVehicleMaintenance = async (req, res) => {
  try {
    const records = await Maintenance.findByVehicle(req.params.vehicle_id);
    res.json(records);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.createMaintenance = async (req, res) => {
  try {
    const record = await Maintenance.createWithLogic(req.body);
    return sendSuccess(res, record, "Maintenance added", 201);
  } catch (error) {
    return sendError(res, error.message, 400);
  }
};