// This is a serverless function handler (or a Node.js module for local server.js)
// It acts as a proxy to bypass CORS restrictions for web scraping.

const fetch = require('node-fetch'); // Import node-fetch for making HTTP requests
const { JSDOM } = require('jsdom'); // NEW: Import JSDOM for HTML parsing

// Ensure this is module.exports = async (req, res) => { ... }
// This exports an asynchronous function that takes req and res as arguments.
module.exports = async (req, res) => {
  // Set CORS headers to allow requests from your frontend
  res.setHeader('Access-Control-Allow-Origin', '*'); // Allow all origins for local dev
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Handle preflight requests (OPTIONS method)
  if (req.method === 'OPTIONS') {
    console.log('[API/SCRAPE] Received OPTIONS preflight request.');
    res.status(200).end();
    return;
  }

  // Ensure it's a POST request
  if (req.method !== 'POST') {
    console.log(`[API/SCRAPE] Received ${req.method} request, expected POST.`);
    return res.status(405).json({ error: 'Method Not Allowed', message: 'Only POST requests are allowed.' });
  }

  // Extract the URL from the request body
  const { url } = req.body;
  console.log('[API/SCRAPE] Received scrape request for URL:', url);

  if (!url) {
    console.error('[API/SCRAPE] Error: URL is missing from request body.');
    return res.status(400).json({ error: 'Bad Request', message: 'URL is required in the request body.' });
  }

  let fullHtmlContent = ''; // Variable to store the full HTML content
  let plainTextContent = ''; // Variable to store the extracted plain text

  try {
    // Attempt to fetch the content from the provided URL
    console.log(`[API/SCRAPE] Attempting to fetch content from: ${url}`);
    const fetchResponse = await fetch(url);
    console.log(`[API/SCRAPE] Fetch response status: ${fetchResponse.status} ${fetchResponse.statusText}`);

    // Check if the fetch was successful (status code 2xx)
    if (!fetchResponse.ok) {
      const errorBody = await fetchResponse.text(); // Get the response body for more info
      console.error(`[API/SCRAPE] Failed to fetch URL: ${fetchResponse.status} ${fetchResponse.statusText}. Response body (first 200 chars): ${errorBody.substring(0, 200)}...`);
      // Return a 500 status with a clear error message to the client
      return res.status(500).json({
        success: false,
        error: 'Failed to scrape content from target URL',
        message: `Status: ${fetchResponse.status} ${fetchResponse.statusText}. Target URL might be down or blocking requests.`
      });
    }

    // Get the full HTML content from the response
    fullHtmlContent = await fetchResponse.text();
    console.log(`[API/SCRAPE] Successfully fetched HTML content. Length: ${fullHtmlContent.length} characters.`);

    // Parse the HTML
    const dom = new JSDOM(fullHtmlContent);
    const document = dom.window.document; // Get the document object

    // Remove script and style tags before extracting text
    document.querySelectorAll('script, style').forEach(el => el.remove());

    // NEW: Remove common non-article elements from Wikipedia pages
    // These are typically navigational, meta, or citation sections
    const selectorsToRemove = [
      '.mw-parser-output .hatnote',           // "For broader coverage..." notes
      '.mw-parser-output .ambox',             // Article message boxes (e.g., "This article needs citations")
      '.mw-editsection',                      // "edit" links next to headings
      '.reflist',                             // References section
      '.mw-references-columns',               // References section in columns
      '.mw-references-wrap',                  // Wrapper for references
      '.mw-cite-backlink',                    // Backlinks from references
      '#toc',                                 // Table of Contents
      '#See_also', '#References', '#Further_reading', '#External_links', // Common section headings by ID
      '.mw-footer',                           // Page footer
      '#catlinks',                            // Category links at the bottom
      '.mw-indicators',                       // Page indicators
      '.mw-jump-link',                        // "Jump to content" links
      '.sidebar',                             // Common sidebar class
      '#siteSub',                             // Wikipedia specific site subtitle
      '#contentSub',                          // Wikipedia specific content subtitle
      '#mw-navigation',                       // Main navigation area
      '#p-lang-btn',                          // Language button
      '#p-namespaces',                        // Namespaces (article, talk)
      '#p-views',                             // View history, edit, etc.
      '#p-personal',                          // Personal tools
      '#p-search',                            // Search box
      '#p-tb',                                // Toolbox
      '#p-coll-print_export'                  // Print/export
    ];

    selectorsToRemove.forEach(selector => {
      document.querySelectorAll(selector).forEach(el => el.remove());
    });

    // Target specific content area for better text extraction
    // For Wikipedia, the main content is typically within <div id="mw-content-text">
    const mainContentDiv = document.getElementById('mw-content-text');

    if (mainContentDiv) {
      // Extract text content from the main content div
      plainTextContent = mainContentDiv.textContent || '';
      plainTextContent = plainTextContent.replace(/(\r\n|\n|\r){2,}/g, '\n\n').trim(); // Normalize whitespace
      console.log(`[API/SCRAPE] Successfully extracted plain text from main content. Length: ${plainTextContent.length} characters.`);
    } else {
      // Fallback to body text content if main content div not found
      plainTextContent = document.body.textContent || '';
      plainTextContent = plainTextContent.replace(/(\r\n|\n|\r){2,}/g, '\n\n').trim();
      console.warn('[API/SCRAPE] Main content div not found, falling back to full body text. Length:', plainTextContent.length);
    }

    // Send the scraped plain text back to the client as JSON
    res.status(200).json({ success: true, fullText: plainTextContent });
    console.log('[API/SCRAPE] Successfully sent scraped plain text as JSON response.');

  } catch (error) {
    // Catch any network errors or other unexpected issues during the fetch or processing
    console.error('[API/SCRAPE] Critical scraping error caught:', error.message);
    // Ensure a JSON error response is always sent, preventing the server from crashing
    res.status(500).json({
      success: false,
      error: 'Internal Server Error during scraping',
      message: `An unexpected error occurred: ${error.message}.`
    });
  }
};
