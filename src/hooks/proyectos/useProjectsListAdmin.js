import { useState, useEffect, useCallback } from "react";
import { apiBancoProyecto } from "../../services/bancoproyecto.api";

export const useProjectsListAdmin = () => {
  const [projectsAdmin, setProjectsAdmin] = useState([]);
  const [loading, setLoading] = useState(true);
  const [metadata, setMetadata] = useState({ count: 0, next: null, previous: null });
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');  // Agregamos el estado de búsqueda

  const fetchProjectsAdmin = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      // Agregamos el término de búsqueda como parámetro en la URL
      const response = await apiBancoProyecto.get(`projects/v1/list_admin/?page=${pagination}&search=${searchTerm}`);
      const { data } = response;

      // Actualizamos los usuarios y la metadata solo si hay resultados
      if (data.results) {
        setProjectsAdmin(data.results);
        setMetadata({
          count: data.count,
          next: data.next,
          previous: data.previous,
        });
      }
    } catch (err) {
      console.error(err);
      setError(err); // Guardamos el error para manejarlo más tarde
    } finally {
      setLoading(false);
    }
  }, [pagination, searchTerm]);  // Agregamos searchTerm como dependencia

  useEffect(() => {
    fetchProjectsAdmin();
  }, [fetchProjectsAdmin]);

  const updatePage = (newPage) => {
    if (newPage !== pagination) {
      setPagination(newPage); // Solo actualizamos si la nueva página es diferente
    }
  };

  // Función para actualizar la URL, si es necesario
  const updateUrl = (url) => {
    const page = new URL(url).searchParams.get('page'); // Extraemos el número de página de la URL
    if (page) {
      setPagination(Number(page)); // Actualizamos la paginación si se encontró un número de página
    }
  };

  return {
    projectsAdmin,
    pagination,
    setPagination,
    updatePage,
    updateUrl,
    loading,
    error,
    metadata, 
    fetchProjectsAdmin,
    setSearchTerm, 
    searchTerm 
  };
};
