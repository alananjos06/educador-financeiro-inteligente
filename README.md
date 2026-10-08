# FinFreela — Educador Financeiro Inteligente
![CI](https://github.com/alananjos06/educador-financeiro-inteligente/actions/workflows/ci.yml/badge.svg)

Aplicação web voltada para freelancers e pequenos empreendedores com renda variável, ajudando a organizar entradas, saídas e reserva financeira.

## Projeto em produção:
- **Front-end:** https://front-end-eight-olive.vercel.app
- **Back-end:** https://finfreela-api.onrender.com
- **Hospedagem:** front-end no Vercel, API no Render, banco PostgreSQL no Neon (todos no plano gratuito)

> A API (Render) "dorme" após 15 minutos sem uso, e o banco (Neon) após 5 minutos. A primeira requisição depois de um período parado pode levar até 1 minuto. As seguintes respondem normalmente.

![Dashboard do FinFreela](./screenshots/dashboard.png)

---

## Arquitetura do projeto
Este projeto passou por três fases de arquitetura, documentadas aqui de propósito para mostrar o processo de aprendizado:

| Versão | Stack |
| ------ | ----- | 
| **Atual** | React (front-end) + **Node/Express + PostgreSQL** (back-end próprio, com autenticação JWT) |
| **Fase 2** | React (front-end) + **Firebase** (Firestore + Auth) |
| **Fase 1** | React (front-end) + **Node/Express + SQLite** (protótipo inicial, sem autenticação) |

### Por que essa evolução?
Comecei com SQLite pra validar a lógica de negócio (cálculo de pró-labore, distribuição de valores) sem me preocupar com infraestrutura. Depois migrei pro Firebase (Firestore + Authentication) pra ter autenticação pronta e testar o front-end mais rápido, sem gerenciar back-end.

Por fim, voltei pra uma API própria em **Express + PostgreSQL** pra ganhar experiência real com autenticação (JWT + bcrypt), modelagem relacional de dados e queries SQL — habilidades que o Firebase abstraía por completo e que são centrais pra atuar como full stack developer.

Isso significa: cadastro/login com hash de senha (bcrypt), tokens JWT com expiração, rotas protegidas por middleware de autenticação, e transações vinculadas a cada usuário (com verificação de propriedade em todas as operações).

---

## Funcionalidades:

- **Autenticação de usuário** (cadastro/login com JWT + bcrypt)
- Registro de entradas e saídas por mês, vinculado ao usuário logado
- Filtro por mês com visualização de saldo líquido
- Cálculo automático de pró-labore sugerido
- Distribuição recomendada: impostos, reserva, reinvestimento e pró-labore
- Gráfico de evolução mensal (Recharts)
- Edição e exclusão de lançamentos
- Exportação de dados para CSV
- Simulador de reserva: ajuste receita, pró-labore, impostos e meses de reserva e veja a projeção anual
- Gráfico de despesas por categoria
- Ordenação da tabela por descrição, categoria ou valor
---

## Tecnologias Utilizadas:

- **Front-end:** React 18, Vite, Recharts, CSS Modules, Axios
- **Back-end:** Node.js, Express, PostgreSQL, JWT (jsonwebtoken), bcryptjs

---

## Testes e CI
12 testes automatizados no back-end (Jest + Supertest) cobrindo cadastro, login, middleware de autenticação e a verificação de que um usuário não acessa lançamentos de outro. O banco é simulado nos testes, então eles rodam sem PostgreSQL.

A cada push, o GitHub Actions roda os testes do back-end e o build do front-end.

```bash
cd back-end
npm test
```

## Como rodar localmente?
- Requisitos: Node.js 24 e PostgreSQL

### 1. Clone o repositório

```bash
git clone https://github.com/alananjos06/educador-financeiro-inteligente.git
cd educador-financeiro-inteligente
```

### 2. Back-end

```bash
cd back-end
npm install
```

Crie um arquivo `.env` na pasta `back-end/` com:

```
DATABASE_URL=postgres://usuario:senha@localhost:5432/finfreela
JWT_SECRET=uma_chave_secreta_qualquer
PORT=3001
```

```bash
npm run dev
```

### 3. Front-end

Em outro terminal:

```bash
cd front-end
npm install
npm run dev
```

Acesse `http://localhost:5173`.

> Certifique-se de ter um servidor PostgreSQL rodando localmente e um banco de dados criado com o nome usado no `DATABASE_URL`.

---

## Limitações conhecidas
- **Lançamentos não guardam o ano.** Janeiro de 2026 e janeiro de 2027 aparecem juntos. Corrigir exige uma coluna nova no banco e mudanças na API.
- **Erros de rede não aparecem na tela.** Se salvar um lançamento falhar, o erro vai só para o console do navegador.
- **A distribuição recomendada usa percentuais fixos** (15/10/35/40) sobre a receita bruta, sem considerar as despesas do mês.

<div align="center"> Criado com 💚 por Alana Anjos </div>