  import React, { useState } from 'react';

  const App = () => {
    const [blogUrl, setBlogUrl] = useState('');
    const [summary, setSummary] = useState('');
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');
    const [isMessageModalOpen, setIsMessageModalOpen] = useState(false);

    // Function to show a custom message modal
    const showMessage = (msg) => {
      setMessage(msg);
      setIsMessageModalOpen(true);
    };

    // Function to close the custom message modal
    const closeMessageModal = () => {
      setIsMessageModalOpen(false);
      setMessage('');
    };

    // Function to handle summary generation (will be expanded later)
    const handleSummarize = () => {
      if (blogUrl.trim() === '') {
        showMessage("Please enter a blog URL.");
        return;
      }
      // Simulate loading for now
      setLoading(true);
      setSummary(''); // Clear previous summary

      // In a later phase, this will involve fetching content and calling an LLM
      setTimeout(() => {
        setSummary("This is a simulated summary of the blog post. In the next steps, we will integrate actual text scraping and AI summarization.");
        setLoading(false);
      }, 2000); // Simulate a 2-second delay
    };

    return (
      <div className="min-h-screen bg-gray-900 text-gray-100 flex items-center justify-center p-4 font-inter">
        <div className="w-full max-w-lg bg-gray-800 rounded-xl shadow-lg p-6 space-y-6 md:p-8">
          <h1 className="text-3xl md:text-4xl font-bold text-center text-purple-400 mb-6">
            Blog Summariser
          </h1>

          {/* URL Input Section */}
          <div className="space-y-4">
            <label htmlFor="blog-url-input" className="block text-sm font-medium text-gray-300">
              Enter Blog URL:
            </label>
            <input
              id="blog-url-input"
              type="url" // Use type="url" for better mobile keyboard
              value={blogUrl}
              onChange={(e) => setBlogUrl(e.target.value)}
              placeholder="e.g., https://example.com/blog-post"
              className="flex h-10 w-full rounded-md border border-gray-700 bg-gray-900 px-3 py-2 text-sm placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent disabled:cursor-not-allowed disabled:opacity-50 text-gray-200"
              disabled={loading}
            />
            <button
              onClick={handleSummarize}
              className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-500 focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-gray-900 bg-purple-600 text-white hover:bg-purple-700 h-10 px-4 py-2 w-full shadow-md"
              disabled={loading}
            >
              {loading ? 'Summarising...' : 'Summarise Blog'}
            </button>
          </div>

          {/* Summary Display Section */}
          {loading && (
            <div className="text-center text-gray-400 mt-6">
              Fetching and summarising, please wait...
            </div>
          )}

          {!loading && summary && (
            <div className="space-y-4 mt-6">
              <h2 className="text-xl font-semibold text-gray-200 text-center mb-2">Summary:</h2>
              <div className="rounded-lg border border-gray-700 bg-gray-900 p-4 shadow-sm">
                <p className="text-gray-300 leading-relaxed">{summary}</p>
              </div>
            </div>
          )}

          {/* Message Modal */}
          {isMessageModalOpen && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
              <div className="bg-gray-800 rounded-lg p-6 shadow-xl max-w-sm w-full space-y-4">
                <h3 className="text-lg font-semibold text-gray-100">Notification</h3>
                <p className="text-gray-300">{message}</p>
                <button
                  onClick={closeMessageModal}
                  className="w-full inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-500 focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-gray-900 bg-purple-600 text-white hover:bg-purple-700 h-10 px-4 py-2 shadow-md"
                >
                  OK
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  };

  export default App;
