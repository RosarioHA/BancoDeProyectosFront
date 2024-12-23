import { useState, useEffect, useCallback } from "react";
import { apiBancoProyecto } from "../../services/bancoproyecto.api";

export const useListAdminGoodPractices = () =>
{
  const [ goodPracticesAdmin, setGoodPracticesAdmin ] = useState([]);
  const [ loading, setLoading ] = useState(true);
  const [ metadata, setMetadata ] = useState({ count: 0, next: null, previous: null });
  const [ error, setError ] = useState(null);
  const [ pagination, setPagination ] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');  

  const fetchGoodPracticesAdmin = useCallback(async () =>
  {
    setLoading(true);
    setError(null);
    try
    {
      const response = await apiBancoProyecto.get(`good_practices/v1/list_admin/?page=${pagination}&search=${searchTerm}`);  // Enviar la petición con el token
      const { data } = response;

      // Actualizamos los usuarios y la metadata solo si hay resultados
      if (data.results) {
        setGoodPracticesAdmin(data.results);
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
    fetchGoodPracticesAdmin();
  }, [ fetchGoodPracticesAdmin ]);


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
    goodPracticesAdmin,
    pagination,
    setPagination,
    updatePage,
    updateUrl,
    loading,
    error,
    metadata, 
    fetchGoodPracticesAdmin,
    setSearchTerm, 
    searchTerm 
  };
};
