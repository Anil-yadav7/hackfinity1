const mongoose = require('mongoose');

const BudgetSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    category: {
      type: String,
      enum: ['Food', 'Transport', 'Shopping', 'Entertainment', 'Health', 'Utilities', 'Education', 'Other'],
      required: true,
    },
    limit: { type: Number, required: true },
    month: { type: Number, required: true }, // 1–12
    year: { type: Number, required: true },
    // Alert thresholds already fired (to avoid duplicate notifications)
    alerts70Sent: { type: Boolean, default: false },
    alerts90Sent: { type: Boolean, default: false },
    alerts100Sent: { type: Boolean, default: false },
  },
  { timestamps: true }
);

// Unique per user/category/month/year
BudgetSchema.index({ user: 1, category: 1, month: 1, year: 1 }, { unique: true });

module.exports = mongoose.model('Budget', BudgetSchema);
