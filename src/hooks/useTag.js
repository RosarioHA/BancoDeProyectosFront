import { useState, useEffect } from 'react';
import { apiBancoProyecto } from '../services/bancoproyecto.api';

export const useApiTagProject = () => {
  const [ dataTag, setDataTag ] = useState([]);
  const [ tagLoading, setTagLoading ] = useState(true);
  const [ tagError, setTagError ] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await apiBancoProyecto.get('tags/v1/');
        setDataTag(response.data);
        setTagLoading(false);
      } catch (error) {
        setTagError(error);
        setTagLoading(false);
      }
    };
    fetchData();
  },[]);
  return { dataTag , tagLoading , tagError };
};