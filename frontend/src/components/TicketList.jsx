import React, { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import {
  RefreshCw,
  Image as ImageIcon,
  Ticket as TicketIcon,
  X,
  MessageSquare,
  UserCheck,
  ClipboardList,
  Save,
  Trash2,
  Edit3,
  CornerRightUp,
} from 'lucide-react'
import {
  addResolutionNotes,
  addTicketComment,
  assignTechnician,
  deleteTicketComment,
  editTicketComment,
  fetchTicketById,
  fetchVisibleTickets,
  updateTicketStatus,
} from '../api'

function formatDate(value) {
  if (!value) {
    return 'Unknown'
  }

  try {
    return new Date(value).toLocaleString()
  } catch {
    return String(value)
  }
}

function StatusBadge({ status }) {
  const styles = {
    OPEN: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    IN_PROGRESS: 'bg-blue-100 text-blue-800 border-blue-200',
    RESOLVED: 'bg-green-100 text-green-800 border-green-200',
    CLOSED: 'bg-slate-100 text-slate-700 border-slate-200',
    REJECTED: 'bg-red-100 text-red-800 border-red-200',
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

function normalizeTicket(ticket) {
  return {
    ...ticket,
    comments: ticket.comments || [],
    imageUrls: ticket.imageUrls || [],
  }
}

export function TicketList({ refreshKey = 0 }) {
  const [tickets, setTickets] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [localRefresh, setLocalRefresh] = useState(0)
  const [selectedTicket, setSelectedTicket] = useState(null)
  const [commentText, setCommentText] = useState('')
  const [editingCommentId, setEditingCommentId] = useState(null)
  const [editingCommentText, setEditingCommentText] = useState('')
  const [assignedTo, setAssignedTo] = useState('')
  const [status, setStatus] = useState('OPEN')
  const [statusReason, setStatusReason] = useState('')
  const [resolutionNotes, setResolutionNotes] = useState('')
  const [actionError, setActionError] = useState(null)
  const [actionMessage, setActionMessage] = useState(null)
  const [saving, setSaving] = useState(false)

  const role = localStorage.getItem('userRole')
  const currentUserId = localStorage.getItem('userEmail') || ''
  const currentUserName = localStorage.getItem('userName') || currentUserId
  const canManage = true;

  async function load() {
    setLoading(true)
    setError(null)
    try {
      const data = await fetchVisibleTickets()
      setTickets((Array.isArray(data) ? data : []).map(normalizeTicket))
    } catch (e) {
      setError(e?.message || 'Failed to load tickets')
    } finally {
      setLoading(false)
    }
  }

  async function refreshTicket(ticketId) {
    const freshTicket = normalizeTicket(await fetchTicketById(ticketId))
    setSelectedTicket(freshTicket)
    setTickets((currentTickets) =>
      currentTickets.map((ticket) => (ticket.id === freshTicket.id ? freshTicket : ticket))
    )
    setAssignedTo(freshTicket.assignedTo || '')
    setStatus(freshTicket.status || 'OPEN')
    setStatusReason(freshTicket.rejectedReason || '')
    setResolutionNotes(freshTicket.resolutionNotes || '')
    setEditingCommentId(null)
    setEditingCommentText('')
    setCommentText('')
  }

  useEffect(() => {
    load()
  }, [refreshKey, localRefresh])

  useEffect(() => {
    if (!selectedTicket) {
      return
    }

    setAssignedTo(selectedTicket.assignedTo || '')
    setStatus(selectedTicket.status || 'OPEN')
    setStatusReason(selectedTicket.rejectedReason || '')
    setResolutionNotes(selectedTicket.resolutionNotes || '')
  }, [selectedTicket])

  async function openTicket(ticket) {
    setActionError(null)
    setActionMessage(null)

    try {
      const freshTicket = normalizeTicket(await fetchTicketById(ticket.id))
      setSelectedTicket(freshTicket)
    } catch {
      setSelectedTicket(normalizeTicket(ticket))
    }
  }

  async function handleAssign() {
    if (!selectedTicket || !assignedTo.trim()) {
      setActionError('Enter a technician name or email.')
      return
    }

    setSaving(true)
    setActionError(null)
    try {
      await assignTechnician(selectedTicket.id, assignedTo.trim())
      setActionMessage('Technician assigned successfully.')
      await refreshTicket(selectedTicket.id)
      setLocalRefresh((value) => value + 1)
    } catch (e) {
      setActionError(e?.message || 'Failed to assign technician')
    } finally {
      setSaving(false)
    }
  }

  async function handleStatusSave() {
    if (!selectedTicket) {
      return
    }

    if (status === 'REJECTED' && !statusReason.trim()) {
      setActionError('Rejected tickets require a reason.')
      return
    }

    setSaving(true)
    setActionError(null)
    try {
      await updateTicketStatus(selectedTicket.id, status, status === 'REJECTED' ? statusReason.trim() : '')
      setActionMessage('Ticket status updated.')
      await refreshTicket(selectedTicket.id)
      setLocalRefresh((value) => value + 1)
    } catch (e) {
      setActionError(e?.message || 'Failed to update status')
    } finally {
      setSaving(false)
    }
  }

  async function handleResolutionSave() {
    if (!selectedTicket || !resolutionNotes.trim()) {
      setActionError('Enter resolution notes first.')
      return
    }

    setSaving(true)
    setActionError(null)
    try {
      await addResolutionNotes(selectedTicket.id, resolutionNotes.trim())
      setActionMessage('Resolution notes saved.')
      await refreshTicket(selectedTicket.id)
      setLocalRefresh((value) => value + 1)
    } catch (e) {
      setActionError(e?.message || 'Failed to save resolution notes')
    } finally {
      setSaving(false)
    }
  }

  async function handleAddComment() {
    if (!selectedTicket || !commentText.trim()) {
      return
    }

    setSaving(true)
    setActionError(null)
    try {
      await addTicketComment(selectedTicket.id, {
        authorId: currentUserId,
        authorName: currentUserName,
        text: commentText.trim(),
      })
      setCommentText('')
      await refreshTicket(selectedTicket.id)
      setActionMessage('Comment added.')
      setLocalRefresh((value) => value + 1)
    } catch (e) {
      setActionError(e?.message || 'Failed to add comment')
    } finally {
      setSaving(false)
    }
  }

  async function handleSaveComment() {
    if (!selectedTicket || !editingCommentId || !editingCommentText.trim()) {
      return
    }

    setSaving(true)
    setActionError(null)
    try {
      await editTicketComment(selectedTicket.id, editingCommentId, {
        authorId: currentUserId,
        text: editingCommentText.trim(),
      })
      setEditingCommentId(null)
      setEditingCommentText('')
      await refreshTicket(selectedTicket.id)
      setActionMessage('Comment updated.')
      setLocalRefresh((value) => value + 1)
    } catch (e) {
      setActionError(e?.message || 'Failed to edit comment')
    } finally {
      setSaving(false)
    }
  }

  async function handleDeleteComment(commentId) {
    if (!selectedTicket) {
      return
    }

    const confirmed = window.confirm('Delete this comment?')
    if (!confirmed) {
      return
    }

    setSaving(true)
    setActionError(null)
    try {
      await deleteTicketComment(selectedTicket.id, commentId, currentUserId)
      await refreshTicket(selectedTicket.id)
      setActionMessage('Comment deleted.')
      setLocalRefresh((value) => value + 1)
    } catch (e) {
      setActionError(e?.message || 'Failed to delete comment')
    } finally {
      setSaving(false)
    }
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
    <>
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className="bg-white rounded-2xl shadow-sm border border-slate-200 flex flex-col overflow-hidden"
      >
        <div className="flex items-center justify-between p-6 border-b border-slate-100 bg-white z-20">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 bg-blue-50 text-blue-600 rounded-xl">
              <TicketIcon className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900 tracking-tight">
                {role === 'USER' ? 'My Tickets' : 'Active Tickets'}
              </h2>
              <p className="text-sm text-slate-500 font-medium">
                {role === 'USER' ? 'Track your submitted tickets' : 'Manage and track support requests'}
              </p>
            </div>
          </div>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setLocalRefresh((value) => value + 1)}
            disabled={loading}
            className="flex items-center px-4 py-2 bg-white border border-slate-300 text-slate-700 text-sm font-semibold rounded-xl hover:bg-slate-50 hover:text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1 disabled:opacity-50 transition-all shadow-sm"
          >
            <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin text-blue-600' : ''}`} />
            Refresh
          </motion.button>
        </div>

        <div className="flex-1 overflow-auto relative min-h-[500px]">
          {error && !loading && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex items-center justify-center h-full p-12"
            >
              <div className="text-center max-w-sm">
                <div className="w-16 h-16 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <RefreshCw className="w-8 h-8" />
                </div>
                <p className="text-red-600 font-semibold text-lg mb-2">{error}</p>
                <p className="text-slate-500 text-sm mb-6">
                  There was a problem communicating with the server.
                </p>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setLocalRefresh((value) => value + 1)}
                  className="px-6 py-2.5 bg-red-50 text-red-700 font-semibold rounded-xl hover:bg-red-100 transition-colors"
                >
                  Try again
                </motion.button>
              </div>
            </motion.div>
          )}

          {!loading && !error && tickets.length === 0 && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex items-center justify-center h-full p-12"
            >
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
                  <th className="px-6 py-4 text-center">Action</th>
                </tr>
              </thead>

              {loading ? (
                <tbody className="divide-y divide-slate-100">{[1, 2, 3, 4, 5].map((index) => <SkeletonRow key={index} />)}</tbody>
              ) : (
                <motion.tbody
                  initial="hidden"
                  animate="show"
                  className="divide-y divide-slate-100"
                >
                  {tickets.map((ticket) => (
                    <motion.tr
                      key={ticket.id}
                      className="hover:bg-slate-50/80 transition-colors group"
                    >
                      <td className="px-6 py-4">
                        <div className="flex flex-col">
                          <span className="font-semibold text-slate-900 group-hover:text-blue-600 transition-colors">
                            {ticket.title}
                          </span>
                          <span className="text-xs font-medium text-slate-500 mt-1">
                            ID: #{ticket.id} • User: {ticket.userId}
                          </span>
                          <span className="text-xs font-medium text-slate-400 mt-1">
                            {ticket.location ? `Location: ${ticket.location}` : 'No location set'}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm font-medium text-slate-600">{ticket.category}</span>
                      </td>
                      <td className="px-6 py-4">
                        <PriorityBadge priority={ticket.priority} />
                      </td>
                      <td className="px-6 py-4">
  {canManage ? (
    <select
      value={ticket.status}
      onChange={(e) => updateTicketStatus(ticket.id, e.target.value)}
      className="border rounded px-2 py-1 text-sm"
    >
      <option value="OPEN">OPEN</option>
      <option value="IN_PROGRESS">IN_PROGRESS</option>
      <option value="RESOLVED">RESOLVED</option>
      <option value="CLOSED">CLOSED</option>
      <option value="REJECTED">REJECTED</option>
    </select>
  ) : (
    <StatusBadge status={ticket.status} />
  )}
</td>
                      <td className="px-6 py-4 text-center">
                        {ticket.imageUrl || (ticket.imageUrls && ticket.imageUrls.length > 0) ? (
                          <motion.div
                            whileHover={{ scale: 1.1, rotate: 2 }}
                            className="inline-flex items-center justify-center w-10 h-10 rounded-lg bg-slate-100 border border-slate-200 overflow-hidden cursor-pointer shadow-sm"
                          >
                            <img
                              src={ticket.imageUrl ? ticket.imageUrl : ticket.imageUrls[0]}
                              alt="Attachment"
                              className="w-full h-full object-cover"
                            />
                          </motion.div>
                        ) : (
                          <div className="inline-flex items-center justify-center w-10 h-10 rounded-lg bg-slate-50 border border-slate-100 text-slate-300">
                            <ImageIcon className="w-4 h-4" />
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4 text-center">
                        <motion.button
                          whileHover={{ scale: 1.04 }}
                          whileTap={{ scale: 0.96 }}
                          onClick={() => openTicket(ticket)}
                          className="inline-flex items-center gap-2 px-3 py-2 rounded-xl border border-slate-200 text-slate-700 bg-white hover:bg-blue-50 hover:text-blue-700 hover:border-blue-200 transition-colors text-sm font-semibold"
                        >
                          <ClipboardList className="w-4 h-4" />
                          Open
                        </motion.button>
                      </td>
                    </motion.tr>
                  ))}
                </motion.tbody>
              )}
            </table>
          )}
        </div>
      </motion.section>

      <AnimatePresence>
        {selectedTicket && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-slate-950/50 backdrop-blur-sm p-4 sm:p-6 overflow-y-auto"
            onClick={() => setSelectedTicket(null)}
          >
            <motion.div
              initial={{ y: 24, opacity: 0, scale: 0.98 }}
              animate={{ y: 0, opacity: 1, scale: 1 }}
              exit={{ y: 24, opacity: 0, scale: 0.98 }}
              transition={{ type: 'spring', stiffness: 260, damping: 24 }}
              onClick={(event) => event.stopPropagation()}
              className="mx-auto max-w-6xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden"
            >
              <div className="flex items-start justify-between gap-4 p-6 border-b border-slate-200 bg-gradient-to-r from-slate-50 to-white">
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.2em] text-slate-500">Ticket Details</p>
                  <h3 className="mt-2 text-2xl font-bold text-slate-900">{selectedTicket.title}</h3>
                  <p className="mt-1 text-sm text-slate-500">
                    Ticket #{selectedTicket.id} • {selectedTicket.location || 'No location set'}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setSelectedTicket(null)}
                  className="p-2 rounded-xl hover:bg-slate-100 text-slate-500 hover:text-slate-900 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="grid grid-cols-1 xl:grid-cols-[1.2fr_0.8fr] gap-0">
                <div className="p-6 space-y-6 border-b xl:border-b-0 xl:border-r border-slate-200">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="rounded-2xl border border-slate-200 p-4">
                      <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Status</p>
                      <div className="mt-2 flex items-center gap-2">
                        <StatusBadge status={selectedTicket.status} />
                        <PriorityBadge priority={selectedTicket.priority} />
                      </div>
                    </div>
                    <div className="rounded-2xl border border-slate-200 p-4">
                      <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Reporter</p>
                      <p className="mt-2 text-sm font-semibold text-slate-900">{selectedTicket.userId}</p>
                      <p className="mt-1 text-xs text-slate-500">Submitted at {formatDate(selectedTicket.createdAt)}</p>
                    </div>
                  </div>

                  <div className="rounded-2xl border border-slate-200 p-4">
                    <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Description</p>
                    <p className="mt-2 text-sm leading-6 text-slate-700 whitespace-pre-wrap">{selectedTicket.description}</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="rounded-2xl border border-slate-200 p-4">
                      <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Resource</p>
                      <p className="mt-2 text-sm text-slate-700">{selectedTicket.resourceId || 'None provided'}</p>
                    </div>
                    <div className="rounded-2xl border border-slate-200 p-4">
                      <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Preferred Contact</p>
                      <p className="mt-2 text-sm text-slate-700">
                        {selectedTicket.preferredContactName || 'Not provided'}
                      </p>
                      <p className="text-sm text-slate-500">
                        {selectedTicket.preferredContactEmail || 'No email provided'}
                      </p>
                      <p className="text-sm text-slate-500">
                        {selectedTicket.preferredContactPhone || 'No phone provided'}
                      </p>
                    </div>
                  </div>

                  <div className="rounded-2xl border border-slate-200 p-4">
                    <div className="flex items-center justify-between gap-3">
                      <div>
                        <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Attachments</p>
                        <p className="mt-1 text-sm text-slate-600">Up to 3 images are shown here.</p>
                      </div>
                      <span className="text-xs font-semibold text-slate-500">
                        {selectedTicket.imageUrls.length} file(s)
                      </span>
                    </div>
                    <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-3">
                      {selectedTicket.imageUrls.length > 0 ? (
                        selectedTicket.imageUrls.map((imageUrl, index) => (
                          <a
                            key={`${imageUrl}-${index}`}
                            href={imageUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="group overflow-hidden rounded-2xl border border-slate-200 bg-slate-50"
                          >
                            <img
                              src={imageUrl}
                              alt={`Attachment ${index + 1}`}
                              className="h-40 w-full object-cover transition-transform duration-300 group-hover:scale-105"
                            />
                          </a>
                        ))
                      ) : (
                        <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 p-8 text-center text-sm text-slate-500 sm:col-span-3">
                          No attachments uploaded.
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="rounded-2xl border border-slate-200 p-4 space-y-4">
                    <div className="flex items-center gap-2">
                      <MessageSquare className="w-4 h-4 text-blue-600" />
                      <h4 className="text-sm font-bold text-slate-900">Comments</h4>
                    </div>

                    <div className="space-y-3 max-h-72 overflow-auto pr-1">
                      {selectedTicket.comments.length > 0 ? (
                        selectedTicket.comments.map((comment) => {
                          const isOwnComment = comment.authorId === currentUserId

                          return (
                            <div key={comment.id} className="rounded-2xl border border-slate-200 p-4 bg-slate-50/70">
                              <div className="flex items-start justify-between gap-3">
                                <div>
                                  <p className="text-sm font-semibold text-slate-900">
                                    {comment.authorName || comment.authorId || 'Unknown author'}
                                  </p>
                                  <p className="text-xs text-slate-500">{formatDate(comment.updatedAt || comment.createdAt)}</p>
                                </div>

                                {isOwnComment && (
                                  <div className="flex items-center gap-1">
                                    <button
                                      type="button"
                                      onClick={() => {
                                        setEditingCommentId(comment.id)
                                        setEditingCommentText(comment.text || '')
                                      }}
                                      className="p-2 rounded-lg text-slate-500 hover:text-blue-700 hover:bg-blue-50 transition-colors"
                                    >
                                      <Edit3 className="w-4 h-4" />
                                    </button>
                                    <button
                                      type="button"
                                      onClick={() => handleDeleteComment(comment.id)}
                                      className="p-2 rounded-lg text-slate-500 hover:text-red-700 hover:bg-red-50 transition-colors"
                                    >
                                      <Trash2 className="w-4 h-4" />
                                    </button>
                                  </div>
                                )}
                              </div>

                              {editingCommentId === comment.id ? (
                                <div className="mt-3 space-y-3">
                                  <textarea
                                    value={editingCommentText}
                                    onChange={(event) => setEditingCommentText(event.target.value)}
                                    className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm min-h-[110px] focus:outline-none focus:ring-2 focus:ring-blue-500"
                                  />
                                  <div className="flex items-center gap-2">
                                    <button
                                      type="button"
                                      onClick={handleSaveComment}
                                      className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700 transition-colors"
                                    >
                                      <Save className="w-4 h-4" />
                                      Save
                                    </button>
                                    <button
                                      type="button"
                                      onClick={() => {
                                        setEditingCommentId(null)
                                        setEditingCommentText('')
                                      }}
                                      className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-50 transition-colors"
                                    >
                                      Cancel
                                    </button>
                                  </div>
                                </div>
                              ) : (
                                <p className="mt-3 text-sm text-slate-700 whitespace-pre-wrap">{comment.text}</p>
                              )}
                            </div>
                          )
                        })
                      ) : (
                        <div className="rounded-2xl border border-dashed border-slate-200 p-6 text-sm text-slate-500">
                          No comments yet.
                        </div>
                      )}
                    </div>

                    <div className="space-y-3">
                      <textarea
                        value={commentText}
                        onChange={(event) => setCommentText(event.target.value)}
                        placeholder="Add a comment..."
                        className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm min-h-[110px] focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                      <button
                        type="button"
                        onClick={handleAddComment}
                        className="inline-flex items-center gap-2 rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white hover:bg-slate-800 transition-colors disabled:opacity-50"
                        disabled={saving}
                      >
                        <CornerRightUp className="w-4 h-4" />
                        Add Comment
                      </button>
                    </div>
                  </div>
                </div>

                <div className="p-6 space-y-6 bg-slate-50/70">
                  {canManage ? (
                    <>
                      <div className="rounded-2xl border border-slate-200 bg-white p-4 space-y-4">
                        <div className="flex items-center gap-2">
                          <UserCheck className="w-4 h-4 text-blue-600" />
                          <h4 className="text-sm font-bold text-slate-900">Assignment</h4>
                        </div>
                        <input
                          value={assignedTo}
                          onChange={(event) => setAssignedTo(event.target.value)}
                          placeholder="Technician name or email"
                          className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <button
                          type="button"
                          onClick={handleAssign}
                          disabled={saving}
                          className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 transition-colors disabled:opacity-50"
                        >
                          Assign Technician
                        </button>
                        <p className="text-sm text-slate-500">
                          Current assignee: {selectedTicket.assignedTo || 'Unassigned'}
                        </p>
                      </div>

                      <div className="rounded-2xl border border-slate-200 bg-white p-4 space-y-4">
                        <div className="flex items-center gap-2">
                          <ClipboardList className="w-4 h-4 text-blue-600" />
                          <h4 className="text-sm font-bold text-slate-900">Status Workflow</h4>
                        </div>
                        <select
                          value={status}
                          onChange={(event) => setStatus(event.target.value)}
                          className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                          <option value="OPEN">OPEN</option>
                          <option value="IN_PROGRESS">IN_PROGRESS</option>
                          <option value="RESOLVED">RESOLVED</option>
                          <option value="CLOSED">CLOSED</option>
                          <option value="REJECTED">REJECTED</option>
                        </select>

                        {status === 'REJECTED' && (
                          <textarea
                            value={statusReason}
                            onChange={(event) => setStatusReason(event.target.value)}
                            placeholder="Reason for rejection"
                            className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm min-h-[100px] focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                        )}

                        <button
                          type="button"
                          onClick={handleStatusSave}
                          disabled={saving}
                          className="inline-flex items-center gap-2 rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white hover:bg-slate-800 transition-colors disabled:opacity-50"
                        >
                          Save Status
                        </button>
                      </div>

                      <div className="rounded-2xl border border-slate-200 bg-white p-4 space-y-4">
                        <div className="flex items-center gap-2">
                          <Save className="w-4 h-4 text-blue-600" />
                          <h4 className="text-sm font-bold text-slate-900">Resolution Notes</h4>
                        </div>
                        <textarea
                          value={resolutionNotes}
                          onChange={(event) => setResolutionNotes(event.target.value)}
                          placeholder="Add the final resolution summary"
                          className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm min-h-[120px] focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <button
                          type="button"
                          onClick={handleResolutionSave}
                          disabled={saving}
                          className="inline-flex items-center gap-2 rounded-xl bg-green-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-green-700 transition-colors disabled:opacity-50"
                        >
                          Save Resolution
                        </button>
                      </div>
                    </>
                  ) : (
                    <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-6 text-sm text-slate-600">
                      Staff-only actions appear here. Users can still view ticket history and add comments.
                    </div>
                  )}

                  <div className="rounded-2xl border border-slate-200 bg-white p-4 space-y-3">
                    <h4 className="text-sm font-bold text-slate-900">Workflow Notes</h4>
                    <p className="text-sm text-slate-600">
                      Resolution notes and final closure are visible here for the support team. If the ticket is rejected, the reason is stored with the ticket.
                    </p>
                    {selectedTicket.resolutionNotes && (
                      <div className="rounded-xl bg-slate-50 border border-slate-200 p-3 text-sm text-slate-700 whitespace-pre-wrap">
                        {selectedTicket.resolutionNotes}
                      </div>
                    )}
                    {selectedTicket.rejectedReason && (
                      <div className="rounded-xl bg-red-50 border border-red-200 p-3 text-sm text-red-700 whitespace-pre-wrap">
                        Rejection reason: {selectedTicket.rejectedReason}
                      </div>
                    )}
                  </div>

                  {(actionError || actionMessage) && (
                    <div
                      className={`rounded-2xl border p-4 text-sm ${
                        actionError
                          ? 'border-red-200 bg-red-50 text-red-700'
                          : 'border-green-200 bg-green-50 text-green-700'
                      }`}
                    >
                      {actionError || actionMessage}
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

export default TicketList