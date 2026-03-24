const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  amount: {
    type: Number,
    required: true
  },
  date: {
    type: Date,
    default: Date.now,
    required: true
  },
  merchant: {
    type: String,
    required: true,
    trim: true
  },
  category: {
    type: String,
    required: true,
    enum: ['Food', 'Transport', 'Utilities', 'Entertainment', 'Shopping', 'Other'],
    default: 'Other'
  },
  reason: {
    type: String,
    required: true,
    trim: true,
  },
  type: {
    type: String,
    enum: ['debit', 'credit'],
    default: 'debit'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Indexes for faster querying
transactionSchema.index({ user: 1, date: -1 });

module.exports = mongoose.model('Transaction', transactionSchema);
