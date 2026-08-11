const express = require('express');
const router = express.Router();
const db = require('../db');
const authMiddleware = require('../middleware/auth');

// toda rota abaixo passa a exigir token válido
router.use(authMiddleware);

// GET - lista as transações do usuário logado
router.get('/', (req, res) => {
  db.all(
    'SELECT * FROM transactions WHERE user_id = ? ORDER BY date DESC',
    [req.user.id],
    (err, rows) => {
      if (err) {
        res.status(500).json({ error: err.message });
      } else {
        res.json(rows);
      }
    }
  );
});

// POST - cria nova transação vinculada ao usuário logado
router.post('/', (req, res) => {
  const { description, amount, type, category, month } = req.body;
  db.run(
    'INSERT INTO transactions (user_id, description, amount, type, category, month) VALUES (?, ?, ?, ?, ?, ?)',
    [req.user.id, description, amount, type, category, month],
    function (err) {
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

// DELETE - remove transação, só se pertencer ao usuário logado
router.delete('/:id', (req, res) => {
  const { id } = req.params;
  db.run(
    'DELETE FROM transactions WHERE id = ? AND user_id = ?',
    [id, req.user.id],
    function (err) {
      if (err) {
        res.status(500).json({ error: err.message });
      } else if (this.changes === 0) {
        res.status(404).json({ error: 'Transação não encontrada' });
      } else {
        res.status(204).send();
      }
    }
  );
});

// PUT - atualiza transação, só se pertencer ao usuário logado
router.put('/:id', (req, res) => {
  const { id } = req.params;
  const { description, amount, type, category, month } = req.body;
  db.run(
    'UPDATE transactions SET description = ?, amount = ?, type = ?, category = ?, month = ? WHERE id = ? AND user_id = ?',
    [description, amount, type, category, month, id, req.user.id],
    function (err) {
      if (err) {
        res.status(500).json({ error: err.message });
      } else if (this.changes === 0) {
        res.status(404).json({ error: 'Transação não encontrada' });
      } else {
        db.get('SELECT * FROM transactions WHERE id = ?', [id], (err, row) => {
          res.json(row);
        });
      }
    }
  );
});

module.exports = router;