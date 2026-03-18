import express, { Router } from 'express'
import multer from 'multer'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'
import * as bookController from '../controllers/bookController.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const router = Router()

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = join(__dirname, '../../uploads')
    cb(null, uploadDir)
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
    cb(null, uniqueSuffix + '-' + file.originalname)
  },
})

const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    if (!file.originalname.endsWith('.epub')) {
      cb(new Error('Only EPUB files are allowed') as any)
    } else {
      cb(null, true)
    }
  },
})

// Routes
router.get('/', bookController.getBooks)
router.post('/upload', upload.single('file'), bookController.uploadBook)
router.get('/:id', bookController.getBookDetail)
router.get('/:id/file', bookController.getBookFile)
router.delete('/:id', bookController.deleteBook)

export default router
