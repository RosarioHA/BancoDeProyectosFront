import { useLocation } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import successIcon from '../../../static/img/icons/Success.svg';

const SuccessBuenasPracticas = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const origen = location.state?.origen;

  const handleButtonClick = () => {
    // Redirige al dashboard de documentos en todos los casos.
    navigate('/dashboard/buenas_practicas');
  };

  // Mensajes personalizados según el origen
  const getTitleMessage = () => {
    switch (origen) {
      case "editar_buenas_practicas":
        return "Editaste la buenas práctica con éxito";
      case "crear_buena_practica":
        return "Creaste la buena práctica con éxito";
      case "eliminar_buena_practica":
        return "Se eliminó la buena práctica con éxito";
      default:
        return "Operación realizada con éxito";
    }
  };

  const getDescriptionMessage = () => {
    switch (origen) {
      case "eliminar_buena_practica":
        return "La buena práctica ha sido eliminada correctamente.";
      case "editar_buenas_practicas":
        return "La buena práctica fue editada correctamente.";
      case "crear_buena_practica":
        return "La buena práctica fue creada correctamente.";
      default:
        return "La operación fue completada exitosamente.";
    }
  };

  return (
    <div className="container ps-5 ms-5">
      <h2 className="text-sans-h2 mt-3">Administrar Buenas Prácticas</h2>

      <div className="success-container col-7 p-3 px-5 my-5">
        <div className="row align-items-center">
          <div className="col-3">
            <img src={successIcon} alt="Éxito" />
          </div>
          <div className="col-9">
            <h2 className="text-sans-h2 mb-4">{getTitleMessage()}</h2>
            <p className="text-sans-p">{getDescriptionMessage()}</p>
          </div>
        </div>
      </div>

      <div className="col-10 d-flex justify-content-center mt-5">
        <button
          className="btn-secundario-s d-flex justify-content-between"
          onClick={handleButtonClick}
        >
          <i className="material-symbols-rounded me-2">arrow_back_ios</i>
          <p className="mb-0 text-decoration-underline">Volver</p>
        </button>
      </div>
    </div>
  );
};

export default SuccessBuenasPracticas;
