const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api'

export const api = {
  // Auth endpoints
  login: async (email: string, password: string) => {
    const response = await fetch(`${API_BASE_URL}/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    })
    return response.json()
  },

  register: async (email: string, password: string, name: string) => {
    const response = await fetch(`${API_BASE_URL}/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password, name }),
    })
    return response.json()
  },

  logout: async () => {
    const response = await fetch(`${API_BASE_URL}/logout`, {
      method: 'POST',
    })
    return response.json()
  },

  // Specialties endpoints
  getSpecialties: async () => {
    const response = await fetch(`${API_BASE_URL}/specialties`)
    return response.json()
  },

  // Doctors endpoints
  getDoctors: async (specialty?: string) => {
    const url = specialty 
      ? `${API_BASE_URL}/doctors?specialty=${encodeURIComponent(specialty)}`
      : `${API_BASE_URL}/doctors`
    const response = await fetch(url)
    return response.json()
  },

  // Appointments endpoints
  createAppointment: async (appointmentData: any) => {
    const response = await fetch(`${API_BASE_URL}/appointments`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(appointmentData),
    })
    return response.json()
  },

  getAvailableTimes: async (doctorId: string, date: string) => {
    const response = await fetch(`${API_BASE_URL}/appointments/available?doctor_id=${doctorId}&date=${date}`)
    return response.json()
  },

  // Contact endpoints
  sendContact: async (contactData: any) => {
    const response = await fetch(`${API_BASE_URL}/contact`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(contactData),
    })
    return response.json()
  },

  // Appointments management
  getAppointments: async (userId: string) => {
    const response = await fetch(`${API_BASE_URL}/appointments?user_id=${userId}`)
    return response.json()
  },

  cancelAppointment: async (appointmentId: string) => {
    const response = await fetch(`${API_BASE_URL}/appointments/${appointmentId}/cancel`, {
      method: 'PUT',
    })
    return response.json()
  },

  rateAppointment: async (appointmentId: string, rating: number) => {
    const response = await fetch(`${API_BASE_URL}/appointments/${appointmentId}/rating`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ rating }),
    })
    return response.json()
  },

  // Get unavailable times for a doctor
  getUnavailableTimes: async (doctorId: string, date: string) => {
    const response = await fetch(`${API_BASE_URL}/doctors/${doctorId}/unavailable-times?date=${date}`)
    return response.json()
  },
}
