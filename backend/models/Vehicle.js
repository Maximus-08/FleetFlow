const mongoose = require('mongoose');

const vehicleSchema = new mongoose.Schema({
  name: { type: String, required: true },
  license_plate: { type: String, required: true, unique: true },
  max_capacity: { type: Number, required: true },
  acquisition_cost: { type: Number, default: 0 },
  status: {
    type: String,
    enum: ['available', 'on_trip', 'in_shop'],
    default: 'available'
  },
  odometer: { type: Number, default: 0 }
}, { timestamps: true });

const VehicleModel = mongoose.model('Vehicle', vehicleSchema);

class Vehicle {

  static async create(data) {
    const vehicle = new VehicleModel(data);
    return await vehicle.save();
  }

  static async findAll() {
    return await VehicleModel.find().sort({ createdAt: -1 });
  }

  static async findById(id) {
    return await VehicleModel.findById(id);
  }

  static async update(id, data) {
    return await VehicleModel.findByIdAndUpdate(id, data, { new: true });
  }

  static async delete(id) {
    await VehicleModel.findByIdAndDelete(id);
    return true;
  }

  static async getDashboardStats() {
    const totalVehicles = await VehicleModel.countDocuments();
    const activeFleet = await VehicleModel.countDocuments({ status: 'on_trip' });
    const maintenanceAlerts = await VehicleModel.countDocuments({ status: 'in_shop' });

    const utilizationRate = totalVehicles === 0
      ? 0
      : ((activeFleet / totalVehicles) * 100).toFixed(2);

    return { totalVehicles, activeFleet, maintenanceAlerts, utilizationRate };
  }

  static async getFuelEfficiency(vehicle_id) {
    const ExpenseModel = mongoose.model('Expense');
    const TripModel = mongoose.model('Trip');

    const distanceAgg = await TripModel.aggregate([
      { $match: { vehicle_id: new mongoose.Types.ObjectId(vehicle_id), status: 'completed' } },
      { $group: { _id: null, total: { $sum: { $subtract: ['$end_odometer', '$start_odometer'] } } } }
    ]);

    const fuelAgg = await ExpenseModel.aggregate([
      { $match: { vehicle_id: new mongoose.Types.ObjectId(vehicle_id) } },
      { $group: { _id: null, totalLiters: { $sum: '$liters' } } }
    ]);

    const distance = distanceAgg[0]?.total || 0;
    const liters = fuelAgg[0]?.totalLiters || 0;
    const fuelEfficiency = liters === 0 ? 0 : (distance / liters).toFixed(2);

    return { totalDistance: distance, totalFuelUsed: liters, fuelEfficiency };
  }

  static async getROI(vehicle_id) {
    const ExpenseModel = mongoose.model('Expense');
    const MaintenanceModel = mongoose.model('Maintenance');
    const TripModel = mongoose.model('Trip');

    const vid = new mongoose.Types.ObjectId(vehicle_id);

    const revenueAgg = await TripModel.aggregate([
      { $match: { vehicle_id: vid, status: 'completed' } },
      { $group: { _id: null, total: { $sum: '$revenue' } } }
    ]);

    const fuelAgg = await ExpenseModel.aggregate([
      { $match: { vehicle_id: vid } },
      { $group: { _id: null, total: { $sum: '$cost' } } }
    ]);

    const maintAgg = await MaintenanceModel.aggregate([
      { $match: { vehicle_id: vid } },
      { $group: { _id: null, total: { $sum: '$cost' } } }
    ]);

    const vehicle = await VehicleModel.findById(vehicle_id);

    const revenue = revenueAgg[0]?.total || 0;
    const fuelCost = fuelAgg[0]?.total || 0;
    const maintenanceCost = maintAgg[0]?.total || 0;
    const acquisitionCost = vehicle?.acquisition_cost || 1;

    const roi = ((revenue - (fuelCost + maintenanceCost)) / acquisitionCost).toFixed(2);

    return { revenue, fuelCost, maintenanceCost, roi };
  }
}

module.exports = Vehicle;
module.exports.VehicleModel = VehicleModel;