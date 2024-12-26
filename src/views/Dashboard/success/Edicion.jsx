import { useLocation } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import successIcon from '../../../static/img/icons/Success.svg'

const SuccessEdicion = () =>
{


  const history = useNavigate();

  const location = useLocation();
  const origen = location.state?.origen;
  const id = location.state?.id;


  const handleButtonClick = () =>
  {
    // Verifica que id tenga un valor antes de intentar acceder a sus propiedades
    if (id)
    {
      // Realizar la navegación condicional según la procedencia del usuario
      switch (origen)
      {
        case "editar_usuario":
          history(`/dashboard/gestion_usuarios`);
          break;
        case "editar_perfil":
          history(`/dashboard`);
          break;
        default:
          history('/dashboard');
      }
    } else
    {
      console.error("El ID del usuario es nulo o indefinido.");
    }
  }


  return (
    <div className="container ps-5 ms-5">
      <h2 className="text-sans-h2 mt-3">Administrar Usuarios</h2>
      <h3 className="text-sans-h3 mt-3 mb-5">Editar Usuario</h3>

      <div className="success-container col-7 p-3 px-5">
        <div className="row align-items-center">
          <div className="col-3">
            <img src={successIcon} alt="Éxito" />
          </div>
          <div className="col-9">
            <h2 className="text-sans-h2 mb-4">Editaste un usuario con éxito</h2>
            <p className="text-sans-p">Descripción detallada del éxito de la operación realizada.</p>
          </div>
        </div>
      </div>

      <div className="col-10 d-flex justify-content-center mt-5">
        <button className="btn-secundario-s  d-flex justify-content-between" onClick={handleButtonClick}>
          <i className="material-symbols-rounded me-2">arrow_back_ios</i>
          <p className="mb-0 text-decoration-underline">Volver</p>
        </button>
      </div>
    </div>
  );
}

export default SuccessEdicion;
