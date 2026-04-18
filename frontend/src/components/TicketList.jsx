import React, { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { fetchTickets } from '../api'
import { RefreshCw, Image as ImageIcon, Ticket as TicketIcon } from 'lucide-react'

export function TicketList({ refreshKey = 0 }) {
  const [tickets, setTickets] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [localRefresh, setLocalRefresh] = useState(0)

  async function load() {
    setLoading(true)
    setError(null)
    try {
      const data = await fetchTickets()
      setTickets(data)
    } catch (e) {
      setError(e?.message || 'Failed to load tickets')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() }, [refreshKey, localRefresh])

  function StatusBadge({ status }) {
    const styles = {
      OPEN: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      IN_PROGRESS: 'bg-blue-100 text-blue-800 border-blue-200',
      RESOLVED: 'bg-green-100 text-green-800 border-green-200',
      CLOSED: 'bg-slate-100 text-slate-700 border-slate-200',
    }
    const style = styles[status] || styles.CLOSED
    return (
      <motion.span
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 500, damping: 25 }}
        className={`px-2.5 py-1 rounded-full text-xs font-semibold border ${style}`}
      >
        {status?.replace('_', ' ')}
      </motion.span>
    )
  }

  function PriorityBadge({ priority }) {
    const styles = {
      LOW: 'text-green-700 bg-green-50 border-green-200',
      MEDIUM: 'text-amber-700 bg-amber-50 border-amber-200',
      HIGH: 'text-orange-700 bg-orange-50 border-orange-200',
      URGENT: 'text-red-700 bg-red-50 border-red-200',
    }
    const style = styles[priority] || styles.LOW
    return (
      <motion.span
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 500, damping: 25, delay: 0.1 }}
        className={`px-2.5 py-1 rounded text-xs font-semibold border ${style}`}
      >
        {priority}
      </motion.span>
    )
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.08, delayChildren: 0.1 } },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20, scale: 0.98 },
    show: { opacity: 1, y: 0, scale: 1, transition: { type: 'spring', stiffness: 300, damping: 24 } },
  }

  const SkeletonRow = () => (
    <tr className="border-b border-slate-100">
      <td className="px-6 py-5">
        <div className="flex flex-col space-y-2">
          <div className="h-4 bg-slate-200 rounded w-3/4 animate-pulse"></div>
          <div className="h-3 bg-slate-100 rounded w-1/2 animate-pulse"></div>
        </div>
      </td>
      <td className="px-6 py-5">
        <div className="h-4 bg-slate-200 rounded w-20 animate-pulse"></div>
      </td>
      <td className="px-6 py-5">
        <div className="h-6 bg-slate-200 rounded-md w-16 animate-pulse"></div>
      </td>
      <td className="px-6 py-5">
        <div className="h-6 bg-slate-200 rounded-full w-24 animate-pulse"></div>
      </td>
      <td className="px-6 py-5 text-center">
        <div className="h-10 w-10 bg-slate-200 rounded-lg mx-auto animate-pulse"></div>
      </td>
    </tr>
  )

  return (
    <motion.section initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, ease: 'easeOut' }} className="bg-white rounded-2xl shadow-sm border border-slate-200 flex flex-col overflow-hidden">
      <div className="flex items-center justify-between p-6 border-b border-slate-100 bg-white z-20">
        <div className="flex items-center space-x-3">
          <div className="p-2.5 bg-blue-50 text-blue-600 rounded-xl">
            <TicketIcon className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-900 tracking-tight">Active Tickets</h2>
            <p className="text-sm text-slate-500 font-medium">Manage and track support requests</p>
          </div>
        </div>

        <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.95 }} onClick={() => setLocalRefresh(r => r + 1)} disabled={loading} className="flex items-center px-4 py-2 bg-white border border-slate-300 text-slate-700 text-sm font-semibold rounded-xl hover:bg-slate-50 hover:text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1 disabled:opacity-50 transition-all shadow-sm">
          <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin text-blue-600' : ''}`} />
          Refresh
        </motion.button>
      </div>

      <div className="flex-1 overflow-auto relative min-h-[500px]">
        {error && !loading && (
          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="flex items-center justify-center h-full p-12">
            <div className="text-center max-w-sm">
              <div className="w-16 h-16 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <RefreshCw className="w-8 h-8" />
              </div>
              <p className="text-red-600 font-semibold text-lg mb-2">{error}</p>
              <p className="text-slate-500 text-sm mb-6">There was a problem communicating with the server.</p>
              <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={() => setLocalRefresh(r => r + 1)} className="px-6 py-2.5 bg-red-50 text-red-700 font-semibold rounded-xl hover:bg-red-100 transition-colors">Try again</motion.button>
            </div>
          </motion.div>
        )}

        {!loading && !error && tickets.length === 0 && (
          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="flex items-center justify-center h-full p-12">
            <div className="text-center">
              <div className="w-20 h-20 bg-slate-50 text-slate-400 rounded-full flex items-center justify-center mx-auto mb-5">
                <TicketIcon className="w-10 h-10" />
              </div>
              <h3 className="text-slate-900 font-bold text-xl mb-2">No tickets found</h3>
              <p className="text-slate-500">Create a new ticket to get started.</p>
            </div>
          </motion.div>
        )}

        {!error && (tickets.length > 0 || loading) && (
          <table className="w-full text-left border-collapse">
            <thead className="bg-slate-50/80 backdrop-blur-sm sticky top-0 z-10 border-b border-slate-200">
              <tr className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                <th className="px-6 py-4">Ticket Details</th>
                <th className="px-6 py-4">Category</th>
                <th className="px-6 py-4">Priority</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-center">Attachment</th>
              </tr>
            </thead>

            {loading ? (
              <tbody className="divide-y divide-slate-100">{[1,2,3,4,5].map(i => <SkeletonRow key={i} />)}</tbody>
            ) : (
              <motion.tbody variants={containerVariants} initial="hidden" animate="show" className="divide-y divide-slate-100">
                {tickets.map(t => (
                  <motion.tr key={t.id} variants={itemVariants} className="hover:bg-slate-50/80 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex flex-col">
                        <span className="font-semibold text-slate-900 group-hover:text-blue-600 transition-colors">{t.title}</span>
                        <span className="text-xs font-medium text-slate-500 mt-1">ID: #{t.id} • User: {t.userId}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4"><span className="text-sm font-medium text-slate-600">{t.category}</span></td>
                    <td className="px-6 py-4"><PriorityBadge priority={t.priority} /></td>
                    <td className="px-6 py-4"><StatusBadge status={t.status} /></td>
                    <td className="px-6 py-4 text-center">{t.imageUrl ? (
                      <motion.div whileHover={{ scale: 1.1, rotate: 2 }} className="inline-flex items-center justify-center w-10 h-10 rounded-lg bg-slate-100 border border-slate-200 overflow-hidden cursor-pointer shadow-sm">
                        <img src={t.imageUrl} alt="Attachment" className="w-full h-full object-cover" />
                      </motion.div>
                    ) : (
                      <div className="inline-flex items-center justify-center w-10 h-10 rounded-lg bg-slate-50 border border-slate-100 text-slate-300"><ImageIcon className="w-4 h-4" /></div>
                    )}</td>
                  </motion.tr>
                ))}
              </motion.tbody>
            )}
          </table>
        )}
      </div>
    </motion.section>
  )
}

export default TicketList
