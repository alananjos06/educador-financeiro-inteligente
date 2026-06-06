import { useState, useEffect } from 'react' 

const SAMPLE_DATA = [
  { id: 1, desc: 'Projeto Website', type: 'entrada', value: 4500, month: 'Sep', category: 'Projeto' },
  { id: 2, desc: 'Aluguel escritório', type: 'saída', value: 800, month: 'Sep', category: 'Fixo' },
  { id: 3, desc: 'Consultoria RH', type: 'entrada', value: 2200, month: 'Jun', category: 'Consultoria' },
  { id: 4, desc: 'Assinaturas', type: 'saída', value: 350, month: 'Jun', category: 'Operacional' },
  { id: 5, desc: 'Freelance Design', type: 'entrada', value: 1800, month: 'Abr', category: 'Projeto' },
  { id: 6, desc: 'Marketing ads', type: 'saída', value: 400, month: 'Abr', category: 'Marketing' },
  { id: 7, desc: 'Projeto App', type: 'entrada', value: 6000, month: 'Mar', category: 'Projeto' },
  { id: 8, desc: 'Contador', type: 'saída', value: 500, month: 'Mar', category: 'Fixo' },
]

export function useEntries() {
  const [entries, setEntries] = useState(() => {
    const saved = localStorage.getItem('finfreela_entries')
    return saved ? JSON.parse(saved) : SAMPLE_DATA
  })

  // Salva no localStorage sempre que o entries mudar
  useEffect(() => {
    localStorage.setItem('finfreela_entries', JSON.stringify(entries))
  }, [entries])

  function addEntry(entry) {
    setEntries(prev => [...prev, { ...entry, id: Date.now() }])
  }

  function removeEntry(id) {
    setEntries(prev => prev.filter(e => e.id !== id))
  }

  // atualiza um lançamento já existente
  function updateEntry(id, updatedData) {
    setEntries(prev => prev.map(entry => 
      entry.id === id ? { ...entry, ...updatedData } : entry
    ))
  }

  function getByMonth(month) {
    return entries.filter(e => e.month === month)
  }

  function getUsedMonths() {
    return [...new Set(entries.map(e => e.month))]
  }

  return { entries, addEntry, removeEntry, updateEntry, getByMonth, getUsedMonths }
}