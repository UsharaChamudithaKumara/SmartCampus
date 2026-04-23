// src/api.js

const BASE_TICKETS = '/api/tickets';
const BASE_RESOURCES = '/api/resources';
const AUTH_BASE = '/api/auth';

function tryParseJson(text) {
  try {
    return JSON.parse(text);
  } catch {
    return null;
  }
}

async function parseResponseOrThrow(res, fallbackMessage) {
  const text = await res.text();
  const parsed = tryParseJson(text);

  if (!res.ok) {
    throw new Error(parsed?.error || text || fallbackMessage);
  }

  return parsed ?? text;
}

// Tickets API
export async function fetchTickets() {
  const res = await fetch(BASE_TICKETS);
  return parseResponseOrThrow(res, 'Failed to fetch tickets');
}

export async function fetchTicketsByUser(userId) {
  const safeUserId = encodeURIComponent(userId || '');
  const res = await fetch(`${BASE_TICKETS}/user/${safeUserId}`);
  return parseResponseOrThrow(res, 'Failed to fetch user tickets');
}

export async function fetchVisibleTickets() {
  const role = localStorage.getItem('userRole');
  const userEmail = localStorage.getItem('userEmail');

  if (role === 'ADMIN' || role === 'TECHNICIAN') {
    return fetchTickets();
  }

  if (!userEmail) {
    return [];
  }

  return fetchTicketsByUser(userEmail);
}

export async function createTicket(ticket) {
  const res = await fetch(BASE_TICKETS, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(ticket),
  });
  return parseResponseOrThrow(res, 'Failed to create ticket');
}

export async function fetchTicketById(ticketId) {
  const res = await fetch(`${BASE_TICKETS}/${ticketId}`);
  return parseResponseOrThrow(res, 'Failed to fetch ticket');
}

export async function assignTechnician(ticketId, technician) {
  const res = await fetch(`${BASE_TICKETS}/${ticketId}/assign?technician=${encodeURIComponent(technician)}`, {
    method: 'PUT',
  });
  return parseResponseOrThrow(res, 'Failed to assign technician');
}

export async function updateTicketStatus(ticketId, status, reason = '') {
  const params = new URLSearchParams({ status });
  if (reason) {
    params.set('reason', reason);
  }

  const res = await fetch(`${BASE_TICKETS}/${ticketId}/status?${params.toString()}`, {
    method: 'PUT',
  });
  return parseResponseOrThrow(res, 'Failed to update ticket status');
}

export async function addResolutionNotes(ticketId, notes) {
  const params = new URLSearchParams({ notes });
  const res = await fetch(`${BASE_TICKETS}/${ticketId}/resolution?${params.toString()}`, {
    method: 'PUT',
  });
  return parseResponseOrThrow(res, 'Failed to save resolution notes');
}

export async function addTicketComment(ticketId, comment) {
  const res = await fetch(`${BASE_TICKETS}/${ticketId}/comments`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(comment),
  });
  return parseResponseOrThrow(res, 'Failed to add comment');
}

export async function editTicketComment(ticketId, commentId, payload) {
  const res = await fetch(`${BASE_TICKETS}/${ticketId}/comments/${commentId}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  return parseResponseOrThrow(res, 'Failed to edit comment');
}

export async function deleteTicketComment(ticketId, commentId, authorId) {
  const res = await fetch(`${BASE_TICKETS}/${ticketId}/comments/${commentId}?authorId=${encodeURIComponent(authorId)}`, {
    method: 'DELETE',
  });
  return parseResponseOrThrow(res, 'Failed to delete comment');
}

export async function uploadImage(ticketId, file) {
  const fd = new FormData();
  fd.append('file', file);

  const res = await fetch(`${BASE_TICKETS}/${ticketId}/upload`, {
    method: 'POST',
    body: fd,
  });

  return parseResponseOrThrow(res, 'Image upload failed');
}

export async function uploadImages(ticketId, files) {
  const fd = new FormData();
  files.forEach((f) => fd.append('files', f));

  const res = await fetch(`${BASE_TICKETS}/${ticketId}/uploads`, {
    method: 'POST',
    body: fd,
  });

  return parseResponseOrThrow(res, 'Images upload failed');
}

// Auth API
export async function signup(firstName, lastName, username, itNumber, studentEmail, nicNumber, password, confirmPassword, profilePhoto) {
  const res = await fetch(`${AUTH_BASE}/signup`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      firstName,
      lastName,
      username,
      itNumber,
      studentEmail,
      nicNumber,
      password,
      confirmPassword,
      profilePhoto,
    }),
  });

  return parseResponseOrThrow(res, 'Signup failed');
}

export async function login(studentEmail, password, role, technicianType) {
  const res = await fetch(`${AUTH_BASE}/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ studentEmail, password, role, technicianType }),
  });

  return parseResponseOrThrow(res, 'Login failed');
}

export async function googleLogin(credential, expectedRole) {
  const res = await fetch(`${AUTH_BASE}/google-login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ credential, expectedRole }),
  });

  return parseResponseOrThrow(res, 'Google login failed');
}

export async function forgotPassword(email) {
  const res = await fetch(`${AUTH_BASE}/forgot-password`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email }),
  });

  return parseResponseOrThrow(res, 'Forgot password request failed');
}

export async function resetPassword(email, resetCode, newPassword) {
  const res = await fetch(`${AUTH_BASE}/reset-password`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, resetCode, newPassword }),
  });

  return parseResponseOrThrow(res, 'Password reset failed');
}

export async function validateToken(token) {
  const res = await fetch(`${AUTH_BASE}/validate?token=${token}`);
  return res.ok;
}

// Resources API
export async function fetchResources(type = '') {
  const url = type ? `${BASE_RESOURCES}?type=${type}` : BASE_RESOURCES;
  const res = await fetch(url);
  return parseResponseOrThrow(res, 'Failed to fetch resources');
}

export async function createResource(resource) {
  const res = await fetch(BASE_RESOURCES, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(resource),
  });
  return parseResponseOrThrow(res, 'Failed to create resource');
}

export async function updateResource(id, resource) {
  const res = await fetch(`${BASE_RESOURCES}/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(resource),
  });
  return parseResponseOrThrow(res, 'Failed to update resource');
}

export async function deleteResource(id) {
  const res = await fetch(`${BASE_RESOURCES}/${id}`, {
    method: 'DELETE',
  });
  await parseResponseOrThrow(res, 'Failed to delete resource');
  return true;      
}

const api = {
  fetchTickets,
  fetchTicketsByUser,
  fetchVisibleTickets,
  createTicket,
  fetchTicketById,
  uploadImage,
  uploadImages,
  assignTechnician,
  updateTicketStatus,
  addResolutionNotes,
  addTicketComment,
  editTicketComment,
  deleteTicketComment,
  signup,
  login,
  forgotPassword,
  resetPassword,
  validateToken,
  fetchResources,
  createResource,
  updateResource,
  deleteResource,
};

export default api;

