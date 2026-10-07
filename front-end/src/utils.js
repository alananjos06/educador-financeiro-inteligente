export const MONTHS = ['Jan','Fev','Mar','Abr','Mai','Jun','Jul','Ago','Set','Out','Nov','Dez']

export function fmt(value) {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value)
}

export function calcTotals(entries) {
  const totalIn = entries
    .filter(e => e.type === 'entrada')
    .reduce((sum, e) => sum + e.value, 0)

  const totalOut = entries
    .filter(e => e.type === 'saída')
    .reduce((sum, e) => sum + e.value, 0)

  return { totalIn, totalOut, balance: totalIn - totalOut }
}

export function formatEixo(v) {
  if (Math.abs(v) < 1000) {
    return Math.round(v).toLocaleString('pt-BR') // abaixo de mil mostra inteiro
  }
  return `${(v / 1000).toLocaleString('pt-BR', { maximumFractionDigits: 1 })}k` // vírgula decimal
}
