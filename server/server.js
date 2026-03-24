require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
const authRoutes = require('./routes/authRoutes');
const aiRoutes = require('./routes/aiRoutes');
const fraudRoutes = require('./routes/fraudRoutes');
const transactionRoutes = require('./routes/transactionRoutes');

app.use('/api/auth', authRoutes);
app.use('/api/insights', aiRoutes);
app.use('/api/fraud', fraudRoutes);
app.use('/api/transactions', transactionRoutes);

// Simple health check route
app.get('/', (req, res) => {
  res.send('SpendIQ API is running');
});

// Database connection & Server start
const PORT = process.env.PORT || 5000;
let MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/spendiq';

async function startServer() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('Connected to local/remote MongoDB');
  } catch (err) {
    console.log('Failed to connect to primary MongoDB. Starting in-memory MongoDB...');
    try {
      const { MongoMemoryServer } = require('mongodb-memory-server');
      const mongoServer = await MongoMemoryServer.create();
      MONGO_URI = mongoServer.getUri();
      await mongoose.connect(MONGO_URI);
      console.log('Connected to In-Memory MongoDB');
    } catch (inMemErr) {
      console.error('MongoDB connection error:', inMemErr);
      return;
    }
  }

  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

startServer();
