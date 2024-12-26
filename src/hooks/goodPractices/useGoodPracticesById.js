import { useState, useEffect } from 'react';
import  apiBancoProyecto from '../../services/bancoproyecto.api';

export const useGoodPracticesDetails = (goodPracticesId) => {
  const [goodPractices, setGoodPractices] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchGoodPracticesDetails = async () => {
      try {
        setLoading(true);
        const response = await apiBancoProyecto.get(`good_practices/v1/${goodPracticesId}/`);
        setGoodPractices(response.data);  // Asignar los datos del proyecto al estado
      } catch (err) {
        setError('Error al cargar los datos del proyecto');  // Manejo de errores
      } finally {
        setLoading(false);  // Finalizar la carga
      }
    };

    if (goodPracticesId) {
      fetchGoodPracticesDetails();
    }
  }, [goodPracticesId]);  // Ejecutar cuando cambia el ID del proyecto

  return { goodPractices, loading, error};
};

