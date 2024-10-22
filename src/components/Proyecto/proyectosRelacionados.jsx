import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiBancoProyecto } from '../../services/bancoproyecto.api.js';

export const ProyectosRelacionados = ({ currentSlug }) =>
{
  const [ relatedProjects, setRelatedProjects ] = useState([]);
  const navigate = useNavigate(); // Hook para manejar la navegación

  useEffect(() =>
  {
    async function fetchRelatedProjects()
    {
      try
      {
        const response = await apiBancoProyecto.get(`projects/v1/${currentSlug}/related_projects/`);
        setRelatedProjects(response.data);
      } catch (error)
      {
        console.error('Error fetching related projects:', error);
      }
    }

    fetchRelatedProjects();
  }, [ currentSlug ]);

  // Función para manejar el click en el link
  const handleLinkClick = (projectSlug) =>
  {
    navigate(`/project/${projectSlug}`); // Navegación a la nueva página
    window.scrollTo(0, 0); // Mueve la vista al inicio de la página
  };

  if (relatedProjects.length === 0)
  {
    return null;
  }

  return (

    <div className="container row">
      <h2 className="text-sans-h2 my-4 mt-5">Proyectos relacionados</h2>
      {relatedProjects.map((project) => (
        <div
          key={project.slug}
          className={`col-md-4 my-3 ${relatedProjects.length === 1 ? 'offset-md-1' : ''}`} // Si solo hay un proyecto, centramos la columna
        >
          <div className="row">
            <div className="col">
              <img className="imagen" src={project.portada} alt={project.name} />
            </div>
            <div className="col">
              <span
                onClick={() => handleLinkClick(project.slug)}
                className="text-sans-p-tertiary "
                style={{ cursor: 'pointer' }}
              >
                <u>{project.name}</u>
              </span>
              <p className="text-sans-h5 mt-3">{project.type.name}</p>
              <p className="text-sans-h5">{project.program.name}</p>
            </div>
          </div>
        </div>
      ))
      }
    </div >
  );

};

