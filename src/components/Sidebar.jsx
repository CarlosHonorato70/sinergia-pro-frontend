import React, { useContext } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import '../styles/Sidebar.css';

export function Sidebar() {
  const { user, logout } = useContext(AuthContext);
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <h2>🏥 Sinergia Pro</h2>
      </div>

      <nav className="sidebar-nav">
        {/* Menu comum a todos */}
        <Link 
          to="/dashboard" 
          className={`nav-link ${isActive('/dashboard') ? 'active' : ''}`}
        >
          📊 Dashboard
        </Link>

        {/* Menu do Paciente */}
        {user?.role === 'patient' && (
          <>
            <div className="nav-section">
              <h3>Paciente</h3>
              <Link 
                to="/meus-atendimentos" 
                className={`nav-link ${isActive('/meus-atendimentos') ? 'active' : ''}`}
              >
                📅 Meus Atendimentos
              </Link>
              <Link 
                to="/prontuario" 
                className={`nav-link ${isActive('/prontuario') ? 'active' : ''}`}
              >
                📋 Prontuário
              </Link>
              <Link 
                to="/telemedicina" 
                className={`nav-link ${isActive('/telemedicina') ? 'active' : ''}`}
              >
                📹 Telemedicina
              </Link>
            </div>
          </>
        )}

        {/* Menu do Terapeuta */}
        {user?.role === 'therapist' && (
          <>
            <div className="nav-section">
              <h3>Terapeuta</h3>
              <Link 
                to="/meus-pacientes" 
                className={`nav-link ${isActive('/meus-pacientes') ? 'active' : ''}`}
              >
                👥 Meus Pacientes
              </Link>
              <Link 
                to="/agenda" 
                className={`nav-link ${isActive('/agenda') ? 'active' : ''}`}
              >
                📅 Agenda
              </Link>
              <Link 
                to="/teleatendimento" 
                className={`nav-link ${isActive('/teleatendimento') ? 'active' : ''}`}
              >
                📹 Teleatendimento
              </Link>
            </div>
          </>
        )}

        {/* Menu do Admin */}
        {user?.role === 'admin' && (
          <>
            <div className="nav-section">
              <h3>Administração</h3>
              <Link 
                to="/admin/profissionais" 
                className={`nav-link ${isActive('/admin/profissionais') ? 'active' : ''}`}
              >
                🏥 Gerenciar Profissionais
              </Link>
              <Link 
                to="/admin/pacientes" 
                className={`nav-link ${isActive('/admin/pacientes') ? 'active' : ''}`}
              >
                👥 Gerenciar Pacientes
              </Link>
            </div>
          </>
        )}
      </nav>

      <div className="sidebar-footer">
        <div className="user-info">
          <p className="user-name">{user?.name}</p>
          <p className="user-role">
            {user?.role === 'admin' && '🔐 Administrador'}
            {user?.role === 'therapist' && '👨‍⚕️ Terapeuta'}
            {user?.role === 'patient' && '👤 Paciente'}
          </p>
        </div>
        <button className="logout-btn" onClick={logout}>
          🚪 Sair
        </button>
      </div>
    </aside>
  );
}
