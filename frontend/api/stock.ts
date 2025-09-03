import { type StockNewsResponse, type StockProfile, type StockQuote, type StockSearchResult } from '../types/index.ts'
import { apiClient } from './apiClient.ts'

/**
 * Search for a stock by symbol
 */
export const searchStock = async (symbol: string): Promise<StockProfile> => {
    const res = await apiClient(`/api/stocks/search?stock=${symbol}`);
    console.log(res.data.response)
    return res.data.response;
};

/**
 * Search for a stocks by query
 */
export const searchStocks = async (query: string): Promise<StockSearchResult[]> => {
    const res = await apiClient(`/api/stocks/multi/search?stock=${query}`);
    console.log(res.data.response.result)
    return res.data.response.result;
};


/**
 * Search for a stock quote
 */
export const getStockQuote = async (symbol: string): Promise<StockQuote> => {
    const res = await apiClient(`/api/stocks/quote?stock=${symbol}`);
    try {
        console.log(symbol,res. data.response)
        return res.data.response;
    } catch(e) {
        throw new Error(`HTTP error! status: ${res.status, e}`);
    }
};

/**
 * Search for a stock news for last month
 */
export const getStockNews = async (symbol: string): Promise<StockNewsResponse> => {
    const res = await apiClient(`/api/stocks/news?stock=${symbol}`);
    try {
        console.log(symbol, res.data)
        return res.data;
    } catch(e) {
        throw new Error(`HTTP error! status: ${res.status, e}`);
    }
};