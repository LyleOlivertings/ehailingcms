import mongoose from 'mongoose';

const RideSchema = new mongoose.Schema({
  customer: { type: mongoose.Schema.Types.ObjectId, ref: 'Customer', required: true },
  vehicleType: { type: String, required: true },
  passengers: { type: Number, required: true },
  distance: { type: Number, required: true },
  quoteAmount: { type: Number, required: true },
  isPaid: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
  pickupLocation: String,
  dropoffLocation: String,
  status: { type: String, enum: ['pending', 'active', 'completed'], default: 'pending' }
});

export default mongoose.models.Ride || mongoose.model('Ride', RideSchema);