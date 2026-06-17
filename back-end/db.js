const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.resolve(__dirname, 'finfreela.db');

const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('❌ Erro ao conectar ao SQLite:', err.message);
  } else {
    console.log('✅ Conectado ao SQLite com sucesso!');
  }
});

db.run(`
  CREATE TABLE IF NOT EXISTS transactions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    description TEXT NOT NULL,
    amount REAL NOT NULL,
    type TEXT NOT NULL CHECK (type IN ('entrada', 'saida')),
    date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    category TEXT,
    month TEXT
  )
`, (err) => {
  if (err) {
    console.error('❌ Erro ao criar tabela:', err.message);
  } else {
    console.log('✅ Tabela transactions pronta!');
  }
});

module.exports = db;