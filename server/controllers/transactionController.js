const Transaction = require('../models/Transaction');
const Budget = require('../models/Budget');
const { Expo } = require('expo-server-sdk');
const User = require('../models/User');

const expo = new Expo();

// Helper: check budget and send push notification
async function checkBudgetAlert(userId, category) {
  const now = new Date();
  const month = now.getMonth() + 1;
  const year = now.getFullYear();

  const budget = await Budget.findOne({ user: userId, category, month, year });
  if (!budget) return;

  const spent = await Transaction.aggregate([
    { $match: { user: userId, category, type: 'debit', date: { $gte: new Date(year, month - 1, 1) } } },
    { $group: { _id: null, total: { $sum: '$amount' } } },
  ]);

  const totalSpent = spent[0]?.total || 0;
  const pct = (totalSpent / budget.limit) * 100;

  const user = await User.findById(userId);
  if (!user.pushToken || !Expo.isExpoPushToken(user.pushToken)) return;

  let message = null;
  if (pct >= 100 && !budget.alerts100Sent) {
    message = { title: `🚨 Budget Exceeded`, body: `You've exceeded your ${category} budget!` };
    budget.alerts100Sent = true;
  } else if (pct >= 90 && !budget.alerts90Sent) {
    message = { title: `⚠️ 90% Budget Used`, body: `You've used 90% of your ${category} budget.` };
    budget.alerts90Sent = true;
  } else if (pct >= 70 && !budget.alerts70Sent) {
    message = { title: `📊 70% Budget Used`, body: `You've used 70% of your ${category} budget.` };
    budget.alerts70Sent = true;
  }

  if (message) {
    await expo.sendPushNotificationsAsync([{ to: user.pushToken, ...message }]);
    await budget.save();
  }
}

// @route POST /api/transactions
exports.createTransaction = async (req, res) => {
  const { amount, type, category, merchantName, merchant, paymentMethod, reason, intentTag, note, date } = req.body;
  const transaction = await Transaction.create({
    user: req.user.id,
    amount, 
    type: type || 'debit', 
    category: category || 'Other', 
    merchant: merchant || merchantName || reason, 
    paymentMethod, 
    reason, 
    intentTag, 
    note, 
    date: date || new Date(),
  });
  if (type === 'debit') await checkBudgetAlert(req.user.id, category);
  res.status(201).json(transaction);
};

// @route GET /api/transactions
exports.getTransactions = async (req, res) => {
  const { page = 1, limit = 20, category, intentTag, startDate, endDate } = req.query;
  const filter = { user: req.user.id };
  if (category) filter.category = category;
  if (intentTag) filter.intentTag = intentTag;
  if (startDate || endDate) {
    filter.date = {};
    if (startDate) filter.date.$gte = new Date(startDate);
    if (endDate) filter.date.$lte = new Date(endDate);
  }
  const transactions = await Transaction.find(filter)
    .sort({ date: -1 })
    .skip((page - 1) * limit)
    .limit(Number(limit));
  const total = await Transaction.countDocuments(filter);
  res.json({ transactions, total, page: Number(page) });
};

// @route GET /api/transactions/:id
exports.getTransaction = async (req, res) => {
  const tx = await Transaction.findOne({ _id: req.params.id, user: req.user.id });
  if (!tx) return res.status(404).json({ message: 'Transaction not found' });
  res.json(tx);
};

// @route PATCH /api/transactions/:id
exports.updateTransaction = async (req, res) => {
  const tx = await Transaction.findOneAndUpdate(
    { _id: req.params.id, user: req.user.id },
    { ...req.body, userCorrected: true },
    { new: true, runValidators: true }
  );
  if (!tx) return res.status(404).json({ message: 'Transaction not found' });
  res.json(tx);
};

// @route DELETE /api/transactions/:id
exports.deleteTransaction = async (req, res) => {
  const tx = await Transaction.findOneAndDelete({ _id: req.params.id, user: req.user.id });
  if (!tx) return res.status(404).json({ message: 'Transaction not found' });
  res.json({ message: 'Transaction deleted' });
};

// @route GET /api/transactions/summary
exports.getSummary = async (req, res) => {
  const now = new Date();
  const start = new Date(now.getFullYear(), now.getMonth(), 1);
  const summary = await Transaction.aggregate([
    { $match: { user: req.user.id, type: 'debit', date: { $gte: start } } },
    { $group: { _id: '$category', total: { $sum: '$amount' }, count: { $sum: 1 } } },
    { $sort: { total: -1 } },
  ]);
  const intentSummary = await Transaction.aggregate([
    { $match: { user: req.user.id, type: 'debit', date: { $gte: start } } },
    { $group: { _id: '$intentTag', total: { $sum: '$amount' } } },
  ]);
  res.json({ categoryBreakdown: summary, intentBreakdown: intentSummary });
};
