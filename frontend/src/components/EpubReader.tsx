import { useEffect, useRef, useState } from 'react'
import * as EPUBJS from 'epubjs'
import './EpubReader.css'

interface EpubReaderProps {
  bookId: string
  filePath: string
  title: string
}

function EpubReader({ bookId, filePath, title }: EpubReaderProps) {
  const viewerRef = useRef<HTMLDivElement>(null)
  const bookRef = useRef<any>(null)
  const renditionRef = useRef<any>(null)
  
  const [currentLocation, setCurrentLocation] = useState(0)
  const [totalLocations, setTotalLocations] = useState(0)
  const [fontSize, setFontSize] = useState(16)
  const [showTOC, setShowTOC] = useState(false)
  const [chapters, setChapters] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (!viewerRef.current) return

    const initEpub = async () => {
      try {
        setIsLoading(true)
        
        // Initialize EPUB.js book
        const book = new EPUBJS.Book({
          url: `/api/books/${bookId}/file`,
          openAs: 'epub',
        })

        bookRef.current = book
        
        // Generate rendition
        const rendition = book.renderTo(viewerRef.current, {
          width: '100%',
          height: '100%',
          spread: 'auto',
          flow: 'paginated',
        })

        renditionRef.current = rendition

        // Handle keyboard navigation
        rendition.on('keydown', handleKeyDown)

        // Display first page
        const displayed = await rendition.display()

        // Generate locations for pagination
        await book.locations.generate(256)

        // Get table of contents
        const toc = book.navigation.toc
        setChapters(toc)

        // Set total locations
        const locations = book.locations.length()
        setTotalLocations(locations)

        // Track current location
        rendition.on('relocated', (location: any) => {
          const currentLoc = book.locations.indexOf(location.start.cfi)
          setCurrentLocation(currentLoc)
        })

        setIsLoading(false)
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

  const handleKeyDown = (event: any) => {
    const { rendition } = renditionRef.current ? { rendition: renditionRef.current } : { rendition: null }
    if (!rendition) return

    switch (event.keyCode) {
      case 37: // Left arrow
      case 72: // H
      case 80: // P
        event.preventDefault()
        rendition.prev()
        break
      case 39: // Right arrow
      case 74: // J
      case 78: // N
        event.preventDefault()
        rendition.next()
        break
      case 32: // Space
        event.preventDefault()
        rendition.next()
        break
    }
  }

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

  const handleFontSizeChange = (newSize: number) => {
    setFontSize(newSize)
    if (renditionRef.current) {
      renditionRef.current.themes.fontSize(newSize + 'px')
    }
  }

  const goToChapter = (href: string) => {
    if (renditionRef.current && bookRef.current) {
      renditionRef.current.display(href)
      setShowTOC(false)
    }
  }

  const progress = totalLocations > 0 ? ((currentLocation + 1) / totalLocations) * 100 : 0

  return (
    <div className="epub-reader">
      <div className="reader-toolbar">
        <div className="toolbar-left">
          <button className="toolbar-btn" onClick={goPrev} title="上一页 (←)">
            ← 上一页
          </button>
          <span className="page-info">
            {currentLocation + 1} / {totalLocations}
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
          <label className="font-size-control">
            <span>字体大小：</span>
            <input
              type="range"
              min="12"
              max="28"
              value={fontSize}
              onChange={(e) => handleFontSizeChange(parseInt(e.target.value))}
              title="调整字体大小"
            />
            <span>{fontSize}px</span>
          </label>
        </div>
      </div>

      <div className="reader-progress">
        <div className="progress-bar" style={{ width: progress + '%' }}></div>
        <span className="progress-text">{Math.round(progress)}%</span>
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
