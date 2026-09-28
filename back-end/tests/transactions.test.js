process.env.JWT_SECRET = 'test_secret'; // precisa existir antes de importar o app

const request = require('supertest');
const jwt = require('jsonwebtoken');
const app = require('../server');

// mocka o banco pra não precisar de Postgres real rodando pros testes
jest.mock('../db', () => ({ query: jest.fn() }));
const db = require('../db');

const token = jwt.sign({ id: 1 }, process.env.JWT_SECRET);

describe('DELETE /api/transactions/:id', () => {
  afterEach(() => jest.clearAllMocks());

  it('retorna 404 quando a transação não pertence ao usuário logado', async () => {
    db.query.mockResolvedValueOnce({ rowCount: 0 });

    const res = await request(app)
      .delete('/api/transactions/99')
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(404);
    expect(res.body.error).toBeDefined();
    // falha se a cláusula de propriedade sair da query real
    expect(db.query).toHaveBeenCalledWith(
      expect.stringContaining('user_id'),
      expect.arrayContaining([1])
    );
  });

  it('remove a transação do próprio usuário', async () => {
    db.query.mockResolvedValueOnce({ rowCount: 1 });

    const res = await request(app)
      .delete('/api/transactions/10')
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(204);
  });

  it('retorna 401 sem token', async () => {
    const res = await request(app).delete('/api/transactions/10');

    expect(res.status).toBe(401);
  });
});

describe('PUT /api/transactions/:id', () => {
  afterEach(() => jest.clearAllMocks());

  it('retorna 404 quando a transação não pertence ao usuário logado', async () => {
    db.query.mockResolvedValueOnce({ rows: [], rowCount: 0 });

    const res = await request(app)
      .put('/api/transactions/99')
      .set('Authorization', `Bearer ${token}`)
      .send({ desc: 'Alterado', value: 100, type: 'despesa', category: 'Outros', month: '2025-01' });

    expect(res.status).toBe(404);
    expect(res.body.error).toBeDefined();
    // falha se a cláusula de propriedade sair da query real
    expect(db.query).toHaveBeenCalledWith(
      expect.stringContaining('user_id'),
      expect.arrayContaining([1])
    );
  });
});
