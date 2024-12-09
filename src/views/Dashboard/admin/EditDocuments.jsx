import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import CustomInput from "../../../components/Form/custom_input";
import { useDocumentTypes } from "../../../hooks/useTypeDocuemnts";
import { useApiDocuments } from "../../../hooks/useApiDocuments";

const EditDocuments = () =>
{
  const navigate = useNavigate();
  const { id } = useParams();
  const { document, fetchDocumentById } = useApiDocuments();
  const { documentTypes } = useDocumentTypes();

  useEffect(() =>
  {
    if (id)
    {
      fetchDocumentById(id);
    }
  }, [ id, fetchDocumentById ]);



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
          <p className="mb-0">Volver</p>
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
            value={document?.title || ""}
            error=""
          />

          <div className="my-5">
            <p className="text-sans-p">Elige tipo de documento (Obligatorio)</p>
            <select className="custom-selector p-3" id="program-select" value="">
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
              {/* Botón personalizado para cargar el archivo */}
              <button
                type="button"
                className="btn-principal-s d-flex justify-content-between my-3"
                onClick={() => document.getElementById("fileInput").click()}
              >
                <i className="material-symbols-rounded me-2">upload_2</i>
                Subir Archivo
              </button>

              {/* Input de tipo file oculto */}
              <input
                type="file"
                id="fileInput"
                accept=".pdf"
                style={{ display: "none" }}
                onChange=""
              />
              <div className="my-5 d-flex justify-content-between neutral-container p-4">
                <div className="me-3">{document?.document ? document.document.split('/').pop() : ''}</div>
                <div>
                  <button className="red-ghost-btn px-3 py-1 d-flex justify-content-between"><u>Borrar</u>
                  <i className="material-symbols-rounded me-2">delete</i>
                  </button>
                  </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditDocuments;
