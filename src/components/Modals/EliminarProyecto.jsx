import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ModalBase from './ModalBase';  // Asumiendo que tienes ModalBase en la misma carpeta
import { useDeleteProject } from '../../hooks/proyectos/useDeleteProject';

export const DeleteProjectModal = ({ slug, name }) => {
  const { deleteProject, error, loading, success } = useDeleteProject();
  const [isDeleted, setIsDeleted] = useState(false); 
  const navigate = useNavigate();

  const handleDelete = async () => {
    try {
      await deleteProject(slug); 
    } catch (err) {
      console.error("Error al eliminar el proyecto", err);
    }
  };

  useEffect(() => {
    if (success) {
      setIsDeleted(true); 
    }
  }, [success]); 

  return (
    <ModalBase
      btnName="Eliminar Proyecto"
      btnIcon="delete"
      title={`El proyecto ${name} será eliminado permanentemente`}
      modalID="deleteProjectModal"
      classStyle="btn-logout d-flex mx-4"
      titleStyle="ms-5 ps-5 text-sans-h3"
    >
      {!isDeleted ? (
        <div className="container">
          <div className="row">
            <div className="col-2 align-content-center px-5 my-5 text-sans-xl-danger">
              <i className="material-symbols-rounded ms-2 fs-1 fw-bolder">warning</i>
            </div>
            <div className='col-9 my-4 my-5 ms-5'>
              <span className="text-sans-h4">
                Una vez que aceptes eliminar el proyecto,
                no podrá ser recuperado<br />
                y para volver a publicarlo
                en el sitio web, deberás crear el proyecto nuevamente.
              </span>
            </div>
            {error && <div style={{ color: 'red' }}>{error}</div>}
            <div className="col mx-5 mt-4 d-flex justify-content-end">
              <div className="d-flex align-content-end">
                <button
                  className="btn-secundario-s ms-2"
                  onClick={() => navigate(-1)} 
                  data-bs-dismiss="modal"  
                >
                  <u>Volver atrás</u>
                </button>
                <button
                  className="btn-logout d-flex mx-4 text-sans-p-bold-darkred"
                  onClick={handleDelete}
                  disabled={loading}  
                  type="button"
                >
                    <u>Eliminar permanentemente</u>
                    <i className="material-symbols-rounded ms-2">delete</i>
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="container text-center">
          <span className="text-sans-h4">El proyecto ha sido eliminado exitosamente.</span>
          <div className="d-flex justify-content-center">
            <button
              className="btn-secundario-s"
              data-bs-dismiss="modal"  
              onClick={() => navigate('/dashboard/administrar_proyectos')}
            >
              Volver a administrar proyectos
            </button>
          </div>
        </div>
      )}
    </ModalBase>
  );
};
