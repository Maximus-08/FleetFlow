const mongoose = require('mongoose');

const tripSchema = new mongoose.Schema({
  vehicle_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Vehicle', required: true },
  driver_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Driver', required: true },
  cargo_weight: { type: Number, required: true },
  revenue: { type: Number, default: 0 },
  status: {
    type: String,
    enum: ['dispatched', 'completed', 'cancelled'],
    default: 'dispatched'
  },
  start_odometer: { type: Number, default: 0 },
  end_odometer: { type: Number, default: 0 }
}, { timestamps: true });

const TripModel = mongoose.model('Trip', tripSchema);

class Trip {

  static async findAll() {
    return await TripModel.find().sort({ createdAt: -1 })
      .populate('vehicle_id', 'name license_plate')
      .populate('driver_id', 'name license_number');
  }

  static async findById(id) {
    return await TripModel.findById(id)
      .populate('vehicle_id')
      .populate('driver_id');
  }

  static async createWithLogic(data) {
    const { VehicleModel } = require('./Vehicle');
    const { DriverModel } = require('./Driver');

    const { vehicle_id, driver_id, cargo_weight, revenue } = data;

    // 1. Check vehicle
    const vehicle = await VehicleModel.findById(vehicle_id);
    if (!vehicle) throw new Error('Vehicle not found');
    if (vehicle.status === 'in_shop') throw new Error('Vehicle is under maintenance');
    if (vehicle.status !== 'available') throw new Error('Vehicle is not available');
    if (cargo_weight > vehicle.max_capacity) throw new Error('Cargo exceeds vehicle capacity');

    // 2. Check driver
    const driver = await DriverModel.findById(driver_id);
    if (!driver) throw new Error('Driver not found');
    if (driver.duty_status !== 'off_duty') throw new Error('Driver is not available');

    if (new Date(driver.license_expiry) < new Date()) {
      await DriverModel.findByIdAndUpdate(driver_id, { duty_status: 'suspended' });
      throw new Error('Driver license expired. Driver suspended.');
    }

    // 3. Create trip
    const trip = await TripModel.create({
      vehicle_id,
      driver_id,
      cargo_weight,
      revenue: revenue || 0,
      start_odometer: vehicle.odometer,
      status: 'dispatched'
    });

    // 4. Update vehicle + driver
    await VehicleModel.findByIdAndUpdate(vehicle_id, { status: 'on_trip' });
    await DriverModel.findByIdAndUpdate(driver_id, { duty_status: 'on_duty' });

    return trip;
  }

  static async completeTrip(trip_id, end_odometer) {
    const { VehicleModel } = require('./Vehicle');
    const { DriverModel } = require('./Driver');

    const trip = await TripModel.findById(trip_id);
    if (!trip) throw new Error('Trip not found');
    if (trip.status !== 'dispatched') throw new Error('Trip is not active');

    await TripModel.findByIdAndUpdate(trip_id, { status: 'completed', end_odometer });
    await VehicleModel.findByIdAndUpdate(trip.vehicle_id, { status: 'available', odometer: end_odometer });
    await DriverModel.findByIdAndUpdate(trip.driver_id, { duty_status: 'off_duty' });

    return { message: 'Trip completed successfully' };
  }
}

module.exports = Trip;
module.exports.TripModel = TripModel;