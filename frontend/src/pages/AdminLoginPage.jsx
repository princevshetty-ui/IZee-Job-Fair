import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../hooks/useAuth';
import collegeLogo from '../assets/images/college-logo.png';

const AdminLoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { setAuth } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const API_URL = import.meta.env.VITE_API_URL || '';
      const response = await fetch(`${API_URL}/api/admin/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      if (response.ok) {
        const data = await response.json();
        setAuth(data.access_token);
        navigate('/admin/dashboard');
      } else {
        const errorData = await response.json();
        setError(errorData.detail || 'Login failed');
      }
    } catch (err) {
      console.error(err);
      setError('Network error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex lp2-grain" style={{ backgroundColor: '#15120f' }}>

      {/* Ambient orbs */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute rounded-full blur-[200px]"
          style={{ width: 700, height: 700, background: 'radial-gradient(circle, rgba(161,31,38,0.07) 0%, transparent 70%)', top: '20%', left: '30%' }} />
        <div className="absolute rounded-full blur-[150px]"
          style={{ width: 400, height: 400, background: 'radial-gradient(circle, rgba(208,176,112,0.05) 0%, transparent 70%)', bottom: '10%', right: '10%' }} />
        <div style={{ position: 'absolute', inset: 0, backgroundImage: 'linear-gradient(rgba(208,176,112,0.025) 1px, transparent 1px), linear-gradient(90deg, rgba(208,176,112,0.025) 1px, transparent 1px)', backgroundSize: '80px 80px', maskImage: 'radial-gradient(ellipse 80% 60% at 50% 30%, black 10%, transparent 100%)', WebkitMaskImage: 'radial-gradient(ellipse 80% 60% at 50% 30%, black 10%, transparent 100%)' }} />
      </div>

      {/* ── Left Branding Panel ── */}
      <div className="hidden lg:flex lg:w-1/2 relative flex-col items-center justify-center px-16 overflow-hidden z-10"
        style={{ borderRight: '1px solid rgba(208,176,112,0.1)' }}>

        <div className="absolute right-0 top-1/4 h-1/2 w-px opacity-30"
          style={{ background: 'linear-gradient(to bottom, transparent, #d0b070, transparent)' }} />

        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
          className="relative z-10 text-center max-w-sm"
        >
          <img src={collegeLogo} alt="IZEE" className="h-24 w-auto mx-auto mb-10 object-contain" />

          <p className="text-[10px] uppercase tracking-[0.28em] font-semibold mb-4" style={{ color: 'rgba(208,176,112,0.6)' }}>
            Admin Portal
          </p>
          <h1
            className="mb-5"
            style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: '2.75rem', color: '#f5f1ed', lineHeight: 1.1, fontWeight: 400 }}
          >
            IZee <span style={{ fontStyle: 'italic', color: '#d0b070' }}>Job Fair</span>
          </h1>
          <p className="text-sm leading-relaxed" style={{ color: '#5a4f48' }}>
            Secure admin access to manage registrations, track attendance, and oversee the 2026 placement drive.
          </p>

          <div className="mt-10 flex items-center justify-center gap-10">
            {[{ v: '80+', l: 'Companies' }, { v: '8 May', l: '2026' }].map((s, i) => (
              <div key={i} className="text-center">
                <div className="text-2xl font-light mb-1"
                  style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", color: '#d0b070', fontStyle: 'italic' }}>{s.v}</div>
                <div className="text-[10px] uppercase tracking-[0.2em]" style={{ color: '#5a4f48' }}>{s.l}</div>
              </div>
            ))}
          </div>

          <div className="flex items-center justify-center gap-3 mt-10">
            <span className="h-px w-12" style={{ background: 'rgba(208,176,112,0.3)' }} />
            <span className="text-[10px] tracking-[0.2em] uppercase" style={{ color: 'rgba(208,176,112,0.35)' }}>Est. 2026</span>
            <span className="h-px w-12" style={{ background: 'rgba(208,176,112,0.3)' }} />
          </div>
        </motion.div>
      </div>

      {/* ── Right Login Form ── */}
      <div className="flex-1 flex items-center justify-center px-6 py-16 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="w-full max-w-md"
        >
          {/* Mobile logo */}
          <div className="lg:hidden text-center mb-10">
            <img src={collegeLogo} alt="IZEE" className="h-16 w-auto mx-auto mb-4 object-contain" />
          </div>

          <div className="mb-8">
            <p className="text-[10px] uppercase tracking-[0.28em] font-semibold mb-2" style={{ color: '#d0b070' }}>
              Admin Access
            </p>
            <h2
              className="mb-2"
              style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: '2.25rem', color: '#f5f1ed', fontWeight: 400, lineHeight: 1.1 }}
            >
              Welcome <span style={{ fontStyle: 'italic', color: '#d0b070' }}>Back</span>
            </h2>
            <p className="text-sm" style={{ color: '#5a4f48' }}>Sign in to manage the Job Fair</p>
          </div>

          <div style={{
            background: 'rgba(21,18,15,0.85)',
            border: '1px solid rgba(208,176,112,0.18)',
            boxShadow: '0 0 60px rgba(161,31,38,0.05)',
            backdropFilter: 'blur(12px)',
            padding: '32px',
          }}>
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-[10px] font-semibold uppercase tracking-[0.2em] mb-2" style={{ color: '#8d7f76' }}>
                  Email Address
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="lp2-form-input"
                  placeholder="admin@izee.edu"
                  autoComplete="email"
                />
              </div>

              <div>
                <label className="block text-[10px] font-semibold uppercase tracking-[0.2em] mb-2" style={{ color: '#8d7f76' }}>
                  Password
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="lp2-form-input"
                  placeholder="••••••••••"
                  autoComplete="current-password"
                />
              </div>

              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -6 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-center gap-2.5 px-4 py-3 text-sm"
                  style={{ background: 'rgba(161,31,38,0.08)', border: '1px solid rgba(161,31,38,0.3)', color: '#a11f26' }}
                >
                  <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  {error}
                </motion.div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 font-semibold text-sm tracking-[0.12em] uppercase transition-all duration-300 disabled:opacity-50"
                style={{ background: '#a11f26', color: '#f5f1ed', border: '1px solid rgba(208,176,112,0.25)' }}
                onMouseEnter={e => { if (!loading) { e.currentTarget.style.background = '#d0b070'; e.currentTarget.style.color = '#15120f' } }}
                onMouseLeave={e => { e.currentTarget.style.background = '#a11f26'; e.currentTarget.style.color = '#f5f1ed' }}
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                    </svg>
                    Signing in…
                  </span>
                ) : 'Sign In'}
              </button>
            </form>
          </div>

          <p className="text-center text-xs mt-6" style={{ color: '#3d3530' }}>
            IZEE Job Fair 2026 &mdash; Admin Console
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default AdminLoginPage;
