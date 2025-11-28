type SidebarProps = {
  currentPage?: string;
  setCurrentPage?: (p: string) => void;
};

export default function Sidebar({ currentPage, setCurrentPage }: SidebarProps) {
  return (
    <div className="h-screen w-64 bg-white border-r shadow-sm p-6 flex flex-col">
      <h1 className="text-2xl font-bold mb-10">Task Manager</h1>

      <nav className="flex flex-col gap-4 text-gray-700">
        <button
          className={`text-left hover:text-black cursor-pointer ${currentPage === 'Dashboard' ? 'font-semibold' : ''}`}
          onClick={() => setCurrentPage && setCurrentPage('Dashboard')}
        >
          Dashboard
        </button>
        <button
          className={`text-left hover:text-black cursor-pointer ${currentPage === 'Tasks' ? 'font-semibold' : ''}`}
          onClick={() => setCurrentPage && setCurrentPage('Tasks')}
        >
          Tasks
        </button>
        <button
          className={`text-left hover:text-black cursor-pointer ${currentPage === 'Completed' ? 'font-semibold' : ''}`}
          onClick={() => setCurrentPage && setCurrentPage('Completed')}
        >
          Completed
        </button>
        {/* Settings removed per request */}
      </nav>

      <div className="mt-auto">
        <button className="text-red-500 hover:text-red-600">Logout</button>
      </div>
    </div>
  );
}
