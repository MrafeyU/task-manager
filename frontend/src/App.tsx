import { useState } from "react";
import Sidebar from "./components/Sidebar";
import Topbar from "./components/Topbar";
import Dashboard from "./pages/Dashboard";
import Tasks from "./pages/Tasks";
import Completed from "./pages/Completed";
import Login from './pages/Login';
import Register from './pages/Register';
import { getToken } from './auth';

export default function App() {
  const [showModal, setShowModal] = useState(false);
  const [currentPage, setCurrentPage] = useState("Dashboard");
  const [searchTerm, setSearchTerm] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(!!getToken());
  const [authMode, setAuthMode] = useState<'login'|'register'>('login');

  const renderPage = () => {
    switch (currentPage) {
      case "Tasks":
        return <Tasks searchTerm={searchTerm} />;
      case "Completed":
        return <Completed searchTerm={searchTerm} />;
      default:
        return (
          <Dashboard
            showModal={showModal}
            setShowModal={setShowModal}
            searchTerm={searchTerm}
          />
        );
    }
  };

  if (!isAuthenticated) {
    return authMode === 'login' ? (
      <div>
        <Login onLogin={() => setIsAuthenticated(true)} />
        <div className="fixed bottom-4 left-4">
          <button className="underline" onClick={() => setAuthMode('register')}>Create an account</button>
        </div>
      </div>
    ) : (
      <div>
        <Register onRegister={() => setIsAuthenticated(true)} />
        <div className="fixed bottom-4 left-4">
          <button className="underline" onClick={() => setAuthMode('login')}>Have an account? Login</button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col md:flex-row bg-gray-50 min-h-screen">
      <Sidebar currentPage={currentPage} setCurrentPage={setCurrentPage} />

      <div className="flex-1 flex flex-col min-w-0">
        <Topbar setShowModal={setShowModal} onSearch={setSearchTerm} />
        <div className="flex-1 overflow-auto">
          {renderPage()}
        </div>
      </div>
    </div>
  );
}
