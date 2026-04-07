import { useState } from 'react'
import { createTicket, uploadImage } from '../api'

export default function TicketForm({ onCreated }) {
  const [form, setForm] = useState({
    title: '',
    description: '',
    category: '',
    priority: '',
    resourceId: '',
    userId: '',
  })
  const [file, setFile] = useState(null)
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState(null)

  function update(e) {
    const { name, value } = e.target
    setForm(s => ({ ...s, [name]: value }))
  }

  async function submit(e) {
    e.preventDefault()
    setLoading(true)
    setMessage(null)
    try {
      const created = await createTicket(form)
      if (file) {
        await uploadImage(created.id, file)
      }
      setMessage('Ticket created')
      setForm({ title: '', description: '', category: '', priority: '', resourceId: '', userId: '' })
      setFile(null)
      if (onCreated) onCreated()
    } catch (err) {
      setMessage('Error: ' + err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <section className="animate-pop">
      <h2 className="text-lg font-medium mb-4">Create Ticket</h2>
      <form onSubmit={submit} className="grid grid-cols-1 gap-3">
        <div className="flex flex-col">
          <label className="text-sm text-slate-700 mb-1">Title</label>
          <input name="title" value={form.title} onChange={update} required className="border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-600" />
        </div>

        <div className="flex flex-col">
          <label className="text-sm text-slate-700 mb-1">Description</label>
          <textarea name="description" value={form.description} onChange={update} required className="border rounded px-3 py-2 min-h-[80px] focus:outline-none focus:ring-2 focus:ring-primary-600" />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="flex flex-col">
            <label className="text-sm text-slate-700 mb-1">Category</label>
            <input name="category" value={form.category} onChange={update} required className="border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-600" />
          </div>
          <div className="flex flex-col">
            <label className="text-sm text-slate-700 mb-1">Priority</label>
            <input name="priority" value={form.priority} onChange={update} required className="border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-600" />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="flex flex-col">
            <label className="text-sm text-slate-700 mb-1">Resource ID (optional)</label>
            <input name="resourceId" value={form.resourceId} onChange={update} className="border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-600" />
          </div>
          <div className="flex flex-col">
              <label className="text-sm text-slate-700 mb-1">User ID</label>
              <input name="userId" value={form.userId} onChange={update} required className="border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-600" />
          </div>
        </div>

        <div className="flex flex-col">
          <label className="text-sm text-slate-700 mb-1">Image (optional)</label>
          <input type="file" accept="image/*" onChange={e => setFile(e.target.files?.[0] ?? null)} className="text-sm" />
        </div>

        <div className="mt-3">
          <button type="submit" disabled={loading} className="px-4 py-2 bg-primary-600 text-white rounded hover:bg-primary-700 transform hover:-translate-y-0.5 transition">
            {loading ? 'Saving…' : 'Create'}
          </button>
        </div>
      </form>

      {message && <p className="mt-3 text-sm text-slate-700">{message}</p>}
    </section>
  )
}
