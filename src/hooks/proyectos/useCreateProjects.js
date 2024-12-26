import { useState } from "react";
import  apiBancoProyecto from "../../services/bancoproyecto.api"; 

export const useCreateProjects = () => {
  const [loadingProject, setLoadingProject] = useState(false);
  const [errorProject, setErrorProject] = useState(null);
  const [dataProject, setDataProject] = useState(null); 
  const [slug, setSlug] = useState(null); 

  const createProject = async (projectData) => {
    setLoadingProject(true);
    setErrorProject(null);

    try {
      const response = await apiBancoProyecto.post("/projects/v1/", projectData);
      
      setDataProject(response.data); 
      setSlug(response.data.slug); 
      setLoadingProject(false);
      console.log('slug',response.data.slug)
      return response.data.slug; 
    } catch (err) {
      setLoadingProject(false);

      if (err.response) {
        setErrorProject(err.response.data);
      } else {
        setErrorProject("Error de conexión, inténtelo nuevamente");
      }
      return null;
    }
  };

  return { dataProject, createProject, loadingProject, errorProject, slug };
}; 
