import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import CustomInput from "../../../components/Form/custom_input";
import { useDocumentTypes } from "../../../hooks/useTypeDocuemnts";
import { useApiDocuments } from "../../../hooks/useApiDocuments";
import { useApiTypeProject } from "../../../hooks/useTypeProject";
import { ListDocument } from "../../../components/Commons/ListDocument";

const AddDocuments = () => {
  const navigate = useNavigate();
  const { createDocument } = useApiDocuments();
  const { documentTypes } = useDocumentTypes();
  const { addDocument } = useApiTypeProject();

  const fileInputRef = useRef(null);

  const [title, setTitle] = useState("");
  const [titleError, setTitleError] = useState("");
  const [documentTypeId, setDocumentTypeId] = useState("");
  const [documentTypeError, setDocumentTypeError] = useState("");
  const [file, setFile] = useState(null);
  const [fileError, setFileError] = useState("");
  const [selectedTypes, setSelectedTypes] = useState({}); // Para gestionar tipos seleccionados

  const handleTitleChange = (e) => {
    const value = e.target.value;
    setTitle(value);

    if (!value) {
      setTitleError("El nombre del documento no puede estar vacío.");
    } else if (value.length < 5) {
      setTitleError("El nombre del documento debe tener al menos 5 caracteres.");
    } else {
      setTitleError("");
    }
  };

  const handleDocumentTypeChange = (e) => {
    const value = e.target.value;
    setDocumentTypeId(value);

    if (!value) {
      setDocumentTypeError("El tipo de documento es obligatorio.");
    } else {
      setDocumentTypeError("");
    }
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile && selectedFile.size <= 20 * 1024 * 1024 && selectedFile.type === "application/pdf") {
      setFile(selectedFile);
      setFileError("");
    } else {
      setFile(null);
      setFileError("El archivo debe ser un PDF y no superar los 20 MB.");
    }
  };

  const handleSaveChanges = async () => {
    let hasErrors = false;
  
    // Validación de campos
    if (!title) {
      setTitleError("El nombre del documento no puede estar vacío.");
      hasErrors = true;
    }
  
    if (!documentTypeId) {
      setDocumentTypeError("El tipo de documento es obligatorio.");
      hasErrors = true;
    }
  
    if (!file) {
      setFileError("Por favor sube un archivo.");
      hasErrors = true;
    }
  
    if (hasErrors) return;
  
    // Preparamos el payload para la creación del documento
    const payload = new FormData();
    payload.append("title", title);
    payload.append("document_type", documentTypeId);
    if (file) {
      payload.append("document", file);
    }
  
    try {
      // Crear el documento
      const documentResponse = await createDocument(payload);
  
      // Crear la estructura de documentos para cada tipo seleccionado
      const documentsToSend = Object.keys(selectedTypes).map((typeId) => {
        if (selectedTypes[typeId]) {
          return {
            id: documentResponse.id, // ID del documento creado
            title: title,
            document: documentResponse.document_url, // URL del documento desde la respuesta del backend
            document_format: "PDF", // Suponiendo que el formato es PDF
            document_type: {
              id: typeId,
              type: documentTypes.find((type) => type.id === parseInt(typeId)).type, // Obtener el tipo de documento
            },
            modified: new Date().toISOString(), // Fecha de modificación actual
          };
        }
        return null;
      }).filter(Boolean); // Filtramos los elementos nulos (si no está seleccionado)
  
      // Enviar los documentos al backend
      if (documentsToSend.length > 0) {
        await addDocument(documentsToSend); // Enviar los documentos a la API
      }
  
      // Navegar a la página de éxito
      navigate("/dashboard/documento_exitoso", {
        state: {
          origen: "crear_documento",
        }
      });
  
    } catch (error) {
      alert("Error al guardar los cambios. Por favor, inténtalo nuevamente.");
      console.error(error); // Puedes agregar más detalles del error si es necesario
    }
  };
  
  const handleBackButtonClick = () => {
    navigate("/dashboard/documentos");
  };

  return (
    <div className="container col-10 col-xxl-11 mt-2">
      <div className="text-sans-h2 mx-3">Gestión de Plataforma</div>

      <div className="d-flex flex-row px-4 mb-5 justify-content-between my-3">
        <button
          className="btn-secundario-s d-flex justify-content-between"
          onClick={handleBackButtonClick}
        >
          <i className="material-symbols-rounded me-2">arrow_back_ios</i>
          <span className="mb-0">
            <u>Volver</u>
          </span>
        </button>
      </div>

      <div className="w-50 pl-2 text-sans-h3 align-self-center">
        Documentos: Crear documento
      </div>

      <div className="container col-9">
        <div className="my-5">
          <CustomInput
            placeholder="Nombre del documento"
            label="Nombre del documento"
            maxLength="50"
            value={title}
            onChange={handleTitleChange}
            error={titleError}
          />
          <ListDocument setSelectedTypes={setSelectedTypes} />

          <div className="my-5">
            <p className="text-sans-p">Elige tipo de documento (Obligatorio)</p>
            <select
              className="custom-selector p-3"
              value={documentTypeId}
              onChange={handleDocumentTypeChange}
            >
              <option value="">Seleccionar tipo de documento</option>
              {documentTypes &&
                documentTypes.map((type) => (
                  <option key={type.id} value={type.id}>
                    {type.type}
                  </option>
                ))}
            </select>
            {documentTypeError && <p className="text-sans-h5-red mt-2">{documentTypeError}</p>}
          </div>

          <div className="my-5">
            <span>Archivo para descarga (Obligatorio)</span>
            <p>(peso máximo 20 MB, PDF)</p>
            <div>
              <input
                type="file"
                ref={fileInputRef}
                accept=".pdf"
                onChange={handleFileChange}
                style={{ display: "none" }}
              />
              <button
                type="button"
                className="btn-principal-s d-flex justify-content-between"
                onClick={() => fileInputRef.current.click()}
              >
                <i className="material-symbols-rounded me-2">upload_2</i>
                <u>Seleccionar Archivo</u>
              </button>
              {file ? (
                <div className="my-3 d-flex justify-content-between neutral-container p-4">
                  <div className="me-3 my-auto">{file.name}</div>
                </div>
              ) : null}
              {fileError && <p className="text-sans-h5-red mt-2">{fileError}</p>}
            </div>
          </div>

          <div className="d-flex justify-content-between">
            <button
              type="button"
              className="red-btn d-flex justify-content-between"
              onClick={handleBackButtonClick}
            >
              <i className="material-symbols-rounded me-2">delete</i>
              <u>Cancelar</u>
            </button>
            <button
              type="button"
              className="btn-principal-s d-flex justify-content-between"
              onClick={handleSaveChanges}
            >
              <i className="material-symbols-rounded me-2">save</i>
              <u>Guardar documento</u>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddDocuments;
