import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { useState, useEffect } from 'react'

// Import page components (we'll create these later)
import LandingPage from './pages/LandingPage'
import RegisterPage from './pages/RegisterPage'
import OnSpotPage from './pages/OnSpotPage'
import VolunteerRegisterPage from './pages/VolunteerRegisterPage'
import VolunteerValidatePage from './pages/VolunteerValidatePage'
import AdminLoginPage from './pages/AdminLoginPage'
import AdminDashboard from './pages/AdminDashboard'

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/onspot" element={<OnSpotPage />} />
        <Route path="/volunteer/register" element={<VolunteerRegisterPage />} />
        <Route path="/volunteer/validate" element={<VolunteerValidatePage />} />
        <Route path="/admin" element={<AdminLoginPage />} />
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
      </Routes>
    </Router>
  )
}

export default App