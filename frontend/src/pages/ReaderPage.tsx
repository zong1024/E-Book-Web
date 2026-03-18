import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import axios from 'axios'
import EpubReader from '../components/EpubReader'
import './ReaderPage.css'

interface BookDetail {
  id: string
  title: string
  author: string
  filePath: string
}

function ReaderPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [book, setBook] = useState<BookDetail | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchBook = async () => {
      if (!id) return
      try {
        setLoading(true)
        const response = await axios.get(`/api/books/${id}`)
        setBook(response.data)
      } catch (err) {
        console.error('获取图书详情失败:', err)
        setError('获取图书详情失败')
      } finally {
        setLoading(false)
      }
    }

    fetchBook()
  }, [id])

  if (loading) {
    return <div className="reader-page loading">加载中...</div>
  }

  if (error || !book) {
    return (
      <div className="reader-page error">
        <p>{error || '找不到图书'}</p>
        <button onClick={() => navigate('/')}>返回首页</button>
      </div>
    )
  }

  return (
    <div className="reader-page">
      <div className="reader-header">
        <button className="back-btn" onClick={() => navigate('/')}>
          ← 返回
        </button>
        <h1>{book.title}</h1>
        <p>{book.author}</p>
      </div>
      <EpubReader bookId={id!} filePath={book.filePath} title={book.title} />
    </div>
  )
}

export default ReaderPage
