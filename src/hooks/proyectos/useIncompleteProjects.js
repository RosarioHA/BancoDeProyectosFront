import { useState, useEffect } from 'react';
import apiBancoProyecto  from '../../services/bancoproyecto.api';

export const useFetchIncompleteIncompleteProject = (apiUrl) => {
  const [incompleteProject, setIncompleteProject] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchIncompleteIncompleteProject = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await apiBancoProyecto.get(`projects/v1/incomplete_projects/`);
        setIncompleteProject(response.data.results || response.data); // Ajusta según el formato del backend.
      } catch (err) {
        setError(err.response?.data?.detail || 'Error fetching incompleteProject');
      } finally {
        setLoading(false);
      }
    };

    fetchIncompleteIncompleteProject();
  }, [apiUrl]);

  return { incompleteProject, loading, error };
};

