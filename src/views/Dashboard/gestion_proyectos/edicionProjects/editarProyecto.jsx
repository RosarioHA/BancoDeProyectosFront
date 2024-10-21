import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import useApiProjectsDetail from "../../../../hooks/proyectos/useApiProjectsDetail";
import Carrusel from "../../../../components/Commons/carrusel";

const EditarProyecto = () =>
{
  const { slug } = useParams();
  const { dataProject, loadingProject,errorProject } = useApiProjectsDetail(slug);
  const [ isPublished, setIsPublished ] = useState(dataProject?.public);

  const handleStatusChange = (status) =>
  {
    setIsPublished(status);
    // Lógica para guardar el cambio en la base de datos
    console.log("Estado seleccionado:", status ? "Publicado" : "Privado");

  };


  // Maneja boton de volver atras
  const history = useNavigate();
  const handleBackButtonClick = () =>
  {
    history(-1);
  };

  if (loadingProject)
    {
      return <div className="d-flex align-items-center flex-column my-5">
        <div className="text-center text-sans-h5-blue">Cargando proyecto innovador</div>
        <span className="placeholder col-4 bg-primary">
        </span>
      </div>
    }
    if (errorProject)
    {
      return <div>Error: {errorProject}</div>; // Mostrar un mensaje de error si ocurre
    }

  return (
    <div className="container view-container ms-4">
      <h1 className="text-sans-h2 mb-3 mt-2">Banco de Proyectos: Ver solicitud</h1>
      <button className="btn-secundario-s d-flex mb-4" onClick={handleBackButtonClick}>
        <i className="material-symbols-rounded me-2">arrow_back_ios</i>
        <p className="mb-0 text-decoration-underline">Volver atrás</p>
      </button>

      {/* Mensaje */}
      <div className="container col-10 m-5">
        <div className="tertiary-container">
          <div className="row">
            <h2 className="text-sans-h2 m-3">Información de publicación</h2>
          </div>
          <div className="container mx-2 my-2">
            <div className="row row-cols-2">
              <div className="col ">Solicitante:</div>
              <div className="col ">Publicado por:</div>
              <div className="col ">Fecha de ingreso de solicitud: </div>
              <div className="col ">Fecha de publicación: </div>
            </div>
            <div className="row my-3">
              <div className="col-4">
                <div className="">Cambiar estado de publicación</div>
                <div className="d-flex my-2">
                  <button
                    className={`btn-secundario-s d-flex me-3 px-5 ${isPublished ? 'btn-principal-s' : ''}`}
                    onClick={() => handleStatusChange(true)}
                  >
                    <u>Publicado</u>
                  </button>
                  <button
                    className={`btn-secundario-s d-flex ms-2 px-5 ${!isPublished ? 'btn-principal-s' : ''}`}
                    onClick={() => handleStatusChange(false)}
                  >
                    <u>Privado</u>
                  </button>
                </div>
              </div>
            </div>
            <div className="row my-3">
              <div className="col-12">
                <div className="">Acciones</div>
                <div className="d-flex justify-content-between my-2">
                  <button className="btn-secundario-s d-flex px-3 ">
                    <u>Editar proyecto</u>
                    <i className="material-symbols-rounded ms-2">edit</i>
                  </button>
                  <button className="btn-logout d-flex  px-3 me-4">
                    <u>Eliminar proyecto</u>
                    <i className="material-symbols-rounded ms-2">delete_forever</i>
                  </button>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
      <h1 className="text-sans-h1 my-md-5">{dataProject.name}</h1>

      {/* Descripcion del proyecto */}
      <div className="neutral-container py-3 px-3">
        <h2 className="text-sans-h2 my-2">Descripción del proyecto</h2>
        <p className="text-sans-p" style={{ whiteSpace: 'pre-line' }}>{dataProject.description}</p>
      </div>

      {/* Imágenes del proyecto */}
      <h2 className="text-sans-h2 my-5">Imágenes del proyecto</h2>

      <Carrusel imgPortada={dataProject?.portada} imgGeneral={dataProject?.images} />

      {/* Tabla detalles del proyecto */}
      <div className="detalles-proyecto my-4 mt-5">
        <h2 className="text-sans-h2-white ms-3 ">Detalles del proyecto</h2>
      </div>
      <div className="ms-3">
        <div className="row">
          <div className="col">
            <p className="text-sans-p"><strong>Nombre del proyecto</strong></p>
            <p className="text-sans-p">{dataProject?.name}</p>
          </div>

          <div className="col">
            <p className="text-sans-p"><strong>Programa</strong></p>
            <p className="text-sans-p">{dataProject?.program?.name}</p>
          </div>

          <div className="col">
            <p className="text-sans-p"><strong>Tipo de proyecto</strong></p>
            <p className="text-sans-p">{dataProject?.type?.name}</p>
          </div>
        </div>

        <div className="row">
          <div className="col">
            <p className="text-sans-p"><strong>Región</strong></p>
            <p className="text-sans-p">{dataProject?.comuna?.region}</p>
          </div>

          <div className="col">
            <p className="text-sans-p"><strong>Comuna</strong></p>
            <p className="text-sans-p">{dataProject?.comuna?.comuna}</p>
          </div>

          <div className="col">
            <p className="text-sans-p"><strong>Año de construcción</strong></p>
            <p className="text-sans-p">{dataProject?.year?.number}</p>
          </div>
        </div>

        <div className="row">
          <p className="text-sans-p"><strong>Código de identificación SUBDERE</strong></p>
          <p className="text-sans-p">{dataProject?.id_subdere}</p>
        </div>
      </div>

      {/* Imágenes antes y después */}
      {(dataProject?.beforeimage && dataProject?.afterimage) &&
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
      </div>

      {/* Presupuesto */}
      <div className="row border-top">
        <div className="col-1 p-3">2</div>
        <div className="col p-3">Presupuesto</div>
        <div className="col p-3">PDF</div>
      </div>

      {
        dataProject?.files?.map((file, index) => (
          <div key={index} className={`row border-top ${index % 2 === 0 ? 'grey-table-line' : 'white-table-line'}`}>
            <div className="col-1 p-3">{index + 3}</div>  {/* Comenzamos desde el índice 3 porque ya mostramos 2 documentos anteriormente */}
            <div className="col p-3">{file.name}</div>
            <div className="col p-3">{file.file_format}</div>
          </div>
        ))
      }

      {/* Normativa por programa y tipo de proyecto */}
      {/* {filteredDocuments.length > 0 &&
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
      } */}
    </div>
  )
}

export default EditarProyecto; 