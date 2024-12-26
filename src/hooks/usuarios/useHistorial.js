import { useState, useEffect } from 'react';
import apiBancoProyecto from '../../services/bancoproyecto.api';

export const useFetchProjectHistory = () => {
  const [loading, setLoading] = useState(true); // Para controlar el estado de carga
  const [error, setError] = useState(null); // Para manejar errores
  const [history, setHistory] = useState([]); // Para almacenar los datos obtenidos

  useEffect(() => {
    // Función para obtener los datos desde el endpoint
    const fetchHistory = async () => {
      try {
        const response = await apiBancoProyecto.get('users/all_history/'); // Reemplaza con la URL correcta de tu API
        setHistory(response.data); // Almacena los datos en el estado
        setLoading(false); // Cambia el estado de carga
      } catch (err) {
        setError(err.message); // Manejo de errores
        setLoading(false);
      }
    };

    fetchHistory(); // Llamar a la función fetchHistory
  }, []); // Solo se ejecuta una vez cuando el componente se monta

  return { history, loading, error };
};

