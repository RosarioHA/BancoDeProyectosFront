import { useState, useEffect } from "react";
import { ModalBase } from "./ModalBase";
import useApiInnovativeProjects from "../../hooks/innovativeProject/useInnovativeAdminDetail";

const ModalAgregarFuente = ({ projectId,  onRefresh }) =>
{
  const [ newWebSource, setNewWebSource ] = useState("");
  const [ webSources, setWebSources ] = useState([]);
  const [ modalVisible, setModalVisible ] = useState(false);
  const { getInnovativeProjectById, createWebSource} = useApiInnovativeProjects();

  useEffect(() =>
  {
    const fetchWebSources = async () =>
    {
      const project = await getInnovativeProjectById(projectId);
      if (project && project.web_sources)
      {
        setWebSources(project.web_sources);
      }
    };
    fetchWebSources();
  }, [ projectId, getInnovativeProjectById ]);

  const addNewWebSource = async () =>
  {
    if (newWebSource)
    {
      const updatedWebSources = {url: `https://${newWebSource}`};
      const result = await  createWebSource(projectId,  updatedWebSources );
      onRefresh(); 
      if (result)
      {
        setWebSources(updatedWebSources);
        setNewWebSource("");
        setModalVisible(false);
      }
    }
  };

  console.log('ws', webSources)

  return (
    <>
      <ModalBase
        btnName="Agregar fuentes"
        btnIcon="add"
        title="Agregar fuente (Opcional)"
        modalID="ModalAgregarFuente"
        visible={modalVisible}
        classStyle="btn-secundario-s"
        onClose={() => setModalVisible(false)}
      >
        <p>Enlace de la fuente referencial:</p>
        <div className="input-group-prepend d-flex">
          <span className="input-group-text">https://</span>
          <input
            type="text"
            className="form-control"
            placeholder="Ingrese la dirección web"
            value={newWebSource}
            onChange={(e) => setNewWebSource(e.target.value)}
          />
        </div>

        <hr />
        <div className="d-flex justify-content-between">
          <button className="btn-secundario-s d-flex align-items-center" data-bs-dismiss="modal">
            <i className="material-symbols-rounded">chevron_left</i>
            <p className="text-decoration-underline mb-0">Volver a la solicitud</p>
          </button>
          <button className="btn-principal-s d-flex align-items-center" onClick={addNewWebSource} data-bs-dismiss="modal">
            <i className="material-symbols-rounded">add</i>
            <p className="text-decoration-underline mb-0">Agregar Fuentes</p>
          </button>
        </div>
      </ModalBase>
    </>
  );
};

export default ModalAgregarFuente;
