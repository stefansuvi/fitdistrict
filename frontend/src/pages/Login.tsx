import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

export function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      const res = await axios.post('https://fitdistrict.onrender.com/api/admins/login', {
        username,
        password
      });

      if (res.data.success) {
        localStorage.setItem('isAuthenticated', 'true');
        localStorage.setItem('token', res.data.token);
        console.log('✅ Login uspešan:', res.data);
        navigate('/dashboard');
      } else {
        console.warn('⚠️ Login neuspešan:', res.data.message);
        setError(res.data.message);
      }
    } catch (err: any) {
      // Detaljan log greške
      console.error('❌ Greška pri loginu:', err);

      if (err.response) {
        console.error('📩 Odgovor servera:', err.response.data);
        console.error('📡 Status kod:', err.response.status);
        console.error('🔗 Endpoint:', err.config?.url);

        // Prikaz poruke u UI direktno sa backend-a
        setError(err.response.data?.message || 'Greška pri login-u');
      } else if (err.request) {
        console.error('🚫 Nema odgovora od servera. Poslat zahtev:', err.request);
        setError('Nema odgovora od servera');
      } else {
        console.error('⚙️ Problem u frontend kodu:', err.message);
        setError('Greška pri login-u');
      }
    }
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center p-4">
      <div className="bg-gray-800 rounded-2xl shadow-2xl p-8 w-full max-w-md border border-gray-700">
        <div className="flex flex-col items-center mb-8">
          <img src="/logo.png" alt="Fit District Logo" className="w-120 h-120 mb-4 object-contain" />
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label htmlFor="username" className="block text-sm font-medium text-gray-300 mb-2">
              Korisničko ime
            </label>
            <input
              id="username"
              type="text"
              value={username}
              onChange={e => setUsername(e.target.value)}
              className="w-full px-4 py-3 border border-gray-700 bg-gray-900 text-white rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition"
              placeholder="Unesi korisničko ime"
              required
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-2">
              Lozinka
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              className="w-full px-4 py-3 border border-gray-700 bg-gray-900 text-white rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition"
              placeholder="••••••••"
              required
            />
          </div>

          {error && <p className="text-red-500 text-sm mt-1">{error}</p>}

          <button
            type="submit"
            className="w-full bg-indigo-600 text-white py-3 rounded-lg font-semibold hover:bg-indigo-700 transition duration-200"
          >
            Log in
          </button>
        </form>
      </div>
    </div>
  );
}

