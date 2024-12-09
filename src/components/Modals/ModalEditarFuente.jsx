import { useState, useEffect } from 'react';
import { ModalBase } from './ModalBase';
import useApiInnovativeProjects from '../../hooks/innovativeProject/useInnovativeAdminDetail';

const ModalEditarFuente = ({ projectId, webSource, sourceId, onRefresh }) =>
{
  const [ editedSource, setEditedSource ] = useState(webSource?.url || ''); // Inicializa con la URL o vacío.
  const { deleteWebSource, updateWebSource } = useApiInnovativeProjects();
  const [ loading, setLoading ] = useState(false);


  // Sincroniza editedSource cuando cambie webSource
  useEffect(() =>
  {
    setEditedSource(webSource?.url || '');
  }, [ webSource ]);

  // Función para editar la fuente
  const handleEditSource = async () =>
  {
    try
    {
      setLoading(true);
      await updateWebSource(projectId, webSource.id, { id: webSource.id, url: editedSource });
      onRefresh(); 
    } catch (error)
    {
      console.error('Error al actualizar la fuente web:', error);

    } finally
    {
      setLoading(false);
    }
  };

  // Función para eliminar la fuente
  const handleDeleteSource = async () =>
  {
    try
    {
      setLoading(true);
      await deleteWebSource(projectId, webSource.id);
      onRefresh(); 
    } catch (error)
    {
      console.error('Error al eliminar la fuente:', error);
    } finally
    {
      setLoading(false);
    }
  };

  return (
    <ModalBase
      classStyle="btn-secundario-s"
      btnName="Editar"
      btnIcon="edit"
      title="Editar fuente"
      modalID={`ModalEditarFuente-${sourceId}`} 
    >
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
          <p className="text-decoration-underline mb-0">Guardar Cambios</p>
        </button>
      </div>
    </ModalBase>
  );
};

export default ModalEditarFuente;
