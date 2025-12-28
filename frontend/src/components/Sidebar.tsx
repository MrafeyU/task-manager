import { LayoutDashboard, ClipboardList, CheckCircle2 } from 'lucide-react';
import Button from './Button';

type SidebarProps = {
  currentPage?: string;
  setCurrentPage?: (p: string) => void;
};

export default function Sidebar({ currentPage, setCurrentPage }: SidebarProps) {
  const menuItems = [
    { id: 'Dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { id: 'Tasks', icon: ClipboardList, label: 'Tasks' },
    { id: 'Completed', icon: CheckCircle2, label: 'Completed' }
  ];

  return (
    <div className="h-auto md:h-screen w-full md:w-64 bg-gradient-to-b from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 border-b md:border-r border-gray-200 dark:border-gray-700 shadow-lg p-4 md:p-6 flex flex-row md:flex-col overflow-x-auto md:overflow-x-visible">
      <div className="mb-6 md:mb-10">
        <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          Task Manager
        </h1>
        <p className="text-xs md:text-sm text-gray-500 dark:text-gray-400 mt-1">Stay organized</p>
      </div>

      <nav className="flex flex-row md:flex-col gap-2 flex-1">
        {menuItems.map((item) => {
          const active = currentPage === item.id;
          return (
            <Button key={item.id} onClick={() => setCurrentPage && setCurrentPage(item.id)} variant={active ? 'primary' : 'ghost'} className={`w-full text-left px-3 md:px-4 py-2 md:py-3 rounded-lg transition-all whitespace-nowrap ${active ? 'shadow-lg transform scale-105 ring-1 ring-blue-300' : 'hover:bg-gray-100 dark:hover:bg-gray-700'}`}>
              <item.icon className={`mr-2 md:mr-3 w-4 h-4 inline ${active ? 'text-white' : 'text-gray-600 dark:text-gray-300'}`} />
              <span className="font-medium text-sm md:text-base">{item.label}</span>
            </Button>
          );
        })}
      </nav>
    </div>
  );
}
