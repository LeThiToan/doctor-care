const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3001'

class DoctorsAPI {
  private async request(endpoint: string, options: RequestInit = {}) {
    const url = `${API_BASE_URL}${endpoint}`
    const token = localStorage.getItem('doctor_token')
    
    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
        ...options.headers,
      },
      ...options,
    }

    const response = await fetch(url, config)
    
    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.error || 'Có lỗi xảy ra')
    }

    return response.json()
  }

  // Doctor Authentication
  async login(email: string, password: string) {
    return this.request('/api/doctors-auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    })
  }

  async logout() {
    return this.request('/api/doctors-auth/logout', {
      method: 'POST',
    })
  }

  async getProfile() {
    return this.request('/api/doctors-auth/profile')
  }

  // Doctor Appointments
  async getDoctorAppointments() {
    return this.request('/api/doctors-auth/appointments')
  }

  async updateAppointmentStatus(appointmentId: string, status: string) {
    return this.request(`/api/doctors-auth/appointments/${appointmentId}/status`, {
      method: 'PUT',
      body: JSON.stringify({ status }),
    })
  }
}

export const doctorsApi = new DoctorsAPI()
