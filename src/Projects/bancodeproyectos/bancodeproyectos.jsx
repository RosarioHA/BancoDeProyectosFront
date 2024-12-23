import { useContext, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ApiContext } from '../../../context/ProjectContext';
import {
  ProyectoContainer,
  FiltroProyectosContainer,
  ProyectosSort,
  BuscadorProyectos
} from '../../../components/Bancodeproyectos';

const BancoProyectos = () =>
{
  const {
    listProjects,
    searchTerm,
    setSearchTerm,
    filterParams,
    setFilterParams,
    sortOrder,
    handleSortChange,
    projects,
    selectedFilters,
    updateProjects
  } = useContext(ApiContext);

  const [ isSearching, setIsSearching ] = useState(false);

  useEffect(() =>
  {
    updateProjects();
  }, [ selectedFilters, updateProjects ]);

  useEffect(() =>
  {
    listProjects(searchTerm, filterParams, sortOrder);
  }, [ searchTerm, filterParams, sortOrder, listProjects ]);




  return (
    <div className="container col-12 col-md-12 col-sm-12 col-lg-10">
      <nav className="container" aria-label="breadcrumb">
        <ol className="breadcrumb breadcrumb-style">
          <li className="breadcrumb-item"><Link to="/">Inicio</Link></li>
          <li className="breadcrumb-item active" aria-current="page">Banco de Proyectos</li>
        </ol>
      </nav>
      <BuscadorProyectos
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        isSearching={isSearching}
        setIsSearching={setIsSearching}
        onSearch={(newSearchTerm) =>
        {
          setSearchTerm(newSearchTerm);
        }}
      />
      <div className="row">
        <div className="col-2 col-lg-4 col-sm-6 col-md-4 mt-3">
          <FiltroProyectosContainer filterParams={filterParams} setFilterParams={setFilterParams} selectedFilters={selectedFilters} />
        </div>
        
        <div className="col-10 col-sm-8 col-md-8 col-lg-8 ">
          <div className="d-flex justify-content-end mb-1">
            <ProyectosSort sortOrder={sortOrder} onSortChange={handleSortChange} />
          </div>
          <div className="col-12 d-none d-xl-block">

            {projects && projects.length > 0 ? (
              <ProyectoContainer data={projects} />
            ) : (
              <div className="alert-container p-3 d-flex justify-content-center my-4" id='icon-alert'>
                <i className="material-symbols-outlined">
                  info
                </i>
                <p className="text-sans-p-danger fs-5 text-left mx-2 my-auto align-self-center">
                  No encontramos proyectos con los filtros que elegiste. Intenta con otros distintos.
                </p>
              </div>
            )
            }
          </div>
        </div>
        <div className="col-12 col-sm-6 col-md-12 d-block d-xl-none">

          {projects && projects.length > 0 ? (
            <ProyectoContainer data={projects} />
          ) : (
            <div className="alert-container p-3 d-flex justify-content-center my-4" id='icon-alert'>
              <i className="material-symbols-outlined">
                info
              </i>
              <p className="text-sans-p-danger fs-5 text-left mx-2 my-auto align-self-center">
                No encontramos proyectos con los filtros que elegiste. Intenta con otros distintos.
              </p>
            </div>
          )
          }
        </div>
      </div>
    </div>
  );
};

export default BancoProyectos;
