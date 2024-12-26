import { useState, useEffect, useCallback } from 'react';
import apiBancoProyecto  from '../../services/bancoproyecto.api';

export const useUsers = () =>
{
  const [ users, setUsers ] = useState([]);
  const [ loading, setLoading ] = useState(true);
  const [ error, setError ] = useState(null);
  const [ metadata, setMetadata ] = useState({ count: 0, next: null, previous: null });
  const [ pagination, setPagination ] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');  

  const fetchUsers = useCallback(async () =>
  {
    setLoading(true);
    setError(null); // Reseteamos el error al intentar una nueva carga
    try
    {
      const response = await apiBancoProyecto.get(`users/list_admin/?page=${pagination}&search=${searchTerm}`);
      const { data } = response;

      // Actualizamos los usuarios y la metadata solo si hay resultados
      if (data.results)
      {
        setUsers(data.results);
        setMetadata({
          count: data.count,
          next: data.next,
          previous: data.previous,
        });
      }
    } catch (err)
    {
      console.error(err);
      setError(err); // Guardamos el error para manejarlo más tarde
    } finally
    {
      setLoading(false);
    }
  }, [ pagination , searchTerm]);

  useEffect(() =>
  {
    fetchUsers();
  }, [ fetchUsers ]);

  // Función para actualizar la página actual
  const updatePage = (newPage) =>
  {
    if (newPage !== pagination)
    {
      setPagination(newPage); // Solo actualizamos si la nueva página es diferente
    }
  };

  // Función para actualizar la URL, si es necesario
  const updateUrl = (url) =>
  {
    const page = new URL(url).searchParams.get('page'); // Extraemos el número de página de la URL
    if (page)
    {
      setPagination(Number(page)); // Actualizamos la paginación si se encontró un número de página
    }
  };

  return {
    users,
    loading,
    error,
    pagination,
    setPagination,
    updatePage,
    updateUrl,
    metadata,
    fetchUsers,
    setSearchTerm, 
    searchTerm 
  };
};