import { useState, useEffect } from "react";
import { type UserProfile, type WatchlistItem, type StockNews, type StockProfile, type StockQuote } from '../types/index.ts'
import { getStockQuote, getStockNews, searchStock } from "../api/stock.ts";

const USER_PROFILE_KEY = "user_profile";

export const useUserProfile = () => {
  const [user, setUser] = useState<UserProfile | null>(null);

  useEffect(() => {
    const existing = localStorage.getItem(USER_PROFILE_KEY);
    if (existing) {
      setUser(JSON.parse(existing));
    } else {
      const newProfile: UserProfile = {
        id: crypto.randomUUID(),
        name: "Guest",
        createdAt: new Date().toISOString(),
        watchlist: [],
      };
      localStorage.setItem(USER_PROFILE_KEY, JSON.stringify(newProfile));
      setUser(newProfile);
    }
  }, []);

  const saveProfile = (profile: UserProfile) => {
    localStorage.setItem(USER_PROFILE_KEY, JSON.stringify(profile));
    setUser(profile);
  };

  // Add a ticker to watchlist and fetch its data
  const addToWatchlist = async (ticker: string) => {
    if (!user) return;
    const exists = user.watchlist.some(w => w.ticker === ticker);
    if (exists) return;

    try {
      // 1. Get stock profile
      const profile: StockProfile = await searchStock(ticker);

      // 2. Get stock quote
      const quote: StockQuote = await getStockQuote(ticker);

      // 3. Get recent news
      const news: StockNews[] = await getStockNews(ticker);

      // 4. Construct watchlist item
      const newItem: WatchlistItem = {
        ticker: profile.ticker,
        profile: {
          finnhubIndustry: profile.finnhubIndustry,
          ipo: profile.ipo,
          logo: profile.logo,
          name: profile.name,
          weburl: profile.weburl,
        },
        quote: {
          currentPrice: quote.c,
          change: quote.d,
          percentChange: quote.dp,
          high: quote.h,
          low: quote.l,
          open: quote.o,
          prevClose: quote.pc,
          timestamp: quote.t,
        },
        marketNews: news,
      };

      // 5. Update user profile
      const updated = { ...user, watchlist: [...user.watchlist, newItem] };
      saveProfile(updated);
    } catch (err) {
      console.error("Failed to add stock to watchlist:", err);
    }
  };

  // Remove a ticker
  const removeFromWatchlist = (ticker: string) => {
    if (!user) return;
    const updated = {
      ...user,
      watchlist: user.watchlist.filter(w => w.ticker !== ticker),
    };
    saveProfile(updated);
  };

  // Update an existing watchlist item (refresh quote/news)
  const updateWatchlistItem = (item: WatchlistItem) => {
    if (!user) return;
    const updated = {
      ...user,
      watchlist: user.watchlist.map(w => (w.ticker === item.ticker ? item : w)),
    };
    saveProfile(updated);
  };

  return {
    user,
    addToWatchlist,
    removeFromWatchlist,
    updateWatchlistItem,
    saveProfile,
  };
};
