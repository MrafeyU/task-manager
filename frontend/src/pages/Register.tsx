import { useState } from 'react';
import { API_URL } from '../config';
import { setAuth } from '../auth';

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
      onRegister && onRegister();
    } catch (err:any) {
      setError(err.message || 'Register error');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="bg-white p-8 rounded shadow-md w-96">
        <h2 className="text-2xl mb-4">Register</h2>
        {error && <div className="text-red-500 mb-2">{error}</div>}
        <input className="w-full border p-2 mb-2 rounded" placeholder="Name" value={name} onChange={e => setName(e.target.value)} />
        <input className="w-full border p-2 mb-2 rounded" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} />
        <input className="w-full border p-2 mb-2 rounded" placeholder="Password" type="password" value={password} onChange={e => setPassword(e.target.value)} />
        <div className="flex justify-end gap-2">
          <button className="px-4 py-2 rounded border" onClick={() => { setName(''); setEmail(''); setPassword(''); }}>Clear</button>
          <button className="px-4 py-2 bg-green-600 text-white rounded" onClick={handleRegister}>Register</button>
        </div>
      </div>
    </div>
  );
}
