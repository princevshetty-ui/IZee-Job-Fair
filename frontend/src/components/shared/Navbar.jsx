import { Link } from 'react-router-dom'
import collegeLogo from '../../assets/images/college-logo.png'

const Navbar = () => {
  return (
    <nav className="absolute top-0 w-full z-50 pt-4 bg-transparent pointer-events-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20 md:h-28">
          <Link to="/" className="flex items-center gap-3 group h-full">
            <img 
              src={collegeLogo}
              alt="IZEE College Logo" 
              className="h-14 md:h-24 w-auto object-contain drop-shadow-2xl group-hover:scale-[1.03] transition-transform duration-500" 
            />
          </Link>
          <div className="flex items-center gap-6">
             <Link to="/register" className="group">
               <div className="px-6 md:px-8 py-2.5 md:py-3 rounded-full bg-white/[0.02] border border-cyan-400/50 text-cyan-300 font-semibold text-xs md:text-sm tracking-[0.05em] uppercase transition-all shadow-[0_0_15px_rgba(34,211,238,0.2)] hover:shadow-[0_0_30px_rgba(34,211,238,0.5)] hover:bg-cyan-500/10 hover:scale-105 backdrop-blur-md">
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