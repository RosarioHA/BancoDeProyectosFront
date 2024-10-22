import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useApiProjectsDetailAdmin } from "../../../../hooks/proyectos/useApiProjectDetailAdmin";
import { useApiUpdateProject } from "../../../../hooks/proyectos/useUpdateProject"
import Carrusel from "../../../../components/Commons/carrusel";
import { EditableTitle } from "../../../../components/Tables/InputTitle";

const EditarProyecto = () =>
{
  const { slug } = useParams();
  const { dataProjectAdmin, loadingProject, errorProject } = useApiProjectsDetailAdmin(slug);
  const { updateProject } = useApiUpdateProject(slug)
  const [ isPublished, setIsPublished ] = useState(null);
  const [ isEditing, setIsEditing ] = useState(false);
  const [ editingMessage, setEditingMessage ] = useState("Editar proyecto");
  console.log(isEditing)


  const handleEditButtonClick = () =>
  {
    setIsEditing((prev) =>
    {
      const newEditingState = !prev; // Cambia el estado de edición
      setEditingMessage(newEditingState ? "Editando proyecto" : "Editar proyecto"); // Actualiza el mensaje
      return newEditingState; // Devuelve el nuevo estado
    });
  };
  console.log(dataProjectAdmin)

  useEffect(() =>
  {
    if (dataProjectAdmin)
    {
      setIsPublished(dataProjectAdmin?.public);
    }
  }, [ dataProjectAdmin ]);

  const handleStatusChange = async (status) =>
  {
    setIsPublished(status);
    try
    {
      const updatedData = { public: status };
      await updateProject(slug, updatedData);
    } catch (error)
    {
      console.error("Error al actualizar el estado de publicación:", error);
    }
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
      <div className="text-center text-sans-h5-blue">Cargando proyecto</div>
      <span className="placeholder col-4 bg-primary">
      </span>
    </div>
  }
  if (errorProject)
  {
    return <div>Error: {errorProject}</div>;
  }
  //array con documentos de tipo y programa 
  const combinedDocuments = [
    ...dataProjectAdmin.program.documents,
    ...dataProjectAdmin.type.documents,
  ];

  return (
    <div className="container col-11 ms-5 my-5">
      <h1 className="text-sans-h2 mb-3 mt-2">Banco de Proyectos: Ver detalle</h1>
      <button className="btn-secundario-s d-flex mb-4" onClick={handleBackButtonClick}>
        <i className="material-symbols-rounded me-2">arrow_back_ios</i>
        <p className="mb-0 text-decoration-underline">Volver atrás</p>
      </button>

      {/* Mensaje */}
      <div className="container col-11 m-5">
        <div className="tertiary-container">
          <div className="row">
            <h2 className="text-sans-h2 m-3">Información de publicación</h2>
          </div>
          <div className="container mx-2 my-2">
            <div className="row row-cols-2">
              <div className="col ">Creado por: {dataProjectAdmin?.author_name}</div>
              <div className="col ">Publicado por:  </div>
              <div className="col ">Fecha de creación: {dataProjectAdmin?.created}</div>
              <div className="col ">Fecha de publicación: </div>
              <div className="col ">Última modificación: {dataProjectAdmin?.modified}</div>
            </div>
            <div className="row my-3">
              <div className="col-4">
                <div className="">Cambiar estado de publicación</div>
                <div className="d-flex my-2">
                  <button
                    className={`btn-secundario-s d-flex me-3 px-2 ${isPublished === true ? 'btn-principal-s active' : ''}`}
                    onClick={() => handleStatusChange(true)}
                  >
                    <u>Publicado</u>
                    {isPublished === true && <i className="material-symbols-rounded mx-2">check</i>}
                  </button>
                  <button
                    className={`btn-secundario-s d-flex ms-2 px-4 ${isPublished === false ? 'btn-principal-s active' : ''}`}
                    onClick={() => handleStatusChange(false)}
                  >
                    <u>Privado</u>
                    {isPublished === false && <i className="material-symbols-rounded mx-2">check</i>}
                  </button>
                </div>
              </div>
            </div>
            <div className="row my-3">
              <div className="col-12">
                <div className="">Acciones</div>
                <div className="d-flex justify-content-between my-2">
                  <button className="btn-secundario-s d-flex px-3" onClick={handleEditButtonClick}>
                    <u>{editingMessage}</u>
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

      {isEditing ? (
        <>
          <EditableTitle
            initialTitle={dataProjectAdmin?.name}
          />
        </>
      ) : (
        <h1 className="text-sans-h1 my-md-5">{dataProjectAdmin?.name}</h1>
      )}
      {/* Descripcion del proyecto */}
      <div className="neutral-container py-3 px-3">
        <h2 className="text-sans-h2 my-2">Descripción del proyecto</h2>
        <p className="text-sans-p" style={{ whiteSpace: 'pre-line' }}>{dataProjectAdmin?.description}</p>
      </div>

      {/* Imágenes del proyecto */}
      <h2 className="text-sans-h2 my-5">Imágenes del proyecto</h2>

      <Carrusel imgPortada={dataProjectAdmin?.portada} imgGeneral={dataProjectAdmin?.images} />

      {/* Tabla detalles del proyecto */}
      <div className="detalles-proyecto my-4 mt-5">
        <h2 className="text-sans-h2-white ms-3 ">Detalles del proyecto</h2>
      </div>
      <div className="ms-3">
        <div className="row">
          <div className="col">
            <p className="text-sans-p"><strong>Nombre del proyecto</strong></p>
            <p className="text-sans-p">{dataProjectAdmin?.name}</p>
          </div>

          <div className="col">
            <p className="text-sans-p"><strong>Programa</strong></p>
            <p className="text-sans-p">{dataProjectAdmin?.program?.name}</p>
          </div>

          <div className="col">
            <p className="text-sans-p"><strong>Tipo de proyecto</strong></p>
            <p className="text-sans-p">{dataProjectAdmin?.type?.name}</p>
          </div>
        </div>

        <div className="row">
          <div className="col">
            <p className="text-sans-p"><strong>Región</strong></p>
            <p className="text-sans-p">{dataProjectAdmin?.comuna?.region}</p>
          </div>

          <div className="col">
            <p className="text-sans-p"><strong>Comuna</strong></p>
            <p className="text-sans-p">{dataProjectAdmin?.comuna?.comuna}</p>
          </div>

          <div className="col">
            <p className="text-sans-p"><strong>Año de construcción</strong></p>
            <p className="text-sans-p">{dataProjectAdmin?.year?.number}</p>
          </div>
        </div>

        <div className="row">
          <p className="text-sans-p"><strong>Código de identificación SUBDERE</strong></p>
          <p className="text-sans-p">{dataProjectAdmin?.id_subdere}</p>
        </div>
      </div>

      {/* Imágenes antes y después */}
      {(dataProjectAdmin?.beforeimage && dataProjectAdmin?.afterimage) &&
        <>
          <div className=" p-0 d-md-flex justify-content-between my-4">
            <div className="col-md-6">
              <h3 className="text-sans-h3">Antes del proyecto</h3>
              <img src={dataProjectAdmin.beforeimage} className="img-proyecto" />
            </div>
            <div className="col-md-6">
              <h3 className="text-sans-h3">Después del proyecto</h3>
              <img src={dataProjectAdmin.afterimage} className="img-proyecto" />
            </div>
          </div>
        </>
      }

      {/* Video del proyecto */}
      {dataProjectAdmin?.video &&
        <>
          <h3 className="text-sans-h3">Video del proyecto</h3>
          <div className="d-flex justify-content-center mb-md-5">
            <div className="col-md-7 img-proyecto" src={dataProjectAdmin?.video} />
          </div>
        </>
      }
      <div className="my-5">
        <h2 className="text-sans-h2 my-4 mt-5">Documentos del proyecto</h2>
        {/* Tabla documentos del proyecto */}
        <span className="text-sans-h4 my-4 mt-5" >Documentos Obligatorios</span>
        <p>(Máximo 1 archivo, peso máximo de Planimetría 20MB, peso máximo de otros archivos 5 MB, formato PDF)</p>
        <div className="row my-4 fw-bold border-top">
          <div className="col-1 mt-3">#</div>
          <div className="col mt-3">Documento</div>
          <div className="col mt-3">Formato</div>
          <div className="col mt-3">Acción</div>
        </div>
        {/* Planimetria */}
        <div className="row border-top">
          <div className="col-1 p-3">1</div>
          <div className="col p-3">Planimetria</div>
          <div className="col p-3">PDF</div>
          <div className="col p-3">
            {dataProjectAdmin?.planimetria && dataProjectAdmin.planimetria.length > 0
              ? <a className="col p-3 text-sans-p-tertiary" href={dataProjectAdmin?.planimetria} target="_blank" rel="noopener noreferrer">Ver Documento</a>
              : 'No hay documento disponible'}
          </div>

        </div>

        {/* Especificaciones Técnicas */}
        <div className="row border-top grey-table-line">
          <div className="col-1 p-3">2</div>
          <div className="col p-3">Especificaciones Técnicas</div>
          <div className="col p-3">PDF</div>
          <div className="col p-3">
            {dataProjectAdmin?.eett && dataProjectAdmin.eett.length > 0
              ? <a className="col p-3 text-sans-p-tertiary" href={dataProjectAdmin?.eett} target="_blank" rel="noopener noreferrer">Ver Documento</a>
              : 'No hay documento disponible'}
          </div>
        </div>

        {/* Presupuesto */}
        <div className="row border-top">
          <div className="col-1 p-3">3</div>
          <div className="col p-3">Presupuesto</div>
          <div className="col p-3">PDF</div>
          <div className="col p-3">
            {dataProjectAdmin?.presupuesto && dataProjectAdmin.presupuesto.length > 0
              ? <a className="col p-3 text-sans-p-tertiary" href={dataProjectAdmin?.presupuesto} target="_blank" rel="noopener noreferrer">Ver Documento</a>
              : 'No hay documento disponible'}
          </div>

        </div>



      </div>
      <div className="my-5">
        <span className="text-sans-h4 my-4 mt-5">Documentos Adicionales (Opcionales)</span>
        <p>(Número de archivos máximo, peso máximo 20 MB, formato libre)</p>
        <div className="row my-4 fw-bold border-top">
          <div className="col-1 mt-3">#</div>
          <div className="col mt-3">Documento</div>
          <div className="col mt-3">Formato</div>
          <div className="col mt-3">Acción</div>
        </div>

        {
          dataProjectAdmin?.files?.map((file, index) => (
            <div key={index} className={`row border-top ${index % 2 === 0 ? 'grey-table-line' : 'white-table-line'}`}>
              <div className="col-1 p-3">{index + 1}</div>
              <div className="col p-3">{file.name}</div>
              <div className="col p-3">PDF</div>
              <a className="col p-3 text-sans-p-tertiary" href={document.document} target="_blank" rel="noopener noreferrer">Ver Documento</a>
            </div>
          ))
        }
      </div>
      <>
        <h2 className="text-sans-h2 my-4 mt-5">Documentos con normativa de uso general</h2>
        <div className="d-flex text-sans-h5-blue align-items-center">
          <span className="material-symbols-outlined mx-2 ">
            info
          </span>
          Estos documentos están asociados al programa y tipo de proyecto que elegiste anteriormente y se suben automáticamente.</div>
        {/* Normativa por programa y tipo de proyecto */}
        {combinedDocuments.length > 0 && (
          <>
            <div className="row my-4 fw-bold border-top">
              <div className="col-1 mt-3">#</div>
              <div className="col mt-3">Documento</div>
              <div className="col mt-3">Formato</div>
              <div className="col mt-3">Acción</div>
            </div>
            {combinedDocuments.map((document, index) => (
              <div key={document.id} className={`row border-top ${index % 2 === 0 ? 'grey-table-line' : 'white-table-line'}`}>
                <div className="col-1 p-3">{index + 1}</div>
                <div className="col p-3">{document.title}</div>
                <div className="col p-3">{document.document_format}</div>
                <a className="col p-3 text-sans-p-tertiary" href={document.document} target="_blank" rel="noopener noreferrer">Ver Documento</a>
              </div>
            ))}
          </>
        )}
      </>
    </div>
  )
}

export default EditarProyecto; 