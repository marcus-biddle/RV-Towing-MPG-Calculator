// controllers/stocksController.js
import axios from "axios";

export const searchStock = async (req, res) => {
  const { stock } = req.query;
  if (!stock) return res.status(400).json({ success: false, message: "Query required" });

  try {
    const response = await axios.get(
      `https://finnhub.io/api/v1/stock/profile2?symbol=${encodeURIComponent(stock)}&token=${process.env.FINNHUB_API_KEY}`
    );

    res.json({ success: true, response: response.data });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

export const searchStocks = async (req, res) => {
  const { stock } = req.query;
  if (!stock) return res.status(400).json({ success: false, message: "Query required" });

  try {
    const response = await axios.get(
      `https://finnhub.io/api/v1/search?q=${encodeURIComponent(stock)}&exchange=US&token=${process.env.FINNHUB_API_KEY}`
    );

    res.json({ success: true, response: response.data });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

export const stockQuote = async (req, res) => {
  const { stock } = req.query;
  if (!stock) return res.status(400).json({ success: false, message: "Query required" });

  try {
    const response = await axios.get(
      `https://finnhub.io/api/v1/quote?symbol=${encodeURIComponent(stock)}&token=${process.env.FINNHUB_API_KEY}`
    );

    res.json({ success: true, response: response.data });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getToday = () => {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, "0"); // months are 0-based
  const day = String(today.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

export const getMonthAgo = () => {
  const today = new Date();
  // clone so we don’t mutate original
  const monthAgo = new Date(today);
  monthAgo.setMonth(monthAgo.getMonth() - 1);

  const year = monthAgo.getFullYear();
  const month = String(monthAgo.getMonth() + 1).padStart(2, "0");
  const day = String(monthAgo.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
};


export const stockNews = async (req, res) => {
  const { stock } = req.query;
  if (!stock) return res.status(400).json({ success: false, message: "Query required" });

  try {
    const newsResponse = await axios.get(
      `https://finnhub.io/api/v1/company-news?symbol=${encodeURIComponent(stock)}&from=${getMonthAgo()}&to=${getToday()}&token=${process.env.FINNHUB_API_KEY}`
    );

    const newsArray = Array.isArray(newsResponse.data) ? newsResponse.data : [];
    const headlines = newsArray.slice(0, 3).map(item => item.headline);

    console.log("Headlines:", headlines);

    const llmResponse = await axios.post("https://stock-tracker-llm.onrender.com/summarize", { headlines });
    console.log("LLM response:", llmResponse.data);

    let summary = llmResponse.data?.summary || "";

    const marketNews = newsArray.length > 3 ? newsArray.slice(0,3) : newsArray;

    res.json({
      success: true,
      news: marketNews,
      aisummary: summary,
    });
  } catch (error) {
    console.error(error.message || error);
    res.status(500).json({ success: false, message: error.message || "Unknown error" });
  }
};

