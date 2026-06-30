import mongoose from 'mongoose';

const competitorSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please add a competitor name'],
      unique: true,
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Please add a description'],
    },
    marketShare: {
      type: Number,
      required: true,
      default: 0,
    },
    revenue: {
      type: Number, // In millions
      required: true,
      default: 0,
    },
    businessModel: {
      type: String,
      required: true,
      enum: ['Direct Sales', 'Machinery-as-a-Service', 'B2G', 'Subscription', 'Hybrid'],
    },
    adoptionMetrics: {
      activeFarmers: { type: Number, default: 0 },
      acreageCovered: { type: Number, default: 0 }, // In acres/hectares
    },
    techStack: {
      type: [String], // Array of strings (e.g., ['IoT', 'Drones', 'AI'])
      default: [],
    },
  },
  {
    timestamps: true, // Automatically creates createdAt and updatedAt fields
  }
);

const Competitor = mongoose.model('Competitor', competitorSchema);
export default Competitor;