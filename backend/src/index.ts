import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import specialtiesRoutes from './routes/specialties'
import doctorsRoutes from './routes/doctors'
import appointmentsRoutes from './routes/appointments'
import authRoutes from './routes/auth'
import doctorsAuthRoutes from './routes/doctors-auth'
import contactRoutes from './routes/contact'
import adminRoutes from './routes/admin'

dotenv.config()

const app = express()
const PORT = process.env.PORT || 3001

// Middleware
app.use(cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    credentials: true
}))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// Routes
app.use('/api/specialties', specialtiesRoutes)
app.use('/api/doctors', doctorsRoutes)
app.use('/api/appointments', appointmentsRoutes)
app.use('/api', authRoutes)
app.use('/api/doctors-auth', doctorsAuthRoutes)
app.use('/api/contact', contactRoutes)
app.use('/api/admin', adminRoutes)

// Health check
app.get('/api/health', (req, res) => {
    res.json({ message: 'Backend API is running', status: 'OK' })
})

app.listen(PORT, () => {
    console.log(`Backend server is running on port ${PORT}`)
})
