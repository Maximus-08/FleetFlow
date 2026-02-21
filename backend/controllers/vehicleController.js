const Vehicle = require('../models/Vehicle');
const { isEmpty, isPositiveNumber, sendSuccess, sendError } = require('../utils/helpers');

exports.createVehicle = async (req, res) => {
  try {
    const { name, license_plate, max_capacity, acquisition_cost } = req.body;

    // Basic validation
    if (isEmpty(name) || isEmpty(license_plate)) {
      return sendError(res, "Name and license plate are required", 400);
    }

    if (!isPositiveNumber(max_capacity)) {
      return sendError(res, "Max capacity must be a positive number", 400);
    }

    const vehicle = await Vehicle.create(req.body);

    return sendSuccess(res, vehicle, "Vehicle created successfully", 201);

  } catch (error) {
    return sendError(res, error.message);
  }
};

exports.getAllVehicles = async (req, res) => {
  try {
    const vehicles = await Vehicle.findAll();
    res.json(vehicles);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getVehicleById = async (req, res) => {
  try {
    const vehicle = await Vehicle.findById(req.params.id);
    res.json(vehicle);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.updateVehicle = async (req, res) => {
  try {
    const updated = await Vehicle.update(req.params.id, req.body);
    res.json(updated);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.deleteVehicle = async (req, res) => {
  try {
    await Vehicle.delete(req.params.id);
    res.json({ message: "Vehicle deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getDashboardStats = async (req, res) => {
  try {
    const stats = await Vehicle.getDashboardStats();
    return sendSuccess(res, stats);
  } catch (error) {
    return sendError(res, error.message);
  }
};
exports.getFuelEfficiency = async (req, res) => {
  try {
    const data = await Vehicle.getFuelEfficiency(req.params.id);
    return sendSuccess(res, data);
  } catch (error) {
    return sendError(res, error.message);
  }
};
exports.getROI = async (req, res) => {
  try {
    const data = await Vehicle.getROI(req.params.id);
    return sendSuccess(res, data);
  } catch (error) {
    return sendError(res, error.message);
  }
};