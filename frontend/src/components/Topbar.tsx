import NotificationBell from './NotificationBell';

interface TopbarProps {
  setShowModal: (value: boolean) => void;
  onSearch?: (q: string) => void;
}

export default function Topbar({ setShowModal, onSearch }: TopbarProps) {
  const user = (() => { try { return JSON.parse(localStorage.getItem('tm_user') || 'null'); } catch { return null; } })();
  const handleLogout = () => { localStorage.removeItem('tm_token'); localStorage.removeItem('tm_user'); window.location.reload(); };

  return (
    <div className="h-16 w-full bg-white border-b border-gray-200 shadow-sm flex items-center justify-between px-3 md:px-6 gap-2">
      <input
        type="text"
        placeholder="Search tasks..."
        className="border border-gray-300 rounded-lg px-3 py-2 w-32 md:w-64 bg-white text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm md:text-base"
        onChange={(e) => onSearch && onSearch(e.target.value)}
      />

      <div className="flex items-center gap-2 md:gap-4">
        <button
          className="bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl px-2 md:px-4 py-2 transition-all hover:scale-105 hover:shadow-lg font-medium text-xs md:text-sm whitespace-nowrap"
          onClick={() => {
            console.log("Topbar: open modal");
            setShowModal(true);
          }}
        >
          <span className="hidden md:inline">+ New task</span>
          <span className="md:hidden">+</span>
        </button>
        <NotificationBell />

        <p className="font-medium text-gray-900 hidden md:block">Hi, {user?.name || 'User'} 👋</p>
        <div className="h-8 w-8 md:h-10 md:w-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white font-semibold text-xs md:text-sm">
          {user?.name?.charAt(0)?.toUpperCase() || 'U'}
        </div>
        <button 
          className="px-2 md:px-4 py-2 text-xs md:text-sm border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors text-gray-700 whitespace-nowrap" 
          onClick={handleLogout}
        >
          <span className="hidden md:inline">Logout</span>
          <span className="md:hidden">Out</span>
        </button>
      </div>
    </div>
  );
}
