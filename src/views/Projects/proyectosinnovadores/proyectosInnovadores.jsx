import { useState, useEffect, useMemo } from 'react';
import useApiInnovativeProjects from '../../../hooks/useApiInnovativeProjects';
import useFilterOptions from '../../../hooks/useFilterProjects';
import useApiGoodPractices from '../../../hooks/useApiGoodPractices';
import Carrusel from '../../../components/Commons/carrusel';
import DropdownComponent from '../../../components/Commons/Dropdown';
import SelectorLateral from '../../../components/Commons/selectorLateral';

const ProyectosInnovadores = () =>
{
  // Hooks de estado
  const { programs } = useFilterOptions();
  const [ selectedProject, setSelectedProject ] = useState(null);
  const [ selectedPractice, setSelectedPractice ] = useState(null);
  const [ selectedProgram, setSelectedProgram ] = useState([ 2 ]); // Inicialmente selecciona "PMB"
  const [ selectedPracticesPrograms, setSelectedPracticesPrograms ] = useState(
    selectedProgram.length > 0 ? [ selectedProgram[ 0 ] ] : []
  );

  // Logica para obtener datos de Proyectos Innovadores y Buenas Practicas
  const {
    dataInnovativeProjects,
    loadingInnovativeProjects,
    errorInnovativeProjects
  } = useApiInnovativeProjects();
  const {
    dataGoodPractices,
    loadingGoodPractices,
    errorGoodPractices,
  } = useApiGoodPractices();

  // Funcion para filtrar proyectos segun programa seleccionado
  const filterProjectsByPrograms = (data, selectedProgramsSiglas) =>
  {
    if (selectedProgramsSiglas.length === 0)
    {
      return data;
    } else
    {
      return data.filter((item) =>
        item.program && selectedProgramsSiglas.includes(item.program.sigla)
      );
    }
  };

  const filterPracticesByPrograms = (data, selectedProgramSiglas) =>
  {
    if (selectedProgramSiglas.length === 0)
    {
      return data;
    } else
    {
      return data.filter((practice) =>
        practice.program.some(program =>
          selectedProgramSiglas.includes(program.sigla)
        )
      );
    }
  };

  // Funcion para cambiar el programa seleccionado
  const toggleProgram = (sigla) =>
  {
    if (selectedProgram.includes(sigla))
    {
      setSelectedProgram([]);
      setSelectedPracticesPrograms([]);
      setSelectedPractice(null);
    } else
    {
      setSelectedProgram([ sigla ]);
      setSelectedPracticesPrograms([ sigla ]);
      setSelectedPractice(null);
      setSelectedProject(null); // Limpia seleccion del usuario para mostrar primer proyecto del listado al cambiar programa.
    }
  };

  // Funcion para seleccionar una practica
  const onSelect = (practice) =>
  {
    setSelectedPractice(practice);
    // Guarda la buena practica seleccionada en el almacenamiento local
    localStorage.setItem('selectedPractice', JSON.stringify(practice));
  };

  const filteredProjects = useMemo(() =>
  {
    return filterProjectsByPrograms(dataInnovativeProjects, selectedProgram);
  }, [ selectedProgram, dataInnovativeProjects ]);


  const filteredPractices = useMemo(() =>
  {
    return filterPracticesByPrograms(dataGoodPractices, selectedProgram);
  }, [ dataGoodPractices, selectedProgram ]);

  // Actualiza proyecto seleccionado al cambiar la lista de proyectos
  useEffect(() =>
  {
    if (filteredProjects.length > 0 && selectedProject === null)
    {
      setSelectedProject(filteredProjects[ 0 ]);
    }
  }, [ filteredProjects, selectedProject ]);

  // Actualiza la practica seleccionada al cambiar la lista de practicas
  useEffect(() =>
  {
    if (filteredPractices.length > 0 && selectedPractice === null)
    {
      setSelectedPractice(filteredPractices[ 0 ]);
    }
  }, [ filteredPractices, selectedPractice ]);

  // Manejo de errores y carga de datos
  if (loadingInnovativeProjects)
  {
    return <>
      <div className="d-flex align-items-center flex-column my-5">
        <div className="text-center text-sans-p-blue">Cargando Datos</div>
        <span className="placeholder col-4 bg-primary"></span>
      </div>
    </>
  }
  if (errorInnovativeProjects)
  {
    return <div>Error: {errorInnovativeProjects}</div>;
  }
  if (loadingGoodPractices)
  {
    return <>
      <div className="d-flex align-items-center flex-column my-5 ">
        <div className="text-center text-sans-p-blue">Cargando datos de buenas prácticas</div>
        <span className="placeholder col-4 bg-primary"></span>
      </div>
    </>
  }
  if (errorGoodPractices)
  {
    return <div>Error en los datos de buenas prácticas: {errorGoodPractices}</div>;
  }

  return (
    <div className="container col-10">
      <nav aria-label="breadcrumb">
        <ol className="breadcrumb ms-3">
          <li className="breadcrumb-item "><a className="breadcrumbs" href="/">Inicio</a></li>
          <li className="breadcrumb-item active" aria-current="page">Proyectos Innovadores</li>
        </ol>
      </nav>
      <h1 className="text-sans-h1">Proyectos Innovadores</h1>
      <p className="text-sans-p my-md-4"> En la sección de proyectos innovadores podrás encontrar una variedad de alternativas de proyectos de carácter innovador,
        que te ayuda a diversificar la oferta de infraestructura, entregándole un nuevo aire a tu comuna.
      </p>
      <h2 className="text-sans-h2 mt-5">Listado de proyectos innovadores</h2>
      <h3 className="text-sans-h3 mt-3">Primero, elige un programa:</h3>

      {/* Tipo de programa */}
      <div className="container d-flex flex-row justify-content-center ">
        {programs.map(program => (
          <div
            key={program.sigla}
            tabIndex="0"
            className="container-btnCircle px-4 col-5 d-flex flex-column mx-2 align-items-center"
          >
            <button
              key={program.sigla}
              className={`categorias-circle btn rounded-circle border-2 d-flex align-items-center justify-content-center my-2 ${selectedProgram.includes(program.sigla) ? 'btn-primary' : 'btn-outline-primary white-text'
                }`}
              onClick={() => toggleProgram(program.sigla)}
            >
              <img src={program.icon_program} alt={program.sigla} id='btnIcon' className={selectedProgram.includes(program.sigla) ? 'white-icon' : ''} />
            </button>
            <p className="text-sans-h5-bold text-center">{program.name}</p>
          </div>

        ))}
      </div>

      {selectedProgram.includes(1) ? ( // Si PMU está seleccionado
        <p className="text-sans-p my-md-4">
          Los espacios públicos, al igual que nuestra sociedad, son dinámicos y varían acorde a los tiempos y lugares en los que se encuentran. Es por esto, que la innovación en el espacio urbano se hace fundamental a la hora de entregar a la ciudadanía una mejor, más amplia y moderna oferta de espacio público. Aquí te mostramos algunas ideas de espacios deportivos, culturales y de protección ambiental para que puedas considerar posibles soluciones a desarrollar con financiamiento PMU.
        </p>
      ) : ( // Si PMB u otro programa está seleccionado
        <p className="text-sans-p my-md-4">
          {/* Aqui poner texto PMB si es que entregan alguno    */}
        </p>
      )}

      {/* Selector Proyectos */}
      <div className="container my-3">
        {filteredProjects.map((project) => (
          <button
            key={project.id} // Asegúrate de que 'id' sea único
            className="btn-terciario text-decoration-underline px-3 p-2 m-1"
            onClick={() => setSelectedProject(project)}
          >
            {project.title}
          </button>
        ))}
      </div>

      {/* Dropdown */}
      <div className="d-flex justify-content-center m-3 d-lg-none">
        <DropdownComponent
          data={filteredProjects}
          description='un proyecto'
          onOptionSelect={(project) =>
          {
            setSelectedProject(project);
          }}
          titlePropertyName="title"
          selectedOption={selectedProject}
        />
      </div>

      {/* Datos del proyecto */}
      <div>
        {(selectedProject || (filteredProjects.length > 0 && filteredProjects[ 0 ])) ? (
          <div>
            <h4 className="text-sans-h3 text-center text-md-start mt-5">
              {(selectedProject || filteredProjects[ 0 ]).title}
            </h4>

            <div className="row">
              <div className="desc-container">
                <div className="carrusel-container col-12 col-lg-7">
                  <Carrusel
                    imgPortada={(selectedProject || filteredProjects[ 0 ]).portada}
                    imgGeneral={(selectedProject || filteredProjects[ 0 ]).innovative_gallery_images}
                    context="proyectosInnovadores"
                  />
                  <div className="d-flex flex-column align-items-center">
                    <p className="text-sans-p-danger-small px-4 col-10">
                      <em>Éstas imágenes son de carácter referencial y no corresponden necesariamente a proyectos que se hayan realizado.</em>
                    </p>
                  </div>
                </div>
                <p className="text-sans-p ">{(selectedProject || filteredProjects[ 0 ]).description}</p>
              </div>

              <div className="col">
                <div className="d-flex flex-column">
                  {(selectedProject || filteredProjects[ 0 ]).web_sources.map((source, index) => (
                    <a key={source.id} href={source.url} target="_blank" rel="noopener noreferrer">
                      Visitar fuente {index + 1}
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ) : (
          <p className="text-sans-h4 mt-3">Selecciona un proyecto para ver los detalles.</p>
        )}
      </div>

      <div className="container mt-5 pt-5">
        <hr className="my-5" />
        {/* BUENAS PRACTICAS */}
        <h2 className="text-sans-h2">Buenas prácticas para el diseño</h2>
        <p className="text-sans-p mt-3">Con estas prácticas buscamos promover criterios sustentables a considerar en el diseño actual de los proyectos.</p>
        <div className="row">
          <div className="col-lg-4">
            <SelectorLateral
              data={filteredPractices}
              onSelect={onSelect}
              titlePropertyName="title"
            />
          </div>
          <div className="col-lg-8">
            {selectedPractice ? (
              <>
                <h2 className="text-sans-h3">{selectedPractice.title}</h2>
                <p className="text-sans-p" >{selectedPractice.description}</p>
                <div className="my-4">
                  <Carrusel
                    imgPortada={selectedPractice.portada}
                    imgGeneral={selectedPractice.good_practices_gallery_images}
                    context="buenasPracticas"
                  />
                </div>
              </>
            ) : (
              <p className="text-sans-h4 mt-3">Selecciona una buena práctica para ver los detalles.</p>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};

export default ProyectosInnovadores;