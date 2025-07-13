const express = require('express');
const bodyParser = require('body-parser');
const path = require('path'); // Although not strictly used in this simplified version, good to keep
const scrapeHandler = require('./api/scrape'); // Import your serverless function

const app = express();
const PORT = process.env.PORT || 3001; // Use a different port than Parcel's default 1234

// Middleware to parse JSON request bodies
app.use(bodyParser.json());

// Set CORS headers for all responses from this server
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*'); // Allow all origins for local dev
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  next();
});

// Route for your API endpoint
// This mimics how Vercel routes /api/scrape to your scrape.js handler
app.post('/api/scrape', async (req, res) => {
  // The scrapeHandler expects req and res objects similar to Vercel's environment
  // Ensure req.body is available as it would be from Vercel
  await scrapeHandler(req, res);
});

// Start the server and listen on the specified port
try {
  app.listen(PORT, () => {
    console.log(`API server running on http://localhost:${PORT}`);
    console.log(`Your frontend will run on Parcel's port (e.g., 1234)`);
  });
} catch (error) {
  console.error('Failed to start API server:', error.message);
  console.error('Check if all dependencies (express, body-parser, node-fetch) are installed.');
  console.error('Run `pnpm install` in your project root.');
}
