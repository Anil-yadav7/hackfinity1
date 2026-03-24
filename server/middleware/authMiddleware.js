const jwt = require('jsonwebtoken');
const User = require('../models/User');
const mongoose = require('mongoose');

const protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return res.status(401).json({ message: 'Not authorized — no token provided' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback_secret');
    const userId = decoded.userId || decoded.id; // support both token formats
    req.user = await User.findById(userId).select('-password');
    
    // Auto-heal session if in-memory database wiped the user on restart!
    if (!req.user) {
        req.user = await User.create({ 
            _id: new mongoose.Types.ObjectId(userId), 
            name: 'Demo User', 
            email: `${userId}@demo.com`, 
            password: 'autohealed' 
        });
    }
    
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Not authorized — invalid or expired token' });
  }
};

module.exports = protect;
