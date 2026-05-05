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
          <div />
        </div>
      </div>
    </nav>
  )
}

export default Navbar
