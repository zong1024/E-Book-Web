import { useEffect, useRef, useState } from 'react'
import './EpubReader.css'

interface EpubReaderProps {
  bookId: string
  filePath?: string
  title?: string
}

function EpubReader({ bookId }: EpubReaderProps) {
  const viewerRef = useRef<HTMLDivElement>(null)
  const bookRef = useRef<any>(null)
  const renditionRef = useRef<any>(null)
  
  const [currentLocation, setCurrentLocation] = useState(0)
  const [showTOC, setShowTOC] = useState(false)
  const [chapters, setChapters] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (!viewerRef.current) return

    const initEpub = async () => {
      try {
        setIsLoading(true)
        
        // 动态导入 EPUB.js
        return new Promise<void>((resolve) => {
          const script = document.createElement('script')
          script.src = 'https://cdn.jsdelivr.net/npm/epubjs@0.3.88/dist/epub.min.js'
          script.onload = async () => {
            try {
              const EPUBJS = (window as any).EPUB
              if (!EPUBJS) {
                throw new Error('EPUB.js library failed to load')
              }

              // Create book with URL
              const book = new EPUBJS.Book(`/api/books/${bookId}/file`)
              bookRef.current = book

              if (viewerRef.current) {
                // Create rendition
                const rendition = book.renderTo(viewerRef.current, {
                  width: '100%',
                  height: '100%',
                  spread: 'auto',
                })

                renditionRef.current = rendition

                // Display the book
                await rendition.display()

                // Generate locations for progress tracking
                await book.locations.generate(256)

                // Get table of contents
                const toc = book.navigation?.toc || []
                setChapters(toc)

                // Track reading progress
                rendition.on('relocated', (location: any) => {
                  const progress = book.locations.percentageFromCfi(location.start.cfi)
                  setCurrentLocation(Math.round(progress * 100))
                })

                // Handle keyboard shortcuts
                document.addEventListener('keydown', (e: KeyboardEvent) => {
                  if (e.key === 'ArrowRight' || e.key === ' ' || e.key === 'j' || e.key === 'n') {
                    e.preventDefault()
                    rendition.next()
                  } else if (e.key === 'ArrowLeft' || e.key === 'h' || e.key === 'p') {
                    e.preventDefault()
                    rendition.prev()
                  }
                })
              }

              setIsLoading(false)
              resolve()
            } catch (error) {
              console.error('Failed to initialize EPUB:', error)
              setIsLoading(false)
              resolve()
            }
          }

          script.onerror = () => {
            console.error('Failed to load EPUB.js script')
            setIsLoading(false)
            resolve()
          }

          document.head.appendChild(script)
        })
      } catch (error) {
        console.error('Failed to initialize EPUB:', error)
        setIsLoading(false)
      }
    }

    initEpub()

    return () => {
      if (renditionRef.current) {
        renditionRef.current.destroy()
      }
      if (bookRef.current) {
        bookRef.current.destroy()
      }
    }
  }, [bookId])

  const goNext = () => {
    if (renditionRef.current) {
      renditionRef.current.next()
    }
  }

  const goPrev = () => {
    if (renditionRef.current) {
      renditionRef.current.prev()
    }
  }

  const goToChapter = (href: string) => {
    if (renditionRef.current) {
      renditionRef.current.display(href)
      setShowTOC(false)
    }
  }

  return (
    <div className="epub-reader">
      <div className="reader-toolbar">
        <div className="toolbar-left">
          <button className="toolbar-btn" onClick={goPrev} title="上一页 (←)">
            ← 上一页
          </button>
          <span className="page-info">
            {currentLocation}%
          </span>
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

        <div className="toolbar-right">
        </div>
      </div>

      <div className="reader-progress">
        <div className="progress-bar" style={{ width: currentLocation + '%' }}></div>
        <span className="progress-text">{currentLocation}%</span>
      </div>

      {showTOC && (
        <div className="toc-panel">
          <h3>目录</h3>
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
