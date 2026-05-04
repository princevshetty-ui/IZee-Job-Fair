import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import GlobalBackground from './components/shared/GlobalBackground'

import LandingPage from './pages/LandingPage'
import RegisterPage from './pages/RegisterPage'
import ConfirmationPage from './pages/ConfirmationPage'
import VolunteerRegisterPage from './pages/VolunteerRegisterPage'
import VolunteerValidatePage from './pages/VolunteerValidatePage'
import AdminLoginPage from './pages/AdminLoginPage'
import AdminDashboard from './pages/AdminDashboard'
import NotFoundPage from './pages/NotFoundPage'
import OnSpotRegisterPage from './pages/OnSpotRegisterPage'

function App() {
  return (
    <div className="min-h-screen" style={{ backgroundColor: '#020208' }}>
      <GlobalBackground />
      <Router>
        <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/register/confirmation" element={<ConfirmationPage />} />
        <Route path="/volunteer/register" element={<VolunteerRegisterPage />} />
        <Route path="/volunteer/validate" element={<VolunteerValidatePage />} />
        <Route path="/onspot" element={<OnSpotRegisterPage />} />
        <Route path="/admin" element={<AdminLoginPage />} />
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </Router>
    </div>
  )
}

export default App