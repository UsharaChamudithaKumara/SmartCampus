import axios from "axios";

const BASE_URL = "/api/bookings";

export const createBooking = (data) => axios.post(BASE_URL, data);
export const getMyBookings = () => axios.get(`${BASE_URL}/my`);
export const getAllBookings = (filters = {}) => axios.get(BASE_URL, { params: filters });
export const getBookingById = (id) => axios.get(`${BASE_URL}/${id}`);
export const approveBooking = (id) => axios.put(`${BASE_URL}/${id}/approve`);
export const rejectBooking = (id, reason) => axios.put(`${BASE_URL}/${id}/reject`, { reason });
export const cancelBooking = (id) => axios.put(`${BASE_URL}/${id}/cancel`);
export const deleteBooking = (id) => axios.delete(`${BASE_URL}/${id}`);