import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'
import FileUpload from '../components/FileUpload'
import './HomePage.css'

interface Book {
  id: string
  title: string
  author: string
  cover: string
  uploadedAt: string
}

function HomePage() {
  const [books, setBooks] = useState<Book[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        setLoading(true)
        const response = await axios.get('/api/books')
        setBooks(response.data)
        setError(null)
      } catch (err) {
        console.error('获取图书列表失败:', err)
        setError('获取图书列表失败，请稍后重试')
      } finally {
        setLoading(false)
      }
    }

    fetchBooks()
  }, [])

  const handleUploadSuccess = (newBook: Book) => {
    setBooks([newBook, ...books])
  }

  const handleDelete = async (bookId: string) => {
    if (!window.confirm('确定要删除这本书吗？')) return

    try {
      await axios.delete(`/api/books/${bookId}`)
      setBooks(books.filter(book => book.id !== bookId))
    } catch (err) {
      console.error('删除失败:', err)
      alert('删除失败，请稍后重试')
    }
  }

  return (
    <div className="home-page">
      <div className="header-section">
        <h1>欢迎来到电子书阅读器</h1>
        <p>上传并阅读您的EPUB电子书</p>
      </div>

      <FileUpload onUploadSuccess={handleUploadSuccess} />

      <div className="books-section">
        <h2>我的图书库 ({books.length})</h2>
        
        {error && <div className="error-message">{error}</div>}
        
        {loading ? (
          <div className="loading">加载中...</div>
        ) : books.length === 0 ? (
          <div className="empty-state">
            <p>还没有上传任何图书，请先上传一本EPUB电子书</p>
          </div>
        ) : (
          <div className="books-grid">
            {books.map(book => (
              <div key={book.id} className="book-card">
                <div className="book-cover">
                  {book.cover ? (
                    <img src={book.cover} alt={book.title} />
                  ) : (
                    <div className="no-cover">📖</div>
                  )}
                </div>
                <div className="book-info">
                  <h3>{book.title}</h3>
                  <p className="author">{book.author || '未知作者'}</p>
                  <p className="date">{new Date(book.uploadedAt).toLocaleDateString('zh-CN')}</p>
                  <div className="book-actions">
                    <Link to={`/reader/${book.id}`} className="btn-read">
                      阅读
                    </Link>
                    <button
                      className="btn-delete"
                      onClick={() => handleDelete(book.id)}
                    >
                      删除
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default HomePage
