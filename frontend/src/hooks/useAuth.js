import { useState } from 'react'

const decodeJwt = (jwt) => {
  try {
    const payload = jwt.split('.')[1]
    const decoded = atob(payload.replace(/-/g, '+').replace(/_/g, '/'))
    return JSON.parse(decoded)
  } catch (error) {
    return null
  }
}

const isTokenExpired = (jwt) => {
  const payload = decodeJwt(jwt)
  if (!payload?.exp) return true
  return Date.now() >= payload.exp * 1000
}

export const useAuth = () => {
  const [token, setToken] = useState(() => localStorage.getItem('token'))

  const setAuth = (nextToken) => {
    setToken(nextToken)
    localStorage.setItem('token', nextToken)
  }

  const clearAuth = () => {
    setToken(null)
    localStorage.removeItem('token')
  }

  const isAuthenticated = () => {
    if (!token) return false
    return !isTokenExpired(token)
  }

  return { token, setAuth, clearAuth, isAuthenticated }
}