import { useState, useEffect, useCallback } from 'react';
import { apiBancoProyecto } from '../services/bancoproyecto.api.js';


const useApiInnovativeProjects = () =>
{
  const [ dataInnovativeProjects, setDataInnovativeProjects ] = useState([]);
  const [ loadingInnovativeProjects, setLoadingInnovativeProjects ] = useState(true);
  const [ errorInnovativeProjects, setErrorInnovativeProjects ] = useState(null);




  const fetchInnovativeProjectsList = async () => {
    setLoadingInnovativeProjects(true);
    try {
      const response = await apiBancoProyecto.get('innovative_projects/v1/');
      setDataInnovativeProjects(response.data);
    } catch (error) {
      setErrorInnovativeProjects(
        error.response ? error.response.data : error.message
      );
    } finally {
      setLoadingInnovativeProjects(false);
    }
  };


  const InnovativeAdminProjectsList = async () => {
    setLoadingInnovativeProjects(true);
    try {
      const response = await apiBancoProyecto.get('innovative_projects/v1/list_admin/');
      setDataInnovativeProjects(response.data);
      setErrorInnovativeProjects(null);
    } catch (error) {
      setErrorInnovativeProjects(
        error.response && error.response.data ? error.response.data : error.message
      );
    } finally {
      setLoadingInnovativeProjects(false);
    }
  };


  const createInnovativeProject = async ({ title, program }) =>
  {
    try
    {
      const response = await apiBancoProyecto.post('innovative_projects/v1/', {
        title,
        program
      });
      console.log("Enviando:", { title, program });

      if (response.data)
      {
        setDataInnovativeProjects(prevProjects => [ ...prevProjects, response.data ]);
      }

      return { success: true, id: response.data.id };
    } catch (error)
    {
      console.error("Error al crear proyecto innovador:", error);
      return { success: false, error: error.message || "Error desconocido" };
    }
  };


  const getInnovativeProjectById = useCallback(async (id) =>
  {
    if (!id)
    {
      console.error("ID inválido:", id);
      return null;
    }

    try
    {
      const response = await apiBancoProyecto.get(`innovative_projects/v1/${id}/`);
      return response.data;
    } catch (error)
    {
      console.error("Error al obtener el proyecto por ID:", error);
      return null;
    }
  }, []);


  const updateInnovativeProject = async (id, data) =>
  {
    try
    {
      let config = {};
      if (data instanceof FormData)
      {
        config.headers = { 'Content-Type': 'multipart/form-data' };
      }

      console.log("Data being sent:", data);

      // Asumiendo que tienes un método API para actualizar el proyecto
      const response = await apiBancoProyecto.patch(`innovative_projects/v1/${id}/`, data, config);

      if (response.status === 200 && response.data)
      {
        return { success: true, data: response.data };
      } else
      {
        throw new Error("Error en la respuesta del servidor");
      }

    } catch (error)
    {
      console.log("Error updating project:", error);
      return { success: false, error: error.message || "Error desconocido" };
    }
  }


  const deleteInnovativeProject = async (id) =>
  {
    if (!id)
    {
      console.error("ID inválido:", id);
      return;
    }

    try
    {
      await apiBancoProyecto.delete(`innovative_projects/v1/${id}/`);
      console.log("Proyecto eliminado con éxito");

      setDataInnovativeProjects(prevProjects => prevProjects.filter(project => project.id !== id));

    } catch (error)
    {
      console.log("Error al eliminar el proyecto:", error);
    }
  };



  const updateInnovativeProjectCover = async (projectId, coverFile, onUploadProgress) =>
  {
    try
    {
      const formData = new FormData();

      if (coverFile)
      {
        formData.append('portada', coverFile);
      } else
      {
        formData.append('portada', '');
      }

      const response = await apiBancoProyecto.patch(`innovative_projects/v1/${projectId}/`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        onUploadProgress: progressEvent =>
        {
          const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          // Verificar que onUploadProgress sea una función antes de invocarlo
          if (typeof onUploadProgress === 'function')
          {
            onUploadProgress(percentCompleted);
          }
        }
      });

      if (response.status === 200 && response.data)
      {
        setDataInnovativeProjects(prevProjects =>
          prevProjects.map(project => project.id === projectId ? response.data : project)
        );
        return { success: true, data: response.data };
      } else
      {
        throw new Error("Error en la respuesta del servidor");
      }
    } catch (error)
    {
      console.error("Error al actualizar la imagen de portada:", error);
      return { success: false, error: error.message || "Error desconocido" };
    }
  };


  const createInnovativeGalleryImage = async (projectId, formData) =>
  {
    try
    {
      if (!projectId || !formData.get('image'))
      {
        throw new Error("Parámetros inválidos");
      }
      const response = await apiBancoProyecto.post(`innovative_projects/v1/${projectId}/upload_image/`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (response.status === 201 && response.data)
      {
        return response.data;
      } else
      {
        throw new Error("Error en la respuesta del servidor");
      }
    } catch (error)
    {
      console.error("Error al crear la imagen:", error);
      throw error;
    }
  };


  const deleteInnovativeGalleryImage = async (projectId, imageId) =>
  {
    const response = await apiBancoProyecto.delete(`innovative_projects/v1/${projectId}/delete_image/${imageId}`);
    return response.data;
  };


  //CRUD Fuentes 


  const createWebSource = async (projectId, webSourceData) => {
    try {
      const response = await apiBancoProyecto.post(`innovative_projects/v1/${projectId}/add_web_source/`, webSourceData);
      return response.data;
    } catch (error) {
      console.error("Error al crear la fuente web:", error);
      throw error;
    }
  };

  const getWebSources = async (projectId) => {
    try {
      const response = await apiBancoProyecto.get(`innovative_projects/v1/${projectId}/get_web_sources/`);
      return response.data;
    } catch (error) {
      console.error("Error al obtener las fuentes web:", error);
      throw error;
    }
  };

  const updateWebSource = async (projectId, webSourceId, webSourceData) => {
    try {
      const response = await apiBancoProyecto.patch(`innovative_projects/v1/${projectId}/update_web_source/${webSourceId}/`, webSourceData);
      return response.data;
    } catch (error) {
      console.error("Error al actualizar la fuente web:", error);
      throw error;
    }
  };

  const deleteWebSource = async (projectId, webSourceId) => {
    try {
      await apiBancoProyecto.delete(`innovative_projects/v1/${projectId}/delete_web_source/${webSourceId}/`);
      console.log("Fuente web eliminada con éxito");
    } catch (error) {
      console.error("Error al eliminar la fuente web:", error);
      throw error;
    }
  };

  useEffect(() =>
  {
    fetchInnovativeProjectsList();
  }, []);

  return {
    dataInnovativeProjects,
    loadingInnovativeProjects,
    errorInnovativeProjects,
    createInnovativeProject,
    getInnovativeProjectById,
    updateInnovativeProject,
    InnovativeAdminProjectsList,
    deleteInnovativeProject,
    createInnovativeGalleryImage,
    deleteInnovativeGalleryImage,
    updateInnovativeProjectCover,
    createWebSource,
    getWebSources,
    updateWebSource,
    deleteWebSource,

  };
};

export default useApiInnovativeProjects;