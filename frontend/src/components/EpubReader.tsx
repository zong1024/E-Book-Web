import { useEffect, useRef, useState, useCallback } from 'react'
import ePub, { Book, Rendition, NavItem } from 'epubjs'
import './EpubReader.css'

interface EpubReaderProps {
  bookId: string
}

function EpubReader({ bookId }: EpubReaderProps) {
  const viewerRef = useRef<HTMLDivElement>(null)
  const bookRef = useRef<Book | null>(null)
  const renditionRef = useRef<Rendition | null>(null)
  
  const [currentLocation, setCurrentLocation] = useState(0)
  const [showTOC, setShowTOC] = useState(false)
  const [chapters, setChapters] = useState<NavItem[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const initEpub = useCallback(async () => {
    if (!viewerRef.current) return

    try {
      setIsLoading(true)
      setError(null)

      // 创建 Book 实例
      const book = ePub(`/api/books/${bookId}/file`)
      bookRef.current = book

      // 等待 book 加载
      await book.ready

      // 创建 rendition
      const rendition = book.renderTo(viewerRef.current, {
        width: '100%',
        height: '100%',
        spread: 'auto',
        flow: 'paginated',
      })

      renditionRef.current = rendition

      // 显示内容
      await rendition.display()

      // 生成位置信息用于进度追踪
      await book.locations.generate(256)

      // 获取目录
      const navigation = await book.loaded.navigation
      if (navigation?.toc) {
        setChapters(navigation.toc)
      }

      // 监听位置变化
      rendition.on('relocated', (location: any) => {
        if (book.locations) {
          const progress = book.locations.percentageFromCfi(location.start.cfi)
          setCurrentLocation(Math.round(progress * 100))
        }
      })

      // 监听渲染错误
      rendition.on('error', (err: Error) => {
        console.error('Rendition error:', err)
        setError('渲染电子书时出错')
      })

      setIsLoading(false)
    } catch (err) {
      console.error('Failed to initialize EPUB:', err)
      setError('加载电子书失败，请检查文件格式是否正确')
      setIsLoading(false)
    }
  }, [bookId])

  useEffect(() => {
    initEpub()

    return () => {
      // 清理资源
      if (renditionRef.current) {
        renditionRef.current.destroy()
      }
      if (bookRef.current) {
        bookRef.current.destroy()
      }
    }
  }, [initEpub])

  // 键盘导航
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!renditionRef.current) return
      
      if (e.key === 'ArrowRight' || e.key === ' ' || e.key === 'j') {
        e.preventDefault()
        renditionRef.current.next()
      } else if (e.key === 'ArrowLeft' || e.key === 'h') {
        e.preventDefault()
        renditionRef.current.prev()
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [])

  const goNext = () => {
    renditionRef.current?.next()
  }

  const goPrev = () => {
    renditionRef.current?.prev()
  }

  const goToChapter = (href: string) => {
    renditionRef.current?.display(href)
    setShowTOC(false)
  }

  if (error) {
    return (
      <div className="epub-reader">
        <div className="error-container">
          <p className="error-text">{error}</p>
          <button onClick={() => window.history.back()} className="back-button">
            返回
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="epub-reader">
      <div className="reader-toolbar">
        <div className="toolbar-left">
          <button className="toolbar-btn" onClick={goPrev} title="上一页 (←)">
            ← 上一页
          </button>
          <span className="page-info">{currentLocation}%</span>
          <button className="toolbar-btn" onClick={goNext} title="下一页 (→)">
            下一页 →
          </button>
        </div>

        <div className="toolbar-center">
          <button 
            className={`toolbar-btn ${showTOC ? 'active' : ''}`}
            onClick={() => setShowTOC(!showTOC)}
            title="目录"
          >
            📑 目录
          </button>
        </div>
      </div>

      <div className="reader-progress">
        <div className="progress-bar" style={{ width: `${currentLocation}%` }}></div>
        <span className="progress-text">{currentLocation}%</span>
      </div>

      {showTOC && (
        <div className="toc-panel">
          <h3>目录</h3>
          {chapters.length > 0 ? (
            <ul className="toc-list">
              {chapters.map((chapter, idx) => (
                <li key={idx}>
                  <button
                    className="toc-item"
                    onClick={() => goToChapter(chapter.href)}
                  >
                    {chapter.label}
                  </button>
                </li>
              ))}
            </ul>
          ) : (
            <p className="no-toc">此书没有目录</p>
          )}
        </div>
      )}

      {isLoading && (
        <div className="loading-overlay">
          <div className="spinner"></div>
          <p>加载电子书中...</p>
        </div>
      )}

      <div ref={viewerRef} className="epub-viewer"></div>
    </div>
  )
}

export default EpubReader