import { useState, useEffect } from 'react';
import { apiBancoProyecto } from '../../services/bancoproyecto.api.js';

export const useApiProjectsDetailAdmin = (slug) =>
{
  const [ dataProjectAdmin, setDataProjectAdmin ] = useState([]);
  const [ loadingProject, setLoadingProject ] = useState(true);
  const [ errorProject, setErrorProject ] = useState(null);

  useEffect(() =>
  {
    const fetchData = async () =>
    {
      try
      {
        const response = await apiBancoProyecto.get(`projects/v1/${slug}/admin_detail/`);
        setDataProjectAdmin(response.data);
        setLoadingProject(false);
      } catch (error)
      {
        setErrorProject(error.message);
        setLoadingProject(false);
      }
    };
    fetchData();
  }, [ slug ]);

  return { dataProjectAdmin, loadingProject, errorProject };
}

