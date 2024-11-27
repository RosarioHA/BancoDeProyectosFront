import { useState, useEffect } from "react";
import { useNavigate, useLocation, useParams } from "react-router-dom"
import ModalAgregarFuente from "../../../../components/Modals/ModalAgregarFuente";
import ModalEditarFuente from "../../../../components/Modals/ModalEditarFuente";
import UploadImg from "../../../../components/Commons/UploadImg";
import UploadImgsm from "../../../../components/Commons/UploadImgsm";
import useApiInnovativeProjects from "../../../../hooks/innovativeProject/useInnovativeAdminDetail";
import { useUpdateInnovative } from "../../../../hooks/innovativeProject/useUpdateInnovative";
import { UseApiPrograms } from "../../../../hooks/usePrograms";
import { EditableTitle } from "../../../../components/Tables/InputTitle";
// import { useAuth } from '../../../../context/AuthContext';
import useGalleryInnovative from '../../../../hooks/useGalleryInovative';
import { useInnovativeDetailAdmin } from '../../../../hooks/innovativeProject/useInnovativeDetail';
import { useDeleteInnovative } from "../../../../hooks/innovativeProject/useDeleteInnovative";
import { Desechar } from "../../../../components/Modals/desechar";

const CrearProyectoInnovadorP1 = () =>
{
  // const { userData } = useAuth();
  const location = useLocation()
  const { id } = useParams();
  const projectData = location.state;
  // const isEditorOrSuperuser = [ 'Superusuario', 'Editor General' ].includes(userData.tipo_de_usuario);
  const [ projectId, setProjectId ] = useState();
  const { updateInnovative } = useUpdateInnovative()
  const { dataInnovativeAdmin, fetchInnovativeAdminData } = useInnovativeDetailAdmin(id);
  const { updateInnovativeProject, deleteInnovativeProject } = useApiInnovativeProjects();
  const { dataPrograms } = UseApiPrograms();
  const { deleteImage, addImage } = useGalleryInnovative(id)
  const { deleteInnovative, loading, error, success } = useDeleteInnovative();

  const [ completingProject, setCompletingProject ] = useState(false);
  const [ innovativeData, setInnovativeData ] = useState(null);
  const [ selectedProgram, setSelectedProgram ] = useState();
  const [ successMessage, setSuccessMessage ] = useState('');
  const [ successComplete, setSuccessComplete ] = useState('');
  const [ errorComplete, setErrorComplete ] = useState(null);
  const [ errorMessage, setErrorMessage ] = useState(null);
  const [ editando, setEditando ] = useState(false);
  const [ text, setText ] = useState('');
  const [ count, setCount ] = useState(0);
  const [ webSource, setWebSource ] = useState();
  const [ message, setMessage ] = useState({ type: "", text: "" });



  const [ inputTitle, setInputTitle ] = useState(projectData?.title || '');
  const [ inputDescr, setInputDescr ] = useState('');
  const [ isEditingTitle, setIsEditingTitle ] = useState(false);
  const [ showTitleErrorMessage, setShowTitleErrorMessage ] = useState(false);
  const [ isEditingDescr, setIsEditingDescr ] = useState(false);
  const [ showDescrError, setShowDescrError ] = useState(false);
  const [ currentProjectId, setCurrentProjectId ] = useState(null);
  const [ maxDescChars ] = useState(700); // Maximo de caracteres para la descripcion
  const [ descCharsCount, setDescCharsCount ] = useState(0);
  const [ descCharsExceeded, setDescCharsExceeded ] = useState(false);

  const [ coverImages, setCoverImages ] = useState([]);
  console.log(coverImages)

  console.log(dataInnovativeAdmin)

  console.log(projectData)

  // Inicializar datos y programa seleccionado
  useEffect(() =>
  {
    if (dataInnovativeAdmin)
    {
      setInnovativeData(dataInnovativeAdmin);
      setSelectedProgram(dataInnovativeAdmin.program?.id || "");
    }
  }, [ dataInnovativeAdmin ]);



  const handleSaveClick = async (input, setEditing, setShowError, updateFunction, field) =>
  {
    const trimmedText = input.trim();
    if (trimmedText)
    {
      if (currentProjectId)
      {
        const updateData = {
          [ field ]: trimmedText,
        };
        try
        {
          await updateFunction(currentProjectId, updateData);
          setEditing(false);
          setShowError(false);
        } catch (error)
        {
          console.error(`Error al actualizar ${field}:`, error);
          // Maneja el error según sea necesario
        }
      } else
      {
        console.log("ID del proyecto no definido");
      }
    } else
    {
      setShowError(true);
    }
  };



  // Maneja boton de volver atras
  const history = useNavigate();

  const handleBackButtonClick = () =>
  {
    history(-1);
  };


  useEffect(() =>
  {
    const projectId = new URLSearchParams(window.location.search).get('id');
    if (projectId)
    {
      setProjectId(projectId);
    }
  }, []);








  // LOGICA TITULO
  // Maneja cambios en el input Titulo y actualiza el estado.
  const handleInputChange = (event, setInput, setCount, setExceeded, maxChars) =>
  {
    const text = event.target.value;
    if (text.length <= maxChars)
    {
      setInput(text);
      setCount(text.length);
      setExceeded(false);
    } else
    {
      setExceeded(true);
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

  const handleWebSourceUpdate = async () =>
  {
    try
    {
      const updatedData = await fetchInnovativeAdminData(id); // Asegúrate de tener un método para refrescar datos.
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




  const handleDescrInputChange = (event) => handleInputChange(event, setInputDescr, setDescCharsCount, setDescCharsExceeded, maxDescChars);
  const handleSaveDescrClick = () => handleSaveClick(inputDescr, setIsEditingDescr, setShowDescrError, updateInnovativeProject, 'description', projectId);


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

  const handleDeleteProjectClick = async () =>
  {
    if (id)
    {
      const confirmDeletion = window.confirm("¿Estás seguro de que quieres eliminar este proyecto?");
      if (confirmDeletion)
      {
        await deleteInnovative(id);
        console.log("Proyecto eliminado");
        history(-1);
      }
    } else
    {
      console.log("ID del proyecto no definido");
    }
  };






  return (
    <div className="container col-10 view-container">
      <h2 className="text-sans-h2 mt-4 mb-4">Subir Proyecto: Proyectos Innovadores</h2>

      <button className="btn-secundario-s d-flex mb-4" onClick={handleBackButtonClick}>
        <i className="material-symbols-rounded me-2">arrow_back_ios</i>
        <p className="mb-0 text-decoration-underline">Volver atrás</p>
      </button>

      <div className="container mb-4">
        <div className="dropdown-program-select">
          <>
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
          </>
        </div>
      </div>

      <div className="row">
        <div className="col-5">
          {/* Titulo */}
          <div className="">
            <EditableTitle
              initialTitle={innovativeData?.title}
              onSave={handleTitleSave}
              maxChars={700}
              minChars={10}
            />
          </div>

          {/* Descripcion */}
          <div className="container">
            {isEditingDescr ? (
              // Modo de edición
              <>
                <div className="d-flex flex-column my-4">
                  <h3 className="text-sans-h3">Descripción del proyecto</h3>
                  <textarea
                    className="description-input text-sans-p container ghost-input"
                    placeholder="Descripción del proyecto"
                    value={inputDescr}
                    onChange={handleDescrInputChange}
                  />
                  <p className={`text-sans-h5 ${descCharsExceeded ? "text-sans-h5-red" : ""}`}>{descCharsCount} / {maxDescChars} caracteres</p>
                  <button
                    className="btn-principal-s d-flex text-sans-h4 pb-0 px-3"
                    onClick={handleSaveDescrClick}
                  >
                    <p className="text-sans-p-white text-decoration-underline">Guardar</p>
                    <i className="material-symbols-rounded ms-2 pt-1">save</i>
                  </button>
                </div>

                {showDescrError && (
                  <p className="text-sans-h5-red mt-1">Debes ingresar la descripción del proyecto antes de continuar.</p>
                )}
              </>
            ) : (
              // Modo de visualización
              <div>
                <div className="d-flex flex-column my-3">
                  <h3 className="text-sans-h3">Descripción del proyecto</h3>
                  <div className="description-container">
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
                      <span className="text-sans-h5 m-0">{count}/2000 caracteres.</span>
                      {errorMessage && <p className="text-danger">{errorMessage}</p>}
                    </>
                  </div>
                  <button
                    className="btn-principal-s d-flex text-sans-h4 pb-0 me-1"
                    onClick={handleButtonClick}
                    type="button"
                  >
                    <p className="text-decoration-underline">
                      Guardar
                    </p>
                    <i className="material-symbols-rounded ms-2 pt-1">
                      save
                    </i>
                  </button>
                </div>
              </div>
            )}
          </div>
          {/*fuentes */}
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
        </div>

        <div className="col-6 ms-5">
          {/* Img Portada - componente */}
          <h3 className="text-sans-h35">Imagen de Portada</h3>
          <div className="img-l-container">
            <UploadImg
              img={innovativeData?.portada}
              onSave={handleSaveImage}
              tag='portada'
              title="Imagen Portada"
            />
          </div>
          <div className="d-flex flex-row text-sans-h5-blue mt-2">
            <i className="material-symbols-rounded me-2">info</i>
            <p className="pt-1">La imagen de portada será la primera que se verá en la galería y en el sitio web.</p>
          </div>

          {/* Img Miniatura - componente */}
          <div className="mt-5">
            <UploadImgsm
              imgs={innovativeData?.innovative_gallery_images}
              add={addImageGallery}
              delete={deleteImageGallery}
            />
          </div>
        </div>
      </div>

      <div className="col-10  d-flex  justify-content-between mx-auto  my-5 py-5">
        <Desechar
          slug={dataInnovativeAdmin?.id}
          name={dataInnovativeAdmin?.title}
          type="innovative"
        />
        <button className="btn-principal-s d-flex text-sans-h4 pb-0 me-4"
          type="submit"
          onClick={handleCompleteButtonClick}>
          <p className="text-decoration-underline">Crear Proyecto </p>
          <i className="material-symbols-rounded ms-2">arrow_forward_ios</i>
        </button>
      </div>
    </div >
  )
}

export default CrearProyectoInnovadorP1; 
