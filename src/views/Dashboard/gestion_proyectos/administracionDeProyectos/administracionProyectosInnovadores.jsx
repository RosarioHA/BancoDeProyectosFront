import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useInnovativeProjectsListAdmin } from '../../../../hooks/innovativeProject/useInnovativeListAdmin';
import { InputSearch } from '../../../../components/Commons/input_search';


const AdministrarProyectosInnovadores = () =>
{
  const { innovativeProjectsAdmin, metadata, pagination, setPagination, setSearchTerm, searchTerm } = useInnovativeProjectsListAdmin();
  const [ setSearching ] = useState(false);
  const [ isPublicSorted, setIsPublicSorted ] = useState(false);
  const navigate = useNavigate();

  const projectsPerPage = 10;
  const totalPages = Math.ceil(metadata.count / projectsPerPage);

  const handlePageChange = (pageNumber) =>
  {
    setPagination(pageNumber);
  };


  // Funcion para manejar la busqueda
  const handleSearch = (term) =>
  {
    const normalizedTerm = term.trim().toLowerCase();
    setSearchTerm(normalizedTerm);
    setSearching(!!normalizedTerm);
  };


  const handleDetailsProject = (project) =>
  {
    navigate(`/dashboard/edicion_innovador/${project.id}`, { state: { project } });
  };
  // Función para manejar el ordenamiento
  const handleSortByPublic = () => {
    setIsPublicSorted(!isPublicSorted);
  };
  // Ordenar proyectos según 'public'
  const sortedProjectsAdmin = [ ...innovativeProjectsAdmin ].sort((a, b) =>
  {
    if (isPublicSorted)
    {
      return (a.public === b.public) ? 0 : a.public ? -1 : 1; // Ascendente
    } else
    {
      return (a.public === b.public) ? 0 : a.public ? 1 : -1; // Descendente
    }
  });

  const renderPaginationButtons = () =>
  {
    if (!pagination)
    {
      return null;
    }

    return (
      <div className="d-flex flex-column flex-md-row my-5">
        <p className="text-sans-h5 mx-5 text-center">
          {`${(pagination - 1) * projectsPerPage + 1}- ${Math.min(pagination * projectsPerPage, metadata.count)} de ${metadata.count} `}
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
          <h3 className="text-sans-h3">Proyectos Innovadores</h3>
          <div>
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
      <div className="d-flex row col-12 ms-5 border-top justify-content-evenly">
        <div className="col-1 mt-3">#</div>
        <div className="col-2 mt-3">
          <p className="text-sans-b-gray ms-3">Proyecto</p>
        </div>
        <div className="col-2 mt-2 ">
          <button className="sort-estado-btn d-flex align-items-top"  onClick={handleSortByPublic}>
            <p className="text-sans-b-gray mt-1 ms-2">Estado</p>
            <i className="material-symbols-rounded ms-2 pt-1">filter_alt</i>
          </button>
        </div>
        <div className="col-2 mt-3">
          <p className="text-sans-b-gray">Programa</p>
        </div>
        <div className="col-3 mt-3">
          <p className="text-sans-b-gray me-5">Creado por</p>
        </div>
        <div className="col-2 mt-3">
          <p className="text-sans-b-gray">Acción</p>
        </div>

        {/* Mostrar proyectos segun si se aplico una busqueda o no */}
        {sortedProjectsAdmin.length > 0 ? (
          // Si no se aplico ninguna, muestra dataInnovativeProjects completa
          sortedProjectsAdmin?.map((project, index) => (
            <div key={index} className={`row border-top ${index % 2 === 0 ? 'grey-table-line' : 'white-table-line'}`}>
              <div className="col-1 p-3">{(pagination - 1) * projectsPerPage + index + 1}</div>
              <div className="col-2 p-3">{project.title}</div>
              <div className="col-1 p-3">
                {/* Badge adicional para el estado 'is_complete' */}
                {project.is_complete === false ? (
                  <span className="mx-auto px-1 py-1 incompleto ">Incompleto</span>
                ) : project.public === false ? (
                  <span className="mx-auto px-1 py-1 privado">Privado</span>
                ) : (
                  <span className="mx-auto px-1 py-1 publicado">Publicado</span>
                )}
              </div>
              <div className="col-3 p-3">
                <p className="program mx-auto px-2 py-1">{project.program?.sigla || "No seleccionado"}</p>
              </div>
              <div className="col-3 p-3 ">{project.author_email}</div>
              <div className="col-2 p-3">
                <button className="btn-secundario-s px-3 py-1"
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
      </div>
    </>
  );
};

export default AdministrarProyectosInnovadores;