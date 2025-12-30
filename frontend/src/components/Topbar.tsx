import NotificationBell from './NotificationBell';
import Button from './Button';
import { Sun, Moon } from 'lucide-react';

interface TopbarProps {
  setShowModal: (value: boolean) => void;
  onSearch?: (q: string) => void;
  forceTheme?: 'light'|'dark';
  setForceTheme?: (value: 'light'|'dark') => void;
}

export default function Topbar({ setShowModal, onSearch, forceTheme, setForceTheme }: TopbarProps) {
  const user = (() => { try { return JSON.parse(localStorage.getItem('tm_user') || 'null'); } catch { return null; } })();
  const handleLogout = () => { localStorage.removeItem('tm_token'); localStorage.removeItem('tm_user'); window.location.reload(); };

  return (
    <div className="h-16 w-full bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 shadow-sm flex items-center justify-between px-3 md:px-6 gap-2">
      <input
        id="search"
        name="search"
        type="text"
        placeholder="Search tasks..."
        className="border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 w-32 md:w-64 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm md:text-base"
        onChange={(e) => onSearch && onSearch(e.target.value)}
      />

      <div className="flex items-center gap-2 md:gap-4">
        <Button
          variant="primary"
          className="rounded-xl px-2 md:px-4 py-2 transition-all hover:scale-105 hover:shadow-lg font-medium text-xs md:text-sm whitespace-nowrap"
          onClick={() => {
            console.log("Topbar: open modal");
            setShowModal(true);
          }}
        >
          <span className="hidden md:inline">+ New task</span>
          <span className="md:hidden">+</span>
        </Button>
        <NotificationBell />

        <div className="flex items-center gap-2">
        

          {typeof setForceTheme === 'function' && (
            <div className="flex items-center gap-2">
              <Button
                title={forceTheme === 'dark' ? 'Switch to light' : 'Switch to dark'}
                variant="secondary"
                size="sm"
                className="p-2"
                onClick={() => setForceTheme(forceTheme === 'dark' ? 'light' : 'dark')}
              >
                {forceTheme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" /> }
              </Button>
            </div>
          )}
        </div>

        <p className="font-medium text-gray-900 dark:text-white hidden md:block">Hi, {user?.name || 'User'} 👋</p>
        <div className="h-8 w-8 md:h-10 md:w-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white font-semibold text-xs md:text-sm">
          {user?.name?.charAt(0)?.toUpperCase() || 'U'}
        </div>
        <Button 
          variant="secondary"
          className="px-2 md:px-4 py-2 text-xs md:text-sm whitespace-nowrap"
          onClick={handleLogout}
        >
          <span className="hidden md:inline">Logout</span>
          <span className="md:hidden">Out</span>
        </Button>
      </div>
    </div>
  );
}
