import { useState } from 'react'
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend } from 'recharts'
import { MONTHS, fmt } from '../utils.js'
import styles from './Simulador.module.css'

export default function Simulador() {
  const [receita, setReceita] = useState(5000)
  const [mesesReserva, setMesesReserva] = useState(3)
  const [aliquota, setAliquota] = useState(15)
  const [pctProLabore, setPctProLabore] = useState(40)

  const proLabore = receita * (pctProLabore / 100)
  const impostos = receita * (aliquota / 100)
  const reservaMensal = receita * 0.1
  const reservaTotal = reservaMensal * mesesReserva
  const restante = receita - proLabore - impostos - reservaMensal
  const saudavel = restante > 0

  const chartData = MONTHS.map((m, i) => ({
    name: m,
    Reserva: reservaMensal * (i + 1),
    Meta: reservaTotal,
  }))

  const alertType = !saudavel ? 'warn' : restante > receita * 0.2 ? 'ok' : 'info'
  const alertMsg = !saudavel
    ? `⚠️ Saldo para o negócio negativo (${fmt(restante)}). Reduza o pró-labore ou revise despesas.`
    : restante > receita * 0.2
    ? `✅ Distribuição saudável! Você ainda tem ${fmt(restante)} para reinvestir.`
    : `ℹ️ Distribuição apertada. Saldo de ${fmt(restante)} para o negócio.`

  return (
    <div>
      <div className={styles.hero}>
        <p className={styles.tag}>// simulador de reserva</p>
        <h1 className={styles.title}>Planeje o<br /><span>imprevisível.</span></h1>
        <p className={styles.sub}>Simule quanto separar para impostos, reserva e períodos sem renda.</p>
      </div>

      <div className={styles.grid}>
        <div className={styles.card}>
          <h2 className={styles.cardTitle}>Parâmetros do mês</h2>

          {[
            { label: 'Receita bruta do mês', value: fmt(receita), min: 500, max: 30000, step: 100, state: receita, setter: setReceita },
            { label: `% Pró-labore desejado`, value: `${pctProLabore}%`, min: 20, max: 60, step: 5, state: pctProLabore, setter: setPctProLabore },
            { label: 'Alíquota de imposto estimada', value: `${aliquota}%`, min: 6, max: 33, step: 1, state: aliquota, setter: setAliquota },
            { label: 'Meses de reserva de segurança', value: `${mesesReserva} meses`, min: 1, max: 12, step: 1, state: mesesReserva, setter: setMesesReserva },
          ].map(({ label, value, min, max, step, state, setter }) => (
            <div key={label} className={styles.sliderWrap}>
              <div className={styles.sliderLabel}>
                <span>{label}</span>
                <span className={styles.sliderValue}>{value}</span>
              </div>
              <input
                type="range"
                min={min} max={max} step={step}
                value={state}
                onChange={e => setter(Number(e.target.value))}
              />
            </div>
          ))}
        </div>

        <div>
          <div className={styles.card} style={{ marginBottom: '1rem' }}>
            <h2 className={styles.cardTitle}>Distribuição do mês</h2>
            <div className={styles.resultBlock}>
              {[
                { label: 'Receita bruta', value: fmt(receita), cls: 'success' },
                { label: `Pró-labore (${pctProLabore}%)`, value: fmt(proLabore), cls: 'accent' },
                { label: `Impostos (${aliquota}%)`, value: fmt(impostos), cls: 'danger' },
                { label: 'Reserva mensal (10%)', value: fmt(reservaMensal), cls: 'purple' },
                { label: 'Saldo para negócio', value: fmt(restante), cls: saudavel ? 'success' : 'danger' },
              ].map(({ label, value, cls }) => (
                <div key={label} className={styles.resultRow}>
                  <span className={styles.resultKey}>{label}</span>
                  <span className={`${styles.resultVal} ${styles[cls]}`}>{value}</span>
                </div>
              ))}
            </div>
          </div>

          <div className={styles.card}>
            <h2 className={styles.cardTitle}>Meta de reserva</h2>
            <div className={`${styles.resultBlock} ${styles.purple}`}>
              {[
                { label: `Reserva alvo (${mesesReserva} meses)`, value: fmt(reservaTotal), cls: 'purple' },
                { label: 'Aporte mensal necessário', value: fmt(reservaMensal), cls: 'purple' },
                { label: 'Tempo para atingir meta', value: `${mesesReserva} meses`, cls: 'muted' },
              ].map(({ label, value, cls }) => (
                <div key={label} className={styles.resultRow}>
                  <span className={styles.resultKey}>{label}</span>
                  <span className={`${styles.resultVal} ${styles[cls]}`}>{value}</span>
                </div>
              ))}
            </div>
          </div>

          <div className={`${styles.alert} ${styles[alertType]}`}>{alertMsg}</div>
        </div>
      </div>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Projeção anual de reserva</h2>
        <div className={styles.chartCard}>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#ffffff08" />
              <XAxis dataKey="name" tick={{ fill: '#888', fontSize: 11, fontFamily: 'DM Mono' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: '#888', fontSize: 10, fontFamily: 'DM Mono' }} axisLine={false} tickLine={false} tickFormatter={v => `${(v / 1000).toFixed(1)}k`} />
              <Tooltip contentStyle={{ background: '#18181f', border: '1px solid #ffffff12', borderRadius: 8, fontFamily: 'DM Mono', fontSize: 12 }} formatter={v => fmt(v)} />
              <Legend wrapperStyle={{ fontSize: 11, fontFamily: 'DM Mono' }} />
              <Line type="monotone" dataKey="Reserva" stroke="#7c6cff" strokeWidth={2} dot={false} />
              <Line type="monotone" dataKey="Meta" stroke="#c8ff00" strokeWidth={1.5} strokeDasharray="6 3" dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </section>
    </div>
  )
}
