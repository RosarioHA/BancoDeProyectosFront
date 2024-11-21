import { useState } from 'react';
import { apiBancoProyecto } from '../../services/bancoproyecto.api.js';

export const useApiUpdateProject = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const updateProject = async (slug, updatedData) => {
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const response = await apiBancoProyecto.patch(`projects/v1/${slug}/`, updatedData);
      setSuccess(true);
      return response.data; // Devuelve los datos actualizados para actualizar el estado local
    } catch (error) {
      setError(error.message || 'Error al actualizar el proyecto');
      setSuccess(false);
    } finally {
      setLoading(false);
    }
  };

  return { updateProject, loading, error, success };
};