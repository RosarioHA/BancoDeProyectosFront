import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useUpdateInnovative } from "../../../../hooks/innovativeProject/useUpdateInnovative";
import { useInnovativeDetailAdmin } from "../../../../hooks/innovativeProject/useInnovativeDetail"
import { UseApiPrograms } from '../../../../hooks/usePrograms';
import Carrusel from "../../../../components/Commons/carrusel";
import UploadImg from "../../../../components/Commons/UploadImg";
import UploadImgsm from "../../../../components/Commons/UploadImgsm";
import { EditableTitle } from "../../../../components/Tables/InputTitle";
import ModalAgregarFuente from "../../../../components/Modals/ModalAgregarFuente";
import ModalEditarFuente from "../../../../components/Modals/ModalEditarFuente";
import { useGalleryInnovative } from "../../../../hooks/innovativeProject/useGalleryInnovative";
import { DeleteProjectModal } from "../../../../components/Modals/EliminarProyecto";
import { useAuth } from '../../../../context/AuthContext';

const EditarInnovador = () =>
{
  const { id } = useParams();
  const { userData } = useAuth();
  const history = useNavigate();
  const { updateInnovative } = useUpdateInnovative()
  const { dataInnovativeAdmin, fetchInnovativeAdminData } = useInnovativeDetailAdmin(id);
  const { dataPrograms } = UseApiPrograms();
  const { deleteImage, addImage } = useGalleryInnovative(id)
  // const [ loading, setLoading ] = useState(true); 
  // const [ error, setError ] = useState(null);
  const [ innovativeData, setInnovativeData ] = useState(null);
  const [ isPublished, setIsPublished ] = useState(null);
  const [ text, setText ] = useState('');
  const [ count, setCount ] = useState(0);
  const [ errorComplete, setErrorComplete ] = useState(null);
  const [ successComplete, setSuccessComplete ] = useState('');
  const [ webSource, setWebSource ] = useState();
  const [ isEditing, setIsEditing ] = useState(false);
  const [ editando, setEditando ] = useState(false);
  const [ successMessage, setSuccessMessage ] = useState('');
  const [ errorMessage, setErrorMessage ] = useState(null);
  const [ editingMessage, setEditingMessage ] = useState("Editar proyecto");
  const [ completingProject, setCompletingProject ] = useState(false);
  const [ selectedProgram, setSelectedProgram ] = useState();
  const [ message, setMessage ] = useState({ type: "", text: "" });
  const isCompleted = dataInnovativeAdmin?.is_complete;
  const userEditor = userData?.perfil?.includes("Editor");

  console.log(successMessage)
  console.log(userData)
  useEffect(() =>
  {
    if (dataInnovativeAdmin)
    {
      setIsPublished(dataInnovativeAdmin?.public);
      setText(dataInnovativeAdmin?.description || '');
      setCount(dataInnovativeAdmin?.description?.length || 0);
      setWebSource(dataInnovativeAdmin?.web_source || '');
      // Cargar detalles iniciales
      setInnovativeData((prev) => ({
        ...prev,
        ...dataInnovativeAdmin,
      }));
    }
  }, [ dataInnovativeAdmin ]);
  console.log(webSource)

  useEffect(() =>
  {
  }, [ innovativeData ]);

  useEffect(() =>
  {
    setSuccessMessage('');
  }, [ isEditing ]);

  // Inicializar datos y programa seleccionado
  useEffect(() =>
  {
    if (dataInnovativeAdmin)
    {
      setInnovativeData(dataInnovativeAdmin);
      setSelectedProgram(dataInnovativeAdmin.program?.id || "");
    }
  }, [ dataInnovativeAdmin ]);


  // Limpiar mensaje de éxito al editar
  useEffect(() =>
  {
    if (isEditing)
    {
      setMessage({ type: "", text: "" });
    }
  }, [ isEditing ]);

  const handleProgramChange = async (e) =>
  {
    const programId = e.target.value;
    setSelectedProgram(programId); // Actualizar el estado local
    setMessage({ type: "", text: "" }); // Limpiar mensajes previos

    try
    {
      await updateInnovative(id, { program: programId }); // Enviar solo el ID
      setMessage({ type: "success", text: "Programa actualizado exitosamente." });

      // Actualizar el programa en los datos locales
      setInnovativeData((prev) => ({
        ...prev,
        program: dataPrograms.find((p) => p.id.toString() === programId),
      }));
    } catch (error)
    {
      console.error("Error al actualizar el programa:", error);
      setMessage({ type: "error", text: "No se pudo actualizar el programa." });
    }
  };

  // Solo actualizar webSource con el valor correcto si dataInnovativeAdmin tiene web_sources
  useEffect(() =>
  {
    if (dataInnovativeAdmin?.web_sources)
    {
      setWebSource(dataInnovativeAdmin.web_sources);
    }
  }, [ dataInnovativeAdmin ]);

  const handleWebSourceUpdate = async () =>
  {
    try
    {
      const updatedData = await fetchInnovativeAdminData(id);
      setWebSource(updatedData?.web_sources || []);
      setInnovativeData((prev) => ({
        ...prev,
        web_sources: updatedData?.web_sources || [],
      }));
    } catch (error)
    {
      console.error("Error al actualizar las fuentes:", error);
    }
  };

  const handleEditButtonClick = () =>
  {
    setIsEditing((prev) =>
    {
      const newEditingState = !prev;
      setEditingMessage(newEditingState ? "Editando proyecto" : "Editar proyecto");
      if (newEditingState && dataInnovativeAdmin)
      {
        setInnovativeData((prevData) => ({
          ...prevData,
          ...dataInnovativeAdmin
        }));
      }
      return newEditingState;
    });
  };

  const handleTitleSave = async (newTitle) =>
  {
    try
    {
      const updatedData = await updateInnovative(id, { title: newTitle });
      setInnovativeData((prev) => ({ ...prev, title: updatedData.title }));
    } catch (error)
    {
      console.error("Error al actualizar el título del proyecto:", error);
    }
  };

  const handleTextChange = (e) =>
  {
    const newText = e.target.value;
    setText(newText);
    setCount(newText.length);
  };

  const handleButtonClick = async () =>
  {
    setErrorMessage(null);
    if (editando)
    {
      if (text.length > 2000)
      {
        setErrorMessage('El texto no puede superar los 2000 caracteres.');
        return;
      }
      if (text.trim().length === 0)
      {
        setErrorMessage('No puede guardar un texto vacío.');
        return;
      }

      try
      {
        const updatedData = await updateInnovative(id, { description: text });
        setInnovativeData((prev) => ({ ...prev, description: updatedData.description }));
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

  const handleStatusChange = async (status) =>
  {
    setIsPublished(status);
    try
    {
      const updatedData = await updateInnovative(id, { public: status });
      setInnovativeData((prev) => ({ ...prev, public: updatedData.public }));
    } catch (error)
    {
      console.error("Error al actualizar el estado de publicación:", error);
    }
  };
  // Maneja el botón de volver atrás
  const handleBackButtonClick = () =>
  {
    history(-1);
  };

  const handleSaveImage = async (formData) =>
  {
    try
    {
      const updatedData = await updateInnovative(id, formData);

      setInnovativeData((prev) =>
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
      setInnovativeData((prev) => ({
        ...prev,
        innovative_gallery_images: [ ...prev.innovative_gallery_images, newImage ],
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
      setInnovativeData((prev) => ({
        ...prev,
        innovative_gallery_images: prev.innovative_gallery_images.filter((img) => img.id !== imageId),
      }));
    } catch (error)
    {
      console.error("Error al eliminar la imagen:", error);
    }
  };


  // if (loading)
  // {
  //   return <div className="d-flex align-items-center flex-column my-5">
  //     <div className="text-center text-sans-h5-blue">Cargando proyecto innovador</div>
  //     <span className="placeholder col-4 bg-primary">
  //     </span>
  //   </div>
  // }
  // if (error)
  // {
  //   return <div>Error: {error}</div>; // Mostrar un mensaje de error si ocurre
  // }

  const handleCompleteProject = async () =>
  {
    if (completingProject)
    {  // Solo ejecuta si completingProject es verdadero
      try
      {
        await updateInnovative(id, { is_complete: true });
        setInnovativeData((prev) => ({
          ...prev,
          is_complete: true,
        }));
        setSuccessComplete("El proyecto se ha marcado como completo.");
        history('/dashboard/creacion_exitosa', { state: { origen: 'ProyectosInnovadores', name: innovativeData?.title } });
        setErrorComplete("");
      } catch (err)
      {
        console.error("Error al marcar el proyecto como completo:", err.message);
        setErrorComplete(err.message);
        setSuccessComplete("");
      }
    }
  };

  const handleCompleteButtonClick = () =>
  {
    setCompletingProject(true);  // Establece el estado para permitir la ejecución
    handleCompleteProject();     // Ejecuta la función
  };

  return (
    <div className="container view-container ms-5">
      <h1 className="text-sans-h2 mb-3 mt-2">Proyectos Innovadores: Ver detalles</h1>
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
              <div className="col ">Creado por: {innovativeData?.author_name || ''}</div>
              <div className="col ">Publicado por: {innovativeData?.published_name || ''}  </div>
              <div className="col ">Fecha de creación: {innovativeData?.created || ''}</div>
              <div className="col ">Fecha de publicación: {innovativeData?.published_date || ''} </div>
              <div className="col ">Última modificación: {innovativeData?.modified || ''}</div>
            </div>
            <div className="row my-3">
              <div className="col-4">
                {userEditor ? (
                  <div className="col-4">
                    {isCompleted ? (
                      <>
                        <div>Cambiar estado de publicación</div>
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
                ) : (
                  <>
                    <div className="my-1">Estado de publicación</div>
                    {isCompleted ? (
                      <>
                        <div className="d-flex my-2">
                          {isPublished === true ? (
                            <span
                              className="publicado px-3 py-2 mx-2 my-2">
                              Publicado
                            </span>
                            ) : (
                            <span
                              className="privado px-3 py-2 mx-2 my-2"
                            >
                              Privado
                            </span>
                          )}
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="incompleto px-2 py-1">Proyecto Incompleto</div>
                      </>
                    )}
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
                    slug={dataInnovativeAdmin?.id}
                    name={dataInnovativeAdmin?.title}
                    buttonText="innovadores"
                    type="innovative"
                  />
                </div>
              </div>
            </div>
          </div>

        </div>
      </div >

      {/* Descripcion del proyecto */}
      <div className="container col-10 view-container" >
        <h2 className="text-sans-h2 mt-4 mb-4">Editar Proyecto: Proyectos Innovadores</h2>

        <div className="container mb-4">

          <div>
            {isEditing ? (
              <div>
                <p className="text-sans-p">Este proyecto corresponde al programa:</p>
                <select
                  className="custom-selector p-3"
                  id="program-select"
                  value={selectedProgram}
                  onChange={handleProgramChange}
                >
                  <option value="">Seleccionar Programa</option>
                  {dataPrograms &&
                    dataPrograms.map((program) => (
                      <option key={program.id} value={program.id}>
                        {program.name} {/* Mostrar el nombre del programa */}
                      </option>
                    ))}
                </select>

                {/* Mensaje de éxito o error */}
                {message.text && (
                  <p
                    className={`mt-2 ${message.type === "success" ? "text-green-500" : "text-red-500"
                      }`}
                  >
                    {message.text}
                  </p>
                )}
              </div>
            ) : (
              <div>
                <span className="text-sans-h5-grey">Este proyecto corresponde al programa:</span>
                <p className="text-sans-h35">{innovativeData?.program?.name}</p>
              </div>
            )}
            {/* titulo del proyecto */}
            {isEditing ? (
              <div className="">
                <EditableTitle
                  initialTitle={innovativeData?.title}
                  onSave={handleTitleSave}
                  maxChars={700}
                  minChars={10}
                />
              </div>
            ) : (
              <h4 className="text-sans-h3 text-center text-md-start mt-5">
                {innovativeData?.title}
              </h4>)}
          </div>
          <div className="d-flex">
            <div className="col-5">
              {/* Descripcion del proyecto */}
              {isEditing ? (
                <>
                  <div className="d-flex justify-content-between">
                    <label htmlFor="FormControlTextarea" className="form-label text-sans-h3 ms-1">Descripción del Proyecto (Obligatorio)</label>

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
                        maxLength="2000"
                      />
                      <span className="text-sans-h5 m-0">{count}/2000 caracteres.</span>
                      {errorMessage && <p className="text-danger">{errorMessage}</p>}
                    </>
                  ) : (
                    <p className="text-sans-h5 m-3">{text}</p>
                  )}
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
                </>
              ) : (
                <p className="text-sans-p ">{innovativeData?.description}</p>
              )}
            </div>
            <div className="col-9">
              {isEditing ? (
                <>
                  <div className="mx-5">
                    <div>Imagen Portada (Obligatorio)</div>
                    <div className="">
                      <UploadImg
                        img={innovativeData?.portada}
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
                  <div className="ms-5">
                    <UploadImgsm
                      imgs={innovativeData?.innovative_gallery_images}
                      add={addImageGallery}
                      delete={deleteImageGallery}
                    />
                  </div>
                </>
              ) : (

                <Carrusel
                  imgPortada={innovativeData?.portada}
                  imgGeneral={innovativeData?.innovative_gallery_images}
                  context="proyectosInnovadores"
                />
              )}
            </div>

          </div>
        </div>


        <div className="col ms-3">
          <div className="form-label text-sans-h3 ms-1">Fuentes {isEditing ? '(Obligatorio)' : ''}</div>
          {isEditing ? (
            <>
              {innovativeData?.web_sources?.length > 0 ? (
                <>
                  <div className="d-flex flex-column">
                    {innovativeData?.web_sources.map((source, index) => (
                      <div key={source?.id} className="d-flex justify-content-between my-2">
                        <div>
                          {/* Aquí se muestra el link de la fuente */}
                          <a href={source?.url} target="_blank" rel="noopener noreferrer">
                            Visitar fuente {index + 1}
                          </a>
                        </div>

                        {/* Modal para editar la fuente */}
                        <ModalEditarFuente
                          key={`modal-${source.id}`}
                          sourceId={source.id}
                          projectId={id}
                          webSource={source}
                          onRefresh={handleWebSourceUpdate}
                        />
                      </div>
                    ))}
                  </div>
                  <ModalAgregarFuente
                    projectId={id}
                    onRefresh={handleWebSourceUpdate}
                  />
                </>
              ) : (
                <ModalAgregarFuente
                  projectId={id}
                  onRefresh={handleWebSourceUpdate}
                />
              )}
            </>
          ) : (
            <>
              {innovativeData?.web_sources?.length >= 1 ? (
                <>
                  <div className="d-flex flex-column">

                    {innovativeData?.web_sources.map((source, index) => (
                      <a key={source.id} href={source.url} target="_blank" rel="noopener noreferrer">
                        Visitar fuente {index + 1}
                      </a>
                    ))}
                  </div>
                </>
              ) : (
                <div className="mx-2">No hay fuentes disponibles</div>
              )}
            </>
          )}
        </div>
      </div>
      <div className="my-5">
        {isEditing && (
          <>
            {!isCompleted ? (
              <div className="d-flex justify-content-end my-5 mx-5">
                {successComplete && (
                  <div className="alert-success mt-3">{successComplete}</div>
                )}
                {errorComplete && (
                  <div className="text-sans-h5-red mt-3 mx-5">{errorComplete}</div>
                )}
                <button className="btn-principal-s d-flex text-sans-h4 pb-0 me-4"
                  onClick={handleCompleteButtonClick}>
                  <p className="text-decoration-underline">Completar Proyecto</p>
                  <i className="material-symbols-rounded ms-2">arrow_forward_ios</i>
                </button>
              </div>) : ("")
            }
          </>)}
      </div>
    </div >
  )
}


export default EditarInnovador; 