const BASE = '/api/tickets'

export async function fetchTickets() {
  const res = await fetch(BASE)
  if (!res.ok) throw new Error('Failed to fetch tickets')
  return res.json()
}

export async function createTicket(ticket) {
  const res = await fetch(BASE, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(ticket),
  })
  if (!res.ok) throw new Error('Failed to create ticket')
  return res.json()
}

export async function uploadImage(ticketId, file) {
  const fd = new FormData()
  fd.append('file', file)
  const res = await fetch(`${BASE}/${ticketId}/upload`, {
    method: 'POST',
    body: fd,
  })
  if (!res.ok) throw new Error('Image upload failed')
  return res.text()
}

export default { fetchTickets, createTicket, uploadImage }
