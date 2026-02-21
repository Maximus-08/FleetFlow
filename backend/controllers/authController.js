const jwt      = require('jsonwebtoken');
const bcrypt   = require('bcryptjs');
const mongoose = require('mongoose');

/* ── User schema ── */
const userSchema = new mongoose.Schema({
  firstName: { type: String, required: true, trim: true },
  lastName:  { type: String, required: true, trim: true },
  email:     { type: String, required: true, unique: true, lowercase: true },
  password:  { type: String, required: true, select: false },
  role:      { type: String, default: 'Fleet Administrator' },
  phone:     { type: String, default: '' },
}, { timestamps: true });

const User = mongoose.models.User || mongoose.model('User', userSchema);

function signToken(user) {
  return jwt.sign(
    { id: user._id, email: user.email, role: user.role },
    process.env.JWT_SECRET || 'fleetflow_secret_key',
    { expiresIn: '7d' }
  );
}

/* POST /api/auth/register */
exports.register = async (req, res) => {
  try {
    const { firstName, lastName, email, password, role, phone } = req.body;
    if (!firstName || !lastName || !email || !password)
      return res.status(400).json({ success: false, message: 'All fields are required' });
    if (password.length < 6)
      return res.status(400).json({ success: false, message: 'Password must be at least 6 characters' });

    const existing = await User.findOne({ email });
    if (existing)
      return res.status(409).json({ success: false, message: 'Email already registered' });

    const hashed = await bcrypt.hash(password, 12);
    const user   = await User.create({ firstName, lastName, email, password: hashed, role, phone });
    const token  = signToken(user);

    return res.status(201).json({
      success: true, message: 'Account created successfully', token,
      user: { id: user._id, firstName: user.firstName, lastName: user.lastName, email: user.email, role: user.role, phone: user.phone }
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

/* POST /api/auth/login */
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password)
      return res.status(400).json({ success: false, message: 'Email and password are required' });

    const user = await User.findOne({ email }).select('+password');
    if (!user) return res.status(401).json({ success: false, message: 'Invalid email or password' });

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(401).json({ success: false, message: 'Invalid email or password' });

    const token = signToken(user);
    return res.json({
      success: true, message: 'Login successful', token,
      user: { id: user._id, firstName: user.firstName, lastName: user.lastName, email: user.email, role: user.role, phone: user.phone }
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

/* GET /api/auth/me */
exports.getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });
    return res.json({ success: true, user });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

/* PUT /api/auth/profile */
exports.updateProfile = async (req, res) => {
  try {
    const { firstName, lastName, phone, role } = req.body;
    const updated = await User.findByIdAndUpdate(req.user.id, { firstName, lastName, phone, role }, { new: true, runValidators: true });
    return res.json({ success: true, message: 'Profile updated', user: updated });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};
