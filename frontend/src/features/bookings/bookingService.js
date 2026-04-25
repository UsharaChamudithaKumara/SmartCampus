const BASE_URL = "/api/bookings";

async function request(path, options = {}) {
	const userEmail = sessionStorage.getItem("userEmail") || "";
	const res = await fetch(`${BASE_URL}${path}`, {
		...options,
		headers: {
			"Content-Type": "application/json",
			"X-User-Id": userEmail,
			"X-User-Email": userEmail,
			...(options.headers || {}),
		},
	});

	const text = await res.text();
	let data = null;

	try {
		data = text ? JSON.parse(text) : null;
	} catch {
		data = text;
	}

	if (!res.ok) {
		const message =
			(typeof data === "object" && data?.message) ||
			(typeof data === "object" && data?.error) ||
			(typeof data === "string" && data) ||
			"Booking request failed.";
		throw new Error(message);
	}

	// Keep an axios-like response shape to avoid touching existing UI code.
	return { data };
}

export const createBooking = (data) =>
	request("", { method: "POST", body: JSON.stringify(data) });

export const getMyBookings = () => request("/my");

export const getAllBookings = (filters = {}) => {
	const query = new URLSearchParams();
	Object.entries(filters).forEach(([key, value]) => {
		if (value !== undefined && value !== null && value !== "") {
			query.append(key, value);
		}
	});
	const suffix = query.toString() ? `?${query.toString()}` : "";
	return request(suffix);
};

export const getBookingById = (id) => request(`/${id}`);
export const approveBooking = (id) => request(`/${id}/approve`, { method: "PUT" });
export const rejectBooking = (id, reason) =>
	request(`/${id}/reject`, { method: "PUT", body: JSON.stringify({ reason }) });
export const cancelBooking = (id) => request(`/${id}/cancel`, { method: "PUT" });
export const deleteBooking = (id) => request(`/${id}`, { method: "DELETE" });