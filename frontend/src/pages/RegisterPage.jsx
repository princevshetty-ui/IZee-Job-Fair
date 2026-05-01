import { useState } from 'react'
import Navbar from '../components/shared/Navbar'

const RegisterPage = () => {
  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <Navbar />
      <div className="container mx-auto px-4 py-16">
        <h1 className="text-3xl font-bold mb-8 text-center">Pre-Registration</h1>
        <div className="max-w-2xl mx-auto glass rounded-lg p-6">
          <p className="text-center text-gray-300">Registration form will be implemented here</p>
        </div>
      </div>
    </div>
  )
}

export default RegisterPage