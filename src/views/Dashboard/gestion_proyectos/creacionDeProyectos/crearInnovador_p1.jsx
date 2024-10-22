import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"
import ModalAgregarFuente from "../../../../components/Modals/ModalAgregarFuente";
import ModalEditarFuente from "../../../../components/Modals/ModalEditarFuente";
import UploadImg from "../../../../components/Commons/UploadImg";
import UploadImgsm from "../../../../components/Commons/UploadImgsm";
import useApiInnovativeProjects from "../../../../hooks/innovativeProject/useApiInnovativeProjects";
import { UseApiPrograms } from "../../../../hooks/usePrograms";
import { useAuth } from '../../../../context/AuthContext';
import useGalleryInnovative from '../../../../hooks/useGalleryInovative';


const CrearProyectoInnovadorP1 = () =>
{
  const { userData } = useAuth();
  // const isEditorOrSuperuser = [ 'Superusuario', 'Editor General' ].includes(userData.tipo_de_usuario);
  const [ projectId, setProjectId ] = useState(null);
  const { getInnovativeProjectById, updateInnovativeProject, deleteInnovativeProject, updateInnovativeProjectCover,
    addWebSource, updateWebSource } = useApiInnovativeProjects();
  const { dataPrograms, loadingPrograms, errorPrograms } = UseApiPrograms();

  const [ dropdownOpen, setDropdownOpen ] = useState(false);
  const [ updatedProgram, setUpdatedProgram ] = useState(null);
  const [ selectedProgramOption, setSelectedProgramOption ] = useState(null);

  const [ inputTitle, setInputTitle ] = useState('');
  const [ inputDescr, setInputDescr ] = useState('');
  const [ isEditingTitle, setIsEditingTitle ] = useState(false);
  const [ showTitleErrorMessage, setShowTitleErrorMessage ] = useState(false);
  const [ isEditingDescr, setIsEditingDescr ] = useState(false);
  const [ showDescrError, setShowDescrError ] = useState(false);
  const [ selectedProgram, setSelectedProgram ] = useState(null);
  const [ currentProjectId, setCurrentProjectId ] = useState(null);
  const [ webSources, setWebSources ] = useState([])
  // Hooks de estado para conteo de caracteres maximos en Titulo
  const [ maxTitleChars ] = useState(70); // Maximo de caracteres para el titulo
  const [ titleCharsCount, setTitleCharsCount ] = useState(0);
  const [ titleCharsExceeded, setTitleCharsExceeded ] = useState(false);
  //Hooks de estado para conteo de caracteres maximos en Descripcion
  const [ maxDescChars ] = useState(700); // Maximo de caracteres para la descripcion
  const [ descCharsCount, setDescCharsCount ] = useState(0);
  const [ descCharsExceeded, setDescCharsExceeded ] = useState(false);

  const [ coverImages, setCoverImages ] = useState([]);
  console.log(coverImages)


  const handleSaveClick = async (input, setEditing, setShowError, updateFunction, field) =>
  {
    const trimmedText = input.trim();
    if (trimmedText)
    {
      if (currentProjectId)
      {
        const updateData = {
          [ field ]: trimmedText,// Agrega el programa seleccionado
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


  useEffect(() =>
  {
    const fetchProject = async () =>
    {
      const projectId = new URLSearchParams(window.location.search).get("id");
      if (!projectId || projectId === currentProjectId) return;
      setCurrentProjectId(projectId);
      const project = await getInnovativeProjectById(projectId);
      if (project)
      {
        setInputTitle(project.title);
        setInputDescr(project.description);
        setWebSources(project.web_sources);
        setCoverImages(project.portada)
        if (project.program)
        {
          setSelectedProgram(project.program.id);
          setUpdatedProgram(project.program.id)
        }
      }
    };

    fetchProject();
  }, [ getInnovativeProjectById, currentProjectId, updateInnovativeProject ]);





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

  const handleEditClick = (setState) =>
  {
    setState(true);
  };

  const handleSendRequestClick = async () =>
  {
    if (currentProjectId)
    {
      const result = await updateInnovativeProject(currentProjectId, { request_sent: true });
      console.log("Update result:", result);
      history('/dashboard/administrarproyectosinnovadores');
    } else
    {
      console.log("Project ID is not set.");
    }
  };




  const handleTitleInputChange = (event) => handleInputChange(event, setInputTitle, setTitleCharsCount, setTitleCharsExceeded, maxTitleChars);
  const handleSaveTitleClick = () => handleSaveClick(inputTitle, setIsEditingTitle, setShowTitleErrorMessage, updateInnovativeProject, 'title', projectId);

  const handleDescrInputChange = (event) => handleInputChange(event, setInputDescr, setDescCharsCount, setDescCharsExceeded, maxDescChars);
  const handleSaveDescrClick = () => handleSaveClick(inputDescr, setIsEditingDescr, setShowDescrError, updateInnovativeProject, 'description', projectId);


  const handleProgramSelection = async (program) =>
  {
    setUpdatedProgram(program.id);
    setDropdownOpen(false);
    setSelectedProgramOption(program.id);
    setSelectedProgram(program.id);

    if (currentProjectId)
    {
      const updateData = {
        program: program.id,
      };
      const result = await updateInnovativeProject(currentProjectId, updateData);
      console.log("Update result:", result);
    }
  };


  const handleDeleteProjectClick = async () =>
  {
    if (projectId)
    {
      const confirmDeletion = window.confirm("¿Estás seguro de que quieres eliminar este proyecto?");
      if (confirmDeletion)
      {
        await deleteInnovativeProject(projectId);
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
          <p className="text-sans-p">Este proyecto corresponde al programa:</p>

          {/* {isEditorOrSuperuser ? ( */}
          <>
            <div className="dropdown-selected" onClick={() => setDropdownOpen(!dropdownOpen)}>
              {updatedProgram ? (
                <div>
                  {dataPrograms.map((program) =>
                  {
                    if (program.id === updatedProgram)
                    {
                      return (
                        <div key={program.id}>
                          {program.name} ({program.sigla})
                        </div>
                      );
                    }
                    return null;
                  })}
                </div>
              ) : (
                "Seleccione un programa"
              )}
              {dropdownOpen ? (
                <i className="material-symbols-outlined pr-0">expand_less</i>
              ) : (
                <i className="material-symbols-outlined pr-0">expand_more</i>
              )}
            </div>
            {dropdownOpen && (
              <ul className="dropdown-list">
                {loadingPrograms ? (
                  <li className="text-sans-h5-blue">Cargando programas...</li>
                ) : errorPrograms ? (
                  <li className="text-sans-h5-blue">Error al cargar programas</li>
                ) : (
                  dataPrograms.map((program) => (
                    <li key={program.id}>
                      <button
                        type="button"
                        onClick={() => handleProgramSelection(program)}
                        className={`${program.id === selectedProgram ? 'active-program' : ''} ${program.id === selectedProgramOption ? 'selected-option' : ''} ${program.id !== selectedProgram && program.id !== selectedProgramOption ? 'not-selected-program' : ''}`}
                      >
                        {program.name} ({program.sigla})
                      </button>

                    </li>
                  ))
                )}
              </ul>
            )}
          </>
          {/* ) : ( */}
          <div className="dropdown-selected">
            {updatedProgram ? (
              <div>
                {dataPrograms.map((program) =>
                {
                  if (program.id === updatedProgram)
                  {
                    return (
                      // eslint-disable-next-line react/jsx-key
                      <button className={`dropdown-program ${selectedProgram ? 'selected-program ' : ''} ${program.id !== selectedProgram && program.id !== selectedProgramOption ? 'not-selected-program' : ''}`}>
                        {program.name} ({program.sigla})
                      </button>
                    );
                  }
                  return null;
                })}
              </div>
            ) : (
              userData.program
            )}
          </div>
          {/* )} */}
        </div>
      </div>

      <div className="row">
        <div className="col-5">
          {/* Titulo */}
          <div className="container">
            {isEditingTitle ? (
              // Modo de edición
              <>
                <div className="d-flex flex-row justify-content-between">
                  <div>
                    <p className="text-sans-h5">Escribe el título del proyecto (Obligatorio)</p>
                    <input
                      className="text-sans-h3-lightgrey container ghost-input ps-0 mx-auto"
                      placeholder="Titulo del Proyecto"
                      value={inputTitle}
                      onChange={handleTitleInputChange}
                    />
                    <p className={`text-sans-h5 ${titleCharsExceeded ? "text-sans-h5-red" : ""}`}> {titleCharsCount} / {maxTitleChars} caracteres </p>
                  </div>

                  <button
                    className="btn-principal-s d-flex text-sans-h4 pb-0 align-self-end"
                    onClick={handleSaveTitleClick}
                  >
                    <p className="text-sans-p-white text-decoration-underline">Guardar</p>
                    <i className="material-symbols-rounded ms-2 pt-1">save</i>
                  </button>
                </div>

                {showTitleErrorMessage && (
                  <p className="text-sans-h5-red mt-1">Debes ingresar un título antes de continuar.</p>
                )}
              </>
            ) : (
              // Modo de visualización
              <div>
                <p className="text-sans-p">Título del Proyecto</p>
                <div className="d-flex flex-row justify-content-between my-3">
                  <h3 className="text-sans-h3 align-self-center">{inputTitle || "Titulo del Proyecto"}</h3>
                  <button
                    className="btn-secundario-s d-flex pb-0 px-3 px-0 mx-0"
                    onClick={() => handleEditClick(setIsEditingTitle)}
                  >
                    <p className="text-decoration-underline">Editar</p>
                    <i className="material-symbols-rounded ms-2 pt-1">edit</i>
                  </button>
                </div>
              </div>
            )}
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
                    <p className="text-sans-p">{inputDescr || "Descripción del proyecto"} </p>
                  </div>
                  <button
                    className="btn-secundario-s d-flex pb-0 px-3"
                    onClick={() => handleEditClick(setIsEditingDescr)}
                  >
                    <p className="text-decoration-underline">Editar</p>
                    <i className="material-symbols-rounded ms-2 pt-1">edit</i>
                  </button>
                </div>
              </div>
            )}
          </div>
          {/*fuentes */}
          {webSources.length === 0 ? (
            <div className="container d-flex flex-row justify-content-between my-4">
              <div className="d-flex flex-column">
                <h3 className="text-sans-h35">Fuentes </h3>
                <p className="text-sans-h5">(Opcional)</p>
              </div>
              <div>
                <ModalAgregarFuente projectId={projectId} addWebSource={addWebSource} />
              </div>
            </div>
          ) : (
            <div className="container">
              <div className="d-flex flex-column">
                <h3 className="text-sans-h35">Fuentes </h3>
                <p className="text-sans-h5">(Opcional)</p>
              </div>
              <div>
                {webSources.map((source) => (
                  <li key={source.id} className="my-2 d-flex justify-content-between">
                    <div className="d-flex flex-row">
                      <p className="text-decoration-underline">{source.url}</p>
                      <a
                        className="material-symbols-rounded ms-2 pt-1 text-decoration-none"
                        rel="noreferrer"
                        target="_blank"
                        href={source.url}
                      >
                        open_in_new
                      </a>
                    </div>
                    <ModalEditarFuente
                      projectId={projectId}
                      webSourceId={source}
                      webSources={webSources}
                      updateWebSource={updateWebSource}
                    />
                    {console.log('data', source)}
                    {console.log('web', source.id)}
                  </li>
                ))}
              </div>
              <div className="mt-5">
                <ModalAgregarFuente projectId={projectId} addWebSource={addWebSource} />
              </div>
            </div>
          )}
        </div>

        <div className="col-6 ms-5">
          {/* Img Portada - componente */}
          <h3 className="text-sans-h35">Imagen de Portada</h3>
          <div className="img-l-container">
            <UploadImg
              projectId={currentProjectId}
              getPortada={getInnovativeProjectById}
              updatePortada={updateInnovativeProjectCover}
            />
          </div>
          <div className="d-flex flex-row text-sans-h5-blue mt-2">
            <i className="material-symbols-rounded me-2">info</i>
            <p className="pt-1">La imagen de portada será la primera que se verá en la galería y en el sitio web.</p>
          </div>

          {/* Img Miniatura - componente */}
          <div className="mt-5">
            <UploadImgsm
              projectId={currentProjectId}
              useGalleryHook={useGalleryInnovative}
            />
          </div>
        </div>
      </div>

      <div className="col-10 mt-5 d-flex justify-content-end">
        <button className="btn-principal-s d-flex text-sans-h4 pb-0" onClick={handleSendRequestClick}>
          <p className="text-decoration-underline">Enviar solicitud</p>
          <i className="material-symbols-rounded ms-2">arrow_forward_ios</i>
        </button>
      </div>

      <div className="col-10 mt-5 d-flex justify-content-start mb-5">
        <button className="red-btn text-sans-h4 d-flex pb-0" onClick={handleDeleteProjectClick}>
          <p className="text-decoration-underline">Desechar solicitud</p>
          <i className="material-symbols-rounded ms-2">delete</i> </button>
      </div>
    </div >
  )
}

export default CrearProyectoInnovadorP1; 
