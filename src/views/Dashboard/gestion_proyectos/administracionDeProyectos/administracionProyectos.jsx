import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../../../../context/AuthContext';
import { useProjectsListAdmin } from '../../../../hooks/proyectos/useProjectsListAdmin'
import Buscador from '../../../../components/Commons/barraDeBusqueda';


const AdministrarProyectos = () =>
{
  const { projectsAdmin, metadata,pagination, setPagination} = useProjectsListAdmin();
  const [ searchTerm, setSearchTerm ] = useState('');
  const [ searchResults, setSearchResults ] = useState([]);
  const [ searching, setSearching ] = useState(false);
  const { userData } = useAuth();

  const projectsPerPage = 10;
  const totalPages = Math.ceil(metadata.count / projectsPerPage);
  const handlePageChange = (pageNumber) => {
    setPagination(pageNumber);
  };

  console.log('U', userData)
  console.log('P', projectsAdmin)

  // Funcion para manejar la busqueda
  const handleSearch = (term) =>
  {
    // Normaliza el termino de busqueda a minusculas
    const normalizedTerm = term.trim().toLowerCase();
    setSearchTerm(normalizedTerm);

    // Filtrar proyectos basados en el termino de busqueda
    const filteredProjects = projectsAdmin.filter((project) =>
    {
      const projectTitleLower = project.title.toLowerCase();
      return (
        projectTitleLower.includes(normalizedTerm) ||
        project.id.toString().includes(normalizedTerm)
      );
    });
    setSearchResults(filteredProjects);
    setSearching(!!normalizedTerm);
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
    <div className="container view-container mx-5">
      <h2 className="text-sans-h2 my-3">Administrar Proyectos</h2>
      <div className="col-11 my-5 d-flex justify-content-between">
        <h3 className="text-sans-h3">Proyectos </h3>
        <div>
          <Buscador
            searchTerm={searchTerm}
            onSearch={handleSearch}
            isSearching={searching}
            setIsSearching={setSearching}
            placeholder="Busca palabras clave o código SUBDERE"
          />
        </div>
      </div>

      <div className="row py-2 border-top">
        <div className="col-1 mt-3">#</div>
        <div className="col mt-3">
          <p className="text-sans-b-gray">Proyecto</p>
        </div>
        <div className="col mt-2">
          <p className="text-sans-b-gray">Tipo de Proyecto</p>
        </div>
        <div className="col mt-2">
          <button className="sort-estado-btn d-flex align-items-top">
            <p className="text-sans-b-gray mt-1">Estado</p>
            <i className="material-symbols-rounded ms-2 pt-1">filter_alt</i>
          </button>
        </div>
        <div className="col mt-3">
          <p className="text-sans-b-gray">Programa</p>
        </div>
        <div className="col mt-3">
          <p className="text-sans-b-gray">Acción</p>
        </div>
      </div>

      {/* Mostrar proyectos segun si se aplico una busqueda o no */}
      {searchTerm === '' ? (
        // Si no se aplico ninguna, muestra dataInnovativeProjects completa
        projectsAdmin.map((project, index) => (
          <div key={index} className={`row border-top ${index % 2 === 0 ? 'grey-table-line' : 'white-table-line'}`}>
            <div className="col-1 p-3">{index + 1}</div>
            <div className="col p-3">{project.name}</div>
            <div className="col p-3">{project.public}</div>
            <div className="col p-3">
              <p className={project.application_status ? `px-3 py-1 ${project.application_status.toLowerCase()}` : ''}> {project.application_status} </p>
            </div>
            <div className="col p-3">
              <p className={project.program ? 'incompleto px-2 py-1' : ''}>{project.program?.sigla || "No seleccionado"}</p>
            </div>
            <div className="col p-3">
            </div>
          </div>
        ))
      ) : searchTerm !== '' ? (
        // Si se aplico una busqueda y hay proyectos filtrados, muestra searchResults
        searchResults.map((project, index) => (
          <div key={index} className={`row border-top ${index % 2 === 0 ? 'grey-table-line' : 'white-table-line'}`}>
            <div className="col-1 p-3">{index + 1}</div>
            <div className="col p-3">{project.title}</div>
            <div className="col p-3">
              <p className={project.application_status ? `px-3 py-1 ${project.application_status.toLowerCase()}` : ''}> {project.application_status} </p>
            </div>
            <div className="col p-3">{project.program?.sigla || "No seleccionado"}</div>
            <div className="col p-3">
              {
                (project.application_status !== 'Publicado' && project.application_status !== 'Privado') ? (
                  <NavLink to={`/dashboard/crearinnovador_paso1?id=${project.id}`} className="action-btn px-3 py-1">Ver solicitud</NavLink>
                ) : (
                  <button className="action-btn px-3 py-1" disabled>Ver proyecto</button>
                )
              }
            </div>
          </div>
        ))
      ) : (
        // Si se aplico una busqueda pero no hay proyectos filtrados, muestra un mensaje
        <div>No se encontraron proyectos coincidentes.</div>
      )}
      {metadata.count > projectsPerPage  && (
        <div className="pagination-container d-flex justify-content-center">
          {renderPaginationButtons()}
        </div>
      )}
    </div>
  );
};
export default AdministrarProyectos; 