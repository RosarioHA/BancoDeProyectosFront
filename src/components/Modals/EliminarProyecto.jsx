import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ModalBase from './ModalBase'; // Asumiendo que tienes ModalBase en la misma carpeta
import { useDeleteProject } from '../../hooks/proyectos/useDeleteProject';
import { useDeleteInnovative } from '../../hooks/innovativeProject/useDeleteInnovative';
import { useDeleteGoodPractices } from '../../hooks/goodPractices/useDeleteGoodPractices';

export const DeleteProjectModal = ({ slug, name,type, buttonText }) =>
{
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

  const {
    deleteGoodPractices,
    error: errorGoodPractices,
    loading: loadingGoodPractices,
    success: successGoodPractices,
  } = useDeleteGoodPractices();

  const [ isDeleted, setIsDeleted ] = useState(false);
  const navigate = useNavigate();

  const handleDelete = async () =>
  {
    try
    {
      if (type === 'standard')
      {
        await deleteProject(slug);
      } else if (type === 'innovative')
      {
        await deleteInnovative(slug);
      } else if (type === 'goodPractice')
      {
        await deleteGoodPractices(slug);
      }
    } catch (err)
    {
      console.error("Error al eliminar el recurso", err);
    }
  };

  const success =
    type === 'standard'
      ? successStandard
      : type === 'innovative'
        ? successInnovative
        : successGoodPractices;

  const error =
    type === 'standard'
      ? errorStandard
      : type === 'innovative'
        ? errorInnovative
        : errorGoodPractices;

  const loading =
    type === 'standard'
      ? loadingStandard
      : type === 'innovative'
        ? loadingInnovative
        : loadingGoodPractices;

  useEffect(() =>
  {
    if (success)
    {
      setIsDeleted(true);
    }
  }, [ success ]);

  return (
    <ModalBase
      btnName="Eliminar"
      btnIcon="delete"
      title={`${name} será eliminado permanentemente`}
      modalID="deleteResourceModal"
      classStyle="btn-logout d-flex mx-4"
      titleStyle="ms-5 ps-5 text-sans-h3"
    >
      {!isDeleted ? (
        <div className="container">
          <div className="row">
            <div className="col-2 align-content-center px-5 my-5 text-sans-xl-danger">
              <i className="material-symbols-rounded ms-2 fs-1 fw-bolder">warning</i>
            </div>
            <div className="col-9 my-4 my-5 ms-5">
              <span className="text-sans-h4">
                Una vez que aceptes eliminar <u>{name || ""}</u> ,
                no podrá ser recuperado<br />
                y para volver a publicarlo
                en el sitio web, deberás crearlo nuevamente.
              </span>
            </div>
            {error && <div style={{ color: 'red' }} className="d-flex justify-content-center">{error}</div>}
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
          <span className="text-sans-h4">{name || ""} ha sido eliminado exitosamente.</span>
          <div className="d-flex justify-content-center">
            <button
              className="btn-secundario-s"
              data-bs-dismiss="modal"
              onClick={() =>
                navigate(
                  type === 'standard'
                    ? '/dashboard/administrar_proyectos'
                    : type === 'innovative'
                      ? '/dashboard/administrar_proyectos_innovadores'
                      : '/dashboard/buenas_practicas'
                )
              }
            >
              Volver a administrar {buttonText}
            </button>
          </div>
        </div>
      )}
    </ModalBase>
  );
};
