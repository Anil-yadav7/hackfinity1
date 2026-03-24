const mongoose = require('mongoose');

const fraudAlertSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  source: { type: String, enum: ['system', 'community'], default: 'system' },
  reportedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  upvotes: { type: Number, default: 0 },
  active: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('FraudAlert', fraudAlertSchema);
