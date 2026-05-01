const API_URL = import.meta.env.VITE_API_URL || ''

export const apiCall = async (endpoint, options = {}) => {
  const url = `${API_URL}${endpoint}`
  
  // Set default headers
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers
  }
  
  // If we have a token in localStorage, add it to the headers
  const token = localStorage.getItem('token')
  if (token) {
    headers['Authorization'] = `Bearer ${token}`
  }
  
  // Merge with any provided options
  const config = {
    ...options,
    headers
  }
  
  try {
    const response = await fetch(url, config)
    
    // Handle 401 Unauthorized
    if (response.status === 401) {
      // Redirect to login or handle unauthorized access
      window.location.href = '/admin'
      return
    }
    
    return response
  } catch (error) {
    console.error('API call failed:', error)
    throw error
  }
}