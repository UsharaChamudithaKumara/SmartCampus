// src/api.js

const BASE_TICKETS = 'http://localhost:8081/api/tickets';
const BASE_RESOURCES = 'http://localhost:8081/api/resources';

// --- Module C: Tickets API (Existing) ---
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

  const res = await fetch(BASE_TICKETS);
  if (!res.ok) throw new Error('Failed to fetch tickets');
  return res.json();

}

export async function createTicket(ticket) {
  const res = await fetch(BASE_TICKETS, {
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

  });
  if (!res.ok) throw new Error('Failed to create ticket');
  return res.json();

}

export async function uploadImage(ticketId, file) {
  const fd = new FormData();
  fd.append('file', file);
  const res = await fetch(`${BASE_TICKETS}/${ticketId}/upload`, {
    method: 'POST',
    body: fd,
  });
  if (!res.ok) throw new Error('Image upload failed');
  return res.text();
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

// --- Module A: Resources API (New) ---
// Meets requirement for searching and filtering by type [cite: 26, 69]
export async function fetchResources(type = '') {
  const url = type ? `${BASE_RESOURCES}?type=${type}` : BASE_RESOURCES;
  const res = await fetch(url);
  if (!res.ok) throw new Error('Failed to fetch resources');
  return res.json();
}

// Meets requirement for maintaining a catalogue (POST) [cite: 24, 69]
export async function createResource(resource) {
  const res = await fetch(BASE_RESOURCES, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(resource),
  });
  if (!res.ok) throw new Error('Failed to create resource');
  return res.json();
}

// Meets requirement for updating status/metadata (PUT) [cite: 25, 69]
// src/api.js
export async function updateResource(id, resource) {
  const res = await fetch(`http://localhost:8081/api/resources/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(resource),
  });
  if (!res.ok) throw new Error('Failed to update status');
  return res.json();
}

// Meets requirement for deleting a resource (DELETE) [cite: 69]
export async function deleteResource(id) {
  const res = await fetch(`${BASE_RESOURCES}/${id}`, {
    method: 'DELETE',
  });
  if (!res.ok) throw new Error('Failed to delete resource');
  return true;
}

// Export all functions together
export default { 
  fetchTickets, createTicket, uploadImage, 
  fetchResources, createResource, updateResource, deleteResource 
};

