import { useState, useEffect } from 'react';
import { apiBancoProyecto } from '../services/bancoproyecto.api';

export const useDocumentTypes = () => {
  const [documentTypes, setDocumentTypes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);


  useEffect(() => {
    // Función para obtener los tipos de documentos
    const fetchDocumentTypes = async () => {
      setLoading(true);
      try {
        // Realizar la solicitud GET para obtener los tipos de documentos
        const response = await apiBancoProyecto.get('document-types/v1/');
        setDocumentTypes(response.data);  // Guardar los tipos de documentos en el estado
      } catch (err) {
        setError('Error al cargar los tipos de documentos.');  // Manejo de errores
      } finally {
        setLoading(false);  // Cambiar estado de carga una vez que se haya completado la solicitud
      }
    };

    fetchDocumentTypes();
  }, []); 

  return { documentTypes, loading, error };
};
