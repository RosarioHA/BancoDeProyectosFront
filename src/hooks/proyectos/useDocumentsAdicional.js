import { useState } from "react";
import { apiBancoProyecto } from "../../services/bancoproyecto.api";

export const useDocumentsAdicional = (slug) => {
  const [ loadingDocs, setLoadingDocs ] = useState(true);
  const [ errorDocs, setErrorDocs ] = useState(null);

  const addDocument = async (name, file) => {
    setLoadingDocs(true);
    setErrorDocs(null);

    const formData = new FormData();
    formData.append('name', name); 
    formData.append('file', file); 

    try {
      const response = await apiBancoProyecto.post(`projects/v1/${slug}/add_file/`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      setLoadingDocs(false);
      return response.data;
    } catch (err) {
      setLoadingDocs(false);
      setErrorDocs(err.response?.data?.detail || 'Error agregando el documento');
    }
  };

  const deleteDocument = async (documentId) => {
    setLoadingDocs(true);
    setErrorDocs(null);

    try {
      const response = await apiBancoProyecto.delete(`projects/v1/${slug}/delete_file/`, {
        data: { file_id: documentId }, // Enviar el ID del archivo en el cuerpo de la solicitud
      });
      setLoadingDocs(false);
      return response.data;
    } catch (err) {
      setLoadingDocs(false);
      setErrorDocs(err.response?.data?.detail || 'Error eliminando el documento');
    }
  };

  return{
    addDocument,
    deleteDocument,
    loadingDocs,
    errorDocs
  }

}
