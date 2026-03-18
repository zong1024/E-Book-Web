import express from 'express'
import cors from 'cors'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'
import { initializeDatabase } from './config/database.js'
import bookRoutes from './routes/books.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const app = express()
const PORT = process.env.PORT || 5000

// Middleware
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'DELETE', 'PUT', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// Static files
app.use('/uploads', express.static(join(__dirname, '../uploads')))

// Initialize database
initializeDatabase()

// Routes
app.use('/api/books', bookRoutes)

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'OK' })
})

// Error handling
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error(err)
  res.status(500).json({ error: err.message || '服务器错误' })
})

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`)
})
