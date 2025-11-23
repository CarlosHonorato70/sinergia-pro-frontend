import React, { useState, useEffect, useContext } from 'react';
import { useParams } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import '../styles/Teleatendimento.css';

export function TeleatendimentoPage() {
  const { appointmentId } = useParams();
  const { user } = useContext(AuthContext);
  const [meetLink, setMeetLink] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [appointment, setAppointment] = useState(null);

  useEffect(() => {
    fetchAppointmentAndMeetLink();
  }, [appointmentId]);

  const fetchAppointmentAndMeetLink = async () => {
    try {
      const token = localStorage.getItem('access_token');
      
      // Buscar detalhes do agendamento
      const appointmentResponse = await fetch(
        `${process.env.REACT_APP_API_URL}/api/appointments/${appointmentId}`,
        { headers: { 'Authorization': `Bearer ${token}` } }
      );
      
      if (!appointmentResponse.ok) throw new Error('Falha ao buscar agendamento');
      const appointmentData = await appointmentResponse.json();
      setAppointment(appointmentData);

      // Se já tem link do Google Meet, usar
      if (appointmentData.google_meet_link) {
        setMeetLink(appointmentData.google_meet_link);
        setLoading(false);
        return;
      }

      // Senão, criar um novo
      const createResponse = await fetch(
        `${process.env.REACT_APP_API_URL}/api/google-meet/create`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            appointment_id: appointmentId,
            title: `Teleatendimento - ${appointmentData.patient_name || 'Paciente'}`
          })
        }
      );

      if (!createResponse.ok) throw new Error('Falha ao criar Google Meet');
      const meetData = await createResponse.json();
      setMeetLink(meetData.meet_link);
      
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="teleatendimento-container"><p>Carregando...</p></div>;
  }

  if (error) {
    return <div className="teleatendimento-container"><p className="error">Erro: {error}</p></div>;
  }

  return (
    <div className="teleatendimento-container">
      <div className="teleatendimento-header">
        <h1>📹 Teleatendimento</h1>
        {appointment && (
          <div className="appointment-info">
            <p><strong>Data:</strong> {new Date(appointment.date).toLocaleString('pt-BR')}</p>
            <p><strong>Status:</strong> {appointment.status === 'scheduled' ? '🔵 Agendado' : '✅ Concluído'}</p>
          </div>
        )}
      </div>

      {meetLink ? (
        <div className="meet-section">
          <button 
            className="join-meet-btn"
            onClick={() => window.open(meetLink, '_blank')}
          >
            🎥 Entrar na Videochamada
          </button>
          
          <div className="meet-info">
            <p>Clique no botão acima para entrar na videochamada do Google Meet</p>
            <p className="small">Link: {meetLink}</p>
          </div>
        </div>
      ) : (
        <div className="no-meet">
          <p>Google Meet não disponível</p>
          <button onClick={fetchAppointmentAndMeetLink}>Tentar Novamente</button>
        </div>
      )}

      <div className="teleatendimento-footer">
        <p>💡 Dica: Verifique sua câmera e microfone antes de entrar</p>
      </div>
    </div>
  );
}
