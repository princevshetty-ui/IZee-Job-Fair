import { Link } from 'react-router-dom'

const Navbar = ({ transparent = false }) => {
  return (
    <nav className={`fixed w-full z-50 transition-all duration-300 ${transparent ? 'bg-transparent border-b border-transparent pt-4' : 'bg-white/70 backdrop-blur-xl border-b border-slate-200 pt-2 shadow-sm'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20 md:h-28">
          <Link to="/" className="flex items-center gap-3 group h-full">
            <img 
              src="/src/assets/images/college-logo.png" 
              alt="IZEE Logo" 
              className="h-14 md:h-24 w-auto object-contain group-hover:scale-[1.03] transition-transform duration-500 opacity-90" 
            />
          </Link>
          <div className="flex items-center gap-6">
             <Link to="/register" className="group">
               <div className="px-6 md:px-8 py-2.5 md:py-3 bg-indigo-600 text-white rounded-lg font-semibold text-xs md:text-sm tracking-[0.05em] uppercase transition-all hover:bg-indigo-700 hover:shadow-lg hover:scale-105">
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