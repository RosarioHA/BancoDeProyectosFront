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
  const [document, setDocument] = useState(null);

  // Función para obtener documentos
  const fetchDocuments = async (endpoint = 'documents/v1/') => {
    setLoadingDocuments(true);
    try {
      const response = await apiBancoProyecto.get(endpoint);
      const allDocuments = response.data;

      const documentsByType = {};
      allDocuments.forEach(doc => {
        const documentType = doc.document_type.type;
        if (!documentsByType[documentType]) {
          documentsByType[documentType] = [];
        }
        documentsByType[documentType].push(doc);
      });

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

  // Fetch de documentos con paginación
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
      setDocument(response.data);
      setErrorDocuments(null);
    } catch (error) {
      setErrorDocuments(
        error.response ? error.response.data : error.message
      );
      setDocument(null);
    } finally {
      setLoadingDocuments(false);
    }
  }, []);

  const createDocument = useCallback(async (newDocumentData) => {
    setLoadingDocuments(true);
    try {
      const response = await apiBancoProyecto.post('/documents/v1/', newDocumentData);
      // Opcional: Puedes agregar el nuevo documento a la lista de documentos
      setDocumentsList(prevDocuments => [response.data, ...prevDocuments]);
      setErrorDocuments(null);
      return response.data; // Devuelve el documento creado
    } catch (error) {
      setErrorDocuments(
        error.response ? error.response.data : error.message
      );
      throw error;
    } finally {
      setLoadingDocuments(false);
    }
  }, []);

  // Actualizar documento (PATCH)
  const updateDocument = useCallback(async (id, updatedData) => {
    setLoadingDocuments(true);
    try {
      const response = await apiBancoProyecto.patch(`/documents/v1/${id}/edit-document/`, updatedData);
      setDocument(response.data);
      setErrorDocuments(null);
      return response.data;
    } catch (error) {
      setErrorDocuments(
        error.response ? error.response.data : error.message
      );
      throw error; 
    } finally {
      setLoadingDocuments(false);
    }
  }, []);

  // Eliminar documento (DELETE)
  const deleteDocument = useCallback(async (id) => {
    setLoadingDocuments(true);
    try {
      const response = await apiBancoProyecto.delete(`/documents/v1/${id}/`);
      setDocumentsList(prevDocuments => prevDocuments.filter(doc => doc.id !== id)); // Update the list by removing the deleted document
      setErrorDocuments(null);
      return response.data;  // Returning the response data (optional, based on the response structure)
    } catch (error) {
      setErrorDocuments(
        error.response ? error.response.data : error.message
      );
      throw error;
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
    setPagination(1);
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
    fetchDocumentById,
    updateDocument,
    deleteDocument,
    createDocument
  };
};
