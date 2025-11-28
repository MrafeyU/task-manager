
interface TopbarProps {
  setShowModal: (value: boolean) => void;
  onSearch?: (q: string) => void;
}

export default function Topbar({ setShowModal, onSearch }: TopbarProps) {
  const user = (() => { try { return JSON.parse(localStorage.getItem('tm_user') || 'null'); } catch { return null; } })();
  const handleLogout = () => { localStorage.removeItem('tm_token'); localStorage.removeItem('tm_user'); window.location.reload(); };
  return (
    <div className="h-16 w-full bg-white border-b shadow-sm flex items-center justify-between px-6">
      <input
        type="text"
        placeholder="Search tasks..."
        className="border rounded-lg px-3 py-2 w-64"
        onChange={(e) => onSearch && onSearch(e.target.value)}
      />

      <div className="flex items-center gap-4">
        <button
          className="bg-yellow-500/80 rounded-xl w-24 h-8 transition hover:scale-105"
          onClick={() => {
            console.log("Topbar: open modal");
            setShowModal(true);
          }}
        >
          + New task
        </button>
        <p className="font-medium">Hi, {user?.name || 'User'} 👋</p>
        <div className="h-10 w-10 rounded-full bg-gray-300"></div>
        <button className="px-3 py-1 text-sm border rounded" onClick={handleLogout}>Logout</button>
      </div>
    </div>
  );
}
