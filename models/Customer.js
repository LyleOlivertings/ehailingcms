import mongoose from 'mongoose';

const CustomerSchema = new mongoose.Schema({
  name: { type: String, required: true },
  phone: { type: String, required: true, unique: true },
  email: String,
  createdAt: { type: Date, default: Date.now },
  notes: String
});

export default mongoose.models.Customer || mongoose.model('Customer', CustomerSchema);