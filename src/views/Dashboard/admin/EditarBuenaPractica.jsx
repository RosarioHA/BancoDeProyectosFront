import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useGoodPracticesDetails } from "../../../hooks/goodPractices/useGoodPracticesById";
import { UseApiPrograms } from '../../../hooks/usePrograms';
import Carrusel from "../../../components/Commons/carrusel";
import UploadImg from "../../../components/Commons/UploadImg";
import { EditableTitle } from "../../../components/Tables/InputTitle";
import { DeleteProjectModal } from "../../../components/Modals/EliminarProyecto";
import { useUpdateGoodPractices } from "../../../hooks/goodPractices/useUpdateGoodPractices";
const EditarBuenaPractica = () =>
{
  const { id } = useParams();
  const history = useNavigate();
  const { updateInnovative } = useUpdateGoodPractices(id);
  const { goodPractices } = useGoodPracticesDetails(id);
  const { dataPrograms } = UseApiPrograms();
  // const [ loading, setLoading ] = useState(true); 
  // const [ error, setError ] = useState(null);
  const [ goodPracticeData, setGoodPracticeData ] = useState(null);
  const [ isPublished, setIsPublished ] = useState(null);
  const [ text, setText ] = useState('');
  const [ count, setCount ] = useState(0);
  const [ isEditing, setIsEditing ] = useState(false);
  const [ editando, setEditando ] = useState(false);
  const [ successMessage, setSuccessMessage ] = useState('');
  const [ errorMessage, setErrorMessage ] = useState(null);
  const [ editingMessage, setEditingMessage ] = useState("Editar");
  const [ selectedProgram, setSelectedProgram ] = useState();
  const [ message, setMessage ] = useState({ type: "", text: "" });

  console.log(successMessage)
  useEffect(() =>
  {
    if (goodPractices)
    {
      setIsPublished(goodPractices?.public);
      setText(goodPractices?.description || '');
      setCount(goodPractices?.description?.length || 0);
      setGoodPracticeData((prev) => ({
        ...prev,
        ...goodPractices,
      }));
    }
  }, [ goodPractices ]);

  useEffect(() =>
  {
  }, [ goodPracticeData ]);

  useEffect(() =>
  {
    setSuccessMessage('');
  }, [ isEditing ]);

  // Inicializar datos y programa seleccionado
  useEffect(() =>
  {
    if (goodPractices)
    {
      setGoodPracticeData(goodPractices);
      setSelectedProgram(goodPractices.program?.id || "");
    }
  }, [ goodPractices ]);


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
      setGoodPracticeData((prev) => ({
        ...prev,
        program: dataPrograms.find((p) => p.id.toString() === programId),
      }));
    } catch (error)
    {
      console.error("Error al actualizar el programa:", error);
      setMessage({ type: "error", text: "No se pudo actualizar el programa." });
    }
  };



  const handleEditButtonClick = () =>
  {
    setIsEditing((prev) =>
    {
      const newEditingState = !prev;
      setEditingMessage(newEditingState ? "Editando " : "Editar ");
      if (newEditingState && goodPractices)
      {
        setGoodPracticeData((prevData) => ({
          ...prevData,
          ...goodPractices
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
      setGoodPracticeData((prev) => ({ ...prev, title: updatedData.title }));
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
        setGoodPracticeData((prev) => ({ ...prev, description: updatedData.description }));
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
      setGoodPracticeData((prev) => ({ ...prev, public: updatedData.public }));
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

      setGoodPracticeData((prev) =>
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

  return (
    <div className="container view-container ms-5">
      <h1 className="text-sans-h2 mb-3 mt-2">Buenas Practicas : Ver detalles</h1>
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
              <div className="col ">Creado por: {goodPracticeData?.author_name || ''}</div>
              <div className="col ">Publicado por: {goodPracticeData?.published_name || ''}  </div>
              <div className="col ">Fecha de creación: {goodPracticeData?.created || ''}</div>
              <div className="col ">Fecha de publicación: {goodPracticeData?.published_date || ''} </div>
              <div className="col ">Última modificación: {goodPracticeData?.modified || ''}</div>
            </div>
            <div className="row my-3">
              <div className="col-4">
                <div className="col-4">

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
                  {/* Modal de confirmación */}
                  <DeleteProjectModal
                    slug={goodPractices?.id}
                    name={goodPractices?.title}
                    text='innovador'
                    buttonText="innovadores"
                    type="innovative"
                  />
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Descripcion del proyecto */}
      <div className="container col-10 view-container">
        <h2 className="text-sans-h2 mt-4 mb-4">Editar Buenas práctica</h2>

        <div className="container mb-4">

          <div>
            {isEditing ? (
              <div>
                <p className="text-sans-p">Esta Buena Práctica corresponde al programa:</p>
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
                <span className="text-sans-h5-grey">Esta Buena Práctica corresponde al programa:</span>
                <p className="text-sans-h35">{goodPracticeData?.program?.name}</p>
              </div>
            )}
            {/* titulo del proyecto */}
            {isEditing ? (
              <div className="">
                <EditableTitle
                  initialTitle={goodPracticeData?.title}
                  onSave={handleTitleSave}
                  maxChars={700}
                  minChars={10}
                />
              </div>
            ) : (
              <h4 className="text-sans-h3 text-center text-md-start mt-5">
                {goodPracticeData?.title}
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
                <p className="text-sans-p ">{goodPracticeData?.description}</p>
              )}
            </div>
            <div className="col-9">
              {isEditing ? (
                <>
                  <div className="mx-5">
                    <div>Imagen Referencial (Obligatorio)</div>
                    <div className="">
                      <UploadImg
                        img={goodPracticeData?.portada}
                        onSave={handleSaveImage}
                        tag='portada'
                        title="Imagen Referencial"
                      />

                    </div>
                    <div className="text-sans-h5-blue info d-flex  align-content-center mt-2">
                      <i className="material-symbols-outlined">
                        info
                      </i>
                      <span className="ms-2 align-self-center">  
                        <p className="text-sans-h5-blue mb-5">
                          Éstas imágenes son de carácter referencial y no corresponden necesariamente a proyectos que se hayan realizado.
                        </p>
                    </span>
                    </div>
                  </div>
                </>
              ) : (

                <Carrusel
                  imgPortada={goodPracticeData?.portada}
                  context="proyectosInnovadores"
                />
              )}
            </div>

          </div>
        </div>


      </div>
    </div >
  )
}

export default EditarBuenaPractica