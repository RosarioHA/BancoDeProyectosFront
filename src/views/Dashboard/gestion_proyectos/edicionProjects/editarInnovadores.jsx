import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import useApiInnovativeProjects from "../../../../hooks/innovativeProject/useApiInnovativeProjects";
import Carrusel from "../../../../components/Commons/carrusel";

const EditarInnovador = () =>
{
  const { id } = useParams();
  const { getInnovativeProjectById } = useApiInnovativeProjects();
  const [ projectData, setProjectData ] = useState(null);
  const [ loading, setLoading ] = useState(true); // Estado de carga
  const [ error, setError ] = useState(null); // Estado para manejar errores
  const [ isPublished, setIsPublished ] = useState(projectData?.public);
  // Efecto para obtener los datos del proyecto por ID
  useEffect(() =>
  {
    const fetchProject = async () =>
    {
      setLoading(true);
      try
      {
        const data = await getInnovativeProjectById(id); // Obtener el proyecto por ID
        if (data)
        {
          setProjectData(data); // Guardar los datos en el estado
        } else
        {
          setError("No se encontró el proyecto.");
        }
      } catch (error)
      {
        setError("Error al obtener el proyecto.");
      } finally
      {
        setLoading(false); // Finalizar estado de carga
      }
    };

    if (id)
    {
      fetchProject();
    }
  }, [ id, getInnovativeProjectById ]);


  const handleStatusChange = (status) =>
  {
    setIsPublished(status);
    // Lógica para guardar el cambio en la base de datos
    console.log("Estado seleccionado:", status ? "Publicado" : "Privado");

  };
  // Maneja el botón de volver atrás
  const history = useNavigate();
  const handleBackButtonClick = () =>
  {
    history(-1);
  };

  if (loading)
  {
    return <div className="d-flex align-items-center flex-column my-5">
      <div className="text-center text-sans-h5-blue">Cargando proyecto innovador</div>
      <span className="placeholder col-4 bg-primary">
      </span>
    </div>
  }
  if (error)
  {
    return <div>Error: {error}</div>; // Mostrar un mensaje de error si ocurre
  }

  return (
    <div className="container view-container ms-5">
      <h1 className="text-sans-h2 mb-3 mt-2">Proyectos Innovadores: Ver solicitud</h1>
      <button className="btn-secundario-s d-flex mb-4" onClick={handleBackButtonClick}>
        <i className="material-symbols-rounded me-2">arrow_back_ios</i>
        <p className="mb-0 text-decoration-underline">Volver atrás</p>
      </button>

      {/* Mensaje */}
      <div className="container col-10 m-5">
        <div className="tertiary-container">
          <div className="row">
            <h2 className="text-sans-h2 m-3">Información de publicación</h2>
          </div>
          <div className="container mx-2 my-2">
            <div className="row row-cols-2">
              <div className="col ">Solicitante:</div>
              <div className="col ">Publicado por:</div>
              <div className="col ">Fecha de ingreso de solicitud: </div>
              <div className="col ">Fecha de publicación: </div>
            </div>
            <div className="row my-3">
              <div className="col-4">
                <div className="">Cambiar estado de publicación</div>
                <div className="d-flex my-2">
                  <button
                    className={`btn-secundario-s d-flex me-3 px-5 ${isPublished ? 'btn-principal-s' : ''}`}
                    onClick={() => handleStatusChange(true)}
                  >
                    <u>Publicado</u>
                  </button>
                  <button
                    className={`btn-secundario-s d-flex ms-2 px-5 ${!isPublished ? 'btn-principal-s' : ''}`}
                    onClick={() => handleStatusChange(false)}
                  >
                    <u>Privado</u>
                  </button>
                </div>
              </div>
            </div>
            <div className="row my-3">
              <div className="col-12">
                <div className="">Acciones</div>
                <div className="d-flex justify-content-between my-2">
                  <button className="btn-secundario-s d-flex px-3 ">
                    <u>Editar proyecto</u>
                    <i className="material-symbols-rounded ms-2">edit</i>
                  </button>
                  <button className="btn-logout d-flex  px-3 me-4">
                    <u>Eliminar proyecto</u>
                    <i className="material-symbols-rounded ms-2">delete_forever</i>
                  </button>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Descripcion del proyecto */}
      <div className="container col-10 view-container">
        <h2 className="text-sans-h2 mt-4 mb-4">Subir Proyecto: Proyectos Innovadores</h2>

        <button className="btn-secundario-s d-flex mb-4" onClick={handleBackButtonClick}>
          <i className="material-symbols-rounded me-2">arrow_back_ios</i>
          <p className="mb-0 text-decoration-underline">Volver atrás</p>
        </button>

        <div className="container mb-4">
        
          <div>
            <h4 className="text-sans-h3 text-center text-md-start mt-5">
              {projectData.title}
            </h4>

            <div className="row">
              <div className="desc-container">
                <div className="carrusel-container col-12 col-lg-7">
                  <Carrusel
                    imgPortada={projectData.portada}
                    imgGeneral={projectData.innovative_gallery_images}
                    context="proyectosInnovadores"
                  />
                </div>
                <p className="text-sans-p ">{projectData.description}</p>
              </div>

              <div className="col">
                <div className="d-flex flex-column">
                  {projectData.web_sources.map((source, index) => (
                    <a key={source.id} href={source.url} target="_blank" rel="noopener noreferrer">
                      Visitar fuente {index + 1}
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

    </div>
  )
}


export default EditarInnovador; 