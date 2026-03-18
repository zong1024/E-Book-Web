import { useState } from 'react'
import axios from 'axios'
import './FileUpload.css'

interface FileUploadProps {
  onUploadSuccess: (book: any) => void
}

function FileUpload({ onUploadSuccess }: FileUploadProps) {
  const [isDragging, setIsDragging] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    const files = e.dataTransfer.files
    if (files.length > 0) {
      handleFile(files[0])
    }
  }

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.currentTarget.files
    if (files && files.length > 0) {
      handleFile(files[0])
    }
  }

  const handleFile = async (file: File) => {
    if (!file.name.endsWith('.epub')) {
      setError('请上传EPUB格式的电子书')
      return
    }

    const formData = new FormData()
    formData.append('file', file)

    try {
      setUploading(true)
      setError(null)
      const response = await axios.post('/api/books/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })
      onUploadSuccess(response.data)
    } catch (err: any) {
      const message = err.response?.data?.error || '上传失败，请稍后重试'
      setError(message)
      console.error('上传失败:', err)
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className="file-upload">
      <div
        className={`upload-area ${isDragging ? 'dragging' : ''}`}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
      >
        {uploading ? (
          <div className="uploading">
            <div className="spinner"></div>
            <p>上传中...</p>
          </div>
        ) : (
          <>
            <input
              type="file"
              accept=".epub"
              onChange={handleFileInput}
              id="file-input"
              className="file-input"
            />
            <label htmlFor="file-input" className="upload-label">
              <div className="upload-icon">📤</div>
              <p className="upload-text">拖拽EPUB文件到此处，或点击选择文件</p>
              <p className="upload-hint">支持格式: .epub</p>
            </label>
          </>
        )}
      </div>
      {error && <div className="error-message">{error}</div>}
    </div>
  )
}

export default FileUpload
