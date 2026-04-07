import { useState } from 'react'
import TicketList from './components/TicketList'
import TicketForm from './components/TicketForm'

function App() {
  const [view, setView] = useState('list') // 'list' | 'create'

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800">
      <div className="max-w-5xl mx-auto p-6">
        <header className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-semibold">SmartCampus — Tickets</h1>
          <div className="space-x-2">
            <button className="px-3 py-1 bg-white border rounded shadow-sm text-sm" onClick={() => setView('list')}>View Tickets</button>
            <button className="px-3 py-1 bg-blue-600 text-white rounded text-sm" onClick={() => setView('create')}>Create Ticket</button>
          </div>
        </header>

        <main className="bg-white rounded-lg shadow p-6">
          {view === 'list' ? <TicketList /> : <TicketForm onCreated={() => setView('list')} />}
        </main>

        <footer className="mt-6 text-sm text-slate-500">Frontend demo connecting to /api/tickets</footer>
      </div>
    </div>
  )
}

export default App
