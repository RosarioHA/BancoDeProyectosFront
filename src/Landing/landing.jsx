import { useContext , useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { BuscadorProyectos } from '../../components/Bancodeproyectos';
import { Link } from 'react-router-dom';
import IconList from '../../static/img/icons/Blueprint.svg'; 
import { ApiContext } from '../../context/ProjectContext';
import useFilterOptions from '../../hooks/useFilterProjects';

import imagenQueEs1 from '../../static/img/que_es_1b.png';
import imagenQueEs2 from '../../static/img/que_es_2b.png';
import imagenQueEs3 from '../../static/img/que_es_3b.png';
import imagenBannerChile from '../../static/img/banner_chile.png';

const Home = () => {
  const {
    setSelectedFilters,
    updateProjects,
    selectedFilters,
    searchTerm,
    setSearchTerm,
  } = useContext(ApiContext);
  const { programs } = useFilterOptions();
  const navigate = useNavigate();
  const [isSearching, setIsSearching] = useState(false); 


  const handleProgramClick = async (e, programId) => {
    e.preventDefault();
    setSelectedFilters((prevFilters) => ({
      ...prevFilters,
      program__in: [programId],
    }));
    await updateProjects();
    navigate('/bancodeproyectos');
  };

  const handleViewAllProjects = () => {
    setSearchTerm('');
    setSelectedFilters({});
    navigate('/bancodeproyectos');
  };

  useEffect(() => {

  }, [selectedFilters]);

  const handleSearch = (newSearchTerm) => {
    setSearchTerm(newSearchTerm); 
    setSelectedFilters({});
    navigate('/bancodeproyectos'); 
  };

  return (
    <>
      <BuscadorProyectos
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        onSearch={handleSearch}
        isSearching={isSearching} 
        setIsSearching={setIsSearching}
      />
      {/* Categorias principales */}
      <div className="container my-4 mb-md-5">
        <h1 className="text-sans-h1 my-3 text-center">Categorías principales</h1>
        <div className="container d-flex flex-row justify-content-center">

        {programs && programs.map((program) => (
            
            <div tabIndex="0" className="container-btnCircle col-md-2 d-flex flex-column align-items-center mr-5" key={program.id}>
            <button
              className='categorias-circle btn btn-outline-primary  border-2 rounded-circle d-flex align-items-center justify-content-center my-3'
                onClick={(e) => handleProgramClick(e, program.id)}>
              <img src={program.icon_program} alt={program.sigla} id='btnIcon'  />
            </button>
            <p className="text-sans-p text-center">{program.name}</p>
          </div>
            
      
          ))}

          <div  tabIndex="0" className="container-btnCircle col-md-2 d-flex flex-column align-items-center mr-5">
            <button type="button"  onClick={handleViewAllProjects} id='btn-icon' className="categorias-circle btn btn-outline-primary  border-2 rounded-circle d-flex align-items-center justify-content-center my-3">
            <img src={IconList} alt='iconList' id='btnIcon' />
            </button>
            <p className="text-sans-p text-center">Ver todos los proyectos</p>
          </div>

        </div>
      </div>
      
      {/* Que es el Banco de Proyectos */}
      <div className="container col-md-8 px-4 mb-4">
        <h2 className="text-sans-h2 my-4">¿Qué es el Banco de Proyectos?</h2>
        <p className="text-sans-p"> El <strong> Banco de Proyectos </strong> de la Subsecretaría de Desarrollo Regional y Administrativo es un
          <strong> repositorio de proyectos ya ejecutados por distintas municipalidades </strong>a lo largo del país, que tiene por objetivo
          <strong> poner a disposición diversas iniciativas y su documentación </strong>asociada al momento de postular a los
          <strong> Programas de Mejoramiento Urbano (PMU) y de Mejoramiento de Barrios (PMB) de esta Subsecretaría.</strong></p>
        <p className="text-sans-p my-md-4"> Toda la información en este repositorio es referencial, <strong>siendo responsabilidad de la unidad ejecutora revisar y actualizar 
          sus valores y aspectos normativos</strong>
        </p>

        <div className="container d-lg-flex my-md-5">
          <div className="col-lg-4 d-flex flex-column mx-lg-2 align-items-center">
            <div className="que-es-circle rounded-circle d-flex align-items-center justify-content-center mb-md-4 my-4" >
              <img src={imagenQueEs1} alt="Imagen" className="que-es-img img-fluid rounded-circle h-100 " />
            </div>
            <strong className="text-sans-h4 text-center">Para personas encargadas de Programas de Mejoramiento Urbano y de Barrios</strong>
            <p className="text-sans-p text-center my-3 my-md-4">Dirigido a todo profesional municipal encargado de la formulación de proyectos que se enmarquen en los programas PMU y PMB.</p>
          </div>

          <div className="col-lg-4 d-flex flex-column mx-lg-2 align-items-center">
            <div className="que-es-circle rounded-circle d-flex align-items-center justify-content-center mb-md-4 my-4" >
              <img src={imagenQueEs2} alt="Imagen" className="que-es-img img-fluid rounded-circle h-100" />
            </div>
            <strong className="text-sans-h4 text-center">Filtra información y encuentra el proyecto que se ajuste a tu comuna</strong>
            <p className="text-sans-p text-center my-3 my-md-4">Podrás filtrar proyectos por tipo de programa, revisar antecedentes y descargar documentación referencial para postular proyectos adecuados a la realidad de tu comuna.</p>
          </div>

          <div className="col-lg-4 d-flex flex-column mx-lg-2 align-items-center">
            <div className="que-es-circle rounded-circle d-flex align-items-center justify-content-center mb-md-4 my-4" >
              <img src={imagenQueEs3} alt="Imagen" className="que-es-img img-fluid rounded-circle" />
            </div>
            <strong className="text-sans-h4 text-center">Entregamos información referencial para la realización de proyectos</strong>
            <p className="text-sans-p text-center my-3 my-md-4">Encontrarás información referencial detallada de proyectos como: planos, especificaciones, presupuestos, e información referencial para su elaboración. </p>
          </div>
        </div>
      </div>

      {/* Ideas innoivadoras / Documentacion */}
      <div className="container col-md-8 px-4 mb-4 d-flex flex-column flex-lg-row justify-content-between">
        <div className="col p-3 me-lg-5">
          <h2 className="text-sans-h2">Encuentra ideas innovadoras para tu comuna</h2>
          <h3 className="text-sans-p mt-3 mb-4">En la sección de proyectos innovadores podrás encontrar una variedad de alternativas de proyectos de carácter innovador, que te ayuda a diversificar la oferta de infraestructura, entregándole un nuevo aire a tu comuna.</h3>

            <Link to={`/bancodeideas`}  type="button" className="btn-secundario-s mt-3 text-sans-p-blue text-decoration-underline px-3 py-3">
              Ver Proyectos Innovadores &gt;
            </Link>
        </div>
        <div className="col p-3 ms-lg-5">
          <h2 className="text-sans-h2">Revisa la documentación que necesitas para tu postulación</h2>
          <h3 className="text-sans-p mt-3 mb-4">En la sección de Documentación encontrarás toda la documentación asociada a la elaboración de proyectos PMU y PMB, de manera fácil y ordenada para que puedas descargarla según necesites.</h3>
            <Link to={`/documentacion`} type="button" className="btn-secundario-s mt-3 text-sans-p-blue text-decoration-underline px-3 py-3">
              Ver Documentación &gt;
            </Link>
        </div>
      </div>

      {/* Banner mapa chile */}
      <div className="container col-md-10 mw-75 d-flex flex-column justify-content-center align-items-center">
        <img src={imagenBannerChile} className="w-100 m-5 " alt="mapa de chile" />
      </div>

    </>
  );
};
  
export default Home;
