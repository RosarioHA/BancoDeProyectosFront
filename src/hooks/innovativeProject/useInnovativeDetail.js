import { useState, useEffect, useCallback } from 'react';
import { apiBancoProyecto } from '../../services/bancoproyecto.api.js';

export const useInnovativeDetailAdmin = (id) => {
  const [dataInnovativeAdmin, setDataInnovativeAdmin] = useState([]);
  const [loadingProject, setLoadingProject] = useState(true);
  const [errorProject, setErrorProject] = useState(null);

  const fetchInnovativeAdminData = useCallback(async () => {
    setLoadingProject(true);
    try {
      const response = await apiBancoProyecto.get(`/innovative_projects/v1/${id}/`);
      setDataInnovativeAdmin(response.data);
      return response.data; 
    } catch (error) {
      setErrorProject(error.message);
    } finally {
      setLoadingProject(false);
    }
  }, [id]); 

  useEffect(() => {
    if (id) {
      fetchInnovativeAdminData(); 
    }
  }, [id, fetchInnovativeAdminData]); 

  return { dataInnovativeAdmin, loadingProject, errorProject, fetchInnovativeAdminData };
};
