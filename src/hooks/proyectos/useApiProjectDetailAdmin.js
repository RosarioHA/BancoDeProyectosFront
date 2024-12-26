import { useState, useEffect, useCallback } from 'react';
import  apiBancoProyecto  from '../../services/bancoproyecto.api.js';

export const useApiProjectsDetailAdmin = (slug) => {
  const [dataProjectAdmin, setDataProjectAdmin] = useState([]);
  const [loadingProject, setLoadingProject] = useState(true);
  const [errorProject, setErrorProject] = useState(null);

  const fetchProjectAdminData = useCallback(async () => {
    setLoadingProject(true);
    try {
      const response = await apiBancoProyecto.get(`projects/v1/${slug}/admin_detail/`);
      setDataProjectAdmin(response.data);
      return response.data; 
    } catch (error) {
      setErrorProject(error.message);
    } finally {
      setLoadingProject(false);
    }
  }, [slug]); 

  useEffect(() => {
    if (slug) {
      fetchProjectAdminData(); 
    }
  }, [slug, fetchProjectAdminData]); 

  return { dataProjectAdmin, loadingProject, errorProject, fetchProjectAdminData };
};
