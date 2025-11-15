import { Router, Request, Response, NextFunction } from 'express'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { promises as fs } from 'fs'
import path from 'path'
import { query } from '../config/database'

const router = Router()

const JWT_SECRET = process.env.JWT_SECRET || 'supersecretkey'

interface DecodedToken {
  id: number
  email: string
  role: string
}

const parseArrayField = (value: unknown) => {
  if (!value) return null
  if (Array.isArray(value)) {
    return JSON.stringify(value)
  }
  if (typeof value === 'string') {
    try {
      const parsed = JSON.parse(value)
      if (Array.isArray(parsed)) {
        return JSON.stringify(parsed)
      }
    } catch {
      // ignore parse error, will treat as comma separated string
    }

    const items = value
      .split(',')
      .map((item) => item.trim())
      .filter(Boolean)

    return items.length ? JSON.stringify(items) : null
  }
  return null
}

const requireAdmin = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '')

    if (!token) {
      return res.status(401).json({ error: 'Token không được cung cấp' })
    }

    const decoded = jwt.verify(token, JWT_SECRET) as DecodedToken

    if (decoded.role !== 'admin') {
      return res.status(403).json({ error: 'Không có quyền truy cập' })
    }

    // @ts-ignore
    req.admin = decoded
    next()
  } catch (error) {
    console.error('Admin auth error:', error)
    return res.status(401).json({ error: 'Token không hợp lệ' })
  }
}

const sanitizeFileName = (fileName: string) => {
  const normalized = fileName.normalize('NFKD').replace(/[\u0300-\u036f]/g, '')
  return normalized
    .replace(/[^a-zA-Z0-9.\-_]/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
}

// Admin login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body

    if (!email || !password) {
      return res.status(400).json({ error: 'Thiếu email hoặc mật khẩu' })
    }

    const rows = await query(
      'SELECT id, email, password, name FROM admin_users WHERE email = ?',
      [email]
    ) as any[]

    const admin = rows[0]

    if (!admin) {
      return res.status(404).json({ error: 'Admin không tồn tại' })
    }

    if (password !== admin.password) {
      return res.status(401).json({ error: 'Mật khẩu không đúng' })
    }

    const token = jwt.sign(
      {
        id: admin.id,
        email: admin.email,
        role: 'admin',
      },
      JWT_SECRET,
      { expiresIn: '8h' }
    )

    res.json({
      message: 'Đăng nhập thành công',
      admin: {
        id: admin.id,
        email: admin.email,
        name: admin.name,
      },
      token,
    })
  } catch (error) {
    console.error('Admin login error:', error)
    res.status(500).json({ error: 'Lỗi server' })
  }
})

// Upload doctor avatar
router.post('/doctors/upload-avatar', requireAdmin, async (req, res) => {
  try {
    const { fileName, fileData } = req.body as { fileName?: string; fileData?: string }

    if (!fileName || !fileData) {
      return res.status(400).json({ error: 'Thiếu thông tin file tải lên' })
    }

    const uploadsDir = path.resolve(process.cwd(), '..', 'frontend', 'public', 'images', 'doctors')
    await fs.mkdir(uploadsDir, { recursive: true })

    const ext = path.extname(fileName) || '.png'
    const baseName = sanitizeFileName(path.basename(fileName, ext)) || 'avatar'
    const safeExt = sanitizeFileName(ext.replace('.', '')) || 'png'
    const finalFileName = `${Date.now()}-${baseName}.${safeExt}`

    const base64Match = fileData.match(/^data:(.+);base64,(.+)$/)
    const base64Content = base64Match ? base64Match[2] : fileData

    const buffer = Buffer.from(base64Content, 'base64')
    await fs.writeFile(path.join(uploadsDir, finalFileName), buffer)

    res.json({
      message: 'Tải ảnh thành công',
      fileName: finalFileName,
    })
  } catch (error) {
    console.error('Upload doctor avatar error:', error)
    res.status(500).json({ error: 'Không thể tải ảnh lên' })
  }
})

