const express = require('express');
const cors = require('cors');
require('dotenv').config();
const db = require('./db');

const app = express();
const port = process.env.PORT || 3001;

app.use(cors({
  origin: 'https://alananjos06.github.io'
}));
app.use(express.json());

// Rotas
const transactionsRoutes = require('./routes/transactions');
app.use('/api/transactions', transactionsRoutes);

// Rota de teste
app.get('/health', (req, res) => {
  res.json({ status: 'OK', message: 'FinFreela API rodando!' });
});

app.listen(port, () => {
  console.log(`🚀 Servidor rodando em http://localhost:${port}`);
});