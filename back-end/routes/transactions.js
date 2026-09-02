const express = require('express');
const router = express.Router();
const db = require('../db');
const authMiddleware = require('../middleware/auth');

// toda rota abaixo passa a exigir token válido
router.use(authMiddleware);

// GET - lista as transações do usuário logado
router.get('/', async (req, res) => {
  try {
      const result = await db.query(
      'SELECT * FROM transactions WHERE user_id = $1 ORDER BY date DESC',
      [req.user.id]
    );
    // O pg devolve os dados dentro da propriedade 'rows'
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST - cria nova transação vinculada ao usuário logado
router.post('/', async (req, res) => {
  const { description, amount, type, category, month } = req.body;
  try {
    // O RETURNING * insere e já retorna o dado inserido
    const result = await db.query(
      `INSERT INTO transactions (user_id, description, amount, type, category, month) 
       VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
      [req.user.id, description, amount, type, category, month]
    );
    
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE - remove transação, só se pertencer ao usuário logado
router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const result = await db.query(
      'DELETE FROM transactions WHERE id = $1 AND user_id = $2',
      [id, req.user.id]
    );
    
    if (result.rowCount === 0) {
      return res.status(404).json({ error: 'Transação não encontrada' });
    }
    res.status(204).send();
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PUT - atualiza transação, só se pertencer ao usuário logado
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { description, amount, type, category, month } = req.body;
  try {
    // usando RETURNING * para evitar um SELECT extra
    const result = await db.query(
      `UPDATE transactions 
       SET description = $1, amount = $2, type = $3, category = $4, month = $5 
       WHERE id = $6 AND user_id = $7 RETURNING *`,
      [description, amount, type, category, month, id, req.user.id]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ error: 'Transação não encontrada' });
    }
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;