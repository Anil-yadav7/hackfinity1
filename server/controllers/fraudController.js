const FraudAlert = require('../models/FraudAlert');

// Get all active fraud news/alerts
exports.getLiveFraudNews = async (req, res) => {
  try {
    const alerts = await FraudAlert.find({ active: true }).sort({ createdAt: -1 }).limit(20);
    res.status(200).json({ success: true, count: alerts.length, data: alerts });
  } catch (error) {
    console.error('Error fetching fraud news:', error);
    res.status(500).json({ success: false, message: 'Server error fetching fraud news' });
  }
};

// User reports a community scam
exports.submitScamReport = async (req, res) => {
  try {
    const { title, description } = req.body;
    const userId = req.body.userId || req.user?.id; // fallback for mock
    
    if (!title || !description) {
      return res.status(400).json({ success: false, message: 'Title and description are required' });
    }

    const newAlert = new FraudAlert({
      title,
      description,
      source: 'community',
      reportedBy: userId,
    });

    await newAlert.save();
    res.status(201).json({ success: true, data: newAlert });
  } catch (error) {
    console.error('Error submitting scam report:', error);
    res.status(500).json({ success: false, message: 'Server error submitting report' });
  }
};

// Check budget thresholds - mocked as endpoint for demo but would typically be a middleware/service
exports.checkBudgetThresholds = async (req, res) => {
  try {
    const { totalSpent, budgetLimit, pushToken } = req.body;
    
    // Default mock behavior if not provided
    const spent = totalSpent || 800;
    const limit = budgetLimit || 1000;

    const percentage = (spent / limit) * 100;
    let alertMessage = null;

    if (percentage >= 100) {
      alertMessage = "You have reached 100% of your budget limit!";
    } else if (percentage >= 90) {
      alertMessage = "Warning: You are at 90% of your budget limit.";
    } else if (percentage >= 70) {
      alertMessage = "Heads up: You have spent 70% of your budget.";
    }

    // Send push notification if token exists and an alert is triggered
    if (alertMessage && pushToken) {
      const message = {
        to: pushToken,
        sound: 'default',
        title: 'Budget Alert 🚨',
        body: alertMessage,
        data: { someData: 'budget_alert' },
      };

      await fetch('https://exp.host/--/api/v2/push/send', {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Accept-encoding': 'gzip, deflate',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(message),
      });
      console.log('Sent push notification:', alertMessage);
    }

    res.status(200).json({ success: true, alertTriggered: !!alertMessage, message: alertMessage });
  } catch (error) {
    console.error('Error checking budget:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};