// Create doctor
router.post('/doctors', requireAdmin, async (req, res) => {
  try {
    const {
      name,
      title,
      specialty,
      experience,
      price,
      avatar,
      education,
      languages,
      description,
      email,
      doctorPassword,
      createDoctorAccount,
    } = req.body

    if (!name || !specialty || !price) {
      return res.status(400).json({ error: 'Thiếu thông tin bắt buộc (name, specialty, price)' })
    }

    const educationJson = parseArrayField(education)
    const languagesJson = parseArrayField(languages)

    const passwordHash = doctorPassword
      ? await bcrypt.hash(doctorPassword, 10)
      : null

    const result = await query(
      `INSERT INTO doctors (
        name,
        title,
        specialty,
        experience,
        rating,
        reviews,
        price,
        avatar,
        education,
        languages,
        description,
        email,
        password_hash,
        is_active
      ) VALUES (?, ?, ?, ?, 0, 0, ?, ?, ?, ?, ?, ?, ?, TRUE)`,
      [
        name,
        title || null,
        specialty,
        experience || null,
        price,
        avatar || null,
        educationJson,
        languagesJson,
        description || null,
        email || null,
        passwordHash,
      ]
    ) as any

    const doctorId = result.insertId

    if (createDoctorAccount && email && doctorPassword) {
      const passwordHash = await bcrypt.hash(doctorPassword, 10)
      await query(
        `INSERT INTO doctor_account (
          name,
          email,
          password,
          doctor_id,
          is_active
        ) VALUES (?, ?, ?, ?, TRUE)`,
        [
          name,
          email,
          passwordHash,
          doctorId,
        ]
      )
    }

    res.status(201).json({
      message: 'Tạo bác sĩ thành công',
      doctor_id: doctorId,
    })
  } catch (error: any) {
    console.error('Create doctor error:', error)
    // Duplicate email error
    if (error && error.code === 'ER_DUP_ENTRY') {
      return res.status(400).json({ error: 'Email đã tồn tại' })
    }
    res.status(500).json({ error: 'Lỗi server' })
  }
})

// Get all doctors
router.get('/doctors', requireAdmin, async (_req, res) => {
  try {
    const rows = await query(
      `SELECT 
        d.id,
        d.name,
        d.title,
        d.specialty,
        d.experience,
        d.rating,
        d.reviews,
        d.price,
        d.avatar,
        d.education,
        d.languages,
        d.description,
        d.email,
        d.is_active,
        d.created_at,
        d.updated_at,
        da.email AS account_email
      FROM doctors d
      LEFT JOIN doctor_account da ON da.doctor_id = d.id
      ORDER BY d.created_at DESC`
    ) as any[]

    const doctors = rows.map((doc) => {
      let education = []
      let languages = []

      try {
        if (doc.education) {
          education = typeof doc.education === 'string' ? JSON.parse(doc.education) : doc.education
        }
      } catch {
        education = []
      }

      try {
        if (doc.languages) {
          languages = typeof doc.languages === 'string' ? JSON.parse(doc.languages) : doc.languages
        }
      } catch {
        languages = []
      }

      return {
        ...doc,
        education,
        languages,
      }
    })

    res.json(doctors)
  } catch (error) {
    console.error('Get doctors error:', error)
    res.status(500).json({ error: 'Lỗi server' })
  }
})

// Update doctor
router.put('/doctors/:id', requireAdmin, async (req, res) => {
  try {
    const { id } = req.params
    const {
      name,
      title,
      specialty,
      experience,
      price,
      avatar,
      education,
      languages,
      description,
      email,
      password,
      is_active,
    } = req.body

    const fields: string[] = []
    const values: any[] = []

    const pushField = (field: string, value: any) => {
      fields.push(`${field} = ?`)
      values.push(value)
    }

    if (name !== undefined) pushField('name', name || null)
    if (title !== undefined) pushField('title', title || null)
    if (specialty !== undefined) pushField('specialty', specialty || null)
    if (experience !== undefined) pushField('experience', experience || null)
    if (price !== undefined) pushField('price', price || null)
    if (avatar !== undefined) pushField('avatar', avatar || null)
    if (description !== undefined) pushField('description', description || null)
    if (is_active !== undefined) pushField('is_active', Boolean(is_active))

    if (education !== undefined) {
      pushField('education', parseArrayField(education))
    }

    if (languages !== undefined) {
      pushField('languages', parseArrayField(languages))
    }

    if (email !== undefined) {
      pushField('email', email || null)
    }

    if (fields.length === 0 && password === undefined) {
      return res.status(400).json({ error: 'Không có dữ liệu cập nhật' })
    }

    if (fields.length > 0) {
      fields.push('updated_at = CURRENT_TIMESTAMP')
      const updateSql = `UPDATE doctors SET ${fields.join(', ')} WHERE id = ?`
      values.push(id)
      await query(updateSql, values)
    }

    if (email !== undefined || password !== undefined) {
      const existingAccounts = await query(
        'SELECT id FROM doctor_account WHERE doctor_id = ?',
        [id]
      ) as any[]

      if (existingAccounts.length > 0) {
        const accountFields: string[] = []
        const accountValues: any[] = []
        if (email !== undefined) {
          accountFields.push('email = ?')
          accountValues.push(email || null)
        }
        if (password !== undefined) {
          const passwordHash = password ? await bcrypt.hash(password, 10) : null
          accountFields.push('password = ?')
          accountValues.push(passwordHash)
        }

        if (accountFields.length > 0) {
          accountValues.push(id)
          await query(
            `UPDATE doctor_account SET ${accountFields.join(', ')} WHERE doctor_id = ?`,
            accountValues
          )
        }
      } else if (email && password) {
        const passwordHash = await bcrypt.hash(password, 10)
        await query(
          `INSERT INTO doctor_account (name, email, password, doctor_id, is_active)
           VALUES (
             (SELECT name FROM doctors WHERE id = ? LIMIT 1),
             ?,
             ?,
             ?,
             TRUE
           )`,
          [id, email, passwordHash, id]
        )
      }
    }

    const result = await query(
      `SELECT 
        d.id,
        d.name,
        d.title,
        d.specialty,
        d.experience,
        d.rating,
        d.reviews,
        d.price,
        d.avatar,
        d.education,
        d.languages,
        d.description,
        d.email,
        d.is_active,
        d.created_at,
        d.updated_at,
        da.email AS account_email
      FROM doctors d
      LEFT JOIN doctor_account da ON da.doctor_id = d.id
      WHERE d.id = ?`,
      [id]
    ) as any[]

    const doctor = result[0]

    if (!doctor) {
      return res.status(404).json({ error: 'Không tìm thấy bác sĩ' })
    }

    const response = {
      ...doctor,
      education: (() => {
        try {
          if (doctor.education) {
            return typeof doctor.education === 'string'
              ? JSON.parse(doctor.education)
              : doctor.education
          }
        } catch {
          return []
        }
        return []
      })(),
      languages: (() => {
        try {
          if (doctor.languages) {
            return typeof doctor.languages === 'string'
              ? JSON.parse(doctor.languages)
              : doctor.languages
          }
        } catch {
          return []
        }
        return []
      })(),
    }

    res.json({
      message: 'Cập nhật bác sĩ thành công',
      doctor: response,
    })
  } catch (error) {
    console.error('Update doctor error:', error)
    res.status(500).json({ error: 'Lỗi server' })
  }
})

