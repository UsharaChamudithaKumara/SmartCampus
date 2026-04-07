import { useEffect, useState } from 'react'
import { fetchTickets } from '../api'

export default function TicketList() {
  const [tickets, setTickets] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  async function load() {
    setLoading(true)
    setError(null)
    try {
      const data = await fetchTickets()
      setTickets(data)
    } catch (e) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() }, [])

  return (
    <section>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-medium">Tickets</h2>
        <button className="px-3 py-1 bg-white border rounded shadow-sm text-sm" onClick={load}>Refresh</button>
      </div>

      {loading && <p className="text-sm text-slate-500">Loading…</p>}
      {error && <p className="text-sm text-red-600">{error}</p>}

      {!loading && tickets.length === 0 && <p className="text-sm text-slate-600">No tickets found.</p>}

      {tickets.length > 0 && (
        <div className="overflow-x-auto">
          <table className="min-w-full table-auto border-collapse">
            <thead>
              <tr className="bg-slate-100 text-left">
                <th className="px-3 py-2 text-sm">Title</th>
                <th className="px-3 py-2 text-sm">Category</th>
                <th className="px-3 py-2 text-sm">Priority</th>
                <th className="px-3 py-2 text-sm">Status</th>
                <th className="px-3 py-2 text-sm">User</th>
                <th className="px-3 py-2 text-sm">Image</th>
              </tr>
            </thead>
            <tbody>
              {tickets.map(t => (
                <tr key={t.id} className="border-b last:border-b-0">
                  <td className="px-3 py-2 text-sm">{t.title}</td>
                  <td className="px-3 py-2 text-sm">{t.category}</td>
                  <td className="px-3 py-2 text-sm">{t.priority}</td>
                  <td className="px-3 py-2 text-sm">{t.status}</td>
                  <td className="px-3 py-2 text-sm">{t.userId}</td>
                  <td className="px-3 py-2 text-sm">
                    {t.imageUrl ? (
                      <a className="text-blue-600 hover:underline" href={t.imageUrl} target="_blank">View</a>
                    ) : (
                      <span className="text-slate-400">—</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  )
}
