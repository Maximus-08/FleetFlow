const express = require('express');
const cors    = require('cors');
require('dotenv').config();

const connectDB = require('./config/db');
connectDB();

const app = express();

app.use(cors({ origin: '*', credentials: true }));
app.use(express.json({ limit: '10mb' }));

app.get('/api/health', (req, res) => res.json({ status: 'FleetFlow API running ✅' }));

app.use('/api/auth',        require('./routes/authRoutes'));
app.use('/api/vehicles',    require('./routes/vehicleRoutes'));
app.use('/api/drivers',     require('./routes/driverRoutes'));
app.use('/api/trips',       require('./routes/tripRoutes'));
app.use('/api/maintenance', require('./routes/maintenanceRoutes'));
app.use('/api/expenses',    require('./routes/expenseRoutes'));

// Global error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ success: false, message: err.message || 'Server Error' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 FleetFlow API running on http://localhost:${PORT}`));
