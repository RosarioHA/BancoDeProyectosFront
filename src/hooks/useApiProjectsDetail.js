import { useState, useEffect } from 'react';
import { apiBancoProyecto } from '../services/bancoproyecto.api.js';

const useApiProjectsDetail = (slug) => {
  const [dataProject, setDataProject] = useState([]);
  const [loadingProject, setLoadingProject] = useState(true);
  const [errorProject, setErrorProject] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await apiBancoProyecto.get(`projects/v1/${slug}/`);
        setDataProject(response.data);
        setLoadingProject(false);
      } catch (error) {
        setErrorProject(error.message);
        setLoadingProject(false);
      }
    };
    fetchData();
  }, [slug]);

  return { dataProject, loadingProject, errorProject };
}

export default useApiProjectsDetail;