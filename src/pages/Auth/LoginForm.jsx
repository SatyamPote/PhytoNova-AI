import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FcGoogle } from 'react-icons/fc';
import { FaGithub } from 'react-icons/fa';
import { useAuth } from '../../context/AuthContext';

export default function LoginForm() {
  const { signIn, signInWithGoogle, signInWithGitHub, error } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    const { error: err } = await signIn(email, password);
    setLoading(false);
    if (!err) navigate('/');
  }

  async function handleGoogle() {
    setLoading(true);
    await signInWithGoogle();
    setLoading(false);
  }

  async function handleGitHub() {
    setLoading(true);
    await signInWithGitHub();
    setLoading(false);
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="bg-red-500/10 border border-red-500/30 rounded-lg px-4 py-2 text-red-400 text-sm">
          {error}
        </div>
      )}

      <div>
        <label className="block text-sm text-text-secondary mb-1" htmlFor="login-email">
          Email
        </label>
        <input
          id="login-email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@example.com"
          required
          className="w-full bg-slate-800 border border-slate-600 rounded-lg px-4 py-2 text-slate-50 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition"
        />
      </div>

      <div>
        <label className="block text-sm text-text-secondary mb-1" htmlFor="login-password">
          Password
        </label>
        <input
          id="login-password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="••••••••"
          required
          className="w-full bg-slate-800 border border-slate-600 rounded-lg px-4 py-2 text-slate-50 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition"
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-gradient-to-r from-primary to-secondary text-white font-semibold rounded-xl px-6 py-3 hover:opacity-90 transition disabled:opacity-50"
      >
        {loading ? 'Signing in…' : 'Sign In'}
      </button>

      <div className="relative flex items-center gap-3 my-2">
        <div className="flex-1 h-px bg-slate-600" />
        <span className="text-xs text-slate-500">or continue with</span>
        <div className="flex-1 h-px bg-slate-600" />
      </div>

      <div className="flex gap-3">
        <button
          type="button"
          onClick={handleGoogle}
          disabled={loading}
          className="flex-1 flex items-center justify-center gap-2 bg-white/8 border border-white/10 rounded-xl px-4 py-3 hover:bg-white/12 transition disabled:opacity-50"
        >
          <FcGoogle className="text-xl" />
          <span className="text-sm text-text-primary">Google</span>
        </button>

        <button
          type="button"
          onClick={handleGitHub}
          disabled={loading}
          className="flex-1 flex items-center justify-center gap-2 bg-white/8 border border-white/10 rounded-xl px-4 py-3 hover:bg-white/12 transition disabled:opacity-50"
        >
          <FaGithub className="text-xl text-white" />
          <span className="text-sm text-text-primary">GitHub</span>
        </button>
      </div>
    </form>
  );
}