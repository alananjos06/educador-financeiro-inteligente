process.env.JWT_SECRET = 'test_secret'; // precisa existir antes de importar o app

const request = require('supertest');
const bcrypt = require('bcryptjs');
const app = require('../server');

// mocka o banco pra não precisar de Postgres real rodando pros testes
jest.mock('../db', () => ({ query: jest.fn() }));
const db = require('../db');

describe('POST /api/auth/register', () => {
  afterEach(() => jest.clearAllMocks());

  it('cadastra um usuário novo com sucesso', async () => {
    db.query.mockResolvedValueOnce({
      rows: [{ id: 1, name: 'Teste', email: 'teste@teste.com', created_at: new Date().toISOString() }]
    });

    const res = await request(app).post('/api/auth/register').send({
      name: 'Teste',
      email: 'teste@teste.com',
      password: 'senha123'
    });

    expect(res.status).toBe(201);
    expect(res.body.token).toBeDefined();
    expect(res.body.user.email).toBe('teste@teste.com');
  });

  it('rejeita cadastro sem campos obrigatórios', async () => {
    const res = await request(app).post('/api/auth/register').send({ email: 'teste@teste.com' });

    expect(res.status).toBe(400);
    expect(res.body.error).toBeDefined();
  });

  it('rejeita e-mail já cadastrado', async () => {
    db.query.mockRejectedValueOnce({ code: '23505' });

    const res = await request(app).post('/api/auth/register').send({
      name: 'Teste',
      email: 'jaexiste@teste.com',
      password: 'senha123'
    });

    expect(res.status).toBe(400);
    expect(res.body.error).toBe('Este e-mail já está cadastrado.');
  });
});

describe('POST /api/auth/login', () => {
  afterEach(() => jest.clearAllMocks());

  it('loga com credenciais corretas', async () => {
    const hash = await bcrypt.hash('senha123', 10);
    db.query.mockResolvedValueOnce({
      rows: [{ id: 1, name: 'Teste', email: 'teste@teste.com', password_hash: hash }]
    });

    const res = await request(app).post('/api/auth/login').send({
      email: 'teste@teste.com',
      password: 'senha123'
    });

    expect(res.status).toBe(200);
    expect(res.body.token).toBeDefined();
  });

  it('rejeita senha incorreta', async () => {
    const hash = await bcrypt.hash('senhacerta', 10);
    db.query.mockResolvedValueOnce({
      rows: [{ id: 1, name: 'Teste', email: 'teste@teste.com', password_hash: hash }]
    });

    const res = await request(app).post('/api/auth/login').send({
      email: 'teste@teste.com',
      password: 'senhaerrada'
    });

    expect(res.status).toBe(401);
  });
});