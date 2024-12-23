import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { UseApiPrograms } from "../../../hooks/usePrograms";
import { useCreateGoodPractice } from "../../../hooks/goodPractices/useAddGoodPractices";


const CrearBuenaPractica = () =>
{
  const { dataPrograms } = UseApiPrograms();
  const { createGoodPractice } = useCreateGoodPractice();
  const [ selectedProgram, setSelectedProgram ] = useState("");
  const [ title, setTitle ] = useState("");
  const [ description, setDescription ] = useState("");
  const [ titleCharCount, setTitleCharCount ] = useState(0);
  const [ descCharCount, setDescCharCount ] = useState(0);
  const [ portada, setPortada ] = useState(null);
  const [ isSubmitting, setIsSubmitting ] = useState(false);
  const [ showModal, setShowModal ] = useState(false);
  const [ isEditMode, setIsEditMode ] = useState(false);
  const [ preview, setPreview ] = useState(null);
  const [ isHovered, setIsHovered ] = useState(false);
  const [ backendErrors, setBackendErrors ] = useState({});
  const modalRef = useRef(null);
  const [ formErrors, setFormErrors ] = useState({ title: '', description: '', program: '' });


  const openModal = (editMode = false) =>
  {
    setIsEditMode(editMode);
    setShowModal(true);
  };
  const closeModal = () =>
  {
    setShowModal(false);
    setIsEditMode(false);
  };


  const handlePortadaSave = () =>
  {
    closeModal();
  };

  const handleOutsideClick = (e) =>
  {
    if (e.target === modalRef.current)
    {
      closeModal();
    }
  };


  const navigate = useNavigate();

  const handleBackButtonClick = () =>
  {
    navigate(-1);
  };

  const handleTitleChange = (e) =>
  {
    const newValue = e.target.value;
    if (newValue.length <= 40)
    {
      setTitle(newValue);
      setTitleCharCount(newValue.length);
    }
  };

  const handleDescriptionChange = (e) =>
  {
    const newValue = e.target.value;
    if (newValue.length <= 2000)
    {
      setDescription(newValue);
      setDescCharCount(newValue.length);
    }
  };

  const handleProgramChange = (e) =>
  {
    setSelectedProgram(e.target.value);
  };


  const handleFileChange = (e) =>
  {
    const file = e.target.files[ 0 ];
    setPortada(file);
    setPreview(URL.createObjectURL(file));
  }
  const handleDelete = () =>
  {
    if (preview)
    {
      URL.revokeObjectURL(preview);
    }
    setPortada(null);
    setPreview(null);
    closeModal();
  };

  useEffect(() =>
  {
    return () =>
    {
      if (preview)
      {
        URL.revokeObjectURL(preview);
      }
    };
  }, [ preview ]);

  const handleSubmit = async () =>
  {
    setIsSubmitting(true);

    // Validación de campos obligatorios
    const errors = {
      title: title.trim() === '' ? 'El título es obligatorio' : '',
      description: description.trim() === '' ? 'La descripción es obligatoria' : '',
      program: selectedProgram === '' ? 'Debe seleccionar un programa' : '',
    };

    setFormErrors(errors);

    if (Object.values(errors).some((error) => error !== ''))
    {
      setIsSubmitting(false);
      return;
    }

    if (!portada)
    {
      setIsSubmitting(false);
      return;
    }

    // Crear un nuevo FormData
    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    formData.append("program", selectedProgram);
    formData.append("portada", portada);

    try
    {
      await createGoodPractice(formData);
      navigate("/dashboard/buenas_practicas_exitosas", {
        state: { origen: "crear_buena_practica", name: title },
      });
    } catch (err)
    {
      console.error("Error creating good practice:", err);
      if (err.response && err.response.data)
      {
        setBackendErrors(err.response.data); // Set backend error messages
      }
    } finally
    {
      setIsSubmitting(false);
    }
  };


  return (
    <div className="container col-11 view-container">
      <h2 className="text-sans-h2 mt-4 mb-4">Crear: Buena práctica</h2>
      <button className="btn-secundario-s d-flex mb-4" onClick={handleBackButtonClick}>
        <i className="material-symbols-rounded me-2">arrow_back_ios</i>
        <p className="mb-0 text-decoration-underline">Volver atrás</p>
      </button>
      <div className="container mb-4">
        <div className="dropdown-program-select">
          <p className="text-sans-p">Esta Buena Práctica corresponde al programa:</p>
          <select
            className="custom-selector p-3"
            value={selectedProgram}
            onChange={handleProgramChange}
          >
            <option value="">Seleccionar Programa</option>
            {dataPrograms &&
              dataPrograms.map((program) => (
                <option key={program.id} value={program.id}>
                  {program.name}
                </option>
              ))}
          </select>
          {formErrors.program && <p className="text-danger">{formErrors.program}</p>}
        </div>
      </div>
      <div className="row">
        <div className="col-6">
          <label>Título de la Buena Práctica (Obligatorio)</label>
          <textarea
            className="border-0 mt-4 text-sans-h1"
            placeholder="Título Buena práctica"
            value={title}
            onChange={handleTitleChange}
          />
          {formErrors.title && <p className="text-danger">{formErrors.title}</p>}
          <p className="text-sans-h5-grey">{titleCharCount}/40 caracteres.</p>
          <div className="container mt-3">
            <h3 className="text-sans-h3">Descripción</h3>
            <textarea
              className="form-control my-3"
              placeholder="Descripción de la buena práctica"
              rows="7"
              value={description}
              onChange={handleDescriptionChange}
            />
            <p className="text-sans-h5-grey">{descCharCount}/2000 caracteres.</p>
            {formErrors.description && <p className="text-danger">{formErrors.description}</p>}
          </div>
        </div>
      </div>
      <div className="col-6 mb-5">
        <h3 className="text-sans-h35">Imagen Referencial</h3>
        <div className="img-section my-3">
          {preview ? (
            <div className="image-container" onMouseEnter={() => setIsHovered(true)} onMouseLeave={() => setIsHovered(false)}>
              {preview ? (
                <img src={preview} alt="Imagen seleccionada" className="upload-image" />
              ) : (
                <div className="placeholder">No hay imagen seleccionada</div>
              )}
              {isHovered && (
                <div className="overlay">
                  <button
                    className="btn-borderless-white d-flex align-content-center mx-3 px-3"
                    onClick={() => openModal(false)}
                  >
                    <i className="material-symbols-outlined mx-1">visibility</i>Ver
                  </button>
                  <button
                    className="btn-borderless-white d-flex align-content-center mx-3 px-3"
                    onClick={() => openModal(true)}
                  >
                    <i className="material-symbols-outlined mx-1">edit</i>Editar
                  </button>
                  <button
                    className="btn-borderless-white d-flex align-content-center mx-3 px-3"
                    onClick={handleDelete}
                  >
                    <i className="material-symbols-outlined mx-1">delete</i>Eliminar
                  </button>
                </div>
              )}
            </div>

          ) : (
            <button
              className="btn-borderless-white d-flex align-content-center mx-3 px-3"
              onClick={() => openModal(true)}
            >
              <i className="material-symbols-outlined mx-1 text-sans-h4">add</i>
              <span className="text-sans-h4">Agregar Imagen</span>
            </button>
          )}
          {showModal && (
            <div ref={modalRef} className="modal-uploadImg" onClick={handleOutsideClick}>
              <div className="modalImg-content">
                <div className="text-sans-h3 text-start">Imagen Referencial</div>
                <button type="button" onClick={closeModal} className="btn-close btn-close-img" aria-label="Close"></button>
                {preview && <img src={preview} alt="Preview" className="img-modal" />}
                {isEditMode && (
                  <div className="modal-actions my-auto">
                    <input type="file" name="portada" onChange={handleFileChange} accept="image/*" className="file-input my-3 mx-5" />
                    <button
                      className="btn-principal-s my-2 mx-3 d-flex align-content-center"
                      type="button"
                      onClick={handlePortadaSave}
                    >
                      <i className="material-symbols-outlined mx-2">save</i>
                      <u>Guardar Imagen</u>
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
        <div>
          <p className="text-sans-h5-blue mb-5">
            Éstas imágenes son de carácter referencial y no corresponden necesariamente a proyectos que se hayan realizado.
          </p>
        </div>
      </div>
      <div className="col-3 d-flex justify-content-end mx-auto my-5">
        {backendErrors.description && (
          <p className="text-danger ms-3">{backendErrors.description[ 0 ]}</p>
        )}
        <button
          className="btn-secundario-s my-5"
          onClick={handleSubmit}
          disabled={isSubmitting}
        >
          Crear Buena práctica
        </button>
      </div>
    </div>
  );
};

export default CrearBuenaPractica;
