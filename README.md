# 💼 FinFreela — Educador Financeiro Inteligente

Aplicação web voltada para freelancers e pequenos empreendedores com renda variável, ajudando a organizar entradas, saídas e reserva financeira.

**🔗 [Ver demonstração ao vivo](https://finfreela.web.app)** — Firebase Hosting
<sub>Versão anterior (build estático): [GitHub Pages](https://alananjos06.github.io/educador-financeiro-inteligente/)</sub>


---

## Arquitetura do projeto

Este projeto passou por uma evolução de arquitetura, documentada aqui de propósito para mostrar o processo de aprendizado:

| Versão | Stack | Pasta |
|---|---|---|
| **Atual** | React (front-end) + **Firebase** (Firestore + Auth) | `front-end/` |
| **Anterior** | React (front-end) + **Node/Express + SQLite** (back-end próprio) | `front-end/` + `back-end/` |

### Por que migrei para o Firebase?

A versão original usava um back-end próprio em Express com banco SQLite, com uma API REST completa (rotas GET, POST, PUT, DELETE). Migrei a camada de dados para o **Firestore** e adicionei autenticação com **Firebase Auth** para ganhar experiência prática com esse stack — hoje o front-end se comunica diretamente com o Firestore, sem precisar de um servidor Express no meio.

A pasta `back-end/` foi mantida no repositório como referência da versão anterior, mostrando que sei construir tanto uma API própria (Node/Express/SQL) quanto usar um BaaS (Backend as a Service) como o Firebase — e entender quando cada abordagem faz sentido.

---

## Funcionalidades:

- Registro de entradas e saídas por mês
- Filtro por mês com visualização de saldo líquido
- Cálculo automático de pró-labore sugerido
- Distribuição recomendada: impostos, reserva, reinvestimento e pró-labore
- Gráfico de evolução mensal (Recharts)
- Edição e exclusão de lançamentos
- Exportação de dados para CSV
- **Autenticação de usuário** (cadastro/login com Firebase Auth)
- **Persistência em nuvem** (Firestore)

---

## Tecnologias Utilizadas:

**Front-end:** React 18, Vite, Recharts, CSS Modules
**Dados & Auth (versão atual):** Firebase (Firestore + Authentication)
**Back-end (versão anterior):** Node.js, Express, SQLite
**Deploy:** Firebase Hosting

---

## Como rodar localmente?

```bash
git clone https://github.com/alananjos06/educador-financeiro-inteligente.git
cd educador-financeiro-inteligente/front-end
npm install
npm run dev
```

> Nota: a versão atual usa Firebase, então não é necessário rodar o `back-end/` para o projeto funcionar. Ele está mantido apenas como referência histórica e experiência.

---

<div align="center"> Criado com 💚 por Alana Anjos </div>