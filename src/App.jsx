import React, { useContext, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthContext } from './context/AuthContext';
import { Sidebar } from './components/Sidebar';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { DashboardPage } from './pages/DashboardPage';
import { AdminProfissionaisPage } from './pages/AdminProfissionaisPage';
import { AdminPacientesPage } from './pages/AdminPacientesPage';
import './styles/App.css';

function App() {
  const { user, isAuthenticated } = useContext(AuthContext);

  return (
    <Router>
      {isAuthenticated ? (
        <div className="app-container">
          <Sidebar />
          <main className="main-content">
            <Routes>
              <Route path="/dashboard" element={<DashboardPage />} />
              
              {/* Rotas Admin */}
              <Route 
                path="/admin/profissionais" 
                element={user?.role === 'admin' ? <AdminProfissionaisPage /> : <Navigate to="/dashboard" />}
              />
              <Route 
                path="/admin/pacientes" 
                element={user?.role === 'admin' ? <AdminPacientesPage /> : <Navigate to="/dashboard" />}
              />

              {/* Rota padrão */}
              <Route path="/" element={<Navigate to="/dashboard" />} />
              <Route path="*" element={<Navigate to="/dashboard" />} />
            </Routes>
          </main>
        </div>
      ) : (
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/" element={<Navigate to="/login" />} />
          <Route path="*" element={<Navigate to="/login" />} />
        </Routes>
      )}
    </Router>
  );
}

export default App;
