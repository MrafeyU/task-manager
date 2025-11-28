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
      /* Settings page removed */
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
    <div className="flex">
      <Sidebar currentPage={currentPage} setCurrentPage={setCurrentPage} />

      <div className="flex-1 flex flex-col">
        <Topbar setShowModal={setShowModal} onSearch={setSearchTerm} />
        {renderPage()}
      </div>
    </div>
  );
}
