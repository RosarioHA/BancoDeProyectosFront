import { useState, useEffect, useCallback } from 'react';
import apiBancoProyecto  from '../services/bancoproyecto.api';

export const useApiTagProject = () => {
  const [dataTag, setDataTag] = useState([]);
  const [tagList, setTagList] = useState([]); 
  const [tagLoading, setTagLoading] = useState(false);
  const [tagError, setTagError] = useState(null); 
  const [metadata, setMetadata] = useState({ count: 0, next: null, previous: null }); 
  const [pagination, setPagination] = useState(1); 
  const [searchTerm, setSearchTerm] = useState(''); 

  // Fetch de todos los tags (sin paginación)
  useEffect(() => {
    const fetchAllTags = async () => {
      try {
        setTagLoading(true);
        const response = await apiBancoProyecto.get('tags/v1/list/');
        setDataTag(response.data);
      } catch (error) {
        setTagError(error);
      } finally {
        setTagLoading(false);
      }
    };
    fetchAllTags();
  }, []);

  // Fetch de tags filtrados con paginación
  const fetchPaginatedTags = useCallback(async () => {
    try {
      setTagLoading(true);
      const response = await apiBancoProyecto.get(
        `/tags/v1/list-filtered/?page=${pagination}&search=${searchTerm}`
      );
      const { results, count, next, previous } = response.data;
      setTagList(results);
      setMetadata({ count, next, previous });
    } catch (error) {
      setTagError(error);
    } finally {
      setTagLoading(false);
    }
  }, [pagination, searchTerm]);

  // Actualiza la página de paginación
  const updatePage = (newPage) => {
    if (newPage !== pagination) setPagination(newPage);
  };

  // Actualiza el término de búsqueda
  const updateSearchTerm = (newSearchTerm) => {
    setSearchTerm(newSearchTerm);
    setPagination(1); // Reinicia a la primera página
  };

  // Crear un nuevo tag
  const addTag = async (newTagName) => {
    try {
      setTagLoading(true);
      const response = await apiBancoProyecto.post('tags/v1/', { prioritized_tag: newTagName });
      // Después de agregar el tag, actualizar la lista de tags
      await fetchPaginatedTags(); // Actualiza la lista de tags
      return response.data; // Devuelve el tag creado si es necesario
    } catch (error) {
      setTagError(error);
      throw error; // Propaga el error para manejarlo en el componente
    } finally {
      setTagLoading(false);
    }
  };
  // Eliminar un tag
  const deleteTag = async (tagId) => {
    try {
      setTagLoading(true);
      await apiBancoProyecto.delete(`tags/v1/${tagId}/`);
      // Actualizar la lista después de eliminar
      fetchPaginatedTags();
    } catch (error) {
      setTagError(error);
    } finally {
      setTagLoading(false);
    }
  };

  // Ejecutar fetch cuando cambien `pagination` o `searchTerm`
  useEffect(() => {
    fetchPaginatedTags();
  }, [fetchPaginatedTags]);

  return {
    dataTag,
    tagList,
    tagLoading,
    tagError,
    metadata,
    updatePage,
    updateSearchTerm,
    searchTerm,
    setSearchTerm,
    pagination,
    setPagination,
    addTag,
    deleteTag,
  };
};
