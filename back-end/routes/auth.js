const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../db');

// POST - Cadastro de novo usuário
router.post('/register', async (req, res) => {
  const { name, email, password } = req.body;

  // Validação básica
  if (!name || !email || !password) {
    return res.status(400).json({ error: 'Preencha todos os campos obrigatórios.' });
  }

  try {
    // Criptografa a senha usando bcrypt 
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    // insere o usuário no PostgreSQL e retorna os dados públicos com RETURNING
    const result = await db.query(
      `INSERT INTO users (name, email, password_hash) 
       VALUES ($1, $2, $3) 
       RETURNING id, name, email, created_at`,
      [name, email, passwordHash]
    );

    const newUser = result.rows[0];

    // Gera o token no cadastro para o usuário logar direto
    const token = jwt.sign({ id: newUser.id }, process.env.JWT_SECRET, { expiresIn: '7d' });

    res.status(201).json({
      message: 'Usuário cadastrado com sucesso!',
      user: newUser,
      token
    });

  } catch (err) {
    // Código '23505' no PostgreSQL indica violação de restrição UNIQUE (e-mail duplicado)
    if (err.code === '23505') {
      return res.status(400).json({ error: 'Este e-mail já está cadastrado.' });
    }
    console.error('Erro no registro:', err.message);
    res.status(500).json({ error: 'Erro interno ao cadastrar usuário.' });
  }
});

// POST - Login do usuário
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Informe e-mail e senha.' });
  }

  try {
    // Busca o usuário pelo e-mail
    const result = await db.query('SELECT * FROM users WHERE email = $1', [email]);
    
    if (result.rows.length === 0) {
      return res.status(401).json({ error: 'Credenciais inválidas.' });
    }

    const user = result.rows[0];

    // Compara a senha enviada com a senha hash do banco
    const match = await bcrypt.compare(password, user.password_hash);
    
    if (!match) {
      return res.status(401).json({ error: 'Credenciais inválidas.' });
    }

    // Gera o Token JWT válido por 7 dias
    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '7d' });
    
    res.json({
      message: 'Login realizado com sucesso!',
      user: { 
        id: user.id, 
        name: user.name, 
        email: user.email 
      },
      token
    });

  } catch (err) {
    console.error('Erro no login:', err.message);
    res.status(500).json({ error: 'Erro interno ao realizar login.' });
  }
});

module.exports = router;