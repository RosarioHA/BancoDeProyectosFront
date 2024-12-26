import { useState, useEffect } from 'react';
import  apiBancoProyecto  from '../../services/bancoproyecto.api';


export const useUserDetails = (userId) => {
  const [userDetails, setUserDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);


  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await apiBancoProyecto.get(`/users/${userId}/`);
        setUserDetails(response.data);
      } catch (err) {
        console.error(err);
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [userId]);

  return { userDetails, loading, error };
};
