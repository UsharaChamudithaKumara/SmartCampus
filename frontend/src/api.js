const BASE = '/api/tickets'

export async function fetchTickets() {
  const res = await fetch(BASE)
  const bodyText = await res.text()
  if (!res.ok) {
    throw new Error(bodyText || 'Failed to fetch tickets')
  }
  try {
    return JSON.parse(bodyText)
  } catch (e) {
    // fallback: return empty array on unexpected response
    throw new Error(bodyText || 'Failed to parse tickets JSON')
  }
}

export async function createTicket(ticket) {
  const res = await fetch(BASE, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(ticket),
  })
  const text = await res.text()
  if (!res.ok) throw new Error(text || 'Failed to create ticket')
  try {
    return JSON.parse(text)
  } catch (e) {
    return text
  }
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

export async function uploadImages(ticketId, files) {
  const fd = new FormData()
  files.forEach(f => fd.append('files', f))
  const res = await fetch(`${BASE}/${ticketId}/uploads`, {
    method: 'POST',
    body: fd,
  })
  const text = await res.text()
  if (!res.ok) throw new Error(text || 'Images upload failed')
  return text
}

// AUTH ENDPOINTS

const AUTH_BASE = '/api/auth'

export async function signup(firstName, lastName, username, itNumber, studentEmail, nicNumber, password, confirmPassword, profilePhoto) {
  const res = await fetch(`${AUTH_BASE}/signup`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ firstName, lastName, username, itNumber, studentEmail, nicNumber, password, confirmPassword, profilePhoto }),
  })
  const text = await res.text()
  if (!res.ok) {
    const parsed = tryParseJson(text)
    throw new Error(parsed?.error || text || 'Signup failed')
  }
  return JSON.parse(text)
}

export async function login(studentEmail, password) {
  const res = await fetch(`${AUTH_BASE}/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ studentEmail, password }),
  })
  const text = await res.text()
  if (!res.ok) {
    const parsed = tryParseJson(text)
    throw new Error(parsed?.error || text || 'Login failed')
  }
  return JSON.parse(text)
}

export async function forgotPassword(email) {
  const res = await fetch(`${AUTH_BASE}/forgot-password`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email }),
  })
  const text = await res.text()
  if (!res.ok) {
    const parsed = tryParseJson(text)
    throw new Error(parsed?.error || text || 'Forgot password request failed')
  }
  return tryParseJson(text)
}

export async function resetPassword(email, resetCode, newPassword) {
  const res = await fetch(`${AUTH_BASE}/reset-password`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, resetCode, newPassword }),
  })
  const text = await res.text()
  if (!res.ok) {
    const parsed = tryParseJson(text)
    throw new Error(parsed?.error || text || 'Password reset failed')
  }
  return tryParseJson(text)
}

export async function validateToken(token) {
  const res = await fetch(`${AUTH_BASE}/validate?token=${token}`)
  return res.ok
}

// HELPER

function tryParseJson(text) {
  try {
    return JSON.parse(text)
  } catch (e) {
    return null
  }
}

export default { fetchTickets, createTicket, uploadImage, uploadImages, signup, login, forgotPassword, resetPassword, validateToken }
