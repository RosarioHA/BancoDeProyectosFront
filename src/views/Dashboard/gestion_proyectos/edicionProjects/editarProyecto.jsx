import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useApiProjectsDetailAdmin } from "../../../../hooks/proyectos/useApiProjectDetailAdmin";
import { useApiUpdateProject } from "../../../../hooks/proyectos/useUpdateProject"
import { useGalleryProject } from "../../../../hooks/proyectos/useGalleryProject";
import { useDocumentsAdicional } from "../../../../hooks/proyectos/useDocumentsAdicional";
import Carrusel from "../../../../components/Commons/carrusel";
import { EditableTitle } from "../../../../components/Tables/InputTitle";
import { ModalDetalles } from "../../../../components/Modals/ModalDetalles";
import UploadImg from "../../../../components/Commons/UploadImg";
import UploadImgsm from "../../../../components/Commons/UploadImgsm";
import { DocumentsProjects } from "../../../../components/Tables/DocumentsProjects";
import DocumentsAditionals from "../../../../components/Commons/DocumentsAditionals";
import { DeleteProjectModal } from "../../../../components/Modals/EliminarProyecto";
const EditarProyecto = () =>
{
  const { slug } = useParams();
  const navigate = useNavigate();
  const { dataProjectAdmin, loadingProject, errorProject, fetchProjectAdminData } = useApiProjectsDetailAdmin(slug);
  const { updateProject } = useApiUpdateProject();
  const { deleteImage, addImage } = useGalleryProject(slug);
  const { addDocument, deleteDocument } = useDocumentsAdicional(slug) || [];

  const [ dataProject, setDataProject ] = useState(null);
  const [ isPublished, setIsPublished ] = useState(null);
  const [ isEditing, setIsEditing ] = useState(false);
  const [ editando, setEditando ] = useState(false);
  const [ editingMessage, setEditingMessage ] = useState("Editar proyecto");
  const [ text, setText ] = useState('');
  const [ count, setCount ] = useState(0);
  const [ errorMessage, setErrorMessage ] = useState(null);
  const [ errorComplete, setErrorComplete ] = useState(null);
  const [ successComplete, setSuccessComplete ] = useState('');
  const [ detallesEdit, setDetallesEdit ] = useState({});
  const [ videoLink, setVideoLink ] = useState('');
  const [ successMessage, setSuccessMessage ] = useState('');
  const [ beforeimage, setBeforeimage ] = useState('');
  const [ afterimage, setAfterImage ] = useState('');
  const [ previousLink, setPreviousLink ] = useState('');
  const [ files, setFiles ] = useState([]);
  const [ completingProject, setCompletingProject ] = useState(false);

  const isCompleted = dataProject?.is_complete;


  useEffect(() =>
  {
    if (dataProjectAdmin)
    {
      setIsPublished(dataProjectAdmin?.public);
      setText(dataProjectAdmin?.description || '');
      setCount(dataProjectAdmin?.description?.length || 0);
      setVideoLink(dataProjectAdmin?.video || '');
      setBeforeimage(dataProjectAdmin?.beforeimage || ''),
        setAfterImage(dataProjectAdmin?.afterimage || '')
      setFiles(dataProjectAdmin?.files || []);
      // Cargar detalles iniciales
      setDetallesEdit({
        programa: dataProjectAdmin?.program?.name,
        region: dataProjectAdmin?.comuna?.region,
        comuna: dataProjectAdmin?.comuna?.comuna,
        tipoProyecto: dataProjectAdmin?.type?.name,
        year: dataProjectAdmin?.year?.number,
        idSubdere: dataProjectAdmin?.id_subdere,
        tag: dataProjectAdmin?.prioritized_tag?.prioritized_tag
      });
      setDataProject((prev) => ({
        ...prev,
        ...dataProjectAdmin,
        programa: dataProjectAdmin?.program?.name,
        region: dataProjectAdmin?.comuna?.region,
        comuna: dataProjectAdmin?.comuna?.comuna,
        tipoProyecto: dataProjectAdmin?.type?.name,
        year: dataProjectAdmin?.year?.number,
        idSubdere: dataProjectAdmin?.id_subdere,
        tag: dataProjectAdmin?.prioritized_tag?.prioritized_tag,
        beforeimage: dataProjectAdmin?.beforeimage,
        afterimage: dataProjectAdmin?.afterimage

      }));
    }
  }, [ dataProjectAdmin ]);

  useEffect(() =>
  {
  }, [ dataProject ]);

  useEffect(() =>
  {
    setSuccessMessage('');
  }, [ isEditing ]);

  useEffect(() =>
  {
    if (videoLink !== previousLink)
    {
      setSuccessMessage('');
    }
  }, [ videoLink, previousLink ]);

  const handleGuardarDetalles = async (newDetails) =>
  {
    try
    {
      const updatedData = await updateProject(slug, newDetails);
      setDetallesEdit((prev) => ({ ...prev, ...newDetails }));
      setDataProject((prev) => ({ ...prev, ...updatedData }));
      fetchProjectAdminData()
    } catch (error)
    {
      console.error("Error al actualizar el proyecto:", error);
    }
  };

  const handleButtonClick = async () =>
  {
    setErrorMessage(null);
    if (editando)
    {
      if (text.length > 700)
      {
        setErrorMessage('El texto no puede superar los 700 caracteres.');
        return;
      }
      if (text.trim().length === 0)
      {
        setErrorMessage('No puede guardar un texto vacío.');
        return;
      }

      try
      {
        const updatedData = await updateProject(slug, { description: text });
        setDataProject((prev) => ({ ...prev, description: updatedData.description }));
        setEditando(false);
      } catch (error)
      {
        console.error("Error al actualizar la descripción del proyecto:", error);
        setErrorMessage("No se pudo guardar la descripción.");
      }
    } else
    {
      setEditando(true);
    }
  };

  const handleEditButtonClick = () =>
  {
    setIsEditing((prev) =>
    {
      const newEditingState = !prev;
      setEditingMessage(newEditingState ? "Editando proyecto" : "Editar proyecto");
      if (newEditingState && dataProjectAdmin)
      {
        setDataProject((prevData) => ({
          ...prevData,
          ...dataProjectAdmin
        }));
      }

      return newEditingState;
    });
  };

  const handleTextChange = (e) =>
  {
    const newText = e.target.value;
    setText(newText);
    setCount(newText.length);
  };

  const handleTitleSave = async (newTitle) =>
  {
    try
    {
      const updatedData = await updateProject(slug, { name: newTitle });
      setDataProject((prev) => ({ ...prev, name: updatedData.name }));
    } catch (error)
    {
      console.error("Error al actualizar el título del proyecto:", error);
    }
  };


  const handleStatusChange = async (status) =>
  {
    setIsPublished(status);
    try
    {
      const updatedData = await updateProject(slug, { public: status });
      setDataProject((prev) => ({ ...prev, public: updatedData.public }));
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


  const handleSaveImage = async (formData) =>
  {
    try
    {
      const updatedData = await updateProject(slug, formData);

      setDataProject((prev) =>
      {
        const images = Array.isArray(updatedData.images) && typeof updatedData.images[ 0 ] === 'object'
          ? updatedData.images
          : prev.images;

        const updatedProject = {
          ...prev, ...updatedData, images
        }
        return updatedProject;
      });
    } catch (error)
    {
      console.error('Error al actualizar la imagen de portada:', error);
    }
  };
  const addImageGallery = async (image) =>
  {
    try
    {
      const newImage = await addImage(image);
      setDataProject((prev) => ({
        ...prev,
        images: [ ...prev.images, newImage ],
      }));
    } catch (error)
    {
      console.error("Error al agregar la imagen:", error);
    }
  };

  const deleteImageGallery = async (imageId) =>
  {
    try
    {
      await deleteImage(imageId);
      setDataProject((prev) => ({
        ...prev,
        images: prev.images.filter((img) => img.id !== imageId),
      }));
    } catch (error)
    {
      console.error("Error al eliminar la imagen:", error);
    }
  };



  const handleVideoChange = async () =>
  {
    try
    {
      const videoData = { video: videoLink };
      const updatedData = await updateProject(slug, videoData);
      setDataProject((prev) => ({ ...prev, video: updatedData.video }));
      if (videoLink !== previousLink)
      {
        setSuccessMessage('Link guardado exitosamente');
        setPreviousLink(videoLink);
      }
    } catch (error)
    {
      console.error('Error al actualizar el video:', error);
    }
  };

  const handleFileUpload = async (field, file) =>
  {
    const formData = new FormData();
    formData.append(field, file || '');

    try
    {
      const updatedData = await updateProject(slug, formData);
      setDataProject((prevData) => ({
        ...prevData,
        [ field ]: updatedData[ field ] || prevData[ field ],
      }));
    } catch (error)
    {
      console.error("Error al subir/eliminar el archivo:", error);
    }
  };


  const handleAddDocument = async (name, file) =>
  {
    console.log(name);
    try
    {
      const response = await addDocument(name, file);
      console.log(response);
      setFiles((prevFiles) => [ ...prevFiles, { ...response, file, name } ]);
    } catch (error)
    {
      console.error("Error adding document:", error);
    }
  };

  const handleDeleteDocument = async (documentId) =>
  {
    try
    {
      await deleteDocument(documentId);
      setFiles((prevFiles) => prevFiles.filter((file) => file.id !== documentId));
    } catch (error)
    {
      console.error("Error deleting document:", error);
    }
  };

  const documentosType = dataProjectAdmin?.type?.documents || []

  const handleCompleteProject = async () =>
  {
    if (completingProject)
    {  // Solo ejecuta si completingProject es verdadero
      try
      {
        await updateProject(slug, { is_complete: true });
        setDataProject((prev) => ({
          ...prev,
          is_complete: true,
        }));
        setSuccessComplete("El proyecto se ha marcado como completo.");
        navigate('/dashboard/creacion_exitosa', { state: { origen: 'bancoProyecto', name: dataProject?.name } });
        setErrorComplete("");
      } catch (err)
      {
        console.error("Error al marcar el proyecto como completo:", err.message);
        setErrorComplete(err.message);
        setSuccessComplete("");
      }
    }
  };

  // Llamado cuando el botón de completar es clickeado
  const handleCompleteButtonClick = () =>
  {
    setCompletingProject(true);  // Establece el estado para permitir la ejecución
    handleCompleteProject();     // Ejecuta la función
  };

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
              <div className="col ">Publicado por: {dataProjectAdmin?.published_name} </div>
              <div className="col ">Fecha de creación: {dataProjectAdmin?.created}</div>
              <div className="col ">Fecha de publicación: {dataProjectAdmin?.published_date} </div>
              <div className="col ">Última modificación: {dataProjectAdmin?.modified}</div>
            </div>
            <div className="row my-3">
              <div className="col-4">
                {isCompleted ? (
                  <>
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
                  </>
                ) : (
                  <>
                    <div className="my-1">Estado de publicación</div>
                    <div className="incompleto-xl px-2 py-1">Proyecto Incompleto</div>
                  </>
                )}
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
                  {/* Modal de confirmación */}
                  <DeleteProjectModal
                    slug={dataProjectAdmin?.slug}
                    name={dataProjectAdmin?.name}
                    type="standard"
                  />
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
      {/* titulo del proyecto */}
      {isEditing ? (
        <div className="">
          <EditableTitle
            initialTitle={dataProject?.name}
            onSave={handleTitleSave}
            maxChars={200}
            minChars={10}
          />
        </div>
      ) : (
        <h1 className="text-sans-h1 my-md-5">{dataProjectAdmin?.name}</h1>
      )}
      {/* Descripcion del proyecto */}
      {isEditing ? (
        <>
          <div className="neutral-container py-3 px-3">
            <div className="d-flex justify-content-between">
              <label htmlFor="FormControlTextarea" className="form-label text-sans-h3 ms-1">Descripción del Proyecto (Obligatorio)</label>
              <button
                className="btn-principal-s d-flex text-sans-h4 pb-0 me-1"
                onClick={handleButtonClick}
                type="button"
              >
                <p className={editando ? "text-decoration-underline" : "text-decoration-underline"}>
                  {editando ? 'Guardar' : 'Editar'}
                </p>
                <i className="material-symbols-rounded ms-2 pt-1">
                  {editando ? 'save' : 'edit'}
                </i>
              </button>
            </div>
            {editando ? (
              <>
                <textarea
                  className="form-control my-3"
                  id="FormControlTextarea"
                  placeholder="Descripción del proyecto"
                  rows="7"
                  value={text}
                  onChange={handleTextChange}
                  maxLength="700"
                />
                <span className="text-sans-h5 m-0">{count}/700 caracteres.</span>
                {errorMessage && <p className="text-danger">{errorMessage}</p>}
              </>
            ) : (
              <p className="text-sans-h5 m-3">{text}</p>
            )}
          </div>
        </>
      ) : (
        <div className="neutral-container py-3 px-3">
          <p className="text-sans-h5">{dataProjectAdmin?.description}</p>
        </div>
      )}
      {/* Imágenes del proyecto */}
      <h2 className="text-sans-h2 my-5">Imágenes del proyecto</h2>
      {isEditing ? (
        <>
          <div className="mx-5">
            <div>Imagen Portada (Obligatorio)</div>
            <div className="img-xl-container">
              <UploadImg
                img={dataProject?.portada}
                onSave={handleSaveImage}
                tag='portada'
                title="Imagen Portada"
              />

            </div>
            <div className="text-sans-h5-blue info d-flex  align-content-center mt-2">
              <i className="material-symbols-outlined">
                info
              </i>
              <span className="ms-2 align-self-center">La foto de portada será la primera que se verá en la galería y en el buscador de proyectos.</span>
            </div>
          </div>
          {/*galeria imagenes */}
          <div className="mx-1">
            <UploadImgsm
              imgs={dataProject?.images}
              add={addImageGallery}
              delete={deleteImageGallery}
            />
          </div>
        </>
      ) : (
        <>
          <Carrusel imgPortada={dataProject?.portada} imgGeneral={dataProject?.images} />
        </>
      )}


      {/* Tabla detalles del proyecto */}
      <div className="detalles-proyecto my-4 mt-5">
        <h2 className="text-sans-h2-white ms-3">Detalles del proyecto</h2>
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
          <div className="col">
            <p className="text-sans-p"><strong>Código de identificación SUBDERE</strong></p>
            <p className="text-sans-p">{dataProjectAdmin?.idSubdere}</p>
          </div>
          <div className="col">
            <p className="text-sans-p"><strong>Tag Priorización</strong></p>
            <p className="text-sans-p">{dataProjectAdmin?.prioritized_tag?.prioritized_tag}</p>
          </div>
        </div>
      </div>

      {isEditing && (
        <ModalDetalles
          initialDetails={detallesEdit}
          setDetalles={setDetallesEdit}
          onGuardar={handleGuardarDetalles}
        />
      )}

      {/* Imágenes antes y después */}
      {isEditing ? (
        <>
          <div className="p-0 d-md-flex justify-content-between my-5 gap-1">
            <div className="col-md-6 img-l-container">
              <h3 className="text-sans-h3">Antes del proyecto</h3>
              <UploadImg
                img={dataProject?.beforeimage}
                onSave={handleSaveImage}
                tag='beforeimage'
                title='Imagen Antes'
              />
            </div>
            <div className="col-md-6 img-l-container">
              <h3 className="text-sans-h3">Antes del proyecto</h3>
              <UploadImg
                img={dataProject?.afterimage}
                onSave={handleSaveImage}
                tag='afterimage'
                title='Imagen Después'
              />
            </div>
          </div>
          <div className="text-sans-h5-blue info d-flex  align-content-center col-9 mt-5">
            <i className="material-symbols-outlined mt-5">
              info
            </i>
            <span className="ms-2 align-self-center me-5 mt-5">Si subes una foto de como se veia
              antes de la realización del proyecto, debes obligatoriamente subir
              una foto de como se ve después de su realización.</span>
          </div>
        </>) : (
        <>
          <div className="p-0 d-md-flex justify-content-between my-4">
            <div className="col-md-6">
              <h3 className="text-sans-h3">Antes del proyecto</h3>
              {beforeimage ? (
                <img src={beforeimage} className="img-proyecto" />
              ) : (
                <div className="img-section py-5">
                  <p>No hay imagen disponible</p>
                </div>
              )}
            </div>
            <div className="col-md-6 ">
              <h3 className="text-sans-h3">Después del proyecto</h3>
              {afterimage ? (
                <img src={afterimage} className="img-proyecto" />
              ) : (
                <div className="img-section py-5">
                  <p>No hay imagen disponible</p>
                </div>
              )}
            </div>
          </div>
        </>
      )
      }
      {
        isEditing ? (
          <>
            <div className="my-5 me-4 pe-4 py-3">
              <span className='text-sans-h2'>Video del proyecto</span>
              <p>(Máximo 1 enlace)</p>
              <div className="input-group ">
                <span className="input-group-text" id="basic-addon3">https://</span>
                <input
                  type="text"
                  className="form-control"
                  id="basic-url"
                  aria-describedby="basic-addon3 basic-addon4"
                  value={videoLink}
                  onChange={(e) => setVideoLink(e.target.value)}
                />
                <button
                  className="btn-principal-s d-flex mx-1"
                  type="button"
                  id="button-addon2"
                  onClick={handleVideoChange}
                >
                  <i className="material-symbols-outlined">upgrade</i>
                  <u className="align-self-center">Subir Link</u>
                </button>
              </div>
              {successMessage && (
                <div className=" d-flex flex-column text-sans-h5-blue ">
                  {successMessage}
                </div>
              )}
            </div>
          </>) : (
          <>
            {dataProjectAdmin?.video &&
              <>
                <h3 className="text-sans-h3">Video del proyecto</h3>
                <div className="d-flex justify-content-center mb-md-5">
                  <div className="col-md-7 img-proyecto" src={dataProject?.video} />
                </div>
              </>
            }</>)
      }
      <div className="my-5">
        <h2 className="text-sans-h2 my-4 mt-5">Documentos del proyecto</h2>
        {/* Tabla documentos del proyecto */}
        <span className="text-sans-h4 my-4 mt-5" >Documentos Obligatorios</span>
        <p>(Máximo 1 archivo, peso máximo de Planimetría 20MB, peso máximo de otros archivos 5 MB, formato PDF)</p>
        <div className="row my-4 fw-bold border-top">
          <div className="col-1 mt-3">#</div>
          <div className="col mt-3">Documento</div>
          <div className="col mt-3">Archivo</div>
          <div className="col mt-3">Acción</div>
        </div>
        {isEditing ? (
          <>
            <div className="row border-top">
              <DocumentsProjects
                index="1"
                description="Planimetría"
                fileType="No seleccionado"
                value={dataProject.planimetria}
                maxSize={20}
                fieldName="planimetria"
                onUpload={(file) => handleFileUpload('planimetria', file)}
              />
            </div>
          </>
        ) : (
          <div className="row border-top">
            <div className="col-1 p-3">1</div>
            <div className="col p-3">Planimetría</div>
            <div className="col p-3">PDF</div>
            <div className="col p-3">
              {/* Mostramos el enlace solo si el documento está disponible */}
              {dataProject?.planimetria && dataProject.planimetria.length > 0 ? (
                <a className="col p-3 text-sans-p-tertiary" href={dataProject.planimetria} target="_blank" rel="noopener noreferrer">
                  Ver Documento
                </a>
              ) : (
                'No hay documento disponible'
              )}
            </div>
          </div>
        )}

        {isEditing ? (
          <>
            <div className="row border-top">
              <DocumentsProjects
                index="2"
                description="Especificaciones Técnicas"
                fileType="No seleccionado"
                fieldName="eett"
                value={dataProject.eett}
                maxSize={5} // 5 MB
                onUpload={(file) => handleFileUpload('eett', file)}
              />
            </div>
          </>
        ) : (
          <div className="row border-top grey-table-line">
            <div className="col-1 p-3">2</div>
            <div className="col p-3">Especificaciones Técnicas</div>
            <div className="col p-3">PDF</div>
            <div className="col p-3">
              {dataProject?.eett && dataProject.eett.length > 0
                ? <a className="col p-3 text-sans-p-tertiary" href={dataProject?.eett} target="_blank" rel="noopener noreferrer">Ver Documento</a>
                : 'No hay documento disponible'}
            </div>
          </div>
        )}

        {isEditing ? (
          <>
            <div className="row border-top">
              <DocumentsProjects
                index="3"
                description="Presupuesto"
                fileType="No seleccionado"
                fieldName="presupuesto"
                value={dataProject?.presupuesto}
                maxSize={5} // 5 MB
                onUpload={(file) => handleFileUpload('presupuesto', file)}
              />
            </div>
          </>
        ) : (
          <>
            <div className="row border-top">
              <div className="col-1 p-3">3</div>
              <div className="col p-3">Presupuesto</div>
              <div className="col p-3">PDF</div>
              <div className="col p-3">
                {dataProject?.presupuesto && dataProject.presupuesto.length > 0
                  ? <a className="col p-3 text-sans-p-tertiary" href={dataProject?.presupuesto} target="_blank" rel="noopener noreferrer">Ver Documento</a>
                  : 'No hay documento disponible'}
              </div>
            </div>
          </>
        )}


      </div>
      {
        isEditing ? (
          <>
            <DocumentsAditionals
              documents={files}
              addDocument={handleAddDocument}
              deleteDocument={handleDeleteDocument}
            />
          </>
        ) : (
          <>
            <div>
              <div className="my-5">
                <span className="text-sans-h4 my-4 mt-5">Documentos Adicionales (Opcionales)</span>
                <p>(Número de archivos máximo, peso máximo 20 MB, formato libre)</p>
                <div className="row my-4 fw-bold border-top">
                  <div className="col-1 mt-3">#</div>
                  <div className="col mt-3">Documento</div>
                  <div className="col mt-3">Formato</div>
                  <div className="col mt-3">Acción</div>
                </div>
                {files?.map((file, index) => (
                  <div key={index} className={`row border-top ${index % 2 === 0 ? 'grey-table-line' : 'white-table-line'}`}>
                    <div className="col-1 p-3">{index + 1}</div>
                    <div className="col p-3">{file.name}</div>
                    <div className="col p-3">{file.file_format}</div>
                    <a className="col p-3 text-sans-p-tertiary" href={file.file} target="_blank" rel="noopener noreferrer">Ver Documento</a>
                  </div>
                ))}
              </div>
            </div>
          </>
        )
      }
      <h2 className="text-sans-h2 my-4 mt-5">Documentos con normativa de uso general</h2>
      <div className="d-flex text-sans-h5-blue align-items-center">
        <span className="material-symbols-outlined mx-2 ">
          info
        </span>
        Estos documentos están asociados al programa y tipo de proyecto que elegiste anteriormente y se suben automáticamente.</div>
      {/* Normativa por programa y tipo de proyecto */}
      {
        documentosType ? (
          <>
            <div className="row my-4 fw-bold border-top">
              <div className="col-1 mt-3">#</div>
              <div className="col mt-3">Documento</div>
              <div className="col mt-3">Formato</div>
              <div className="col mt-3">Acción</div>
            </div>
            {documentosType?.map((document, index) => (
              <div key={document.id} className={`row border-top ${index % 2 === 0 ? 'grey-table-line' : 'white-table-line'}`}>
                <div className="col-1 p-3">{index + 1}</div>
                <div className="col p-3">{document.title}</div>
                <div className="col p-3">{document.document_format}</div>
                <a className="col p-3 text-sans-p-tertiary" href={document.document} target="_blank" rel="noopener noreferrer">Ver Documento</a>
              </div>
            ))}
          </>
        ) : ("sin documentos diponibles")
      }

      {isEditing && (<>
        {!isCompleted ? (
          <div className="d-flex justify-content-end my-5 ">
            {successComplete && (
              <div className="alert-success mt-3">{successComplete}</div>
            )}
            {errorComplete && (
              <div className="text-sans-h5-red mt-3 mx-5">{errorComplete}</div>
            )}
            <button className="btn-principal-s d-flex text-sans-h4 pb-0 me-4"
              type="submit"
              onClick={handleCompleteButtonClick}>
              <p className="text-decoration-underline">Completar Proyecto </p>
              <i className="material-symbols-rounded ms-2">arrow_forward_ios</i>
            </button>
          </div>) : ("")
        }
      </>)}
    </div >
  )
}

export default EditarProyecto; 