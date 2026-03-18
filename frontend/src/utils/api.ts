import axios from 'axios'

const API_BASE_URL = '/api'

export const bookApi = {
  getBooks: async () => {
    const response = await axios.get(`${API_BASE_URL}/books`)
    return response.data
  },

  getBook: async (id: string) => {
    const response = await axios.get(`${API_BASE_URL}/books/${id}`)
    return response.data
  },

  uploadBook: async (file: File) => {
    const formData = new FormData()
    formData.append('file', file)
    const response = await axios.post(`${API_BASE_URL}/books/upload`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
    return response.data
  },

  deleteBook: async (id: string) => {
    await axios.delete(`${API_BASE_URL}/books/${id}`)
  },

  getBookFile: async (id: string) => {
    const response = await axios.get(`${API_BASE_URL}/books/${id}/file`, {
      responseType: 'blob',
    })
    return response.data
  },
}
