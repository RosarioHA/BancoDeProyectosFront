import { useState } from 'react';
import  apiBancoProyecto from "../../services/bancoproyecto.api";

export const useCreateGoodPractice = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const createGoodPractice = async (data) => {
    setLoading(true);
    setError(null);
    setSuccess(false);
  
    try {
      console.log('hook data:', data);
      const response = await apiBancoProyecto.post(`good_practices/v1/`, data);
      setSuccess(true);
      return response.data;
    } catch (err) {
      setError(err.response?.data || 'Error al crear la buena práctica');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { createGoodPractice, loading, error, success };
};
