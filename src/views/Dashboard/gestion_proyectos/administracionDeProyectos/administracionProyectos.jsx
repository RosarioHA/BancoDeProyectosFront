import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../../context/AuthContext';
import { useProjectsListAdmin } from '../../../../hooks/proyectos/useProjectsListAdmin'
import { InputSearch } from '../../../../components/Commons/input_search';


const AdministrarProyectos = () =>
{
  const { projectsAdmin, metadata, pagination, setPagination, setSearchTerm, searchTerm } = useProjectsListAdmin();
  const [ setSearching ] = useState(false);
  const { userData } = useAuth();
  const navigate = useNavigate();

  const projectsPerPage = 10;
  const totalPages = Math.ceil(metadata.count / projectsPerPage);
  const handlePageChange = (pageNumber) =>
  {
    setPagination(pageNumber);
  };

  console.log('U', userData)

  // Funcion para manejar la busqueda

  const handleSearch = (term) => {
    const normalizedTerm = term.trim().toLowerCase();
    setSearchTerm(normalizedTerm);
    setSearching(!!normalizedTerm);
  };



  const handleDetailsProject = (project) =>
  {
    navigate(`/dashboard/editar_proyecto/${project.slug}/`, { state: { project } });
  };

  const renderPaginationButtons = () =>
  {
    if (!pagination)
    {
      return null;
    }

    return (
      <div className="d-flex flex-column flex-md-row my-5">
        <p className="text-sans-h5 mx-5 text-center">
          {`${(pagination - 1) * projectsPerPage + 1}- ${Math.min(pagination * projectsPerPage, metadata.count)} de ${metadata.count} usuarios`}
        </p>
        <nav className="pagination-container mx-auto mx-md-0">
          <ul className="pagination ms-md-5">
            <li className={`page-item ${pagination === 1 ? 'disabled' : ''}`}>
              <button className="custom-pagination-btn mx-3" onClick={() => handlePageChange(pagination - 1)} disabled={pagination === 1}>
                &lt;
              </button>
            </li>
            {Array.from({ length: totalPages }, (_, i) => (
              <li key={i} className="page-item">
                <button className={`custom-pagination-btn text-decoration-underline px-2 mx-2 ${pagination === i + 1 ? 'active' : ''}`} onClick={() => handlePageChange(i + 1)}>
                  {i + 1}
                </button>
              </li>
            ))}
            <li className={`page-item ${pagination === totalPages ? 'disabled' : ''}`}>
              <button className="custom-pagination-btn mx-3" onClick={() => handlePageChange(pagination + 1)} disabled={pagination === totalPages}>
                &gt;
              </button>
            </li>
          </ul>
        </nav>
      </div>
    );
  };

  return (
    <>
      <div className="container col-11">
        <h2 className="text-sans-h2 my-3">Administrar Proyectos</h2>
        <div className="my-5 d-flex justify-content-between">
          <h3 className="text-sans-h3">Proyectos </h3>
          <div >
          <InputSearch
              value={searchTerm}
              onSearch={handleSearch}
              setHasSearched={setSearching}
              onChange={setSearchTerm}
              placeholder="Busca palabras clave"
            />
          </div>
        </div>
      </div>
      <table className="d-flex row col-12 ms-5 border-top justify-content-evenly">
        <div className="col-1 mt-3 mx-auto">#
        </div>
        <div className="col-2 mt-3 ">
          <span className="text-sans-b-gray ">Proyecto</span>
        </div>
        <div className="col-2 mt-3">
          <p className="text-sans-b-gray ">Tipo de Proyecto</p>
        </div>
        <div className="col-1 mt-2 mx-auto">
          <button className="sort-estado-btn d-flex align-items-top">
            <p className="text-sans-b-gray mt-1">Estado</p>
            <i className="material-symbols-rounded ms-2 pt-1">filter_alt</i>
          </button>
        </div>
        <div className="col-1 mt-3 mx-auto">
          <p className="text-sans-b-gray ">Programa</p>
        </div>
        <div className="col-2 mt-3 mx-auto">
          <p className="text-sans-b-gray">Creado por</p>
        </div>
        <div className="col-1 mt-3 mx-auto">
          <p className="text-sans-b-gray">Acción</p>
        </div>


        {/* Mostrar proyectos segun si se aplico una busqueda o no */}
        {projectsAdmin?.length > 0 ? (
          // Si no se aplico ninguna, muestra dataInnovativeProjects completa
          projectsAdmin?.map((project, index) => (
            <div key={index} className={`row d-flex justify-content-evenly ${index % 2 === 0 ? 'grey-table-line' : 'white-table-line'}`}>
              <div className="d-flex col-3 mt-3 px-0 ">
                <span className="ms-1 me-3" >{(pagination - 1) * projectsPerPage + index + 1}</span>
                <span className="d-flex justify-content-start">{project?.name}</span>
              </div>
              <div className="col-2 mx-1 py-3">{project?.type?.name}</div>
              <div className="col-1 px-1 py-3">
                <p className={` mx-auto px-1 py-1 ${project.public ? "publicado" : "privado"}`}>
                  {project.public ? "Publicado" : "Privado"}
                </p>
              </div>
              <div className="col-1 px-1 py-3">
                <p className="program mx-auto px-1 py-1">{project.program?.sigla || "No seleccionado"}</p>
              </div>
              <div className="col-2 me-5 py-3 ">
                {project.author_email}
              </div>
              <div className="col-1 py-3">
                <button className="btn-secundario-s px-2 py-1"
                  onClick={() => handleDetailsProject(project)}>
                  <u>Ver proyecto</u>
                </button>
              </div>
            </div>
          ))
        ) : (
          // Si se aplico una busqueda pero no hay proyectos filtrados, muestra un mensaje
          <div>No se encontraron proyectos coincidentes.</div>
        )}
        {metadata.count > projectsPerPage && (
          <div className="pagination-container d-flex justify-content-center">
            {renderPaginationButtons()}
          </div>
        )}
      </table>
    </>
  );
};
export default AdministrarProyectos; 