import { useState } from 'react';
import { API_URL } from '../config';
import { setAuth } from '../auth';
import Button from '../components/Button';

type Props = { onRegister?: () => void };

export default function Register({ onRegister }: Props) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleRegister = async () => {
    try {
      const res = await fetch(`${API_URL}/api/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password }),
      });
      const data = await res.json();
      if (!res.ok) return setError(data.error || 'Register failed');
      setAuth(data.token, data.user);
      onRegister?.();
    } catch (err) {
      const error = err as Error;
      setError(error.message || 'Register error');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 p-4">
      <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-2xl w-full max-w-md border border-gray-200 dark:border-gray-700">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold mb-2 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Create Account
          </h2>
          <p className="text-gray-600 dark:text-gray-300">Join us to get started</p>
        </div>
        {error && (
          <div className="mb-4 p-3 text-sm text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/30 rounded-lg border border-red-200 dark:border-red-800">
            {error}
          </div>
        )}
        <div className="space-y-4">
          <input
            id="register-name"
            name="name"
            autoComplete="name"
            className="w-full border border-gray-300 dark:border-gray-600 rounded-lg p-3 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
            placeholder="Name"
            value={name}
            onChange={e => setName(e.target.value)}
          />
          <input
            id="register-email"
            name="email"
            autoComplete="email"
            className="w-full border border-gray-300 dark:border-gray-600 rounded-lg p-3 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
            placeholder="Email"
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
          />
          <input
            id="register-password"
            name="password"
            autoComplete="new-password"
            className="w-full border border-gray-300 dark:border-gray-600 rounded-lg p-3 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
            placeholder="Password"
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
          />
        </div>
        <div className="flex justify-end gap-3 mt-6">
          <Button variant="secondary" className="px-6 py-2" onClick={() => { setName(''); setEmail(''); setPassword(''); setError(''); }}>Clear</Button>
          <Button variant="primary" className="px-6 py-2" onClick={handleRegister}>Register</Button>
        </div>
      </div>
    </div>
  );
}
