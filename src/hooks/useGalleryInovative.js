import { useState, useEffect } from 'react';
import useApiInnovativeProjects from './useApiInnovativeProjects';

const useGalleryInnovative = (projectId) =>
{
  const [ gallery, setGallery ] = useState([]);
  const { getInnovativeProjectById, createInnovativeGalleryImage, deleteInnovativeGalleryImage } = useApiInnovativeProjects();
  const [ loading, setLoading ] = useState(false);
  const [ uploadPercentage, setUploadPercentage ] = useState(0);
  const [ uploadSuccess, setUploadSuccess ] = useState(false);


  useEffect(() =>
  {
    const fetchGallery = async () =>
    {
      try
      {
        const project = await getInnovativeProjectById(projectId);
        if (project && project.innovative_gallery_images)
        {
          setGallery(project.innovative_gallery_images);
        }
      } catch (error)
      {
        console.log('Error al obtener las imágenes', error);
      }
    };
    fetchGallery();
  }, [ getInnovativeProjectById, projectId ]);

  const refreshGallery = async () =>
  {
    try
    {
      const project = await getInnovativeProjectById(projectId);
      if (project && project.innovative_gallery_images)
      {
        setGallery(project.innovative_gallery_images);
      }
    } catch (error)
    {
      console.error('Error al refrescar la galería', error);
    }
  };

  const addImageToGallery = async (newImage) =>
  {
    setLoading(true);
    setUploadPercentage(0);
    setUploadSuccess(false);
    try
    {
      if (newImage)
      {
        const config = {
          onUploadProgress: progressEvent =>
          {
            const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
            setUploadPercentage(percentCompleted);
          }
        };
        const newImageResponse = await createInnovativeGalleryImage(projectId, newImage, config);
        if (newImageResponse && newImageResponse.id)
        {
          await refreshGallery();
          setUploadSuccess(true);
          setLoading(true);
          return true;
        }
      }
      setLoading(false);
      return false;
    } catch (error)
    {
      setLoading(false);
      console.error("Error details:", error.response ? error.response.data : error.message);
      return false;
    }
  };



  const deleteImageInGallery = async (imageId) =>
  {
    try
    {
      await deleteInnovativeGalleryImage(projectId, imageId);
      const updatedGallery = gallery.filter(img => img.id !== imageId);
      setGallery(updatedGallery);
      return true;
    } catch (error)
    {
      console.error("Error al eliminar imagen:", error.response ? error.response.data : error.message);
      return false;
    }
  };


  return {
    gallery,
    setGallery,
    addImageToGallery,
    loading,
    uploadPercentage,
    uploadSuccess,
    deleteImageInGallery,
    refreshGallery
  }
}

export default useGalleryInnovative;