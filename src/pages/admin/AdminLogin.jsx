import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { Lock, Mail, ArrowRight, ShieldCheck, AlertCircle, Loader2 } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { HariHaraLogo } from '../../components/HariHaraLogo';
import { validateEmail, validateText } from '../../utils/validators';

export function AdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fieldErrors, setFieldErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || '/admin/dashboard';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    const errors = {};
    const emailErr = validateEmail(email, true);
    if (emailErr) errors.email = emailErr;

    const passErr = validateText(password, 'Password', 4, 100);
    if (passErr) errors.password = passErr;

    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      setError('Please provide a valid admin email and password.');
      return;
    }

    setFieldErrors({});
    setLoading(true);

    try {
      await login({ email, password });
      navigate(from, { replace: true });
    } catch (err) {
      setError(err.message || 'Invalid administrator credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-stone-950 flex flex-col justify-center py-12 sm:px-6 lg:px-8 text-stone-100 selection:bg-amber-500 selection:text-stone-950">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center space-y-4 px-4">
        <div className="inline-block p-4 rounded-2xl bg-stone-900 border border-amber-500/40 shadow-2xl">
          <HariHaraLogo size="large" />
        </div>
        <div className="space-y-1">
          <h2 className="text-xl sm:text-2xl font-bold font-serif text-amber-200">
            Administrator Access Portal
          </h2>
          <p className="text-xs text-stone-400">
            Secure management console for jewellery designs, categories, and customer enquiries.
          </p>
        </div>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md px-4">
        <div className="bg-stone-900/90 py-8 px-6 sm:px-10 shadow-2xl rounded-2xl border border-stone-800 backdrop-blur-md">
          {error && (
            <div className="mb-6 p-3.5 rounded-xl bg-red-950/60 border border-red-800/60 flex items-center gap-2.5 text-xs text-red-200">
              <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5 text-xs">
            <div>
              <label className="block font-semibold text-stone-300 mb-1.5">
                Admin Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-500" />
                <input
                  type="email"
                  required
                  placeholder="admin@hariharajewellery.com"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (fieldErrors.email) setFieldErrors(prev => ({ ...prev, email: null }));
                  }}
                  className={`w-full pl-10 pr-4 py-2.5 rounded-lg bg-stone-950 border text-stone-200 focus:outline-none focus:ring-2 text-xs transition-colors ${
                    fieldErrors.email
                      ? 'border-red-500 focus:ring-red-500/50 focus:border-red-500 bg-red-950/20'
                      : 'border-stone-700 focus:ring-amber-500/50 focus:border-amber-500'
                  }`}
                />
              </div>
              {fieldErrors.email && (
                <p className="text-red-400 text-[11px] mt-1 flex items-center gap-1 font-medium">
                  <AlertCircle className="w-3.5 h-3.5 shrink-0" /> {fieldErrors.email}
                </p>
              )}
            </div>

            <div>
              <label className="block font-semibold text-stone-300 mb-1.5">
                Admin Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-500" />
                <input
                  type="password"
                  required
                  placeholder="••••••••••••"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (fieldErrors.password) setFieldErrors(prev => ({ ...prev, password: null }));
                  }}
                  className={`w-full pl-10 pr-4 py-2.5 rounded-lg bg-stone-950 border text-stone-200 focus:outline-none focus:ring-2 text-xs transition-colors ${
                    fieldErrors.password
                      ? 'border-red-500 focus:ring-red-500/50 focus:border-red-500 bg-red-950/20'
                      : 'border-stone-700 focus:ring-amber-500/50 focus:border-amber-500'
                  }`}
                />
              </div>
              {fieldErrors.password && (
                <p className="text-red-400 text-[11px] mt-1 flex items-center gap-1 font-medium">
                  <AlertCircle className="w-3.5 h-3.5 shrink-0" /> {fieldErrors.password}
                </p>
              )}
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-amber-600 via-amber-700 to-amber-800 hover:from-amber-500 hover:to-amber-700 text-white font-bold py-3 px-4 rounded-xl shadow-lg shadow-amber-600/20 text-xs transition-all cursor-pointer disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Verifying Session...</span>
                  </>
                ) : (
                  <>
                    <span>Enter Management Dashboard</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          </form>

          {/* Quick Credential Tip */}
          <div className="mt-6 pt-5 border-t border-stone-800 text-[11px] text-stone-400 space-y-1.5">
            <div className="flex items-center gap-1.5 text-amber-400 font-semibold">
              <ShieldCheck className="w-3.5 h-3.5" />
              Initial Admin Credentials:
            </div>
            <p className="font-mono text-stone-300">
              Email: <span className="text-amber-200">admin@hariharajewellery.com</span>
            </p>
            <p className="font-mono text-stone-300">
              Password: <span className="text-amber-200">SecureAdminPassword@2026</span>
            </p>
          </div>
        </div>

        <div className="text-center mt-6">
          <Link to="/" className="text-xs text-stone-500 hover:text-amber-400 transition-colors">
            ← Return to Public Customer Website
          </Link>
        </div>
      </div>
    </div>
  );
}
