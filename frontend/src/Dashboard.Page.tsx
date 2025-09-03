import React, { useState, useEffect } from 'react';
import {getStockNews, getStockQuote, searchStock, searchStocks} from '../api/stock.js'
import { type StockNews, type StockProfile, type StockQuote, type StockSearchResult, type WatchlistItem } from '../types/index.ts'
import { Search, Plus, X, ExternalLink, TrendingUp, Clock, Star, AlertCircle } from 'lucide-react';
import { useUserProfile } from '../hooks/useUserProfile.ts'


const StockNewsDashboard = () => {
  const { addToWatchlist, user, removeFromWatchlist } = useUserProfile();

  const [tickerList, setTickerList] = useState<WatchlistItem[]>([]);
  const [watchList, setWatcList] = useState([]);
  const [watchlist, setWatchlist] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<StockSearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [selectedStock, setSelectedStock] = useState(null);
  const [newsData, setNewsData] = useState({});
  const [isLoadingNews, setIsLoadingNews] = useState(false);

  const handleSearch = async (query: string) => {
  setSearchQuery(query);

  if (query.length >= 1) {
    setIsSearching(true);
    try {
      const data: StockSearchResult[] = await searchStocks(query);
      setSearchResults(data);
    } catch (err) {
      console.error("Search failed:", err);
    } finally {
      setIsSearching(false);
    }
  } else {
    setSearchResults([]);
  }
};

const handleSelectedStock = async (stockName: string) => {
  await addToWatchlist(stockName);
      
  setSearchQuery("");
  setSearchResults([]);
}


  const timeAgo = (unixSeconds: number): string => {
    const now = Date.now();
    const date = new Date(unixSeconds * 1000); // convert to ms
    const diffMs = now - date.getTime();

    const diffMinutes = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffMinutes < 1) return "just now";
    if (diffMinutes < 60) return `${diffMinutes} minute${diffMinutes !== 1 ? "s" : ""} ago`;
    if (diffHours < 24) return `${diffHours} hour${diffHours !== 1 ? "s" : ""} ago`;
    return `${diffDays} day${diffDays !== 1 ? "s" : ""} ago`;
  };


  const getSentimentColor = (sentiment) => {
    switch (sentiment) {
      case 'positive': return 'text-green-600 bg-green-50';
      case 'negative': return 'text-red-600 bg-red-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  const getSentimentIcon = (sentiment) => {
    switch (sentiment) {
      case 'positive': return '📈';
      case 'negative': return '📉';
      default: return '📊';
    }
  };

  console.log(tickerList)

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-slate-900 to-black">
      {/* Header */}
      <div className="bg-black/40 backdrop-blur-xl border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-gradient-to-r from-purple-500 via-pink-500 to-cyan-500 rounded-xl shadow-lg">
                <TrendingUp className="w-7 h-7 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                  Stock News Hub
                </h1>
                <p className="text-gray-400 font-medium">Stay updated with your portfolio 🚀</p>
              </div>
            </div>
            <div className="flex items-center space-x-2 text-sm text-gray-400 bg-gray-800/50 px-3 py-2 rounded-lg">
              <Clock className="w-4 h-4" />
              <span>Last updated: {new Date().toLocaleTimeString()}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search Section */}
        <div className="mb-8">
          <div className="bg-gray-900/60 backdrop-blur-xl rounded-2xl shadow-2xl border border-gray-800 p-8">
            <h2 className="text-xl font-bold text-white mb-6 flex items-center">
              <div className="w-2 h-6 bg-gradient-to-b from-purple-400 to-pink-400 rounded-full mr-3"></div>
              Add Stock to Watchlist
            </h2>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search by symbol (AAPL) or company name (Apple)"
                value={searchQuery}
                onChange={(e) => handleSearch(e.target.value)}
                className="block w-full pl-12 pr-4 py-4 bg-gray-800/50 border border-gray-700 rounded-xl leading-5 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-200"
              />
            </div>

            {/* Search Results */}
            {searchResults.length > 0 && (
              <div className="mt-6 bg-gray-800/80 backdrop-blur-sm border border-gray-700 rounded-xl shadow-2xl overflow-hidden">
                {searchResults.filter(stock => stock.type === "Common Stock").map((stock: StockSearchResult, index) => (
                  <div key={index} className="flex items-center justify-between p-6 hover:bg-gray-700/50 border-b border-gray-700 last:border-b-0 transition-colors">
                    <div>
                      <div className="font-bold text-white text-lg">{stock.symbol}</div>
                      <div className="text-sm text-gray-400">{stock.description}</div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <div className="text-right">
                        {/* <div className="font-semibold">${stock.price.toFixed(2)}</div> */}
                        {/* <div className={`text-sm ${stock.change > 0 ? 'text-green-600' : 'text-red-600'}`}>
                          {stock.change > 0 ? '+' : ''}{stock.change.toFixed(2)} ({stock.changePercent.toFixed(2)}%)
                        </div> */}
                      </div>
                      <button
                        onClick={() => handleSelectedStock(stock.symbol)}
                        className="p-3 text-purple-400 hover:text-white hover:bg-purple-600/20 rounded-xl transition-all duration-200 border border-purple-500/30 hover:border-purple-400"
                      >
                        <Plus className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {isSearching && (
              <div className="mt-6 text-center text-gray-300">
                <div className="inline-block animate-spin rounded-full h-5 w-5 border-b-2 border-purple-500"></div>
                <span className="ml-3 font-medium">Searching...</span>
              </div>
            )}
          </div>
        </div>

        <div className="mb-8">
          <h2 className="text-2xl font-bold text-white mb-8 flex items-center">
            <div className="w-8 h-8 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-lg flex items-center justify-center mr-4 shadow-lg">
              <Star className="w-5 h-5 text-white" />
            </div>
            Your Watchlist 
            <span className="ml-3 px-3 py-1 bg-purple-500/20 text-purple-300 rounded-full text-sm font-medium">
              {user?.watchlist.length}
            </span>
          </h2>

          {user?.watchlist.length === 0 ? (
            <div className="bg-gray-900/60 backdrop-blur-xl rounded-2xl shadow-2xl border border-gray-800 p-16 text-center">
              <div className="w-16 h-16 bg-gray-700/50 rounded-full flex items-center justify-center mx-auto mb-6">
                <AlertCircle className="w-8 h-8 text-gray-500" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">No stocks in your watchlist</h3>
              <p className="text-gray-400">Search and add stocks above to start tracking news 📊</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8">
              {user?.watchlist.map((stock) => (
                <div key={stock.ticker} className="group bg-gray-900/60 backdrop-blur-xl rounded-2xl shadow-2xl border border-gray-800 hover:border-gray-700 transition-all duration-300 overflow-hidden hover:shadow-purple-500/10">
                  {/* Stock Header */}
                  <div className="p-8 border-b border-gray-800 bg-gradient-to-br from-gray-800/50 to-gray-900/50">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <h3 className="text-2xl font-bold text-white mb-1">{stock.ticker}</h3>
                        <p className="text-sm text-gray-400 font-medium truncate">{stock.profile.name}</p>
                      </div>
                      <button
                        onClick={() => removeFromWatchlist(stock.ticker)}
                        className="p-2 text-gray-500 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all duration-200"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    </div>
                    <div className="flex items-end justify-between">
                      <div className="text-3xl font-black text-white">
                        ${stock.quote.currentPrice}
                      </div>
                      <div className={`px-3 py-2 rounded-full text-sm font-bold shadow-lg ${
                        stock.quote.change > 0 
                          ? 'bg-green-500/20 text-green-400 border border-green-500/30' 
                          : 'bg-red-500/20 text-red-400 border border-red-500/30'
                      }`}>
                        {stock.quote.change > 0 ? '+' : ''}{stock.quote.change.toFixed(2)} ({stock.quote.percentChange.toFixed(2)}%)
                      </div>
                    </div>
                  </div>


                  {/* News Section */}
                  <div className="p-8">
                    <h4 className="font-bold text-white mb-6 flex items-center">
                      <div className="w-1 h-6 bg-gradient-to-b from-cyan-400 to-blue-500 rounded-full mr-3"></div>
                      Latest News
                    </h4>
                    {stock.marketNews ? (
                      <div className="space-y-6">
                        {stock.marketNews.slice(0, 3).map((article) => (
                          <div key={article.id} className="group/article">
                            <div className="flex items-start space-x-4">
                              {/* <div className={`px-3 py-1 rounded-full text-xs font-bold shadow-lg ${getSentimentColor(article.sentiment).replace('text-', 'text-').replace('bg-', 'bg-').replace('50', '500/20').replace('600', '400')}`}>
                                {getSentimentIcon(article.sentiment)}
                              </div> */}
                              <div className="flex-1 min-w-0">
                                <a 
                                  href={article.url}
                                  className="block hover:text-cyan-400 transition-colors"
                                  target="_blank"
                                  rel="noopener noreferrer"
                                >
                                  <h5 className="text-sm font-bold text-gray-100 line-clamp-2 group-hover/article:text-cyan-300 leading-relaxed">
                                    {article.headline}
                                  </h5>
                                  <div className="flex items-center space-x-2 mt-2 text-xs text-gray-500 font-medium">
                                    <span className="text-gray-400">{article.source}</span>
                                    <span>•</span>
                                    <span>{timeAgo(article.datetime)}</span>
                                    <ExternalLink className="w-3 h-3 opacity-0 group-hover/article:opacity-100 transition-opacity text-cyan-400" />
                                  </div>
                                </a>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-12">
                        {isLoadingNews ? (
                          <div>
                            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500 mb-4"></div>
                            <p className="text-sm text-gray-400 font-medium">Loading news...</p>
                          </div>
                        ) : (
                          <p className="text-sm text-gray-500">No recent news available</p>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="text-center text-sm text-gray-500">
          <p>Stock prices are delayed. News updates every hour.</p>
        </div>
      </div>
    </div>
  );
};

export default StockNewsDashboard;