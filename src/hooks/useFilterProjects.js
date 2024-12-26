import { useState, useEffect, useCallback } from 'react';
import axios from 'axios'; 
import apiBancoProyecto  from '../services/bancoproyecto.api.js'; 

const useFilterOptions = () => {
  const [filterOptions, setFilterOptions] = useState(null);
  const [years, setYears] = useState([]);
  const [programs, setPrograms] = useState([]);
  const [types, setTypes] = useState([]);
  const [regiones, setRegiones] = useState([]);
  const [comunas, setComunas] = useState([]); 
  const [selectedComuna, setSelectedComuna] = useState(null); 
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const getFilterOptions = useCallback(async (params = {}) => {
    setLoading(true);
    setError(null);

    const source = axios.CancelToken.source();

    try {
      if (selectedComuna) {
        params.comuna__in = selectedComuna; 
      }

      const response = await apiBancoProyecto.get('/projects/v1/filter_options/', { 
        params,
        cancelToken: source.token
      });
      
      const data = response.data;
      setFilterOptions(data);
      setYears(data.years);
      setPrograms(data.programs);
      setTypes(data.types);
      setRegiones(data.regiones);

      // Obtener todas las comunas de todas las regiones
      const allComunas = data.regiones.flatMap(region => region.comunas);
      setComunas(allComunas);

    } catch (err) {
      if (!axios.isCancel(err)) {
        console.error('Error al obtener opciones de filtro:', err);
        setError(err);
      }
    } finally {
      setLoading(false);
    }

    return () => {
      source.cancel();
    };

  }, [selectedComuna]);

  useEffect(() => {
    getFilterOptions();
  }, [getFilterOptions]);

  return { filterOptions, years, programs, types, regiones, comunas, getFilterOptions, loading, error, setSelectedComuna };  
};

export default useFilterOptions;
