import { validatePhone, validateEmail, validateRollNumber } from './validators'

export const validatePhone = (phone) => {
  // Basic phone validation (10 digits)
  if (!phone) return false
  return /^\d{10}$/.test(phone)
}

export const validateEmail = (email) => {
  if (!email) return false
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

export const validateRollNumber = (rollNumber) => {
  if (!rollNumber) return false
  // Basic validation for 12 alphanumeric characters
  return /^[a-zA-Z0-9]{12}$/.test(rollNumber)
}