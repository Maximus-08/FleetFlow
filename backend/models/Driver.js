const mongoose = require('mongoose');

const driverSchema = new mongoose.Schema({
  name: { type: String, required: true },
  license_number: { type: String, required: true, unique: true },
  license_expiry: { type: Date, required: true },
  duty_status: {
    type: String,
    enum: ['off_duty', 'on_duty', 'suspended'],
    default: 'off_duty'
  },
  safety_score: { type: Number, default: 100 }
}, { timestamps: true });

const DriverModel = mongoose.model('Driver', driverSchema);

class Driver {

  static async create(data) {
    const driver = new DriverModel(data);
    return await driver.save();
  }

  static async findAll() {
    return await DriverModel.find().sort({ createdAt: -1 });
  }

  static async findById(id) {
    return await DriverModel.findById(id);
  }

  static async update(id, data) {
    return await DriverModel.findByIdAndUpdate(id, data, { new: true });
  }

  static async delete(id) {
    await DriverModel.findByIdAndDelete(id);
    return true;
  }

  static async getPerformance(driver_id) {
    const TripModel = mongoose.model('Trip');

    const totalTrips = await TripModel.countDocuments({ driver_id });
    const completedTrips = await TripModel.countDocuments({ driver_id, status: 'completed' });

    const completionRate = totalTrips === 0
      ? 0
      : ((completedTrips / totalTrips) * 100).toFixed(2);

    return { totalTrips, completedTrips, completionRate };
  }
}

module.exports = Driver;
module.exports.DriverModel = DriverModel;