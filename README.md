# 💼 FinFreela — Educador Financeiro Inteligente

> Projeto desenvolvido como parte do Bootcamp Santander 2026 AI React Front-End da DIO

**[🚀 Ver demo ao vivo](https://alananjos06.github.io/educador-financeiro-inteligente/)**

---

## Sobre o projeto:

O **FinFreela** é uma aplicação React voltada para freelancers e pequenos empreendedores com renda variável. Ele resolve um problema real: a falta de ferramentas financeiras que respeitam a irregularidade da receita de quem trabalha por conta própria.

---

## Funcionalidades:

### Dashboard:
- Registro de entradas e saídas por mês
- Filtro por mês com visualização de saldo líquido
- Cálculo automático de pró-labore sugerido (40% da receita)
- Distribuição recomendada: impostos, reserva, reinvestimento e pró-labore
- Gráfico de barras com evolução mensal (Recharts)

### Simulador:
- Sliders interativos para receita, % pró-labore, alíquota de imposto e meses de reserva
- Cálculo em tempo real de toda a distribuição financeira
- Alerta inteligente: saudável / apertado / negativo
- Gráfico de projeção anual da reserva de segurança

---

## Tecnologias:

- **React 18** — componentização e hooks (useState, useMemo)
- **Vite** — bundler e servidor de desenvolvimento
- **Recharts** — gráficos interativos
- **CSS Modules** — estilização isolada por componente

---

## Estrutura do projeto:

```
src/
├── components/
│   ├── Header.jsx / Header.module.css
│   ├── Dashboard.jsx / Dashboard.module.css
│   └── Simulador.jsx / Simulador.module.css
├── hooks/
│   └── useEntries.js       ← custom hook para estado dos lançamentos
├── App.jsx / App.module.css
├── main.jsx
├── index.css
└── utils.js                ← formatação e cálculos reutilizáveis
```

---

## Como rodar localmente?

```bash
# Clone o repositório
git clone https://github.com/alananjos06/educador-financeiro-inteligente.git

# Instale as dependências
npm install

# Inicie o servidor de desenvolvimento
npm run dev

# Build para produção
npm run build
```

---

## Deploy no GitHub Pages:

```bash
npm run build
# Faça upload da pasta dist/ para o branch gh-pages
# ou configure o GitHub Actions para deploy automático
```

---

*Criado com React + Vite · Bootcamp Santander 2026 AI React Front-End · DIO*
