import { useState, useEffect } from 'react';
import apiBancoProyecto  from '../../services/bancoproyecto.api';

export const useIncompleteInnovative = (apiUrl) => {
  const [incompleteInnovative, setIncompleteInnovative] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchIncompleteIncompleteInnovative = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await apiBancoProyecto.get(`innovative_projects/v1/incomplete_projects/`);
        setIncompleteInnovative(response.data.results || response.data); 
      } catch (err) {
        setError(err.response?.data?.detail || 'Error fetching incompleteInnovative');
      } finally {
        setLoading(false);
      }
    };

    fetchIncompleteIncompleteInnovative();
  }, [apiUrl]);

  return { incompleteInnovative, loading, error };
};

