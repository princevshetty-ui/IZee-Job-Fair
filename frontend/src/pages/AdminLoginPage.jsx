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
    <div className="min-h-screen flex text-white" style={{ backgroundColor: '#020208' }}>

      {/* ── Left Branding Panel ── */}
      <div className="hidden lg:flex lg:w-1/2 relative flex-col items-center justify-center px-16 overflow-hidden"
        style={{ background: 'linear-gradient(160deg, #0D0D1A 0%, #080812 100%)', borderRight: '1px solid #1a1a2e' }}>

        {/* Decorative orbs */}
        <div className="absolute rounded-full blur-[120px] pointer-events-none"
          style={{ width: 500, height: 500, background: 'radial-gradient(circle, rgba(99,102,241,0.12) 0%, transparent 70%)', top: '-10%', left: '-10%' }} />
        <div className="absolute rounded-full blur-[100px] pointer-events-none"
          style={{ width: 400, height: 400, background: 'radial-gradient(circle, rgba(139,92,246,0.1) 0%, transparent 70%)', bottom: '5%', right: '-5%' }} />

        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
          className="relative z-10 text-center max-w-sm"
        >
          <img src={collegeLogo} alt="IZEE" className="h-24 w-auto mx-auto mb-10 object-contain"
            style={{ filter: 'drop-shadow(0 0 24px rgba(99,102,241,0.3))' }} />

          <div className="mb-2">
            <span className="text-[10px] uppercase tracking-[0.3em] font-semibold" style={{ color: 'rgba(99,102,241,0.6)' }}>
              Admin Portal
            </span>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold mb-4 font-heading-art tracking-tight text-gradient-hero">
            IZee Job Fair
          </h1>
          <p className="text-sm leading-relaxed" style={{ color: '#334155' }}>
            Secure admin access to manage registrations, track attendance, and oversee the 2026 placement drive.
          </p>

          <div className="mt-10 flex items-center justify-center gap-8">
            {[{ v: '80+', l: 'Companies' }, { v: '2500+', l: 'Candidates' }, { v: '8 May', l: '2026' }].map((s, i) => (
              <div key={i} className="text-center">
                <div className="text-lg font-bold text-gradient-hero">{s.v}</div>
                <div className="text-[10px] uppercase tracking-[0.15em] mt-0.5" style={{ color: '#475569' }}>{s.l}</div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* ── Right Login Form ── */}
      <div className="flex-1 flex items-center justify-center px-6 py-16 relative">
        <div className="absolute rounded-full blur-[150px] pointer-events-none"
          style={{ width: 500, height: 500, background: 'radial-gradient(circle, rgba(99,102,241,0.06) 0%, transparent 70%)', top: '50%', left: '50%', transform: 'translate(-50%,-50%)' }} />

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="w-full max-w-md relative z-10"
        >
          {/* Mobile logo */}
          <div className="lg:hidden text-center mb-8">
            <img src={collegeLogo} alt="IZEE" className="h-16 w-auto mx-auto mb-4 object-contain" />
          </div>

          <div className="mb-8">
            <h2 className="text-2xl md:text-3xl font-bold text-white tracking-tight font-heading-art mb-2">Welcome back</h2>
            <p className="text-sm" style={{ color: '#475569' }}>Sign in to manage the Job Fair</p>
          </div>

          <div className="rounded-2xl p-8" style={{ background: '#0D0D1A', border: '1px solid #1a1a2e' }}>
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-[0.12em] mb-2" style={{ color: '#475569' }}>
                  Email Address
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="form-input"
                  placeholder="admin@izee.edu"
                  autoComplete="email"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-[0.12em] mb-2" style={{ color: '#475569' }}>
                  Password
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="form-input"
                  placeholder="••••••••••"
                  autoComplete="current-password"
                />
              </div>

              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -6 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-center gap-2.5 px-4 py-3 rounded-lg text-sm"
                  style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)', color: '#EF4444' }}
                >
                  <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                  {error}
                </motion.div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 px-4 rounded-xl text-white font-semibold text-sm tracking-[0.05em] uppercase transition-all duration-200"
                style={{
                  background: loading ? 'rgba(99,102,241,0.4)' : 'linear-gradient(135deg, #6366F1, #8B5CF6)',
                  boxShadow: loading ? 'none' : '0 4px 20px rgba(99,102,241,0.35)',
                }}
                onMouseEnter={e => { if (!loading) { e.currentTarget.style.opacity = '0.9'; e.currentTarget.style.transform = 'translateY(-1px)' } }}
                onMouseLeave={e => { e.currentTarget.style.opacity = '1'; e.currentTarget.style.transform = 'translateY(0)' }}
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/></svg>
                    Signing in…
                  </span>
                ) : 'Sign In'}
              </button>
            </form>
          </div>

          <p className="text-center text-xs mt-6" style={{ color: '#334155' }}>
            IZEE Job Fair 2026 &mdash; Admin Console
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default AdminLoginPage;
