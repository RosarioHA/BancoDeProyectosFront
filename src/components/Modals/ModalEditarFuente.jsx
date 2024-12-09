import { useState } from 'react';
import { ModalBase } from './ModalBase';
import useApiInnovativeProjects from '../../hooks/useApiInnovativeProjects';

const ModalEditarFuente = ({ projectId, webSourceId, updateWebSource }) => {
  const [editedSource, setEditedSource] = useState(webSourceId ? webSourceId.url : ''); 
  const { deleteWebSource } = useApiInnovativeProjects();
  const [loading, setLoading] = useState(false);


  const handleEditSource = async () => {
    try {
      setLoading(true);
      const updatedSource = await updateWebSource(projectId, webSourceId.id, { url: editedSource });
      if (updatedSource) {
        setEditedSource('');
        // Cerrar el modal aquí si es necesario
      }
    } catch (error) {
      console.error('Error al editar la fuente:', error);
    } finally {
      setLoading(false);
    }
  };
  
  const handleDeleteSource = async () => {
    try {
      if (webSourceId !== undefined) {
        setLoading(true);
        await deleteWebSource(projectId, webSourceId.id);
        // Mostrar una alerta con el mensaje de eliminado exitosamente
        window.alert('Fuente eliminada con éxito');
        // Cerrar el modal o realizar otras acciones después de eliminar la fuente
      } else {
        console.error('sourceId is undefined');
      }
    } catch (error) {
      console.error('Error al eliminar la fuente:', error);
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <>
      <ModalBase btnName="Editar" btnIcon="edit" title="Editar fuente" modalID="ModalEditarFuente">
        <p>Enlace de la fuente referencial:</p>
        <div className="input-group-prepend d-flex">
          <input
            type="text"
            className="form-control"
            placeholder="URL de la fuente"
            value={editedSource}
            onChange={(e) => setEditedSource(e.target.value)}
          />
        </div>
        <button
          className="red-ghost-btn d-flex mt-3"
          onClick={handleDeleteSource}
          disabled={loading}
          data-bs-dismiss="modal"
        >
          <p className="text-sans-p-bold-darkred text-decoration-underline mb-0">Borrar fuente</p>
          <i className="material-symbols-rounded ms-1 mt-1">delete</i>
        </button>

        <hr />

        <div className="d-flex justify-content-between">
          <button className="btn-secundario-s d-flex align-items-center" data-bs-dismiss="modal">
            <i className="material-symbols-rounded me-1">chevron_left</i>
            <p className="text-decoration-underline mb-0">Volver a la solicitud</p>
          </button>
          <button
            className="btn-principal-s d-flex align-items-center"
            onClick={handleEditSource}
            disabled={loading}
            data-bs-dismiss="modal"
          >
            <i className="material-symbols-rounded me-2">edit</i>
            <p className="text-decoration-underline mb-0">Editar Fuente</p>
          </button>
        </div>
      </ModalBase>
    </>
  );
};

export default ModalEditarFuente;