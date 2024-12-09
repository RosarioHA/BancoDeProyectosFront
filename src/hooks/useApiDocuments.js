import { useState, useEffect, useCallback } from 'react';
import { apiBancoProyecto } from '../services/bancoproyecto.api.js';

export const useApiDocuments = () => {
  const [dataDocuments, setDataDocuments] = useState([]);
  const [documentTypes, setDocumentTypes] = useState([]);
  const [documentsList, setDocumentsList] = useState([]);
  const [loadingDocuments, setLoadingDocuments] = useState(true);
  const [errorDocuments, setErrorDocuments] = useState(null);
  const [metadata, setMetadata] = useState({ count: 0, next: null, previous: null });
  const [pagination, setPagination] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [document, setDocument] = useState(null); // Nuevo estado para el documento individual

  const fetchDocuments = async (endpoint = 'documents/v1/') => {
    setLoadingDocuments(true);
    try {
      const response = await apiBancoProyecto.get(endpoint);
      const allDocuments = response.data;

      // Crear un objeto para agrupar los documentos por tipo
      const documentsByType = {};

      allDocuments.forEach(doc => {
        const documentType = doc.document_type.type;

        if (!documentsByType[documentType]) {
          documentsByType[documentType] = [];
        }

        documentsByType[documentType].push(doc);
      });

      // Convertir el objeto en un array de objetos con el tipo como clave
      const documentTypeArray = Object.keys(documentsByType).map(type => ({
        type,
        documents: documentsByType[type],
      }));

      setDataDocuments(allDocuments);
      setDocumentTypes(documentTypeArray);
      setErrorDocuments(null);
    } catch (error) {
      setErrorDocuments(
        error.response ? error.response.data : error.message
      );
    } finally {
      setLoadingDocuments(false);
    }
  };

  useEffect(() => {
    fetchDocuments();
  }, []);

  // Fetch de documentos filtrados con paginación
  const fetchPaginatedDocuments = useCallback(async () => {
    try {
      setLoadingDocuments(true);
      const response = await apiBancoProyecto.get(
        `/documents/v1/admin-list/?page=${pagination}&search=${searchTerm}`
      );
      const { results, count, next, previous } = response.data;
      setDocumentsList(results);
      setMetadata({ count, next, previous });
    } catch (error) {
      setErrorDocuments(error);
    } finally {
      setLoadingDocuments(false);
    }
  }, [pagination, searchTerm]);

  // Fetch de un documento específico por su ID
  const fetchDocumentById = useCallback(async (id) => {
    setLoadingDocuments(true);
    try {
      const response = await apiBancoProyecto.get(`/documents/v1/${id}/get-document/`);
      setDocument(response.data); // Guardamos el documento obtenido en el estado
      setErrorDocuments(null);
    } catch (error) {
      setErrorDocuments(
        error.response ? error.response.data : error.message
      );
      setDocument(null); // Si hay error, aseguramos que el estado de 'document' sea null
    } finally {
      setLoadingDocuments(false);
    }
  }, []);

  // Actualiza la página de paginación
  const updatePage = (newPage) => {
    if (newPage !== pagination) setPagination(newPage);
  };

  // Actualiza el término de búsqueda
  const updateSearchTerm = (newSearchTerm) => {
    setSearchTerm(newSearchTerm);
    setPagination(1); // Reinicia a la primera página
  };

  useEffect(() => {
    fetchPaginatedDocuments();
  }, [fetchPaginatedDocuments]);

  return {
    dataDocuments,
    documentTypes,
    loadingDocuments,
    errorDocuments,
    documentsList,
    updatePage,
    updateSearchTerm,
    metadata,
    pagination,
    setPagination,
    searchTerm,
    setSearchTerm,
    document,
    fetchDocumentById 
  };
};
