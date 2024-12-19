import { useNavigate } from "react-router-dom";
import { useFetchIncompleteIncompleteProject } from "../../../hooks/proyectos/useIncompleteProjects";
import { useIncompleteInnovative } from "../../../hooks/innovativeProject/useIncompleteInnovative";
import { useFetchProjectHistory } from "../../../hooks/usuarios/useHistorial";
const HomeDashboard = () =>
{
  const { incompleteProject } = useFetchIncompleteIncompleteProject();
  const { incompleteInnovative } = useIncompleteInnovative();
  const { history } = useFetchProjectHistory()
  const navigate = useNavigate();

  const handleDetailsProject = (project) =>
  {
    navigate(`/dashboard/editar_proyecto/${project.slug}/`, { state: { project } });
  };

  const handleDetailsInnovative = (project) =>
  {
    navigate(`/dashboard/edicion_innovador/${project.id}`, { state: { project } });
  };

  const handleAdministrarProject = () =>
  {
    navigate('/dashboard/administrar_proyectos/');
  };

  const handleAdministrarInnovative = () =>
  {
    navigate('/dashboard/administrar_proyectos_innovadores/');
  };

  return (
    <div className="container-home">
      <div className="d-flex ">
        <div className="container col-6">
          <div className="row">
            <div className="container-history my-4">
              {incompleteProject.length >= 1 ? (
                <>
                  <div className="title-history text-sans-h4">
                    <i className="material-symbols-outlined">pending_actions</i>
                    <span>Publicaciones pendientes en Banco de Proyectos</span>
                  </div>
                  {incompleteProject.slice(0, 2).map((project) => (
                    <div className="body-history border-bottom" key={project.id}>
                      <div className="col-12">
                        <div className="row">
                          <div className="col-7 mx-3"><strong>{project.name}</strong></div>
                          <div className="col-1 mx-2">{project.created}</div>
                        </div>
                        <div className="row my-3">
                          <div className="col-7 mx-3">creado por</div>
                          <div className="col-1 mx-2">{project.author_name}</div>
                        </div>
                        <div className="row my-3">
                          <div className="col-7 mx-3">Este proyecto se encuentra:</div>
                          <div className="col-1 mx-2"><span className="incompleto px-2 py-1">Pendiente</span></div>
                        </div>
                        <div className="d-flex justify-content-end mx-3 my-4">
                          <button className="btn-pill-white my-2" onClick={() => handleDetailsProject(project)}>
                            <u>Ver proyecto</u>
                            <i className="material-symbols-outlined">chevron_right</i>
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </>
              ) : (
                <div className="title-history text-sans-h4">
                  <i className="material-symbols-outlined">
                  check_circle</i>
                  <span>Estás al día con Banco de Proyectos</span>
                </div>
              )}
            </div>
            {incompleteProject.length > 2 && (
              <div className="d-flex justify-content-end my-2">
                <button className="btn-principal-s my-2" onClick={handleAdministrarProject}>
                  <u>Ver más</u>
                </button>
              </div>
            )}

            {incompleteInnovative.length >=1 ? (
              <div className="container-history my-4">
                <>
                  <div className="title-history text-sans-h4">
                    <i className="material-symbols-outlined">pending_actions</i>
                    Publicaciones pendientes en Proyectos Innovadores
                  </div>
                  {incompleteInnovative.slice(0, 2).map((project) => (
                    <div className="body-history border-bottom" key={project.id}>
                      <div className="col-12">
                        <div className="row">
                          <div className="col-7 mx-3"><strong>{project.title}</strong></div>
                          <div className="col-1 mx-2">{project.created}</div>
                        </div>
                        <div className="row my-3">
                          <div className="col-7 mx-3"><strong>Creado por</strong></div>
                          <div className="col-1 mx-2">{project.author_name}</div>
                        </div>
                        <div className="row my-3">
                          <div className="col-7 mx-3">Este proyecto se encuentra:</div>
                          <div className="col-1 mx-2"><span className="incompleto p-1">Pendiente</span></div>
                        </div>
                        <div className="d-flex justify-content-end mx-3 my-1">
                          <button className="btn-pill-white my-1" onClick={() => handleDetailsInnovative(project)}>
                            <u>Ver proyecto</u>
                            <i className="material-symbols-outlined">chevron_right</i>
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </>
              </div>
            ) : (
              <div className="container-history my-4">
                <div className="title-history text-sans-h4">
                  <i className="material-symbols-outlined">
                  check_circle</i>
                  <span>Estás al día con Proyectos Innovadores</span>
                </div>
              </div>
            )}
            {incompleteInnovative.length > 2 && (
              <div className="d-flex justify-content-end my-2">
                <button className="btn-principal-s my-2" onClick={handleAdministrarInnovative}>
                  <u>Ver más</u>
                </button>
              </div>
            )}
          </div>
        </div>
        <div className="col-4">
          <div className="container-history me-3 my-4">
            <div className="title-history text-sans-h4">
              <i className="material-symbols-outlined">history</i>
              <span>Modificaciones recientes</span>
            </div>
            <div>
              <div className="body-history p-0">
                {history.length >= 1 ? (
                  <>
                    {history.map((history, index) => (
                      <div className="mx-2 px-3 py-2 border-bottom" key={index}>
                        <div><strong>{history.origen}</strong></div>
                        <div className="text-sans-p-tertiary">{history.name || history.title}</div>
                        <div className="text-sans-p-lightgrey">Fecha modificacion :{history.modified}</div>
                      </div>
                    ))}
                  </>
                ) : (<div className="text-sans-p-tertiary mx-3 my-2">No hay modificaciones recientes</div>)}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomeDashboard;
