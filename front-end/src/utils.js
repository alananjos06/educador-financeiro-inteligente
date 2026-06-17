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
