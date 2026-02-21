const mongoose = require('mongoose');

const maintenanceSchema = new mongoose.Schema({
  vehicle_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Vehicle', required: true },
  service_type: { type: String, required: true },
  cost: { type: Number, required: true }
}, { timestamps: true });

const MaintenanceModel = mongoose.model('Maintenance', maintenanceSchema);

class Maintenance {

  static async create(data) {
    const record = new MaintenanceModel(data);
    return await record.save();
  }

  static async findByVehicle(vehicle_id) {
    return await MaintenanceModel.find({ vehicle_id }).sort({ createdAt: -1 });
  }

  static async createWithLogic(data) {
    const { VehicleModel } = require('./Vehicle');
    const { vehicle_id, service_type, cost } = data;

    const vehicle = await VehicleModel.findById(vehicle_id);
    if (!vehicle) throw new Error('Vehicle not found');

    const record = await MaintenanceModel.create({ vehicle_id, service_type, cost });

    await VehicleModel.findByIdAndUpdate(vehicle_id, { status: 'in_shop' });

    return record;
  }
}

module.exports = Maintenance;
module.exports.MaintenanceModel = MaintenanceModel;