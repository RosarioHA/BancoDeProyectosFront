import { useState, useEffect } from 'react';
import apiBancoProyecto  from '../services/bancoproyecto.api';

export const useApiTypeProject = () => {
  const [ dataType, setDataType ] = useState([]);
  const [ typeLoading, setTypeLoading ] = useState(true);
  const [ typeError, setTypeError ] = useState(null);
  const [documentError, setDocumentError] = useState(null);
  const [documentSuccess, setDocumentSuccess] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await apiBancoProyecto.get('types/v1/');
        setDataType(response.data);
        setTypeLoading(false);
      } catch (error) {
        setTypeError(error);
        setTypeLoading(false);
      }
    };
    fetchData();
  },[]);

  const addDocument = async (documentId, selectedTypes) => {
    try {
      // Crear un array de promesas para cada tipo seleccionado
      const promises = selectedTypes.map((typeId) => {
        return apiBancoProyecto.post(`types/v1/${typeId}/add_document/`, {
          document_id: documentId,
        });
      });
  
      // Espera a que todas las promesas se resuelvan
      const responses = await Promise.all(promises);
  
      setDocumentSuccess(true);
      setDocumentError(null);
      return responses.map((response) => response.data); // Devuelve las respuestas de cada solicitud
    } catch (error) {
      setDocumentError(error);
      setDocumentSuccess(false);
      throw error;
    }
  };

  return { dataType, typeLoading, typeError, addDocument, documentError, documentSuccess };
};