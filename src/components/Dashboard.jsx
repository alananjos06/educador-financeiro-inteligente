import { useState, useMemo } from 'react'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend } from 'recharts'
import { useEntries } from '../hooks/useEntries.js'
import { MONTHS, fmt, calcTotals } from '../utils.js'
import styles from './Dashboard.module.css'

const EMPTY_FORM = { desc: '', type: 'entrada', value: '', month: 'Mai', category: 'Projeto' }

export default function Dashboard() {
  const { entries, addEntry, removeEntry, updateEntry, getByMonth, getUsedMonths } = useEntries()
  const [form, setForm] = useState(EMPTY_FORM)
  const [filterMonth, setFilterMonth] = useState('Mai')
  const [editingId, setEditingId] = useState(null)
  const [editForm, setEditForm] = useState({ desc: '', value: '' })
  const CATEGORIES = ['Projeto', 'Fixo', 'Operacional', 'Marketing', 'Educação', 'Saúde', 'Alimentação', 'Transporte', 'Outros']

  const filtered = useMemo(() => getByMonth(filterMonth), [entries, filterMonth])
  const { totalIn, totalOut, balance } = useMemo(() => calcTotals(filtered), [filtered])
  const usedMonths = getUsedMonths()

  const proLabore = totalIn * 0.4
  const impostos = totalIn * 0.15
  const reserva = totalIn * 0.1

  const chartData = useMemo(() =>
    MONTHS.filter(m => usedMonths.includes(m)).map(m => {
      const mes = entries.filter(e => e.month === m)
      return {
        name: m,
        Entradas: mes.filter(e => e.type === 'entrada').reduce((s, e) => s + e.value, 0),
        Saídas: mes.filter(e => e.type === 'saída').reduce((s, e) => s + e.value, 0),
      }
    }), [entries])

  function handleAdd() {
    if (!form.desc || !form.value) return
    addEntry({ ...form, value: parseFloat(form.value) })
    setForm(EMPTY_FORM)
  }

  function startEdit(entry) {
  setEditingId(entry.id)
  setEditForm({ desc: entry.desc, value: entry.value })
}

function cancelEdit() {
  setEditingId(null)
  setEditForm({ desc: '', value: '' })
}

function saveEdit(id) {
  if (!editForm.desc.trim() || !editForm.value) return
  updateEntry(id, { 
    desc: editForm.desc, 
    value: parseFloat(editForm.value) 
  })
  cancelEdit()
}

function exportToCSV() {
  // Prepara os dados para o CSV
  const headers = ['Descrição', 'Tipo', 'Valor (R$)', 'Mês', 'Categoria']
  
  const rows = entries.map(entry => [
    entry.desc,
    entry.type === 'entrada' ? 'Entrada' : 'Saída',
    entry.value.toFixed(2).replace('.', ','),
    entry.month,
    entry.category
  ])
  
  // Converte para formato CSV
  const csvContent = [
    headers.join(','),
    ...rows.map(row => row.join(','))
  ].join('\n')
  
  // Adiciona BOM para acentos funcionarem no Excel
  const blob = new Blob(["\uFEFF" + csvContent], { type: 'text/csv;charset=utf-8;' })
  
  // Cria link para download
  const link = document.createElement('a')
  const url = URL.createObjectURL(blob)
  link.href = url
  link.setAttribute('download', `finfreela_${new Date().toISOString().slice(0,10)}.csv`)
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}

  function handleChange(field, value) {
    setForm(prev => ({ ...prev, [field]: value }))
  }

  return (
    <div>
      <div className={styles.hero}>
        <p className={styles.tag}>// dashboard financeiro</p>
        <h1 className={styles.title}>Suas finanças,<br /><span>sob controle.</span></h1>
        <p className={styles.sub}>Registre entradas e saídas e acompanhe sua saúde financeira mês a mês.</p>
    </div>

      <div className={styles.monthSelector}>
        {MONTHS.filter(m => usedMonths.includes(m)).map(m => (
          <button
            key={m}
            className={`${styles.monthBtn} ${filterMonth === m ? styles.active : ''}`}
            onClick={() => setFilterMonth(m)}
          >
            {m}
          </button>
        ))}
      </div>

      <div className={styles.statsGrid}>
        {[
          { label: 'Receita bruta', value: fmt(totalIn), cls: 'positive', sub: `${filterMonth} ${new Date().getFullYear()}` },
          { label: 'Despesas', value: fmt(totalOut), cls: 'negative', sub: `${filtered.filter(e => e.type === 'saída').length} lançamentos` },
          { label: 'Saldo líquido', value: fmt(balance), cls: balance >= 0 ? 'positive' : 'negative', sub: balance >= 0 ? '✓ positivo' : '⚠ negativo' },
          { label: 'Pró-labore sugerido', value: fmt(proLabore), cls: 'accent', sub: '40% da receita' },
        ].map(({ label, value, cls, sub }) => (
          <div key={label} className={styles.statCard}>
            <div className={styles.statLabel}>{label}</div>
            <div className={`${styles.statValue} ${styles[cls]}`}>{value}</div>
            <div className={styles.statSub}>{sub}</div>
          </div>
        ))}
      </div>

      <section className={styles.section}>
  <h2 className={styles.sectionTitle}>Novo lançamento</h2>
  <div className={styles.card}>
    <div className={styles.formRow}>
      <div className={styles.field}>
        <label>Descrição</label>
        <input value={form.desc} onChange={e => handleChange('desc', e.target.value)} placeholder="ex: Projeto cliente X" />
      </div>
      <div className={styles.field}>
        <label>Tipo</label>
        <select value={form.type} onChange={e => handleChange('type', e.target.value)}>
          <option value="entrada">Entrada</option>
          <option value="saída">Saída</option>
        </select>
      </div>
      <div className={styles.field}>
        <label>Valor (R$)</label>
        <input type="number" value={form.value} onChange={e => handleChange('value', e.target.value)} placeholder="0,00" />
      </div>
      <div className={styles.field}>
        <label>Mês</label>
        <select value={form.month} onChange={e => handleChange('month', e.target.value)}>
          {MONTHS.map(m => <option key={m}>{m}</option>)}
        </select>
      </div>
      <div className={styles.field}>
        <label>Categoria</label>
        <select value={form.category} onChange={e => handleChange('category', e.target.value)}>
          {CATEGORIES.map(cat => <option key={cat}>{cat}</option>)}
        </select>
      </div>
    </div>
    <button className={styles.btnAccent} onClick={handleAdd}>+ Adicionar</button>
  </div>
</section>

      <section className={styles.section}>
  <div className={styles.sectionHeader}>
    <h2 className={styles.sectionTitle}>Lançamentos — {filterMonth}</h2>
    <button className={styles.btnExport} onClick={exportToCSV}>
      📥 Exportar CSV
    </button>
  </div>
  <div className={styles.card}>
    {filtered.length === 0 ? (
      <div className={styles.empty}>
        <span>📭</span>
        <p>Nenhum lançamento em {filterMonth}.</p>
      </div>
    ) : (
      <div className={styles.tableWrap}>
        <table>
          <thead>
            <tr>
              <th>Descrição</th>
              <th>Tipo</th>
              <th>Categoria</th>
              <th>Valor</th>
              <th></th>
            </tr>
          </thead>
  <tbody>
    {filtered.map(e => (
    <tr key={e.id}>
      <td>
        {editingId === e.id ? (
          <input 
            value={editForm.desc} 
            onChange={e => setEditForm({ ...editForm, desc: e.target.value })}
            className={styles.editInput}
          />
        ) : (
          e.desc
        )}
      </td>
      <td>
        <span className={`${styles.badge} ${e.type === 'entrada' ? styles.badgeIn : styles.badgeOut}`}>
          {e.type}
        </span>
      </td>
      <td className={styles.muted}>{e.category}</td>
      <td style={{ color: e.type === 'entrada' ? 'var(--success)' : 'var(--danger)' }}>
        {editingId === e.id ? (
          <input 
            type="number"
            value={editForm.value} 
            onChange={e => setEditForm({ ...editForm, value: e.target.value })}
            className={styles.editInput}
            style={{ width: '100px' }}
          />
        ) : (
          `${e.type === 'entrada' ? '+' : '-'}${fmt(e.value)}`
        )}
      </td>
      <td>
        {editingId === e.id ? (
          <>
            <button className={styles.btnSave} onClick={() => saveEdit(e.id)}>✓</button>
            <button className={styles.btnCancel} onClick={cancelEdit}>✗</button>
          </>
        ) : (
          <>
            <button className={styles.btnEdit} onClick={() => startEdit(e)}>✏️</button>
            <button className={styles.btnRemove} onClick={() => removeEntry(e.id)}>×</button>
          </>
        )}
      </td>
    </tr>
  ))}
</tbody>
              </table>
            </div>
          )}
        </div>
      </section>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Evolução mensal</h2>
        <div className={styles.chartCard}>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={chartData} barGap={4}>
              <CartesianGrid strokeDasharray="3 3" stroke="#ffffff08" />
              <XAxis dataKey="name" tick={{ fill: '#888', fontSize: 11, fontFamily: 'DM Mono' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: '#888', fontSize: 10, fontFamily: 'DM Mono' }} axisLine={false} tickLine={false} tickFormatter={v => `${(v / 1000).toFixed(0)}k`} />
              <Tooltip contentStyle={{ background: '#18181f', border: '1px solid #ffffff12', borderRadius: 8, fontFamily: 'DM Mono', fontSize: 12 }} formatter={v => fmt(v)} />
              <Legend wrapperStyle={{ fontSize: 11, fontFamily: 'DM Mono' }} />
              <Bar dataKey="Entradas" fill="#00e5a0" radius={[4, 4, 0, 0]} />
              <Bar dataKey="Saídas" fill="#ff4545" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </section>

      {totalIn > 0 && (
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Distribuição recomendada — {filterMonth}</h2>
          <div className={styles.card}>
            <div className={styles.resultBlock} style={{ borderColor: 'var(--accent3)' }}>
              {[
                { label: '🧾 Impostos (25%)', value: fmt(impostos), cls: 'danger' },
                { label: '🏦 Reserva de segurança (10%)', value: fmt(reserva), cls: 'purple' },
                { label: '💼 Reinvestimento no negócio (35%)', value: fmt(totalIn * 0.35), cls: 'orange' },
                { label: '✅ Pró-labore (30%)', value: fmt(proLabore), cls: 'accent' },
              ].map(({ label, value, cls }) => (
                <div key={label} className={styles.resultRow}>
                  <span className={styles.resultKey}>{label}</span>
                  <span className={`${styles.resultVal} ${styles[cls]}`}>{value}</span>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  )
}
