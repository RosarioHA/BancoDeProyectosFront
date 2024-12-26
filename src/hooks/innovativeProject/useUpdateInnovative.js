import { useState } from 'react';
import  apiBancoProyecto  from '../../services/bancoproyecto.api.js';

export const useUpdateInnovative = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const updateInnovative = async (id, updatedData) => {
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const response = await apiBancoProyecto.patch(`innovative_projects/v1/${id}/`, updatedData);
      setSuccess(true);
      return response.data; // Devuelve los datos actualizados para actualizar el estado local
    } catch (err) {
      const backendError = err?.response?.data?.detail || err.message || 'Error al actualizar el proyecto';
      setError(backendError); // Almacena el mensaje del backend si está disponible
      setSuccess(false);
      throw new Error(backendError); // Lanza el error para manejarlo externamente si es necesario
    } finally {
      setLoading(false);
    }
  };

  return { updateInnovative, loading, error, success };
}
