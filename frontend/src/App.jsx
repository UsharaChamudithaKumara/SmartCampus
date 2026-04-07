import { useState, useEffect } from 'react'
import TicketList from './components/TicketList'
import TicketForm from './components/TicketForm'

function App() {
  const [view, setView] = useState('list') // 'list' | 'create'

  // open create view if ?view=create in URL
  useEffect(() => {
    try {
      const params = new URLSearchParams(window.location.search)
      if (params.get('view') === 'create') setView('create')
    } catch (e) {}
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 text-neutral-900">
      <div className="max-w-6xl mx-auto p-6 animate-fade-in">
        <header className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-md bg-primary-600 flex items-center justify-center text-white font-bold shadow">SC</div>
            <div>
              <h1 className="text-2xl font-semibold">SmartCampus</h1>
              <p className="text-sm text-slate-500">Ticketing & Facilities</p>
            </div>
          </div>

          <nav className="flex items-center gap-3">
            <button className="px-3 py-1 bg-white border rounded shadow-sm text-sm hover:shadow-md transition" onClick={() => setView('list')}>View Tickets</button>
            <button className="px-3 py-1 bg-primary-600 text-white rounded text-sm hover:bg-primary-700 transform hover:-translate-y-0.5 transition" onClick={() => setView('create')}>Create Ticket</button>
          </nav>
        </header>

        <main className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <section className="lg:col-span-2 bg-white rounded-lg shadow p-6 animate-pop">
            {view === 'list' ? <TicketList /> : <TicketForm onCreated={() => setView('list')} />}
          </section>

          <aside className="hidden lg:block bg-white rounded-lg shadow p-6 animate-fade-in">
            <h3 className="text-lg font-medium mb-3">Overview</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm text-slate-500">Open</div>
                  <div className="text-xl font-semibold">12</div>
                </div>
                <div className="text-primary-600 text-2xl font-bold">↗</div>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm text-slate-500">In Progress</div>
                  <div className="text-xl font-semibold">4</div>
                </div>
                <div className="text-amber-500 text-2xl font-bold">→</div>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm text-slate-500">Resolved</div>
                  <div className="text-xl font-semibold">32</div>
                </div>
                <div className="text-success text-2xl font-bold">✔</div>
              </div>
            </div>
          </aside>
        </main>

        {/* Persistent floating create button */}
        <button
          aria-label="Create ticket"
          onClick={() => setView('create')}
          className="fixed right-6 bottom-6 z-50 w-14 h-14 rounded-full bg-primary-600 text-white shadow-lg flex items-center justify-center text-2xl hover:bg-primary-700 transform hover:-translate-y-1 transition"
        >
          +
        </button>

        <footer className="mt-6 text-sm text-slate-500">Frontend demo connecting to `/api/tickets`</footer>
      </div>
    </div>
  )
}

export default App
