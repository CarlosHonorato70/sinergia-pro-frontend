import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import '../styles/AdminPacientes.css';

export function AdminPacientesPage() {
  const { user } = useContext(AuthContext);
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user?.role !== 'admin') {
      window.location.href = '/dashboard';
    }
    loadPatients();
  }, [user]);

  const loadPatients = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('access_token');
      const response = await axios.get(
        'https://sinergia-pro-backend.onrender.com/api/admin/pacientes',
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      setPatients(response.data);
    } catch (error) {
      console.error('Erro ao carregar pacientes:', error);
      alert('Erro ao carregar pacientes');
    } finally {
      setLoading(false);
    }
  };

  const handleDeletePatient = async (id, name) => {
    if (window.confirm(`Tem certeza que deseja deletar ${name}?`)) {
      try {
        setLoading(true);
        const token = localStorage.getItem('access_token');
        await axios.delete(
          `https://sinergia-pro-backend.onrender.com/api/admin/pacientes/${id}`,
          {
            headers: { Authorization: `Bearer ${token}` }
          }
        );
        alert('✅ Paciente deletado com sucesso');
        loadPatients();
      } catch (error) {
        alert('❌ Erro ao deletar paciente');
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div className="admin-pacientes-container">
      <div className="admin-header">
        <h1>👥 Gerenciar Pacientes</h1>
      </div>

      <div className="patients-section">
        <h2>Pacientes Cadastrados ({patients.length})</h2>
        
        {loading && <p className="loading">⏳ Carregando...</p>}

        {patients.length === 0 && !loading ? (
          <p className="empty">Nenhum paciente cadastrado ainda</p>
        ) : (
          <table className="patients-table">
            <thead>
              <tr>
                <th>Nome</th>
                <th>Email</th>
                <th>Data de Cadastro</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {patients.map(patient => (
                <tr key={patient.id}>
                  <td>{patient.name}</td>
                  <td>{patient.email}</td>
                  <td>{new Date(patient.created_at).toLocaleDateString('pt-BR')}</td>
                  <td>
                    <button 
                      className="btn-danger"
                      onClick={() => handleDeletePatient(patient.id, patient.name)}
                      disabled={loading}
                    >
                      🗑️ Deletar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
