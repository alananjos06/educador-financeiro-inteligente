import { useState } from 'react'
import Header from './components/Header.jsx'
import Dashboard from './components/Dashboard.jsx'
import Simulador from './components/Simulador.jsx'
import styles from './App.module.css'

export default function App() {
  const [tab, setTab] = useState('dashboard')

  return (
    <div className={styles.app}>
      <Header tab={tab} setTab={setTab} />
      <main className={styles.main}>
        {tab === 'dashboard' ? <Dashboard /> : <Simulador />}
      </main>
    </div>
  )
}
