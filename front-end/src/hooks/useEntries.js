import { useState, useEffect } from 'react'
import { transactionService } from '../services/transactionService'

export function useEntries() {
  const [entries, setEntries] = useState([])
  const [loading, setLoading] = useState(true)

  // Carrega transações da API/PostgreSQL
  useEffect(() => {
    async function loadEntries() {
      try {
        const data = await transactionService.getAll()
        setEntries(data)
      } catch (error) {
        console.error('❌ Erro ao carregar transações:', error)
      } finally {
        setLoading(false)
      }
    }
    loadEntries()
  }, [])

  // Adiciona transação
  async function addEntry(entry) {
    try {
      const newEntry = await transactionService.create(entry)
      setEntries(prev => [...prev, newEntry])
    } catch (error) {
      console.error('❌ Erro ao adicionar transação:', error)
    }
  }

  // Remove transação
  async function removeEntry(id) {
    try {
      await transactionService.remove(id)
      setEntries(prev => prev.filter(e => e.id !== id))
    } catch (error) {
      console.error('❌ Erro ao remover transação:', error)
    }
  }

  // Atualiza transação
  async function updateEntry(id, updatedData) {
    try {
      const updated = await transactionService.update(id, updatedData)
      setEntries(prev => prev.map(entry =>
        entry.id === id ? { ...entry, ...updated } : entry
      ))
    } catch (error) {
      console.error('❌ Erro ao atualizar transação:', error)
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