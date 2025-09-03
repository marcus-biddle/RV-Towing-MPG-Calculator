# 📈 AI-Powered Stock News Summarizer  

An end-to-end full stack project that fetches real-time stock market news 📰, processes it with an **LLM service** (OpenAI GPT), and delivers **concise AI summaries** alongside raw headlines.  

This project demonstrates **frontend, backend, and AI integration** — making financial data more digestible for traders, analysts, and everyday investors.  

---

## 🚀 Features
- 🔎 **Search Stocks** by ticker symbol.  
- 📰 **Real-time Market News** from [Finnhub.io](https://finnhub.io).  
- 🤖 **AI-Powered Summaries** of top headlines via GPT.  
- 💾 **LocalStorage caching** with error recovery.  
- 📊 **Clean TypeScript interfaces** for safety.  
- ⚡ Full-stack deployment (frontend, backend, and LLM service).  

---

## 🏗️ Architecture

The project is split into **three main services**:

### 1. 🖥️ Frontend (React + TypeScript)
- Built with **React** + **TypeScript**.  
- Uses **TailwindCSS** for styling.  
- Handles:
  - Search input and ticker watchlist.  
  - Displays stock profiles, live quotes, and AI-powered summaries.  
  - Caches user data and watchlist in `localStorage`.  

### 2. ⚙️ Backend (Node.js + Express)
- Acts as a bridge between the frontend and external APIs.  
- Responsibilities:
  - Querying **Finnhub API** for stock profiles, quotes, and news.  
  - Error handling and retry logic.  
  - Forwarding news headlines to the **LLM service** for summarization.  
- Written in **JavaScript/TypeScript** for type safety.

### 3. 🧠 LLM Service (Python + FastAPI)
- A lightweight **FastAPI** microservice.  
- Uses the **OpenAI API** to generate summaries of top financial headlines.  
- Independent service to keep AI calls isolated and scalable.
