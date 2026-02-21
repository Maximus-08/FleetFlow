const Trip = require('../models/Trip');
const { sendSuccess, sendError, isEmpty, isPositiveNumber } = require('../utils/helpers');

exports.createTrip = async (req, res) => {
  try {
    const { vehicle_id, driver_id, cargo_weight } = req.body;

    if (isEmpty(vehicle_id) || isEmpty(driver_id)) {
      return sendError(res, "Vehicle and Driver are required", 400);
    }

    if (!isPositiveNumber(cargo_weight)) {
      return sendError(res, "Cargo weight must be positive", 400);
    }

    const trip = await Trip.createWithLogic(req.body);

    return sendSuccess(res, trip, "Trip dispatched successfully", 201);

  } catch (error) {
    return sendError(res, error.message, 400);
  }
};

exports.getAllTrips = async (req, res) => {
  try {
    const trips = await Trip.findAll();
    res.json(trips);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getTripById = async (req, res) => {
  try {
    const trip = await Trip.findById(req.params.id);
    res.json(trip);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.completeTrip = async (req, res) => {
  try {
    const { end_odometer } = req.body;

    if (!end_odometer) {
      return sendError(res, "End odometer required", 400);
    }

    const result = await Trip.completeTrip(
      req.params.id,
      end_odometer
    );

    return sendSuccess(res, result);

  } catch (error) {
    return sendError(res, error.message, 400);
  }
};