import { useState, useEffect } from 'react';
import { apiBancoProyecto } from '../services/bancoproyecto.api.js'; 

const useApiAdminNotificacions = () => {
  const apiEndpoints = [
    'innovative_projects_notifications',
    'recent_actions',
    'unread_count',
    'notifications',
  ];

  const apiState = {};

  // Configurar el estado para cada endpoint
  [...apiEndpoints].forEach(endpoint => {
    apiState[endpoint] = {
      data: null,
      loading: true,
      error: null,
    };
  });

  const [state, setState] = useState(apiState);

  // Función genérica para fetch
  const fetchData = async (endpoint, method = 'get') => {
    setState(prevState => ({ ...prevState, [endpoint]: { ...prevState[endpoint], loading: true }}));

    try {
      const response = await apiBancoProyecto[method](`notifications/v1/${endpoint}/`);
      setState(prevState => ({ 
        ...prevState, 
        [endpoint]: { data: response.data, loading: false, error: null },
      }));
    } catch (error) {
      setState(prevState => ({ 
        ...prevState, 
        [endpoint]: { data: null, loading: false, error: error.response ? error.response.data : error.message },
      }));
    }
  };

  // Función específica para mark_as_read
  const markAsRead = async () => {
    await fetchData('mark_as_read', 'post');
  };

  useEffect(() => {
    apiEndpoints.forEach(endpoint => fetchData(endpoint));
  }, []);

  return {
    ...state,
    markAsRead  // Devolvemos la función para poder utilizarla en los componentes
  };
};

export default useApiAdminNotificacions;