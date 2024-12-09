import { useState } from 'react';
import { apiBancoProyecto } from '../../services/bancoproyecto.api.js';

export const useGalleryProject = (slug) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  // Función para eliminar una imagen
  const deleteImage = async (imageId) => {
    if (!slug) {
      setError('El identificador de proyecto (slug) es requerido');
      return;
    }

    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const response = await apiBancoProyecto.delete(`projects/v1/${slug}/delete-image/${imageId}/`);
      setSuccess(true);
      return response.data;
    } catch (err) {
      setError(err.response?.data?.detail || 'Error eliminando la imagen');
    } finally {
      setLoading(false);
    }
  };

  // Función para agregar una nueva imagen
  const addImage = async (imageFile) => {
    if (!slug) {
      setError('El identificador de proyecto (slug) es requerido');
      return;
    }

    const formData = new FormData();
    formData.append('image', imageFile);

    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const response = await apiBancoProyecto.post(`projects/v1/${slug}/add-image/`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      setSuccess(true);
      console.log(response.data)
      return response.data; 
    } catch (err) {
      setError(err.response?.data?.detail || 'Error agregando la imagen');
    } finally {
      setLoading(false);
    }
  };

  return { deleteImage, addImage, loading, error, success };
};
