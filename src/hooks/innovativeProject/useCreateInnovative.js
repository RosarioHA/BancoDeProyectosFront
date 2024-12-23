import { useState } from "react";
import { apiBancoProyecto } from "../../services/bancoproyecto.api"; 

export const useCreateInnovative = () => {
  const [loadingProject, setLoadingProject] = useState(false);
  const [errorProject, setErrorProject] = useState(null);
  const [dataInnovative, setDataInnovative] = useState(null); 
  const [id, setId] = useState(null); 

  const createInnovative= async (projectData) => {
    setLoadingProject(true);
    setErrorProject(null);

    try {
      const response = await apiBancoProyecto.post("/innovative_projects/v1/", projectData);
      
      setDataInnovative(response.data); 
      setId(response.data.id); 
      setLoadingProject(false);
      console.log('id',response.data.id)
      return response.data.id; 
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

  return { dataInnovative, createInnovative, loadingProject, errorProject, id };
}
