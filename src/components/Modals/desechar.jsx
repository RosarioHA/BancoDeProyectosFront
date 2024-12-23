import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ModalBase from './ModalBase'; // Asumiendo que tienes ModalBase en la misma carpeta
import { useDeleteProject } from '../../hooks/proyectos/useDeleteProject';
import { useDeleteInnovative } from '../../hooks/innovativeProject/useDeleteInnovative'

export const Desechar = ({ slug,  text, type }) => {
  const {
    deleteProject,
    error: errorStandard,
    loading: loadingStandard,
    success: successStandard,
  } = useDeleteProject();

  const {
    deleteInnovative,
    error: errorInnovative,
    loading: loadingInnovative,
    success: successInnovative,
  } = useDeleteInnovative();

  const [isDeleted, setIsDeleted] = useState(false);
  const navigate = useNavigate();

  const handleDelete = async () => {
    try {
      if (type === 'standard') {
        await deleteProject(slug);
      } else if (type === 'innovative') {
        await deleteInnovative(slug);
      }
    } catch (err) {
      console.error("Error al eliminar el proyecto", err);
    }
  };

  const success = type === 'standard' ? successStandard : successInnovative;
  const error = type === 'standard' ? errorStandard : errorInnovative;
  const loading = type === 'standard' ? loadingStandard : loadingInnovative;

  useEffect(() => {
    if (success) {
      setIsDeleted(true);
    }
  }, [success]);

  return (
    <ModalBase
      btnName="Desechar solicitud"
      btnIcon="delete"
      title='¿Estás seguro de que quieres eliminar este proyecto?'
      modalID="deleteProjectModal"
      classStyle="red-btn text-sans-h4 d-flex "
      titleStyle="ms-5 ps-5 text-sans-h3"
    >
      {!isDeleted ? (
        <div className="container">
          <div className="row">
            <div className="col-2 align-content-center px-5 my-5 text-sans-xl-danger">
              <i className="material-symbols-rounded ms-2 fs-1 fw-bolder">warning</i>
            </div>
            {error && <div style={{ color: 'red' }} className="d-flex justify-content-center">{error}</div>}
            <div className="col mx-5 mt-4 d-flex justify-content-end">
              <div className="d-flex align-content-end">
                <button
                  className="btn-secundario-s ms-2 my-5"
                  onClick={() => navigate(-1)}
                  data-bs-dismiss="modal"
                >
                  <u>Volver atrás</u>
                </button>
                <button
                  className="btn-logout d-flex mx-4 text-sans-p-bold-darkred my-5 me-5"
                  onClick={handleDelete}
                  disabled={loading}
                  type="button"
                >
                  <u>Eliminar solicitud</u>
                  <i className="material-symbols-rounded ms-2">delete</i>
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="container text-center">
          <span className="text-sans-h4">La solicitud ha sido eliminada exitosamente.</span>
          <div className="d-flex justify-content-center">
          <button
              className="btn-secundario-s"
              data-bs-dismiss="modal"
              onClick={() => navigate(
                type === 'standard'
                  ? '/dashboard/administrar_proyectos'
                  : '/dashboard/administrar_proyectos_innovadores'
              )}
            >
              Volver a administrar proyectos {text}
            </button>
          </div>
        </div>
      )}
    </ModalBase>
  );
};
