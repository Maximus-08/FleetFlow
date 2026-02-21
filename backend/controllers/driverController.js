const Driver = require('../models/Driver');
const { isEmpty, isValidDate, sendSuccess, sendError } = require('../utils/helpers');

exports.createDriver = async (req, res) => {
  try {
    const { name, license_number, license_expiry } = req.body;

    if (isEmpty(name) || isEmpty(license_number)) {
      return sendError(res, "Name and license number are required", 400);
    }

    if (!isValidDate(license_expiry)) {
      return sendError(res, "Invalid license expiry date", 400);
    }

    const driver = await Driver.create(req.body);

    return sendSuccess(res, driver, "Driver created successfully", 201);

  } catch (error) {
    return sendError(res, error.message);
  }
};

exports.getAllDrivers = async (req, res) => {
  try {
    const drivers = await Driver.findAll();
    res.json(drivers);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getDriverById = async (req, res) => {
  try {
    const driver = await Driver.findById(req.params.id);
    res.json(driver);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.updateDriver = async (req, res) => {
  try {
    const updated = await Driver.update(req.params.id, req.body);
    res.json(updated);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.deleteDriver = async (req, res) => {
  try {
    await Driver.delete(req.params.id);
    res.json({ message: "Driver deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getDriverPerformance = async (req, res) => {
  try {
    const stats = await Driver.getPerformance(req.params.id);
    return sendSuccess(res, stats);
  } catch (error) {
    return sendError(res, error.message);
  }
};