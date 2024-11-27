import { useState } from 'react';
import { apiBancoProyecto } from '../../services/bancoproyecto.api.js';

export const useGalleryInnovative = (id) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  // Función para eliminar una imagen
  const deleteImage = async (imageId) => {
    if (!id) {
      setError('El identificador de proyecto es requerido');
      return;
    }

    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const response = await apiBancoProyecto.delete(`/innovative_projects/v1/${id}/delete_image/${imageId}/`);
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
    if (!id) {
      setError('El identificador de proyecto es requerido');
      return;
    }

    const formData = new FormData();
    formData.append('image', imageFile);

    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const response = await apiBancoProyecto.post(`/innovative_projects/v1/${id}/add_image/`, formData, {
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
}
