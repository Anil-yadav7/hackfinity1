const Transaction = require('../models/Transaction');
const { GoogleGenAI } = require('@google/genai');

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || 'mock-key' });

exports.generateInsights = async (req, res) => {
  try {
    const userId = req.body.userId || req.user?.id;
    
    let transactions = [];
    if (userId) {
      transactions = await Transaction.find({ user: userId }).limit(100);
    } else {
      transactions = [
        { category: 'Food', amount: 45.00, reason: 'Dinner out' },
        { category: 'Transport', amount: 20.00, reason: 'Uber' },
        { category: 'Entertainment', amount: 100.00, reason: 'Concert tickets' },
        { category: 'Shopping', amount: 60.00, reason: 'New shoes' },
        { category: 'Food', amount: 15.00, reason: 'Coffee' }
      ];
    }
    
    const categoryTotals = transactions.reduce((acc, curr) => {
      acc[curr.category] = (acc[curr.category] || 0) + curr.amount;
      return acc;
    }, {});
    
    const promptText = `
      Please act as a financial advisor. Here is a summary of the user's recent spending by category:
      ${JSON.stringify(categoryTotals)}
      
      Generate a personalized 3-sentence insight about their spending habits, and explicitly identify the top 3 avoidable cost categories based on this data. Format the response as a JSON array with two keys: "insight" (a string of exactly 3 sentences) and "avoidableCategories" (an array of 3 strings).
    `;

    let aiResponse;
    if (process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY !== 'mock-key') {
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: promptText,
      });
      try {
        const rawText = response.text.replace(/```json/g, '').replace(/```/g, '');
        aiResponse = JSON.parse(rawText);
      } catch (e) {
         aiResponse = {
           insight: "Your spending is heavily skewed towards discretionary categories like Food and Entertainment. Consider cooking at home more often to reduce food costs. Setting a strict monthly budget for shopping and entertainment could help you save more.",
           avoidableCategories: ["Food", "Entertainment", "Shopping"]
         };
      }
    } else {
      aiResponse = {
        insight: "Your spending is heavily skewed towards discretionary categories like Food and Entertainment. Consider cooking at home more often to reduce food costs. Setting a strict monthly budget for shopping and entertainment could help you save more.",
        avoidableCategories: ["Food", "Entertainment", "Shopping"]
      };
    }

    const donutData = Object.keys(categoryTotals).map((cat, index) => ({
      name: cat,
      population: categoryTotals[cat],
      color: getCategoryColor(cat),
      legendFontColor: "#7F7F7F",
      legendFontSize: 13
    }));

    res.status(200).json({
      success: true,
      data: {
        chartData: donutData,
        insight: aiResponse.insight,
        avoidableCategories: aiResponse.avoidableCategories
      }
    });

  } catch (error) {
    console.error('AI Insight Error:', error);
    res.status(500).json({ success: false, message: 'Failed to generate insights' });
  }
};

function getCategoryColor(category) {
  const colors = {
    'Food': '#f87171',
    'Transport': '#60a5fa',
    'Utilities': '#fbbf24',
    'Entertainment': '#c084fc',
    'Shopping': '#34d399',
    'Other': '#94a3b8'
  };
  return colors[category] || colors['Other'];
}

exports.parseSms = async (req, res) => {
  try {
    const { smsText } = req.body;
    if (!smsText) {
      return res.status(400).json({ success: false, message: 'smsText is required' });
    }

    let parsedData;

    // mock-key fallback
    if (!process.env.GEMINI_API_KEY || process.env.GEMINI_API_KEY === 'mock-key' || process.env.GEMINI_API_KEY.includes('dummy')) {
      const amountMatch = smsText.match(/\$?(\d+\.\d{2})/);
      const amount = amountMatch ? parseFloat(amountMatch[1]) : 15.99;
      
      let merchant = "Unknown Merchant";
      const atMatch = smsText.match(/at\s+([A-Za-z0-9\s]+?)(?:on|\.|$)/i);
      if (atMatch) merchant = atMatch[1].trim();

      parsedData = {
        amount,
        merchant,
        category: 'Shopping',
        reason: 'Parsed from text message'
      };
    } else {
      const promptText = `
        Parse this financial SMS or transaction notification and extract:
        1. amount (number)
        2. merchant (string)
        3. category (choose strictly from: 'Food', 'Transport', 'Utilities', 'Entertainment', 'Shopping', 'Other')
        4. reason (a short 2-3 word summary)
        
        SMS Text: "${smsText}"
        
        Return ONLY valid JSON with keys: amount, merchant, category, reason.
      `;
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: promptText,
      });
      const rawText = response.text.replace(/```json/g, '').replace(/```/g, '');
      parsedData = JSON.parse(rawText);
    }

    const mongoose = require('mongoose');
    const userId = req.body.userId || req.user?.id || new mongoose.Types.ObjectId();

    let transaction;
    try {
       transaction = await Transaction.create({
         user: userId,
         amount: parsedData.amount,
         merchant: parsedData.merchant || 'Unknown',
         category: parsedData.category || 'Other',
         reason: parsedData.reason || 'Parsed from SMS',
         date: new Date()
       });
    } catch(dbErr) {
       transaction = { ...parsedData, _id: new mongoose.Types.ObjectId(), date: new Date() };
    }

    res.status(200).json({ success: true, data: transaction });

  } catch (error) {
    console.error('AI SMS Parse Error:', error);
    res.status(500).json({ success: false, message: 'Failed to parse SMS' });
  }
};
