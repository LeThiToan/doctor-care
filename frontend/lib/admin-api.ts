const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api'
const ADMIN_BASE_URL = `${API_BASE_URL}/admin`

// Helper function để xử lý response và tự động logout nếu token expired
const handleResponse = async (response: Response) => {
  if (!response.ok) {
    const error = await response.json().catch(() => ({}))
    
    // Nếu token expired, tự động logout
    if (response.status === 401 && (error.expired || error.error?.includes('hết hạn'))) {
      // Xóa token và redirect về login
      localStorage.removeItem('admin_token')
      localStorage.removeItem('admin_user')
      
      // Dispatch event để các component khác biết
      window.dispatchEvent(new Event('admin_token_expired'))
      
      // Redirect về login page
      if (typeof window !== 'undefined') {
        window.location.href = '/admin/login'
      }
    }
    
    throw new Error(error?.error || 'Có lỗi xảy ra')
  }
  
  return response.json()
}

export const adminApi = {
  login: async (email: string, password: string) => {
    try {
      const response = await fetch(`${ADMIN_BASE_URL}/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      })

      const data = await response.json().catch(() => ({}))
      
      if (!response.ok) {
        const errorMessage = data?.error || 'Đăng nhập thất bại'
        console.error('Login error:', errorMessage, data)
        throw new Error(errorMessage)
      }

      console.log('Login success:', data)
      return data
    } catch (error: any) {
      console.error('Login request failed:', error)
      throw error
    }
  },

  getDoctors: async (token: string) => {
    const response = await fetch(`${ADMIN_BASE_URL}/doctors`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })

    return handleResponse(response)
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

    return handleResponse(response)
  },

  deleteDoctor: async (token: string, id: number) => {
    const response = await fetch(`${ADMIN_BASE_URL}/doctors/${id}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })

    return handleResponse(response)
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

    return handleResponse(response)
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

    return handleResponse(response)
  },

  getAppointments: async (token: string) => {
    const response = await fetch(`${ADMIN_BASE_URL}/appointments`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })

    return handleResponse(response)
  },

  getRevenue: async (token: string) => {
    const response = await fetch(`${ADMIN_BASE_URL}/revenue`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })

    return handleResponse(response)
  },

  getPatients: async (token: string) => {
    const response = await fetch(`${ADMIN_BASE_URL}/patients`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })

    return handleResponse(response)
  },

  cancelAppointment: async (token: string, appointmentId: number) => {
    const response = await fetch(`${API_BASE_URL}/appointments/${appointmentId}/cancel`, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })

    return handleResponse(response)
  },

  fixDoctorMapping: async (token: string, accountId: number, doctorId: number) => {
    const response = await fetch(`${ADMIN_BASE_URL}/doctors/fix-mapping`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ account_id: accountId, doctor_id: doctorId }),
    })

    return handleResponse(response)
  },
}