// Delete doctor
router.delete('/doctors/:id', requireAdmin, async (req, res) => {
  try {
    const { id } = req.params

    await query('DELETE FROM doctors WHERE id = ?', [id])

    res.json({ message: 'Xóa bác sĩ thành công' })
  } catch (error) {
    console.error('Delete doctor error:', error)
    res.status(500).json({ error: 'Lỗi server' })
  }
})

// Get all appointments
router.get('/appointments', requireAdmin, async (_req, res) => {
  try {
    const rows = await query(
      `SELECT 
        a.id,
        a.patient_name,
        a.patient_phone,
        a.patient_email,
        a.specialty,
        a.appointment_date,
        a.appointment_time,
        a.status,
        a.created_at,
        a.gender,
        a.symptoms,
        a.rating,
        d.name AS doctor_name,
        d.price AS doctor_price,
        u.name AS user_name
      FROM appointments a
      LEFT JOIN doctors d ON a.doctor_id = d.id
      LEFT JOIN users u ON a.user_id = u.id
      ORDER BY a.appointment_date DESC, a.appointment_time DESC`
    )

    res.json(rows)
  } catch (error) {
    console.error('Get appointments error:', error)
    res.status(500).json({ error: 'Lỗi server' })
  }
})

// Revenue summary (completed appointments only)
router.get('/revenue', requireAdmin, async (req, res) => {
  try {
    const totals = await query(
      `SELECT 
        COUNT(*) AS total_completed,
        COALESCE(SUM(
          CAST(
            REPLACE(
              REPLACE(
                REPLACE(
                  REPLACE(d.price, '.', ''),
                  'đ',
                  ''
                ),
                ' ',
                ''
              ),
              ',',
              ''
            ) AS UNSIGNED
          )
        ), 0) AS total_revenue_vnd
      FROM appointments a
      JOIN doctors d ON a.doctor_id = d.id
      WHERE a.status = 'completed'`
    ) as any[]

    const monthly = await query(
      `SELECT 
        DATE_FORMAT(a.appointment_date, '%Y-%m') AS month,
        COUNT(*) AS completed_count,
        COALESCE(SUM(
          CAST(
            REPLACE(
              REPLACE(
                REPLACE(
                  REPLACE(d.price, '.', ''),
                  'đ',
                  ''
                ),
                ' ',
                ''
              ),
              ',',
              ''
            ) AS UNSIGNED
          )
        ), 0) AS revenue_vnd
      FROM appointments a
      JOIN doctors d ON a.doctor_id = d.id
      WHERE a.status = 'completed'
      GROUP BY month
      ORDER BY month DESC
      LIMIT 12`
    )

    res.json({
      totals: totals[0] || { total_completed: 0, total_revenue_vnd: 0 },
      monthly,
    })
  } catch (error) {
    console.error('Get revenue error:', error)
    res.status(500).json({ error: 'Lỗi server' })
  }
})

// Get all patients
router.get('/patients', requireAdmin, async (_req, res) => {
  try {
    const users = await query(
      `SELECT 
        id,
        name,
        email,
        created_at
      FROM users
      ORDER BY created_at DESC
      LIMIT 200`
    )

    res.json(users)
  } catch (error) {
    console.error('Get patients error:', error)
    res.status(500).json({ error: 'Lỗi server' })
  }
})

export default router


