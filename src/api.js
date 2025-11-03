const API_BASE_URL = '/agenticai/api/v1'

class ApiService {
  async request(endpoint, options = {}) {
    const url = `${API_BASE_URL}${endpoint}`
    
    const defaultOptions = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      credentials: 'include',
    }
    
    const config = { ...defaultOptions, ...options }
    
    try {
      const response = await fetch(url, config)
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      
      return await response.json()
    } catch (error) {
      console.error('API request failed:', error)
      throw error
    }
  }
  
  async get(endpoint) {
    return this.request(endpoint, { method: 'GET' })
  }
  
  async post(endpoint, data) {
    return this.request(endpoint, {
      method: 'POST',
      body: JSON.stringify(data),
    })
  }
  
  async put(endpoint, data) {
    return this.request(endpoint, {
      method: 'PUT',
      body: JSON.stringify(data),
    })
  }
  
  async delete(endpoint) {
    return this.request(endpoint, { method: 'DELETE' })
  }
  
  // Specific API methods
  async getUserMe() {
    return this.get('/user/me')
  }
  
  async sendMessage(message) {
    return this.post('/chat', { message })
  }
}

export default new ApiService()
