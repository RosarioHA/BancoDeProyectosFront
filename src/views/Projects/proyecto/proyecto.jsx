import { useParams, useNavigate } from "react-router-dom";
import useApiProjectsDetail from "../../../hooks/useApiProjectsDetail";
import Carrusel from "../../../components/Commons/carrusel";
import ProyectosRelacionados from "../../../components/Proyecto/proyectosRelacionados";
import { useAuth } from "../../../context/AuthContext";
import { Link } from 'react-router-dom';
import { useLogin } from '../../../hooks/useLogin';

const Proyecto = () => {
  const { slug } = useParams();
  const { dataProject, loadingProject, errorProject } = useApiProjectsDetail(slug);
  const navigate = useNavigate();
  const { isLoggedIn } = useAuth();
  const { loginWithKeycloak } = useLogin(); // Asegúrate de que este método esté definido en tu hook.
  const combinedDocuments = [
    ...(dataProject.program && dataProject.program.documents ? dataProject.program.documents : []),
    ...(dataProject.type && dataProject.type.documents ? dataProject.type.documents : [])
  ];

  let filteredDocuments = [];
  let titlesMap = new Map();

  combinedDocuments.forEach(document => {
    if (!titlesMap.has(document.title)) {
      filteredDocuments.push(document);
      titlesMap.set(document.title, true);
    }
  });

  if (loadingProject) {
    return  <>
    <div className="d-flex align-items-center flex-column my-5 ">
      <div className="text-center text-sans-p-blue">Cargando Proyecto</div>
      <span className="placeholder col-4 bg-primary"></span>
    </div>
  </>
  }
  if (errorProject) {
    return <div>Error de conexión: {errorProject}</div>
  }

  let mensajeDisclaimer;
  if (dataProject.program.id === 1) {
    mensajeDisclaimer = (
      <div className="">
        <h3 className="text-sans-p-danger-bold">Condiciones de uso de la información</h3>
        <p className="text-sans-p-danger">Los proyectos son solo referenciales, siendo responsabilidad de la unidad ejecutora revisar y actualizar sus valores y aspectos normativos.
          Verifica precisión y actualidad antes de utilizarlos como base para tus postulaciones.</p>
        <hr className="text-sans-p-danger my-4" />
        <p className="text-sans-p-danger">Si necesitas detalles adicionales sobre algún proyecto, contáctanos.</p>
      </div>
    );
  } else {
    mensajeDisclaimer = (
      <div className="">
        <h3 className="text-sans-p-danger-bold">Condiciones de uso de la información</h3>
        <p className="text-sans-p-danger">Utiliza la información de proyectos como base para postulaciones. Es crucial verificar su adecuación y cumplimiento con los requisitos.
          Si necesitas detalles adicionales sobre algún proyecto, contáctanos.</p>
        <hr className="text-sans-p-danger my-4" />
        <p className="text-sans-p-danger">Si necesitas detalles adicionales sobre algún proyecto, contáctanos.</p>
      </div>
    );
  }

  return (
    <div className="container col-11 col-md-10 mb-5 pb-5" >
      {/* Boton volver y breadcrumbs */}
      <div className="d-flex align-items-center">
        <button className="volver-btn d-none d-lg-block" onClick={() => navigate(-1)}> &lt; volver</button>
        <p className="m-0 d-none d-lg-block me-3 opacity-50">|</p>
        <nav aria-label="breadcrumb">
          <ol className="breadcrumb m-0">
            <li className="breadcrumb-item "><Link className="breadcrumbs" to="/" >Inicio</Link></li>
            <li className="breadcrumb-item"><Link className="breadcrumbs" to="/bancodeproyectos" >Banco de Proyectos</Link></li>
            <li className="breadcrumb-item active d-none d-lg-block" aria-current="page">{dataProject.name}</li>
          </ol>
        </nav>
      </div>

      <h1 className="text-sans-h1 my-md-5">{dataProject.name}</h1>

      {/* Descripcion del proyecto */}
      <div className="neutral-container py-3 px-3">
        <h2 className="text-sans-h2 my-2">Descripción del proyecto</h2>
        <p className="text-sans-p" style={{ whiteSpace: 'pre-line' }}>{dataProject.description}</p>
      </div>

      {/* Imágenes del proyecto */}
      <h2 className="text-sans-h2 my-5">Imágenes del proyecto</h2>

      <Carrusel imgPortada={dataProject.portada} imgGeneral={dataProject.images} />

      {/* Tabla detalles del proyecto */}
      <div className="detalles-proyecto my-4 mt-5">
        <h2 className="text-sans-h2-white ms-3 ">Detalles del proyecto</h2>
      </div>
      <div className="ms-3">
        <div className="row">
          <div className="col">
            <p className="text-sans-p"><strong>Nombre del proyecto</strong></p>
            <p className="text-sans-p">{dataProject.name}</p>
          </div>

          <div className="col">
            <p className="text-sans-p"><strong>Programa</strong></p>
            <p className="text-sans-p">{dataProject.program.name}</p>
          </div>

          <div className="col">
            <p className="text-sans-p"><strong>Tipo de proyecto</strong></p>
            <p className="text-sans-p">{dataProject.type.name}</p>
          </div>
        </div>

        <div className="row">
          <div className="col">
            <p className="text-sans-p"><strong>Región</strong></p>
            <p className="text-sans-p">{dataProject.comuna.region}</p>
          </div>

          <div className="col">
            <p className="text-sans-p"><strong>Comuna</strong></p>
            <p className="text-sans-p">{dataProject.comuna.comuna}</p>
          </div>

          <div className="col">
            <p className="text-sans-p"><strong>Año de construcción</strong></p>
            <p className="text-sans-p">{dataProject.year.number}</p>
          </div>
        </div>

        <div className="row">
          <p className="text-sans-p"><strong>Código de identificación SUBDERE</strong></p>
          <p className="text-sans-p">{dataProject.id_subdere}</p>
        </div>
      </div>

      {/* Imágenes antes y después */}
      {(dataProject.beforeimage && dataProject.afterimage) &&
        <>
          <div className=" p-0 d-md-flex justify-content-between my-4">
            <div className="col-md-6">
              <h3 className="text-sans-h3">Antes del proyecto</h3>
              <img src={dataProject.beforeimage} className="img-proyecto" />
            </div>
            <div className="col-md-6">
              <h3 className="text-sans-h3">Después del proyecto</h3>
              <img src={dataProject.afterimage} className="img-proyecto" />
            </div>
          </div>
        </>
      }

      {/* Video del proyecto */}
      {dataProject.video &&
        <>
          <h3 className="text-sans-h3">Video del proyecto</h3>
          <div className="d-flex justify-content-center mb-md-5">
            <div className="col-md-7 img-proyecto" src={dataProject.video} />
          </div>
        </>
      }

      <h2 className="text-sans-h2 my-4">Documentos del proyecto</h2>
      {/* Mensaje disclaimer */}
      <div className="container alert-container p-4">
        {mensajeDisclaimer}
      </div>
      {/* Tabla documentos del proyecto */}
      <div className="row my-4 fw-bold border-top">
        <div className="col-1 mt-3">#</div>
        <div className="col mt-3">Documento</div>
        <div className="col mt-3">Formato</div>
        <div className="col mt-3">Acción</div>
      </div>

      {/* Especificaciones Técnicas */}
      <div className="row border-top grey-table-line">
        <div className="col-1 p-3">1</div>
        <div className="col p-3">Especificaciones Técnicas</div>
        <div className="col p-3">PDF</div>
        {isLoggedIn ? (
          <a className="col p-3 text-sans-p-tertiary" href={dataProject.eett} target="_blank" rel="noopener noreferrer">Descargar</a>
        ) : (
          <Link className="col p-3 text-sans-p-tertiary" onClick={() => {
            loginWithKeycloak(); // Llama a la función después de registrar el mensaje en la consola.
          }}>Iniciar sesión para descargar</Link>
        )}
      </div>

      {/* Presupuesto */}
      <div className="row border-top">
        <div className="col-1 p-3">2</div>
        <div className="col p-3">Presupuesto</div>
        <div className="col p-3">PDF</div>
        {isLoggedIn ? (
          <a className="col p-3 text-sans-p-tertiary" href={dataProject.presupuesto} target="_blank" rel="noopener noreferrer">Descargar</a>
        ) : (
          <Link className="col p-3 text-sans-p-tertiary" onClick={() => {
            loginWithKeycloak(); // Llama a la función después de registrar el mensaje en la consola.
          }}>Iniciar sesión para descargar</Link>
        )}
      </div>

      {
        dataProject.files.map((file, index) => (
          <div key={index} className={`row border-top ${index % 2 === 0 ? 'grey-table-line' : 'white-table-line'}`}>
            <div className="col-1 p-3">{index + 3}</div>  {/* Comenzamos desde el índice 3 porque ya mostramos 2 documentos anteriormente */}
            <div className="col p-3">{file.name}</div>
            <div className="col p-3">{file.file_format}</div>
            {isLoggedIn ? (
              <a className="col p-3 text-sans-p-tertiary" href={file.file} target="_blank" rel="noopener noreferrer">Descargar</a>
            ) : (
              <Link className="col p-3 text-sans-p-tertiary" onClick={() => {
                loginWithKeycloak(); // Llama a la función después de registrar el mensaje en la consola.
              }}>Iniciar sesión para descargar</Link>
            )}
          </div>
        ))
      }

      {/* Normativa por programa y tipo de proyecto */}
      {filteredDocuments.length > 0 &&
        <>
          <h2 className="text-sans-h2 my-4 mt-5">Documentos</h2>
          <div className="row my-4 fw-bold border-top">
            <div className="col-1 mt-3">#</div>
            <div className="col mt-3">Documento</div>
            <div className="col mt-3">Formato</div>
            <div className="col mt-3">Acción</div>
          </div>
          {
            filteredDocuments.map((documents, index) => (
              <div key={index} className={`row border-top ${index % 2 === 0 ? 'grey-table-line' : 'white-table-line'}`}>
                <div className="col-1 p-3">{index + 1}</div>
                <div className="col p-3">{documents.title}</div>
                <div className="col p-3">{documents.document_format}</div>
                <a className="col p-3 text-sans-p-tertiary" href={documents.document} target="_blank" rel="noopener noreferrer">Descargar</a>
              </div>
            ))
          }
        </>
      }



      {/* Proyectos Relacionados */}
      <ProyectosRelacionados currentSlug={dataProject.slug} />
    </div>

  );
};
export default Proyecto;