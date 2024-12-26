import { useState, useEffect } from 'react';
import  apiBancoProyecto  from '../services/bancoproyecto.api';

export const UseApiPrograms = () =>
{
  const [ dataPrograms, setDataPrograms ] = useState([]);
  const [ loadingPrograms, setLoadingPorgrams ] = useState(true);
  const [ errorPrograms, setErrorPrograms ] = useState(null);

  useEffect(() =>
  {
    const fetchData = async () =>
    {
      try
      {
        const response = await apiBancoProyecto.get('programs/v1/');
        setDataPrograms(response.data);
        setLoadingPorgrams(false);
      } catch (error)
      {
        setErrorPrograms(error);
        setLoadingPorgrams(false);
      }
    };
    fetchData();
  }, []);
  return { dataPrograms, loadingPrograms, errorPrograms }
}