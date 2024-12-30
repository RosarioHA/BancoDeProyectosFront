import { useLocation, useNavigate } from 'react-router-dom';
import successIcon from '../../../../static/img/icons/Success.svg';

const SuccessViews = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const origen = location.state?.origen;
  const name = location.state?.name;

  let tituloComplemento = "";
  let redirectUrl = "/dashboard/administrar_proyectos"; 

  if (origen === "ProyectosInnovadores") {
    tituloComplemento = "Proyectos Innovadores";
    redirectUrl = "/dashboard/administrar_proyectos_innovadores";  
  } else {
    tituloComplemento = "Banco de Proyectos";
  }

  const handleRedirect = () => {
    navigate(redirectUrl); // Redirige a la URL adecuada
  };

  return (
    <div className="container view-container ms-5">
      {/* Titulo debería ser condicional, según de dónde venga el usuario */}
      <h1 className="text-sans-h1 mt-3 mb-5">Subir Proyecto: {tituloComplemento}</h1>

      <div className="success-container col-8 p-3 px-5">
        <div className="row align-items-center">
          <div className="col-3">
            <img src={successIcon} />
          </div>
          <div className="col-9">
            <h2 className="text-sans-h2 mb-4">Creaste el proyecto {name}, con éxito</h2>
            <p className="text-sans-p">El proyecto estará disponible en la sección <u>{tituloComplemento}</u>, donde podrás ver los detalles y editarlo si es necesario. </p>
            <p className="text-sans-p">Antes de su publicación, el proyecto debe ser revisado por un <u>Editor</u> o un <u>Usuario Administrador</u>.</p>
          </div>
        </div>
      </div>
        <div className="col-10 d-flex justify-content-center mt-5">
          <button className="btn-secundario-s d-flex justify-content-between " onClick={handleRedirect}>
            <p className="mb-0 text-decoration-underline mx-3">Ir a {tituloComplemento}</p>
          </button>
        </div>
    </div>   
  );
}

export default SuccessViews;
