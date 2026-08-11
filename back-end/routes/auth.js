const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../db');

const SALT_ROUNDS = 10;

// POST /api/auth/register
router.post('/register', (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ error: 'name, email e password são obrigatórios' });
  }

  db.get('SELECT id FROM users WHERE email = ?', [email], (err, existingUser) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    if (existingUser) {
      return res.status(409).json({ error: 'E-mail já cadastrado' });
    }

    bcrypt.hash(password, SALT_ROUNDS, (err, hash) => {
      if (err) {
        return res.status(500).json({ error: 'Erro ao processar senha' });
      }

      db.run(
        'INSERT INTO users (name, email, password_hash) VALUES (?, ?, ?)',
        [name, email, hash],
        function (err) {
          if (err) {
            return res.status(500).json({ error: err.message });
          }

          const token = jwt.sign({ id: this.lastID }, process.env.JWT_SECRET, { expiresIn: '7d' });
          res.status(201).json({
            user: { id: this.lastID, name, email },
            token
          });
        }
      );
    });
  });
});

// POST /api/auth/login
router.post('/login', (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'email e password são obrigatórios' });
  }

  db.get('SELECT * FROM users WHERE email = ?', [email], (err, user) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    if (!user) {
      return res.status(401).json({ error: 'Credenciais inválidas' });
    }

    bcrypt.compare(password, user.password_hash, (err, match) => {
      if (err) {
        return res.status(500).json({ error: 'Erro ao verificar senha' });
      }
      if (!match) {
        return res.status(401).json({ error: 'Credenciais inválidas' });
      }

      const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '7d' });
      res.json({
        user: { id: user.id, name: user.name, email: user.email },
        token
      });
    });
  });
});

module.exports = router;