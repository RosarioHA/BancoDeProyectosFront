import { useState, useEffect } from 'react';
import { apiBancoProyecto } from '../services/bancoproyecto.api.js';

const useApiDocuments = () => {
  const [dataDocuments, setDataDocuments] = useState([]);
  const [documentTypes, setDocumentTypes] = useState([]);
  const [loadingDocuments, setLoadingDocuments] = useState(true);
  const [errorDocuments, setErrorDocuments] = useState(null);

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

  return {
    dataDocuments,
    documentTypes,
    loadingDocuments,
    errorDocuments,
  };
};

export default useApiDocuments;