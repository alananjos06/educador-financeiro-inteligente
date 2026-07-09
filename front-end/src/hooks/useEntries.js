import { useState, useEffect } from 'react'
import { db } from '../firebase'
import {
  collection,
  getDocs,
  addDoc,
  deleteDoc,
  updateDoc,
  doc
} from 'firebase/firestore'

const COLLECTION_NAME = 'transactions'

export function useEntries() {
  const [entries, setEntries] = useState([])
  const [loading, setLoading] = useState(true)

  // carrega transações do Firestore
  useEffect(() => {
    async function loadEntries() {
      try {
        const querySnapshot = await getDocs(collection(db, COLLECTION_NAME))
        const data = querySnapshot.docs.map(docSnap => ({
          id: docSnap.id,
          ...docSnap.data()
        }))
        setEntries(data)
      } catch (error) {
        console.error('❌ Erro ao carregar transações:', error)
      } finally {
        setLoading(false)
      }
    }
    loadEntries()
  }, [])

  // adiciona transação
  async function addEntry(entry) {
    try {
      const docRef = await addDoc(collection(db, COLLECTION_NAME), {
        desc: entry.desc,
        value: entry.value,
        type: entry.type,
        category: entry.category || 'Outros',
        month: entry.month
      })
      setEntries(prev => [...prev, { id: docRef.id, ...entry }])
    } catch (error) {
      console.error('❌ Erro ao adicionar transação:', error)
    }
  }

  // remove transação
  async function removeEntry(id) {
    try {
      await deleteDoc(doc(db, COLLECTION_NAME, id))
      setEntries(prev => prev.filter(e => e.id !== id))
    } catch (error) {
      console.error('❌ Erro ao remover transação:', error)
    }
  }

  // atualiza transação
  async function updateEntry(id, updatedData) {
    try {
      await updateDoc(doc(db, COLLECTION_NAME, id), updatedData)
      setEntries(prev => prev.map(entry =>
        entry.id === id ? { ...entry, ...updatedData } : entry
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