import { useState, useEffect } from 'react';
import apiBancoProyecto  from '../services/bancoproyecto.api';

export const useApiYears = () => {
  const [dataYears, setDataYears] = useState([]);
  const [yearsLoading, setYearsLoading] = useState(true);
  const [yearsError, setYearsError] = useState(null);

  // Fetch initial data on mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await apiBancoProyecto.get('years/v1/');
        setDataYears(response.data);
      } catch (error) {
        setYearsError(error.response?.data || "An error occurred while fetching years");
      } finally {
        setYearsLoading(false);
      }
    };
    fetchData();
  }, []);

  // Function to add a new year
  const addYear = async (number) => {
    try {
      const response = await apiBancoProyecto.post('years/v1/', { number });
      console.log("Año agregado:", response.data); // Agrega este log para verificar la respuesta
      return response.data; // Asegúrate de que esto retorne el objeto { id, number }
    } catch (error) {
      throw new Error(error.response?.data || "An error occurred while adding the year");
    }
  };

  return { 
    dataYears, 
    yearsLoading, 
    yearsError,
    addYear
  };
};