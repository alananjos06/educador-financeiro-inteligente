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

// db.serialize() garante que os comandos abaixo rodem em ordem, um de cada vez.
// Sem isso, o driver sqlite3 pode disparar os comandos em paralelo e o ALTER
// TABLE pode tentar rodar antes do CREATE TABLE terminar.
db.serialize(() => {
  // Tabela de usuários
  db.run(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT NOT NULL UNIQUE,
      password_hash TEXT NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `, (err) => {
    if (err) {
      console.error('❌ Erro ao criar tabela users:', err.message);
    } else {
      console.log('✅ Tabela users pronta!');
    }
  });

  // Tabela de transações 
  db.run(`
    CREATE TABLE IF NOT EXISTS transactions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL REFERENCES users(id),
      description TEXT NOT NULL,
      amount REAL NOT NULL,
      type TEXT NOT NULL CHECK (type IN ('entrada', 'saida')),
      date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      category TEXT,
      month TEXT
    )
  `, (err) => {
    if (err) {
      console.error('❌ Erro ao criar tabela transactions:', err.message);
    } else {
      console.log('✅ Tabela transactions pronta!');
    }
  });

  // Migração: se o seu finfreela.db já existia sem user_id, esse ALTER adiciona a coluna.
  // "CREATE TABLE IF NOT EXISTS" não altera tabelas que já existem, por isso essa linha extra.
  // Se a coluna já existir (banco novo), o erro "duplicate column" é esperado e ignorado.
  db.run(`ALTER TABLE transactions ADD COLUMN user_id INTEGER REFERENCES users(id)`, (err) => {
    if (err && !err.message.includes('duplicate column')) {
      console.error('❌ Erro na migração de user_id:', err.message);
    }
  });
});

module.exports = db;