const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api'
const ADMIN_BASE_URL = `${API_BASE_URL}/admin`

export const adminApi = {
  login: async (email: string, password: string) => {
    const response = await fetch(`${ADMIN_BASE_URL}/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    })

    if (!response.ok) {
      const error = await response.json().catch(() => ({}))
      throw new Error(error?.error || 'Đăng nhập thất bại')
    }

    return response.json()
  },

  getDoctors: async (token: string) => {
    const response = await fetch(`${ADMIN_BASE_URL}/doctors`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })

    if (!response.ok) {
      const error = await response.json().catch(() => ({}))
      throw new Error(error?.error || 'Không thể tải danh sách bác sĩ')
    }

    return response.json()
  },

  updateDoctor: async (token: string, id: number, data: any) => {
    const response = await fetch(`${ADMIN_BASE_URL}/doctors/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    })

    if (!response.ok) {
      const error = await response.json().catch(() => ({}))
      throw new Error(error?.error || 'Không thể cập nhật bác sĩ')
    }

    return response.json()
  },

  deleteDoctor: async (token: string, id: number) => {
    const response = await fetch(`${ADMIN_BASE_URL}/doctors/${id}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })

    if (!response.ok) {
      const error = await response.json().catch(() => ({}))
      throw new Error(error?.error || 'Không thể xóa bác sĩ')
    }

    return response.json()
  },

  uploadDoctorAvatar: async (token: string, payload: { fileName: string; fileData: string }) => {
    const response = await fetch(`${ADMIN_BASE_URL}/doctors/upload-avatar`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    })

    if (!response.ok) {
      const error = await response.json().catch(() => ({}))
      throw new Error(error?.error || 'Không thể tải ảnh lên')
    }

    return response.json()
  },

  createDoctor: async (token: string, data: any) => {
    const response = await fetch(`${ADMIN_BASE_URL}/doctors`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    })

    if (!response.ok) {
      const error = await response.json().catch(() => ({}))
      throw new Error(error?.error || 'Không thể tạo bác sĩ')
    }

    return response.json()
  },

  getAppointments: async (token: string) => {
    const response = await fetch(`${ADMIN_BASE_URL}/appointments`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })

    if (!response.ok) {
      const error = await response.json().catch(() => ({}))
      throw new Error(error?.error || 'Không thể tải danh sách lịch hẹn')
    }

    return response.json()
  },

  getRevenue: async (token: string) => {
    const response = await fetch(`${ADMIN_BASE_URL}/revenue`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })

    if (!response.ok) {
      const error = await response.json().catch(() => ({}))
      throw new Error(error?.error || 'Không thể tải dữ liệu doanh thu')
    }

    return response.json()
  },

  getPatients: async (token: string) => {
    const response = await fetch(`${ADMIN_BASE_URL}/patients`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })

    if (!response.ok) {
      const error = await response.json().catch(() => ({}))
      throw new Error(error?.error || 'Không thể tải danh sách bệnh nhân')
    }

    return response.json()
  },
}


