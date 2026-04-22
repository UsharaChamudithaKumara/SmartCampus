// src/api.js

const BASE_TICKETS = 'http://localhost:8081/api/tickets';
const BASE_RESOURCES = 'http://localhost:8081/api/resources';

// --- Module C: Tickets API (Existing) ---
export async function fetchTickets() {
  const res = await fetch(BASE_TICKETS);
  if (!res.ok) throw new Error('Failed to fetch tickets');
  return res.json();
}

export async function createTicket(ticket) {
  const res = await fetch(BASE_TICKETS, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(ticket),
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
  const res = await fetch(`http://localhost:8082/api/resources/${id}`, {
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