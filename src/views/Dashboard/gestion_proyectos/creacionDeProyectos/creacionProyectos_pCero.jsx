import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
// import { useAuth } from '../../../../context/AuthContext';
import { UseApiPrograms } from '../../../../hooks/usePrograms';
import useApiInnovativeProjects from '../../../../hooks/innovativeProject/useApiInnovativeProjects';

const CrearProyectos = () =>
{

  //permisos de usuarios
  // const { userData } = useAuth();
  // const isEditorOrSuperuser = [ 'Superusuario', 'Editor General' ].includes(userData.tipo_de_usuario);
  // Hooks de estado
  const [ selectedOption, setSelectedOption ] = useState(null);
  const [ showOptionErrorMessage, setShowOptionErrorMessage ] = useState(false);
  const [ inputText, setInputText ] = useState('');
  const [ isEditing, setIsEditing ] = useState(true);
  const [ showTitleErrorMessage, setShowTitleErrorMessage ] = useState(false);
  const { dataPrograms, loadingPrograms } = UseApiPrograms();
  const [ selectedProgram, setSelectedProgram ] = useState(null);
  const { createInnovativeProject } = useApiInnovativeProjects();
  const [ activeButton, setActiveButton ] = useState(null);


  //Hooks para conteo y manejo de caracteres maximos
  const [ maxTitleChars ] = useState(70); // Maximo de caracteres para el titulo
  const [ titleCharsCount, setTitleCharsCount ] = useState(0);
  const [ titleCharsExceeded, setTitleCharsExceeded ] = useState(false);

  // Maneja cambios en la seleccion y la actualiza en el estado.
  const handleOptionChange = (value) =>
  {
    setSelectedOption(value);
    setActiveButton(value);
  };

  // Maneja cambios en el input y actualiza el estado.
  const handleInputChange = (event) =>
  {
    const text = event.target.value;
    if (text.length <= maxTitleChars)
    {
      setInputText(text);
      setTitleCharsCount(text.length);
      setTitleCharsExceeded(false);
    } else
    {
      setTitleCharsExceeded(true);
    }
  };

  const handleEditarClick = () =>
  {
    setIsEditing(true);
  };

  // Maneja click en Subir proyecto y redireccion.
  const navigate = useNavigate();

  const handleSubirProyectoClick = async () =>
  {
    // Resetear los mensajes de error
    setShowTitleErrorMessage(false);
    setShowOptionErrorMessage(false);

    // Verifica si se ha seleccionado una opción
    if (!selectedOption)
    {
      setShowOptionErrorMessage(true);
      return;
    }

    // Verifica si se ha ingresado un titulo
    const trimmedTitle = inputText.trim();
    if (!trimmedTitle)
    {
      setShowTitleErrorMessage(true);
      return;
    }

    if (selectedOption === 'bancoProyectos')
    {
      navigate('/dashboard/crearproyecto_paso1');
      return;
    }

    if (selectedOption === 'proyectosInnovadores')
    {
      if (!selectedProgram)
      {
        // Aquí deberías manejar o mostrar un mensaje de error si no se ha seleccionado un programa
        // Usa tu sistema de notificaciones o UI aquí en lugar de alert:
        // Notificacion.show("Por favor selecciona un programa.");
        return;
      }

      const newProjectData = {
        title: trimmedTitle,
        program: selectedProgram
      };

      const result = await createInnovativeProject(newProjectData);

      if (result.success)
      {
        navigate(`/dashboard/crearinnovador_paso1?id=${result.id}`);
      } else
      {
        // Manejar error aquí
        // Usa tu sistema de notificaciones o UI aquí en lugar de alert:
        // Notificacion.show("Error al crear el proyecto innovador: " + result.error);
      }
    }
  };

  return (
    <div className="container view-container mx-5 mb-5">
      <h2 className="text-sans-h2 mt-4 mb-5">Subir Proyecto</h2>
      <div className="col-10 mx-5">
        <h3 className="text-sans-h3 ms-1">Elige donde quieres mostrar el proyecto:</h3>

        <div className="row my-5">
          <div
            className={`col-5 opt-container p-3 mx-3 ${activeButton === 'bancoProyectos' ? 'opt-container-active' : 'opt-container'
              }`}
          >
            <h3 className="text-serif-h3 text-center text-decoration-underline">Banco de Proyectos</h3>
            <hr />
            <div className="d-flex flex-row">
              <i className="material-symbols-rounded me-2">check</i>
              <p className="text-sans-h5">Proyectos que ya han sido ejecutados en alguna comuna de Chile.</p>
            </div>
            <div className="d-flex flex-row">
              <i className="material-symbols-rounded me-2">check</i>
              <p className="text-sans-h5">Muestran información como: año de construcción, región y comuna donde se realizó, y el código SUBDERE asociado.</p>
            </div>
            <div className="d-flex flex-row">
              <i className="material-symbols-rounded me-2">check</i>
              <p className="text-sans-h5">Comparten documentación como presupuestos, especificaciones técnicas, entre otros.</p>
            </div>
            <hr />
            <div className="d-flex justify-content-center">
              <button
                className={`btn-secundario-s text-decoration-underline px-4 ${activeButton === 'bancoProyectos' ? 'btn-secundario-s-active' : 'btn-secundario-s'
                  }`}
                onClick={() => handleOptionChange('bancoProyectos')}
                value='bancoProyectos'
              >
                Seleccionar
              </button>
            </div>
          </div>

          <div
            className={`col-5 opt-container p-3 mx-3 ${activeButton === 'proyectosInnovadores' ? 'opt-container-active' : 'opt-container'
              }`}
          >
            <h3 className="text-serif-h3 text-center text-decoration-underline">Proyectos Innovadores</h3>
            <hr />
            <div className="d-flex flex-row">
              <i className="material-symbols-rounded me-2">check</i>
              <p className="text-sans-h5">Proyectos referenciales que no necesariamente han sido ejecutados.</p>
            </div>
            <div className="d-flex flex-row">
              <i className="material-symbols-rounded me-2">check</i>
              <p className="text-sans-h5">Debes tener fotos para mostrar.</p>
            </div>
            <div className="d-flex flex-row">
              <i className="material-symbols-rounded me-2">check</i>
              <p className="text-sans-h5">Puedes agregar enlaces a sitios web referenciales.</p>
            </div>
            <div className="d-flex flex-row">
              <i className="material-symbols-rounded me-2">check</i>
              <p className="text-sans-h5">Proyectos novedosos que escapan de lo que normalmente se postula.</p>
            </div>
            <hr />
            <div className="d-flex justify-content-center">
              <button
                className={`btn-secundario-s text-decoration-underline px-4 ${activeButton === 'proyectosInnovadores' ? 'btn-secundario-s-active' : 'btn-secundario-s'
                  }`}
                onClick={() => handleOptionChange('proyectosInnovadores')}
                value="proyectosInnovadores"
              >
                Seleccionar
              </button>

            </div>
          </div>
        </div>

        {showOptionErrorMessage &&
          <p className="text-sans-h5-red ms-1 ">
            Debes elegir donde quieres mostrar el proyecto antes de continuar.
          </p>
        }

        <div className="container">
          {isEditing ? (
            // Modo de edición
            <>
              <div className="d-flex flex-row justify-content-between my-3">
                <div>
                  <p className="text-sans-h5">Escribe el título del proyecto (Obligatorio)</p>
                  <input
                    className="text-sans-h1 container-fluid ghost-input"
                    placeholder="Titulo del Proyecto"
                    value={inputText}
                    onChange={handleInputChange}
                  />
                  <p className={`text-sans-h5 ${titleCharsExceeded ? "text-sans-h5-red" : ""}`}> {titleCharsCount} / {maxTitleChars} caracteres </p>
                </div>

              </div>

              {showTitleErrorMessage && (
                <p className="text-sans-h5-red mt-1">Debes ingresar un título antes de continuar.</p>
              )}
            </>
          ) : (
            // Modo de visualización
            <div>
              <p>Título del Proyecto</p>
              <div className="d-flex flex-row justify-content-between my-3">
                <h1 className="text-sans-h1">{inputText || "Titulo del Proyecto"}</h1>
                <button
                  className="btn-secundario-s d-flex pb-0"
                  onClick={handleEditarClick}
                >
                  <p className=" text-decoration-underline">Editar</p>
                  <i className="material-symbols-rounded ms-2 pt-1">edit</i>
                </button>
              </div>
            </div>
          )}

          <div>
            <p className="text-sans-p">Este proyecto corresponde al programa:</p>
            {/* {isEditorOrSuperuser && ( */}
              <div>
                <select
                  className="custom-selector p-3"
                  onChange={(e) => setSelectedProgram(e.target.value)}
                  disabled={loadingPrograms}
                >
                  {/* Aquí irían las opciones del programa, asumiendo que dataPrograms es un array de programas */}
                  {dataPrograms.map(program => (
                    <option key={program.id} value={program.id}>
                      {program.name}
                    </option>
                  ))}
                </select>
              </div>
            {/* )} */}
          </div>
        </div>

        <div className="container d-flex justify-content-end mt-5">
          <button
            onClick={handleSubirProyectoClick}
            className="btn-principal-s d-flex text-sans-h4 pb-0"
          >
            <p className="text-sans-h4-white text-decoration-underline">Subir Proyecto</p>
            <i className="material-symbols-rounded ms-2">arrow_forward_ios</i>
          </button>
        </div>

      </div>
    </div>
  );
};
export default CrearProyectos; 