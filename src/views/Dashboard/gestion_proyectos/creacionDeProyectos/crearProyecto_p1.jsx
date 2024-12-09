import { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { useApiProjectsDetailAdmin } from "../../../../hooks/proyectos/useApiProjectDetailAdmin";
import { useApiUpdateProject } from "../../../../hooks/proyectos/useUpdateProject"
import { useGalleryProject } from "../../../../hooks/proyectos/useGalleryProject";
import { useDocumentsAdicional } from "../../../../hooks/proyectos/useDocumentsAdicional";
import { EditableTitle } from "../../../../components/Tables/InputTitle";
import { ModalDetalles } from "../../../../components/Modals/ModalDetalles";
import UploadImg from "../../../../components/Commons/UploadImg";
import UploadImgsm from "../../../../components/Commons/UploadImgsm";
import { DocumentsProjects } from "../../../../components/Tables/DocumentsProjects";
import DocumentsAditionals from "../../../../components/Commons/DocumentsAditionals";
import { Desechar } from "../../../../components/Modals/desechar";
const CrearProyectoP1 = () =>
{
  const location = useLocation()
  const { slug } = useParams();
  const { dataProjectAdmin, loadingProject, errorProject, fetchProjectAdminData } = useApiProjectsDetailAdmin(slug);
  const { updateProject } = useApiUpdateProject();
  const { deleteImage, addImage } = useGalleryProject(slug);
  const { addDocument, deleteDocument } = useDocumentsAdicional(slug) || [];

  const [ dataProject, setDataProject ] = useState(null);
  const [ editando, setEditando ] = useState(false);
  const [ text, setText ] = useState('');
  const [ count, setCount ] = useState(0);
  const [ errorMessage, setErrorMessage ] = useState(null);
  const [ detalles, setDetalles ] = useState({});
  const [ videoLink, setVideoLink ] = useState('');
  const [ successMessage, setSuccessMessage ] = useState('');
  const [ previousLink, setPreviousLink ] = useState('');
  const [ files, setFiles ] = useState([] || '');
  const navigate = useNavigate();
  const projectData = location.state?.project;

  useEffect(() =>
  {
    if (dataProjectAdmin)
    {
      setText(dataProjectAdmin?.description || '');
      setCount(dataProjectAdmin?.description?.length || 0);
      setVideoLink(dataProjectAdmin?.video || '');
      setFiles(dataProjectAdmin?.files || []);
      // Cargar detalles iniciales
      setDetalles({
        programa: dataProjectAdmin?.program?.name || 'No Seleccionado',
        tipoProyecto: dataProjectAdmin?.type?.name || 'No Seleccionado',
        region: dataProjectAdmin?.comuna?.region || 'No Seleccionado',
        comuna: dataProjectAdmin?.comuna?.comuna || 'No Seleccionado',
        year: dataProjectAdmin?.year?.number || 's/n',
        idSubdere: dataProjectAdmin?.id_subdere || 'No Ingresado',
        tag: dataProjectAdmin?.prioritized_tag?.prioritized_tag || "No Seleccionado"
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
      setDetalles((prev) => ({ ...prev, ...newDetails }));
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
      const updatedData = await updateProject(slug, videoData); // Llamada a la API para actualizar el proyecto
      setDataProject((prev) => ({ ...prev, video: updatedData.video }));

      // Solo mostrar el mensaje si hubo cambios en el enlace
      if (videoLink !== previousLink)
      {
        setSuccessMessage('Link guardado exitosamente');
        setPreviousLink(videoLink); // Actualizar el enlace anterior
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

  const handleCompleteProject = async () =>
  {
    try
    {
      await updateProject(slug, { is_complete: true });
      setDataProject((prev) => ({
        ...prev,
        is_complete: true
      }));
      setSuccessMessage("El proyecto se ha marcado como completo.");
      // Redirigir a la siguiente vista
      navigate('/dashboard/creacion_exitosa', { state: { origen: projectData.projectType, name: dataProject?.name } });
    } catch (error)
    {
      console.error("Error al marcar el proyecto como completo:", error);
      setErrorMessage("No se pudo marcar el proyecto como completo.", error);
    }
  };

  const documentosType = dataProjectAdmin?.type?.documents || [];

  return (
    <div className="container col-11 ms-5 my-5">
      <div className="row px-3 mx-3 my-5">
        <h2 className="text-sans-h2 mt-4 mb-5 ">Subir Proyecto: Banco de Proyectos</h2>

        <>
          <EditableTitle
            initialTitle={dataProject?.name || ""}
            onSave={handleTitleSave}
            maxChars={200}
            minChars={10}
          />
        </>

        {/* Descripción */}
        <>
          <div className="neutral-container py-3 px-3">
            <div className="d-flex justify-content-between">
              <label htmlFor="FormControlTextarea" className="form-label text-sans-h3 ms-1">Descripción del Proyecto</label>
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
        <span className='text-sans-h2'>Imágenes del proyecto</span>
        {/* imagen portada  */}
        <>
          <div className="mx-5">
            <div>Imagen Portada</div>
            <div className="img-xl-container">
              <UploadImg
                img={dataProject?.portada || ""}
                onSave={handleSaveImage}
                tag='portada'
                title='Imagen Portada'
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
              imgs={dataProject?.images || []}
              add={addImageGallery}
              delete={deleteImageGallery}
            />
          </div>
        </>
        <div className="detalles-proyecto my-4 mt-5">
          <h2 className="text-sans-h2-white ms-3">Detalles del proyecto</h2>
          <div className="ms-3">
            <div className="row">
              <div className="col">
                <p className="text-sans-p"><strong>Programa</strong></p>
                <p className="text-sans-p">{dataProjectAdmin?.program?.name || "No Seleccionado"}</p>
              </div>

              <div className="col">
                <p className="text-sans-p"><strong>Tipo de proyecto</strong></p>
                <p className="text-sans-p">{dataProjectAdmin?.type?.name || "No Seleccionado"}</p>
              </div>
            </div>

            <div className="row">
              <div className="col">
                <p className="text-sans-p"><strong>Región</strong></p>
                <p className="text-sans-p">{dataProjectAdmin?.comuna?.region || "No Seleccionado"}</p>
              </div>

              <div className="col">
                <p className="text-sans-p"><strong>Comuna</strong></p>
                <p className="text-sans-p">{dataProjectAdmin?.comuna?.comuna || "No Seleccionado"}</p>
              </div>

              <div className="col">
                <p className="text-sans-p"><strong>Año de construcción</strong></p>
                <p className="text-sans-p">{dataProjectAdmin?.year?.number || "No Seleccionado"}</p>
              </div>
            </div>

            <div className="row">
              <div className="col">
                <p className="text-sans-p"><strong>Código de identificación SUBDERE</strong></p>
                <p className="text-sans-p">{dataProjectAdmin?.id_subdere || "No Seleccionado"}</p>
              </div>
              <div className="col">
                <p className="text-sans-p"><strong>Tag Priorización</strong></p>
                <p className="text-sans-p">{dataProjectAdmin?.prioritized_tag?.prioritized_tag || "No Seleccionado"}</p>
              </div>
            </div>
          </div>
          <ModalDetalles
            initialDetails={detalles}
            setDetalles={setDetalles}
            onGuardar={handleGuardarDetalles}
          />
          <>
            {/* imagenes antes-despues*/}
            <span className='text-sans-h3'>Antes del proyecto</span>
            <div className="text-sans-h5-blue info d-flex  align-content-center col-9">
              <i className="material-symbols-outlined">
                info
              </i>
              <span className="ms-2 align-self-center me-5">Si subes una foto de como se veia antes de la realización del proyecto, debes obligatoriamente subir una foto de como se ve después de su realización.</span></div>
            <div>
              <div className="img-xl-container mb-4">
                <UploadImg
                  img={dataProjectAdmin?.beforeimage || ""}
                  onSave={handleSaveImage}
                  tag='beforeimage'
                  title='Imagen Antes'
                />
              </div>
              <span className='text-sans-h3'>
                Después del proyecto</span>
              <div className="img-xl-container">
                <UploadImg
                  img={dataProjectAdmin?.afterimage || ""}
                  onSave={handleSaveImage}
                  tag='afterimage'
                  title='Imagen Después'
                />
              </div>
            </div>
          </>
          {/* Input link video  */}
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
                  value={videoLink || ""}
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
          </>
          {/* Tabla documentos obligatorios */}
          <div className="my-5">
            <span className='text-sans-h2'>Documentos del proyecto</span>
            <p className='text-sans-h3 mt-4'>Documentos Obligatorios</p>
            <p>( Planimetria: peso máximo 20 MB, Especificaciones Técnicas y Presupuesto: peso máximo 5 MB, formato PDF)</p>
            <div className="row my-4 fw-bold border-top">
              <div className="col-1 mt-3">#</div>
              <div className="col mt-3">Documento</div>
              <div className="col mt-3">Formato</div>
              <div className="col mt-3">Acción</div>
            </div>
            <div className="row border-top grey-table-line align-items-center">
              <DocumentsProjects
                index="1"
                description="Planimetría"
                fileType="No seleccionado"
                value={dataProject.planimetria || ""}
                maxSize={20}
                fieldName="planimetria"
                onUpload={(file) => handleFileUpload('planimetria', file)}
              />
            </div>
            <div className="row border-top align-items-center">
              <DocumentsProjects
                index="2"
                description="Especificaciones Técnicas"
                fileType="No seleccionado"
                fieldName="eett"
                value={dataProject.eett || ""}
                maxSize={5} // 5 MB
                onUpload={(file) => handleFileUpload('eett', file)}
              />
            </div>
            <div className="row border-top grey-table-line align-items-center">
              <DocumentsProjects
                index="3"
                description="Presupuesto"
                fileType="No seleccionado"
                fieldName="presupuesto"
                value={dataProject?.presupuesto || ""}
                maxSize={5} // 5 MB
                onUpload={(file) => handleFileUpload('presupuesto', file)}
              />
            </div>
          </div>
          {/* Tabla documentos adicionales */}
          <div className="my-5 me-5 pe-3">
            <DocumentsAditionals
              documents={files || ""}
              addDocument={handleAddDocument}
              deleteDocument={handleDeleteDocument}
            />
          </div>
          {/* Tabla documentos normativa general */}
          <>
            <div className="my-5 me-5 pe-3">
              <span className='text-sans-h2'>Documentos con normativa de uso general</span>
              <div className="text-sans-h5-blue info d-flex align-content-center">
                <i className="material-symbols-outlined">
                  info
                </i>
                <span className="ms-2 align-self-center">Estos documentos están asociados al programa y tipo de proyecto que elegiste anteriormente y se suben automáticamente.</span>
              </div>
              <>

                <div className="row my-4 fw-bold border-top">
                  <div className="col-1 mt-3">#</div>
                  <div className="col mt-3">Documento</div>
                  <div className="col mt-3">Formato</div>
                  <div className="col mt-3">Acción</div>
                </div>
                {documentosType?.map((document, index) => (
                  <div key={document.id || ""} className={`row border-top ${index % 2 === 0 ? 'grey-table-line' : 'white-table-line'}`}>
                    <div className="col-1 p-3">{index + 1}</div>
                    <div className="col p-3">{document.title || ""}</div>
                    <div className="col p-3">{document.document_format || ""}</div>
                    <a className="col p-3 text-sans-p-tertiary" href={document.document || ""} target="_blank" rel="noopener noreferrer">Ver Documento</a>
                  </div>
                ))}
              </>
            </div>
          </>
          <div className="col-10  d-flex  justify-content-between mx-auto  my-5 py-5">
            <Desechar
              slug={dataProjectAdmin?.slug}
              name={dataProjectAdmin?.name}
              type="standard"
              text=''
            />
            {successMessage && (
              <div className="alert-success mt-3">{successMessage}</div>
            )}
            {errorMessage && (
              <div className="text-sans-h5-red mt-3 mx-5">{errorMessage}</div>
            )}
            <button className="btn-principal-s d-flex text-sans-h4 pb-0 me-4"
              type="button"
              onClick={handleCompleteProject}>
              <p className="text-decoration-underline">Crear Proyecto </p>
              <i className="material-symbols-rounded ms-2">arrow_forward_ios</i>
            </button>
          </div>
        </div>
      </div>
    </div >
  )
}

export default CrearProyectoP1; 