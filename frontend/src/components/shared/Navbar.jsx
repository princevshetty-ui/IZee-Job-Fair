import { Link } from 'react-router-dom'
import { useState, useEffect } from 'react'

const Navbar = ({ transparent = false }) => {
  return (
    <nav className={`fixed w-full z-50 ${transparent ? 'bg-transparent' : 'glass'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <div className="text-white font-bold text-xl">IZEE Job Fair 2026</div>
          </div>
        </div>
      </div>
    </nav>
  )
}

export default Navbar