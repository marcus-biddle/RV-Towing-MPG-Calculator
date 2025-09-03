export interface StockProfile {
  country: string;
  currency: string;
  estimateCurrency: string;
  exchange: string;
  finnhubIndustry: string;
  ipo: string; // ISO date string
  logo: string; // URL
  marketCapitalization: number;
  name: string;
  phone: string;
  shareOutstanding: number;
  ticker: string;
  weburl: string;
}

export interface StockSearchResult {
  description: string;
  displaySymbol: string;
  symbol: string;
  type: string;
}

export interface StockQuote {
  c: number;  // Current price
  d: number;  // Change
  dp: number; // Percent change
  h: number;  // High price of the day
  l: number;  // Low price of the day
  o: number;  // Open price of the day
  pc: number; // Previous close price
  t: number;  // Timestamp (Unix time in seconds)
}

export interface StockNews {
  category: string;
  datetime: number;   // Unix timestamp
  headline: string;
  id: number;
  image: string;
  related: string;    // ticker symbol(s)
  source: string;
  summary: string;
  url: string;
}

export interface WatchlistItem {
  ticker: string;
  profile: {
    finnhubIndustry: string;
    ipo: string;
    logo: string;
    name: string;
    weburl: string;
  };
  quote: {
    currentPrice: number;
    change: number;
    percentChange: number;
    high: number;
    low: number;
    open: number;
    prevClose: number;
    timestamp: number;
  };
  marketNews: StockNews[]
}

export interface UserProfile {
  id: string;
  name: string;
  email?: string;
  createdAt: string;
  watchlist: WatchlistItem[];
}
