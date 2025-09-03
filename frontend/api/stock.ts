import { type StockNewsResponse, type StockProfile, type StockQuote, type StockSearchResult } from '../types/index.ts'
const BASE_URL = "https://stock-tracker-vbdy.onrender.com"; //https://stock-tracker-vbdy.onrender.com

/**
 * Search for a stock by symbol
 */
export const searchStock = async (symbol: string): Promise<StockProfile> => {
    console.log(symbol)
  const res = await fetch(`${BASE_URL}/api/stocks/search?stock=${symbol}`);
  if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
  const data = await res.json();
  console.log(data.response)
  return data.response;
};

/**
 * Search for a stocks by query
 */
export const searchStocks = async (query: string): Promise<StockSearchResult[]> => {
    const res = await fetch(`${BASE_URL}/api/stocks/multi/search?stock=${query}`);
    if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
    const data = await res.json();
    console.log(data.response.result)
    return data.response.result;
};


/**
 * Search for a stock quote
 */
export const getStockQuote = async (symbol: string): Promise<StockQuote> => {
    const res = await fetch(`${BASE_URL}/api/stocks/quote?stock=${symbol}`);
    try {
        const data = await res.json();

        console.log(symbol, data.response)
        return data.response;
    } catch(e) {
        throw new Error(`HTTP error! status: ${res.status, e}`);
    }
};

/**
 * Search for a stock news for last month
 */
export const getStockNews = async (symbol: string): Promise<StockNewsResponse> => {
    const res = await fetch(`${BASE_URL}/api/stocks/news?stock=${symbol}`);
    try {
        const data = await res.json();

        console.log(symbol, data)
        return data;
    } catch(e) {
        throw new Error(`HTTP error! status: ${res.status, e}`);
    }
};