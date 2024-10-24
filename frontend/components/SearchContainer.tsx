"use client";

import React, { useState } from 'react';

// Interface definitions for the API responses
interface StackOverflowItem {
  question_id: string;
  title: string;
  link: string;
  score: number;
  answer_count: number;
  creation_date: number;
}

interface RedditItem {
  data: {
    id: string;
    title: string;
    permalink: string;
    score: number;
    num_comments: number;
    created_utc: number;
  }
}

interface SearchResults {
  stackoverflow: StackOverflowItem[];
  reddit: RedditItem[];
}

const SearchContainer = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResults>({ stackoverflow: [], reddit: [] });
  const [loading, setLoading] = useState(false);
  const [sortBy, setSortBy] = useState<'relevance' | 'date' | 'score'>('relevance');
  
  // Enhanced email state
  const [email, setEmail] = useState('');
  const [emailStatus, setEmailStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');
  const [emailError, setEmailError] = useState('');

  const handleSearch = async () => {
    setLoading(true);
    try {
      const response = await fetch(`http://localhost:5000/api/search?query=${encodeURIComponent(query)}`);
      const data = await response.json();
      setResults(data);
    } catch (error) {
      console.error('Search error:', error);
    }
    setLoading(false);
  };

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleEmail = async () => {
    // Reset states
    setEmailStatus('idle');
    setEmailError('');

    // Validate email
    if (!validateEmail(email)) {
      setEmailStatus('error');
      setEmailError('Please enter a valid email address');
      return;
    }

    // Validate results
    if (!results.stackoverflow.length && !results.reddit.length) {
      setEmailStatus('error');
      setEmailError('No results to send. Please perform a search first.');
      return;
    }

    setEmailStatus('sending');
    
    try {
      const response = await fetch('http://localhost:5000/api/email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, results })
      });

      if (!response.ok) {
        throw new Error('Failed to send email');
      }

      setEmailStatus('success');
      setEmail(''); // Clear email after successful send
    } catch (error) {
      console.error('Email error:', error);
      setEmailStatus('error');
      setEmailError('Failed to send email. Please try again.');
    }
  };

  const getTimestamp = (item: StackOverflowItem | RedditItem): number => {
    if ('creation_date' in item) {
      return item.creation_date;
    }
    return item.data.created_utc;
  };

  const sortResults = (platform: keyof SearchResults) => {
    const sorted = [...results[platform]].sort((a, b) => {
      if (sortBy === 'date') {
        return getTimestamp(b) - getTimestamp(a);
      }
      // For score sorting
      const scoreA = 'score' in a ? a.score : a.data.score;
      const scoreB = 'score' in b ? b.score : b.data.score;
      return scoreB - scoreA;
    });
    setResults({ ...results, [platform]: sorted });
  };

  return (
    <div className="container mx-auto max-w-6xl">
      {/* Search Section */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <h1 className="text-2xl font-bold mb-6">Q&A Search Engine</h1>
        
        {/* Search Input */}
        <div className="flex gap-4 mb-4">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Enter your search query..."
            className="flex-1 p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            onClick={handleSearch}
            disabled={loading}
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:bg-blue-300 transition-colors"
          >
            {loading ? 'Searching...' : 'Search'}
          </button>
        </div>

        {/* Sort Controls */}
        <div className="flex gap-4 mb-4">
          <select
            className="p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
          >
            <option value="relevance">Relevance</option>
            <option value="date">Date</option>
            <option value="score">Score</option>
          </select>
          <button
            onClick={() => sortResults('stackoverflow')}
            className="px-4 py-2 border rounded-md hover:bg-gray-50"
          >
            Sort Stack Overflow
          </button>
          <button
            onClick={() => sortResults('reddit')}
            className="px-4 py-2 border rounded-md hover:bg-gray-50"
          >
            Sort Reddit
          </button>
        </div>

        {/* Enhanced Email Section */}
        <div className="space-y-2">
          <div className="flex gap-4">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter email to save results..."
              className={`flex-1 p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 
                ${emailStatus === 'error' ? 'border-red-500' : ''}`}
              disabled={emailStatus === 'sending'}
            />
            <button
              onClick={handleEmail}
              disabled={emailStatus === 'sending' || !email.trim()}
              className={`px-4 py-2 rounded-md text-white transition-colors ${
                emailStatus === 'sending'
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-green-500 hover:bg-green-600'
              }`}
            >
              {emailStatus === 'sending' ? 'Sending...' : 'Send Results'}
            </button>
          </div>
          
          {/* Email Status Messages */}
          {emailStatus === 'error' && (
            <p className="text-red-500 text-sm">{emailError}</p>
          )}
          {emailStatus === 'success' && (
            <p className="text-green-500 text-sm">Results sent successfully!</p>
          )}
        </div>
      </div>

      {/* Results Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Stack Overflow Results */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-bold mb-4">Stack Overflow Results</h2>
          <div className="space-y-4">
            {results.stackoverflow.map((item) => (
              <div key={item.question_id} className="p-4 border rounded-md hover:bg-gray-50">
                <a
                  href={item.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline font-medium block mb-2"
                >
                  {item.title}
                </a>
                <div className="text-sm text-gray-600">
                  Score: {item.score} | Answers: {item.answer_count}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Reddit Results */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-bold mb-4">Reddit Results</h2>
          <div className="space-y-4">
            {results.reddit.map((item) => (
              <div key={item.data.id} className="p-4 border rounded-md hover:bg-gray-50">
                <a
                  href={`https://reddit.com${item.data.permalink}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline font-medium block mb-2"
                >
                  {item.data.title}
                </a>
                <div className="text-sm text-gray-600">
                  Score: {item.data.score} | Comments: {item.data.num_comments}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchContainer;