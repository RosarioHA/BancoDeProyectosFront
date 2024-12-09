import { useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';
import useApiInnovativeProjects from "../../../../hooks/useApiInnovativeProjects";
import { useAuth } from '../../../../context/AuthContext';
import Buscador from '../../../../components/Commons/barraDeBusqueda';

const renderActionButton = (project, isEditorOrSuperuser) => {
  if (['Privado', 'Publicado', 'Rechazado'].includes(project.application_status)) {
    return <button className="action-btn px-3 py-1" disabled>Ver proyecto</button>;
  } else if (project.application_status === 'Incompleto') {
    return <NavLink to={`/dashboard/crearinnovador_paso1?id=${project.id}`} className="action-btn px-3 py-1">Ver solicitud</NavLink>;
  } else if (project.application_status === 'Pendiente') {
    if (isEditorOrSuperuser) {
      return <NavLink to={`/dashboard/evaluarinnovador?id=${project.id}`} className="action-btn px-3 py-1">Evaluar solicitud</NavLink>;
    } else {
      return <button className="action-btn px-3 py-1" disabled>Ver proyecto</button>;
    }
  } else {
    return <button className="action-btn px-3 py-1" disabled>Estado desconocido</button>;
  }
};
const AdministrarProyectosInnovadores = () => {
  const { InnovativeAdminProjectsList, dataInnovativeProjects } = useApiInnovativeProjects();
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [searching, setSearching] = useState(false);
  const { userData } = useAuth();
  const isEditorOrSuperuser = ['Superusuario', 'Editor General', 'Editor Programa'].includes(userData.tipo_de_usuario);

  useEffect(() => {
    InnovativeAdminProjectsList();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Funcion para manejar la busqueda
  const handleSearch = (term) => {
    // Normaliza el termino de busqueda a minusculas
    const normalizedTerm = term.trim().toLowerCase();
    setSearchTerm(normalizedTerm);

  // Filtrar proyectos basados en el termino de busqueda
  const filteredProjects = dataInnovativeProjects.filter((project) => {
    const projectTitleLower = project.title.toLowerCase();
    return (
      projectTitleLower.includes(normalizedTerm) ||
      project.id.toString().includes(normalizedTerm)
    );
  });
    setSearchResults(filteredProjects);
    setSearching(!!normalizedTerm);
  };

  return (
    <div className="container view-container mx-5">
      <h2 className="text-sans-h2 my-3">Administrar Proyectos</h2>
      <div className="col-11 my-5 d-flex justify-content-between">
        <h3 className="text-sans-h3">Proyectos Innovadores</h3>
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
          <p className="text-sans-b-gray">Autor</p>
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
        dataInnovativeProjects.map((project, index) => (
          <div key={index} className={`row border-top ${index % 2 === 0 ? 'grey-table-line' : 'white-table-line'}`}>
            <div className="col-1 p-3">{index + 1}</div>
            <div className="col p-3">{project.title}</div>
            <div className="col p-3">{project.author_email}</div>
            <div className="col p-3">
              <p className={project.application_status ? `px-3 py-1 ${project.application_status.toLowerCase()}` : ''}> {project.application_status} </p>
            </div>
            <div className="col p-3">
              <p className={project.program ? 'incompleto px-2 py-1' : ''}>{project.program?.sigla || "No seleccionado"}</p>
            </div>
            <div className="col p-3">
              {renderActionButton(project, isEditorOrSuperuser)}
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
      </div>
    );
  };
  
  export default AdministrarProyectosInnovadores;