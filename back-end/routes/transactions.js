const express = require('express');
const router = express.Router();
const db = require('../db');

// GET - Lista todas as transações
router.get('/', (req, res) => {
  db.all('SELECT * FROM transactions ORDER BY date DESC', (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
    } else {
      res.json(rows);
    }
  });
});

// POST - Cria nova transação
router.post('/', (req, res) => {
  const { description, amount, type, category, month } = req.body;
  db.run(
    'INSERT INTO transactions (description, amount, type, category, month) VALUES (?, ?, ?, ?, ?)',
    [description, amount, type, category, month],
    function(err) {
      if (err) {
        res.status(500).json({ error: err.message });
      } else {
        db.get('SELECT * FROM transactions WHERE id = ?', [this.lastID], (err, row) => {
          res.status(201).json(row);
        });
      }
    }
  );
});

// DELETE - Remove transação
router.delete('/:id', (req, res) => {
  const { id } = req.params;
  db.run('DELETE FROM transactions WHERE id = ?', [id], function(err) {
    if (err) {
      res.status(500).json({ error: err.message });
    } else {
      res.status(204).send();
    }
  });
});

// PUT - Atualiza transação
router.put('/:id', (req, res) => {
  const { id } = req.params;
  const { description, amount, type, category, month } = req.body;
  db.run(
    'UPDATE transactions SET description = ?, amount = ?, type = ?, category = ?, month = ? WHERE id = ?',
    [description, amount, type, category, month, id],
    function(err) {
      if (err) {
        res.status(500).json({ error: err.message });
      } else {
        db.get('SELECT * FROM transactions WHERE id = ?', [id], (err, row) => {
          res.json(row);
        });
      }
    }
  );
});

module.exports = router;