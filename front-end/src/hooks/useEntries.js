import { useState, useEffect } from 'react'

const API_URL = 'http://localhost:3001/api/transactions'

export function useEntries() {
  const [entries, setEntries] = useState([])
  const [loading, setLoading] = useState(true)

  //carrega transações da API (GET)
    useEffect(() => {
    async function loadEntries() {
      console.log('🔄 Carregando dados da API...')
      try {
        const response = await fetch(API_URL)
        console.log('📡 Resposta da API:', response.status)
        if (!response.ok) throw new Error('Erro ao carregar dados')
        const data = await response.json()
        console.log('📦 Dados recebidos:', data)
        
        // Array fixo com os meses abreviados
        const monthNames = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];

        // Converte para o formato do front-end
        const formatted = data.map(item => {
          const date = new Date(item.date);
          const monthIndex = date.getMonth();
          const month = monthNames[monthIndex];

          return {
            id: item.id,
            desc: item.description,
            type: item.type,
            value: parseFloat(item.amount),
            month: month, 
            category: item.category || 'Outros'
          }
        })
        console.log('✅ Dados formatados:', formatted)
        setEntries(formatted)
      } catch (error) {
        console.error('❌ Erro ao carregar transações:', error)
        // Fallback: tenta carregar do localStorage
        const saved = localStorage.getItem('finfreela_entries')
        if (saved) {
          setEntries(JSON.parse(saved))
        }
      } finally {
        setLoading(false)
      }
    }
    loadEntries()
  }, [])

  //adiciona transação (POST)
  async function addEntry(entry) {
  const newEntry = {
    description: entry.desc,
    amount: entry.value,
    type: entry.type,
    category: entry.category || 'Outros',
    month: entry.month 
  }

  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newEntry)
    })
    if (!response.ok) throw new Error('Erro ao criar transação')
    
    const created = await response.json()
    setEntries(prev => [...prev, {
      id: created.id,
      desc: created.description,
      type: created.type,
      value: parseFloat(created.amount),
      month: created.month, 
      category: created.category || 'Outros'
    }])
  } catch (error) {
    console.error('Erro ao adicionar transação:', error)
    // Fallback: salva localmente se a API falhar
    setEntries(prev => [...prev, { ...entry, id: Date.now() }])
  }
}

  //remove transação (DELETE)
  async function removeEntry(id) {
    try {
      const response = await fetch(`${API_URL}/${id}`, {
        method: 'DELETE'
      })
      if (!response.ok) throw new Error('Erro ao deletar transação')
      
      setEntries(prev => prev.filter(e => e.id !== id))
    } catch (error) {
      console.error('Erro ao remover transação:', error)
      // Fallback: remove localmente
      setEntries(prev => prev.filter(e => e.id !== id))
    }
  }

  // atualiza transação (PUT)
  async function updateEntry(id, updatedData) {
    try {
      const response = await fetch(`${API_URL}/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          description: updatedData.desc,
          amount: updatedData.value,
          category: updatedData.category
        })
      })
      if (!response.ok) throw new Error('Erro ao atualizar transação')
      
      const updated = await response.json()
      setEntries(prev => prev.map(entry =>
        entry.id === id ? {
          ...entry,
          desc: updated.description,
          value: parseFloat(updated.amount),
          category: updated.category || entry.category
        } : entry
      ))
    } catch (error) {
      console.error('Erro ao atualizar transação:', error)
      // Fallback: atualiza localmente
      setEntries(prev => prev.map(entry =>
        entry.id === id ? { ...entry, ...updatedData } : entry
      ))
    }
  }

  function getByMonth(month) {
    return entries.filter(e => e.month === month)
  }

  function getUsedMonths() {
    return [...new Set(entries.map(e => e.month))]
  }

  return { 
    entries, 
    addEntry, 
    removeEntry, 
    updateEntry, 
    getByMonth, 
    getUsedMonths,
    loading 
  }
}