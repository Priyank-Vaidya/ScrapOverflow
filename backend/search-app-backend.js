// server/index.js
const express = require('express');
const mongoose = require('mongoose');
const axios = require('axios');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Schema
const CacheSchema = new mongoose.Schema({
  query: String,
  results: Object,
  timestamp: { type: Date, default: Date.now }
});

const Cache = mongoose.model('Cache', CacheSchema);

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI);

// Stack Overflow API endpoint
async function searchStackOverflow(query) {
  try {
    const response = await axios.get(
      `https://api.stackexchange.com/2.3/search/advanced`,
      {
        params: {
          site: 'stackoverflow',
          q: query,
          order: 'desc',
          sort: 'relevance',
          key: process.env.STACKOVERFLOW_API_KEY
        }
      }
    );
    return response.data.items;
  } catch (error) {
    console.error('Stack Overflow API error:', error);
    return [];
  }
}

// Reddit API endpoint
async function searchReddit(query) {
  try {
    const response = await axios.get(
      `https://www.reddit.com/search.json`,
      {
        params: {
          q: query,
          sort: 'relevance',
          limit: 10
        }
      }
    );
    return response.data.data.children;
  } catch (error) {
    console.error('Reddit API error:', error);
    return [];
  }
}

// Search endpoint
app.get('/api/search', async (req, res) => {
  const { query } = req.query;

  try {
    // Check cache first
    const cachedResults = await Cache.findOne({
      query,
      timestamp: { $gt: new Date(Date.now() - 24 * 60 * 60 * 1000) } // 24 hour cache
    });

    if (cachedResults) {
      return res.json(cachedResults.results);
    }

    // Fetch new results
    const [stackOverflowResults, redditResults] = await Promise.all([
      searchStackOverflow(query),
      searchReddit(query)
    ]);

    const results = {
      stackoverflow: stackOverflowResults,
      reddit: redditResults
    };

    // Cache results
    await Cache.create({ query, results });

    res.json(results);
  } catch (error) {
    console.error('Search error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Email endpoint
app.post('/api/email', async (req, res) => {
  const { email, results } = req.body;
  // Add your email sending logic here using nodemailer or similar
  res.json({ success: true });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});