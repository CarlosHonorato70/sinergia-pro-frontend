import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import '../styles/AdminProfissionais.css';

export function AdminProfissionaisPage() {
  const { user } = useContext(AuthContext);
  const [professionals, setProfessionals] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    name: '',
    specialization: 'Psicólogo',
    crm_or_crp: ''
  });

  useEffect(() => {
    if (user?.role !== 'admin') {
      window.location.href = '/dashboard';
    }
    loadProfessionals();
  }, [user]);

  const loadProfessionals = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('access_token');
      const response = await axios.get(
        'https://sinergia-pro-backend.onrender.com/api/admin/profissionais',
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      setProfessionals(response.data);
    } catch (error) {
      console.error('Erro ao carregar profissionais:', error);
      alert('Erro ao carregar profissionais');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleCreateProfessional = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const token = localStorage.getItem('access_token');
      const response = await axios.post(
        'https://sinergia-pro-backend.onrender.com/api/admin/profissionais',
        formData,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      
      alert(`✅ Profissional criado!\n\nEmail: ${response.data.email}\nSenha Temporária: ${response.data.temporary_password}\n\n⚠️ O profissional deve trocar a senha no primeiro login`);
      
      setFormData({
        email: '',
        name: '',
        specialization: 'Psicólogo',
        crm_or_crp: ''
      });
      setShowForm(false);
      loadProfessionals();
    } catch (error) {
      const errorMsg = error.response?.data?.detail || 'Erro ao criar profissional';
      alert('❌ Erro: ' + errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteProfessional = async (id, name) => {
    if (window.confirm(`Tem certeza que deseja deletar ${name}?`)) {
      try {
        setLoading(true);
        const token = localStorage.getItem('access_token');
        await axios.delete(
          `https://sinergia-pro-backend.onrender.com/api/admin/profissionais/${id}`,
          {
            headers: { Authorization: `Bearer ${token}` }
          }
        );
        alert('✅ Profissional deletado com sucesso');
        loadProfessionals();
      } catch (error) {
        alert('❌ Erro ao deletar profissional');
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div className="admin-profissionais-container">
      <div className="admin-header">
        <h1>🏥 Gerenciar Profissionais</h1>
        <button 
          className="btn-primary"
          onClick={() => setShowForm(!showForm)}
          disabled={loading}
        >
          {showForm ? '✖ Cancelar' : '➕ Adicionar Profissional'}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleCreateProfessional} className="form-container">
          <h2>Novo Profissional</h2>
          
          <div className="form-group">
            <label>Email *</label>
            <input
              type="email"
              name="email"
              placeholder="email@exemplo.com"
              value={formData.email}
              onChange={handleInputChange}
              required
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label>Nome Completo *</label>
            <input
              type="text"
              name="name"
              placeholder="João Silva"
              value={formData.name}
              onChange={handleInputChange}
              required
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label>Especialização *</label>
            <select
              name="specialization"
              value={formData.specialization}
              onChange={handleInputChange}
              disabled={loading}
            >
              <option>Psicólogo</option>
              <option>Médico</option>
              <option>Psiquiatra</option>
              <option>Assistente Social</option>
            </select>
          </div>

          <div className="form-group">
            <label>CRM/CRP *</label>
            <input
              type="text"
              name="crm_or_crp"
              placeholder="12345/SP"
              value={formData.crm_or_crp}
              onChange={handleInputChange}
              required
              disabled={loading}
            />
          </div>

          <button 
            type="submit" 
            className="btn-success"
            disabled={loading}
          >
            {loading ? '⏳ Criando...' : '✅ Criar Profissional'}
          </button>
        </form>
      )}

      <div className="professionals-section">
        <h2>Profissionais Cadastrados ({professionals.length})</h2>
        
        {loading && <p className="loading">⏳ Carregando...</p>}

        {professionals.length === 0 && !loading ? (
          <p className="empty">Nenhum profissional cadastrado ainda</p>
        ) : (
          <table className="professionals-table">
            <thead>
              <tr>
                <th>Nome</th>
                <th>Email</th>
                <th>Especialização</th>
                <th>CRM/CRP</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {professionals.map(prof => (
                <tr key={prof.id}>
                  <td>{prof.name}</td>
                  <td>{prof.email}</td>
                  <td>{prof.specialization || '-'}</td>
                  <td>{prof.crm_or_crp || '-'}</td>
                  <td>
                    <button 
                      className="btn-danger"
                      onClick={() => handleDeleteProfessional(prof.id, prof.name)}
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
