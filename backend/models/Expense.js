const mongoose = require('mongoose');

const expenseSchema = new mongoose.Schema({
  vehicle_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Vehicle', required: true },
  liters: { type: Number, required: true },
  cost: { type: Number, required: true }
}, { timestamps: true });

const ExpenseModel = mongoose.model('Expense', expenseSchema);

class Expense {

  static async create(data) {
    const expense = new ExpenseModel(data);
    return await expense.save();
  }

  static async findByVehicle(vehicle_id) {
    return await ExpenseModel.find({ vehicle_id }).sort({ createdAt: -1 });
  }
}

module.exports = Expense;
module.exports.ExpenseModel = ExpenseModel;