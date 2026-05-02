import { Link } from 'react-router-dom'

const NotFoundPage = () => {
  return (
    <div className="min-h-screen flex items-center justify-center text-white" style={{ backgroundColor: '#0a0e1a' }}>
      <div
        className="fixed inset-0 pointer-events-none z-0"
        style={{
          background: 'linear-gradient(135deg, #0a0e1a 0%, #1a1f3a 40%, #0f1628 100%)'
        }}
      />
      <div className="relative z-10 text-center px-4">
        <h1 className="text-8xl md:text-9xl font-heading-art font-light mb-4">
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 to-cyan-400">404</span>
        </h1>
        <p className="text-xl md:text-2xl text-slate-300 font-light mb-8">Page not found</p>
        <p className="text-slate-400 mb-8 max-w-md mx-auto font-light">
          The page you are looking for does not exist or has been moved.
        </p>
        <Link
          to="/"
          className="inline-block px-8 py-3 rounded-lg bg-gradient-to-r from-indigo-600 to-cyan-500 text-white font-semibold tracking-[0.05em] uppercase transition-all hover:shadow-lg hover:shadow-indigo-500/50 hover:scale-105"
        >
          Go Home
        </Link>
      </div>
    </div>
  )
}

export default NotFoundPage