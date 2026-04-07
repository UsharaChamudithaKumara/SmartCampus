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

  function statusBadge(s) {
    const map = {
      OPEN: 'bg-yellow-100 text-yellow-800',
      IN_PROGRESS: 'bg-blue-100 text-blue-800',
      RESOLVED: 'bg-green-100 text-green-800',
      CLOSED: 'bg-gray-200 text-gray-700'
    }
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-semibold ${map[s]}`}>
        {s?.replace('_', ' ')}
      </span>
    )
  }

  return (
    <section className="bg-white rounded-xl shadow-md p-6 transition-all duration-300 hover:shadow-lg">

      {/* HEADER */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-gray-800">🎫 Tickets</h2>

        <button
          onClick={load}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 transition"
        >
          Refresh
        </button>
      </div>

      {/* LOADING */}
      {loading && (
        <div className="flex justify-center py-10">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      )}

      {/* ERROR */}
      {error && (
        <p className="text-red-500 text-sm text-center">{error}</p>
      )}

      {/* EMPTY */}
      {!loading && tickets.length === 0 && (
        <p className="text-center text-gray-500">No tickets found</p>
      )}

      {/* TABLE */}
      {tickets.length > 0 && (
        <div className="overflow-x-auto">
          <table className="w-full border-separate border-spacing-y-2">

            <thead>
              <tr className="text-left text-gray-600 text-sm">
                <th className="px-4">Title</th>
                <th className="px-4">Category</th>
                <th className="px-4">Priority</th>
                <th className="px-4">Status</th>
                <th className="px-4">User</th>
                <th className="px-4">Image</th>
              </tr>
            </thead>

            <tbody>
              {tickets.map((t, i) => (
                <tr
                  key={t.id}
                  className="bg-gray-50 hover:bg-blue-50 transition duration-300 rounded-lg shadow-sm"
                  style={{
                    animation: `fadeIn 0.4s ease forwards`,
                    animationDelay: `${i * 0.05}s`
                  }}
                >
                  <td className="px-4 py-3 font-medium text-gray-800">{t.title}</td>
                  <td className="px-4 py-3 text-gray-600">{t.category}</td>
                  <td className="px-4 py-3">
                    <span className="px-2 py-1 bg-gray-200 rounded text-xs">
                      {t.priority}
                    </span>
                  </td>
                  <td className="px-4 py-3">{statusBadge(t.status)}</td>
                  <td className="px-4 py-3 text-gray-600">{t.userId}</td>

                  <td className="px-4 py-3">
                    {t.imageUrl ? (
                      <img
                        src={`http://localhost:8080/${t.imageUrl}`}
                        alt="ticket"
                        className="w-12 h-12 object-cover rounded-lg border hover:scale-110 transition"
                      />
                    ) : (
                      <span className="text-gray-400">No Image</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>

          </table>
        </div>
      )}

      {/* ANIMATION STYLE */}
      <style>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>

    </section>
  )
}