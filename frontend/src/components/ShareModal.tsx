import { useEffect, useState } from 'react';
import API_URL from '../config';
import type { Headers } from '../types';
import Button from './Button';

type ShareModalProps = {
  show: boolean;
  taskId: string | null;
  onClose: () => void;
  onShared: () => void; // callback to refresh lists
};

export default function ShareModal({ show, taskId, onClose, onShared }: ShareModalProps) {
  const [users, setUsers] = useState<Array<{ _id: string; name: string; email: string }>>([]);
  const [query, setQuery] = useState('');
  const [selected, setSelected] = useState<Record<string, boolean>>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!show) return;
    const run = async () => {
      try {
        setError(null);
        const token = (await import('../auth')).getToken();
        const headers: Headers = {};
        if (token) headers['Authorization'] = `Bearer ${token}`;
        const url = new URL(`${API_URL}/api/auth/users`);
        if (query) url.searchParams.set('q', query);
        const res = await fetch(url.toString(), { headers });
        if (!res.ok) throw new Error(`Failed to load users (${res.status})`);
        const data = await res.json();
        setUsers(data);
      } catch (e) {
        const error = e as Error;
        setError(error?.message || 'Failed to load users');
      }
    };
    run();
  }, [show, query]);

  const toggle = (id: string) => {
    setSelected((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const submitShare = async () => {
    if (!taskId) return;
    try {
      setLoading(true);
      setError(null);
      const ids = Object.keys(selected).filter((k) => selected[k]);
      if (ids.length === 0) {
        setError('Please select at least one user');
        setLoading(false);
        return;
      }
      const token = (await import('../auth')).getToken();
      const headers: Headers = { 'Content-Type': 'application/json' };
      if (token) headers['Authorization'] = `Bearer ${token}`;
      const res = await fetch(`${API_URL}/api/tasks/${taskId}/share`, {
        method: 'PUT',
        headers,
        body: JSON.stringify({ sharedWith: ids })
      });
      if (!res.ok) {
        const msg = await res.text();
        throw new Error(msg || `Share failed (${res.status})`);
      }
      onShared();
      onClose();
      setSelected({});
    } catch (e) {
      const error = e as Error;
      setError(error?.message || 'Share failed');
    } finally {
      setLoading(false);
    }
  };

  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg p-4 md:p-6 border border-gray-200 my-4 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-2xl font-semibold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Share Task
          </h3>
          <Button size="sm" variant="ghost" className="text-gray-500 hover:text-gray-700 transition-colors" onClick={onClose} aria-label="Close">✕</Button>
        </div>

        <div className="mb-4">
          <input
            id="share-query"
            name="query"
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search users by name or email"
            className="w-full border border-gray-300 rounded-lg px-4 py-2 bg-white text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
          />
        </div>

        {error && (
          <div className="mb-4 p-3 text-sm text-red-600 bg-red-50 rounded-lg border border-red-200">
            {error}
          </div>
        )}

        <div className="max-h-64 overflow-y-auto border border-gray-200 rounded-lg mb-4">
          {users.length === 0 ? (
            <div className="p-4 text-center text-gray-500">No users found</div>
          ) : (
            users.map((u) => (
              <label key={u._id} className="flex items-center gap-3 p-3 border-b border-gray-200 last:border-b-0 hover:bg-gray-50 transition-colors cursor-pointer">
                <input
                  name={`share_user_${u._id}`}
                  type="checkbox"
                  checked={!!selected[u._id]}
                  onChange={() => toggle(u._id)}
                  className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                />
                <div className="flex-1">
                  <div className="font-medium text-gray-900">{u.name}</div>
                  <div className="text-sm text-gray-600">{u.email}</div>
                </div>
              </label>
            ))
          )}
        </div>

        <div className="flex justify-end gap-3">
          <Button variant="secondary" className="px-6 py-2" onClick={onClose} disabled={loading}>Cancel</Button>
          <Button variant="success" className="px-6 py-2" onClick={submitShare} disabled={loading}>{loading ? 'Sharing...' : 'Share'}</Button>
        </div>
      </div>
    </div>
  );
}
