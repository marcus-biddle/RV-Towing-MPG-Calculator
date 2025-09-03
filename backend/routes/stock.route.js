import express from 'express';
import { searchStock, searchStocks, stockQuote, stockNews } from '../controllers/stock.controller.js';

const router = express.Router();

router.get('/search', searchStock);
router.get('/multi/search', searchStocks)
router.get('/quote', stockQuote);
router.get('/news', stockNews);

export default router;
