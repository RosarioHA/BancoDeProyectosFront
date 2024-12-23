import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import CustomInput from "../../../components/Form/custom_input";
import { useDocumentTypes } from "../../../hooks/useTypeDocuemnts";
import { useApiDocuments } from "../../../hooks/useApiDocuments";
import { ListDocument } from "../../../components/Commons/ListDocument";

const EditDocuments = () =>
{
  const navigate = useNavigate();
  const { id } = useParams();
  const { document, fetchDocumentById, updateDocument, deleteDocument } = useApiDocuments();
  const { documentTypes } = useDocumentTypes();

  const fileInputRef = useRef(null); 

  const [ title, setTitle ] = useState("");
  const [ titleError, setTitleError ] = useState("");
  const [ documentTypeId, setDocumentTypeId ] = useState("");
  const [ file, setFile ] = useState(null);
  const [ fileError, setFileError ] = useState("");
  const [ selectedTypes, setSelectedTypes ] = useState([]);

  useEffect(() =>
  {
    if (id)
    {
      fetchDocumentById(id);
    }
  }, [ id, fetchDocumentById ]);

  useEffect(() =>
  {
    if (document)
    {
      setTitle(document.title || "");
      setDocumentTypeId(document.document_type?.id || "");
      if (document.document_types)
      {
        setSelectedTypes(document.document_types.map((type) => type.id));
      }
    }
  }, [ document ]);
  

  const handleTitleChange = (e) =>
  {
    const value = e.target.value;
    setTitle(value);

    if (!value)
    {
      setTitleError("El nombre del documento no puede estar vacío.");
    } else if (value.length < 5)
    {
      setTitleError("El nombre del documento debe tener al menos 5 caracteres.");
    } else
    {
      setTitleError("");
    }
  };

  const handleDocumentTypeChange = (e) =>
  {
    setDocumentTypeId(e.target.value);
  };

  const handleFileChange = (e) =>
  {
    const selectedFile = e.target.files[ 0 ];
    if (selectedFile && selectedFile.size <= 20 * 1024 * 1024 && selectedFile.type === "application/pdf")
    {
      setFile(selectedFile);
      setFileError("");
    } else
    {
      setFile(null);
      setFileError("El archivo debe ser un PDF y no superar los 20 MB.");
    }
  };

  const handleSaveChanges = async () => {
    // Validar los campos
    if (!title) {
      setTitleError("El nombre del documento no puede estar vacío.");
      return;
    }
    if (!documentTypeId) {
      setTitleError("El tipo de documento es obligatorio.");
      return;
    }
    if (!file && !document?.document) {
      setFileError("Por favor sube un archivo.");
      return;
    }

    // Crear el FormData con los valores del formulario
    const payload = new FormData();
    payload.append("title", title);
    payload.append("document_type_id", documentTypeId);
    payload.append("type_ids", selectedTypes);

    // Solo agregar el archivo si fue modificado
    if (file) {
      payload.append("document", file);
    }

    try {
      // Llamar la función de actualización de documento con el ID
      await updateDocument(id, payload);

      // Redirigir a una página de éxito o a donde sea necesario
      navigate("/dashboard/documento_exitoso", {
        state: {
          origen: "editar_documento",
          id: id,
        },
      });
    } catch (error) {
      alert("Error al guardar los cambios. Por favor, inténtalo nuevamente.");
    }
  };

  const handleDelete = async (id) =>
  {
    try
    {
      await deleteDocument(id);
      navigate("/dashboard/documento_exitoso", {
        state: {
          origen: "eliminar_documento",
          id: id,
        },
      });
    } catch (error)
    {
      console.error("Failed to delete document:", error);
    }
  };

  const handleBackButtonClick = () =>
  {
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
          <span className="mb-0"><u>Volver</u></span>
        </button>
      </div>

      <div className="w-50 pl-2 text-sans-h3 align-self-center">
        Documentos: Editar documento
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
          <ListDocument
            setSelectedTypes={setSelectedTypes}
            selectedTypes={selectedTypes}
            documentId={document?.id}
          />

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
          </div>

          <div className="my-5">
            <span>Archivo para descarga (Obligatorio)</span>
            <p>(peso máximo 20 MB, PDF )</p>
            <div>
              <input
                type="file"
                ref={fileInputRef}
                accept=".pdf"
                onChange={handleFileChange}
                style={{ display: "none" }}
              />
              {file ? (
                <div className="my-5 d-flex justify-content-between neutral-container p-4">
                  <div className="me-3 my-auto">{file.name}</div>
                  <button
                    type="button"
                    className="btn-principal-s d-flex justify-content-between"
                    onClick={() => fileInputRef.current.click()}
                  >
                    <i className="material-symbols-rounded me-2">upload_2</i>
                    <u>Modificar Archivo</u>
                  </button>
                </div>
              ) : document?.document ? (
                <div className="container d-flex flex-row neutral-container p-4">
                  <div className="col text-break"> {document.document.split('/').pop()}</div>
                  <div className="col d-flex mx-2">
                    <a className="blue-ghost-btn mx-2" href={document.document} target="_blank" rel="noopener noreferrer">Ver Archivo</a>
                    <button
                      type="button"
                      className="btn-principal-s d-flex justify-content-between"
                      onClick={() => fileInputRef.current.click()}
                    >
                      <i className="material-symbols-rounded me-2">upload_2</i>
                      <u>Modificar Archivo</u>
                    </button>
                  </div>
                </div>
              ) : null}
              {fileError && <p className="text-danger">{fileError}</p>}
            </div>
          </div>

          <div className="d-flex justify-content-between">
            <button
              type="button"
              className="red-btn d-flex justify-content-between"
              onClick={() => handleDelete(document.id)}
            >
              <i className="material-symbols-rounded me-2">delete</i>
              <u>Eliminar Documento</u>
            </button>
            <button
              type="button"
              className="btn-principal-s d-flex justify-content-between"
              onClick={handleSaveChanges}
            >
              <i className="material-symbols-rounded me-2">save</i>
              <u> Guardar cambios</u>
            </button>
          </div>
        </div>
      </div>
    </div >
  );
};

export default EditDocuments;
