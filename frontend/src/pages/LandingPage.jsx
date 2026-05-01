import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import Navbar from '../components/shared/Navbar'
import { COMPANIES } from '../utils/constants'

const LandingPage = () => {
  const [stats, setStats] = useState([
    { value: 0, label: 'Registrations' },
    { value: 0, label: 'Companies' },
    { value: 0, label: 'Attendees' }
  ])

  useEffect(() => {
    // Animate stats on load
    const timer = setTimeout(() => {
      setStats([
        { value: 4000, label: 'Registrations' },
        { value: 80, label: 'Companies' },
        { value: 1500, label: 'Attendees' }
      ])
    }, 500)
    
    return () => clearTimeout(timer)
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-900 text-white">
      <Navbar transparent={true} />
      
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="text-center">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-6xl font-bold mb-4 font-['Outfit']"
          >
            IZEE JOB FAIR 2026
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-xl text-gray-300 mb-8"
          >
            8th May 2026 · IZEE Business School, Bangalore
          </motion.p>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="flex flex-col md:flex-row justify-center gap-4 mb-12"
          >
            <Link to="/register">
              <button className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-6 py-3 rounded-lg font-semibold hover:scale-105 transition-transform">
                Register Now
              </button>
            </Link>
            <Link to="/onspot">
              <button className="border-2 border-blue-500 text-blue-500 px-6 py-3 rounded-lg font-semibold hover:scale-105 transition-transform">
                On-Spot Registration
              </button>
            </Link>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="inline-block bg-gradient-to-r from-emerald-500 to-teal-500 text-white px-4 py-2 rounded-full font-semibold pulse"
          >
            80+ Companies Hiring
          </motion.div>
        </div>
      </div>
      
      {/* Stats Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 + index * 0.1 }}
              className="glass rounded-lg p-6 text-center"
            >
              <h3 className="text-3xl font-bold text-gradient">{stat.value}+</h3>
              <p className="text-gray-300">{stat.label}</p>
            </motion.div>
          ))}
        </div>
      </div>
      
      {/* Company Carousel */}
      <div className="container mx-auto px-4 py-16">
        <div className="overflow-hidden whitespace-nowrap">
          <div className="animate-marquee inline-block">
            {COMPANIES.map((company, index) => (
              <span key={index} className="mx-4 text-gray-400">
                {company}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default LandingPage