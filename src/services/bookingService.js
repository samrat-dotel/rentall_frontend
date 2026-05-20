const API_BASE_URL = 'http://127.0.0.1:8000';

export async function createBooking(bookingData, token) {
  const res = await fetch(`${API_BASE_URL}/bookings`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(bookingData),
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.detail || 'Could not create booking request.');
  }

  return data;
}

export async function getMyBookings(token) {
  const res = await fetch(`${API_BASE_URL}/bookings/my`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.detail || 'Could not load bookings.');
  }

  return data;
}

export async function getOwnerRequests(token) {
  const res = await fetch(`${API_BASE_URL}/bookings/owner`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.detail || 'Could not load owner requests.');
  }

  return data;
}

export async function acceptBooking(bookingId, token) {
  const res = await fetch(`${API_BASE_URL}/bookings/${bookingId}/accept`, {
    method: 'PUT',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.detail || 'Could not accept booking.');
  }

  return data;
}

export async function rejectBooking(bookingId, token) {
  const res = await fetch(`${API_BASE_URL}/bookings/${bookingId}/reject`, {
    method: 'PUT',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.detail || 'Could not reject booking.');
  }

  return data;
}

export async function cancelBooking(bookingId, token) {
  const res = await fetch(`${API_BASE_URL}/bookings/${bookingId}/cancel`, {
    method: 'PUT',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.detail || 'Could not cancel booking.');
  }

  return data;
}