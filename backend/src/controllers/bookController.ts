import { Request, Response } from 'express'
import { v4 as uuidv4 } from 'uuid'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'
import fs from 'fs'
import { allAsync, getAsync, runAsync } from '../config/database.js'
import { parseEpubMetadata } from '../utils/epubParser.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

export const getBooks = async (req: Request, res: Response) => {
  try {
    const books = await allAsync('SELECT * FROM books ORDER BY uploadedAt DESC')
    res.json(books)
  } catch (error) {
    console.error('Error fetching books:', error)
    res.status(500).json({ error: 'Failed to fetch books' })
  }
}

export const uploadBook = async (req: Request, res: Response) => {
  try {
    if (!req.file) {
      res.status(400).json({ error: 'No file uploaded' })
      return
    }

    const bookId = uuidv4()
    const filePath = req.file.path
    const fileName = req.file.filename
    const fileSize = req.file.size

    // Parse EPUB metadata
    let metadata: any = { title: req.file.originalname, author: '' }
    try {
      metadata = await parseEpubMetadata(filePath)
    } catch (err) {
      console.warn('Failed to parse EPUB metadata:', err)
      // Continue with default metadata
    }

    // Store in database
    await runAsync(
      `INSERT INTO books (id, title, author, cover, filePath, fileName, fileSize) 
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [
        bookId,
        metadata.title || req.file.originalname,
        metadata.author || 'Unknown',
        metadata.cover || null,
        filePath,
        fileName,
        fileSize,
      ]
    )

    res.json({
      id: bookId,
      title: metadata.title || req.file.originalname,
      author: metadata.author || 'Unknown',
      cover: metadata.cover || null,
      uploadedAt: new Date().toISOString(),
    })
  } catch (error) {
    console.error('Error uploading book:', error)
    if (req.file) {
      fs.unlinkSync(req.file.path) // Clean up uploaded file
    }
    res.status(500).json({ error: 'Failed to upload book' })
  }
}

export const getBookDetail = async (req: Request, res: Response) => {
  try {
    const book = await getAsync('SELECT * FROM books WHERE id = ?', [req.params.id])
    if (!book) {
      res.status(404).json({ error: 'Book not found' })
      return
    }
    res.json(book)
  } catch (error) {
    console.error('Error fetching book detail:', error)
    res.status(500).json({ error: 'Failed to fetch book' })
  }
}

export const getBookFile = async (req: Request, res: Response) => {
  try {
    const book = await getAsync('SELECT * FROM books WHERE id = ?', [req.params.id])
    if (!book) {
      res.status(404).json({ error: 'Book not found' })
      return
    }

    const filePath = book.filePath
    if (!fs.existsSync(filePath)) {
      res.status(404).json({ error: 'Book file not found' })
      return
    }

    res.setHeader('Content-Type', 'application/epub+zip')
    res.setHeader('Content-Disposition', `attachment; filename="${book.fileName}"`)
    const stream = fs.createReadStream(filePath)
    stream.pipe(res)
  } catch (error) {
    console.error('Error fetching book file:', error)
    res.status(500).json({ error: 'Failed to fetch book file' })
  }
}

export const deleteBook = async (req: Request, res: Response) => {
  try {
    const book = await getAsync('SELECT * FROM books WHERE id = ?', [req.params.id])
    if (!book) {
      res.status(404).json({ error: 'Book not found' })
      return
    }

    // Delete file
    if (fs.existsSync(book.filePath)) {
      fs.unlinkSync(book.filePath)
    }

    // Delete from database
    await runAsync('DELETE FROM books WHERE id = ?', [req.params.id])

    res.json({ message: 'Book deleted successfully' })
  } catch (error) {
    console.error('Error deleting book:', error)
    res.status(500).json({ error: 'Failed to delete book' })
  }
}
