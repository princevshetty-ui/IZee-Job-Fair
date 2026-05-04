import { Link } from 'react-router-dom'
import collegeLogo from '../../assets/images/college-logo.png'

const Navbar = () => {
  return (
    <nav className="absolute top-0 w-full z-50 pt-4 bg-transparent pointer-events-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20 md:h-24">
          <Link to="/" className="flex items-center gap-3 group h-full">
            <img
              src={collegeLogo}
              alt="IZEE"
              className="h-14 md:h-20 w-auto object-contain transition-all duration-500 group-hover:scale-[1.04]"
              style={{ filter: 'drop-shadow(0 0 12px rgba(99,102,241,0.2))' }}
            />
          </Link>
          <div className="flex items-center gap-3">
            <Link to="/register">
              <div
                className="px-6 py-2.5 rounded-full text-xs font-semibold tracking-[0.1em] uppercase transition-all duration-300 cursor-pointer"
                style={{
                  background: 'rgba(99,102,241,0.08)',
                  border: '1px solid rgba(99,102,241,0.25)',
                  color: '#a5b4fc',
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.background = 'rgba(99,102,241,0.18)'
                  e.currentTarget.style.borderColor = 'rgba(99,102,241,0.5)'
                  e.currentTarget.style.boxShadow = '0 0 24px rgba(99,102,241,0.25)'
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.background = 'rgba(99,102,241,0.08)'
                  e.currentTarget.style.borderColor = 'rgba(99,102,241,0.25)'
                  e.currentTarget.style.boxShadow = 'none'
                }}
              >
                Register Now
              </div>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  )
}

export default Navbar
