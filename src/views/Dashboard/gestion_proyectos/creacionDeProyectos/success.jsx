import { useLocation } from 'react-router-dom';
import successIcon from '../../../../static/img/icons/Success.svg'

const SuccessViews = () => {

  const location = useLocation();
  const origen = location.state?.origen;

  let tituloComplemento = "";
  if (origen === "ProyectosInnovadores") {
    tituloComplemento = "Proyectos Innovadores";
  } else {
    tituloComplemento = "Banco de Proyectos";
  }

  return (
    <div className="container view-container ms-5">
      {/* Titulo deberia ser condicional, segun de donde venga el usuario */}
      <h1 className="text-sans-h1 mt-3 mb-5">Subir Proyecto: {tituloComplemento}</h1>

      <div className="success-container col-7 p-3 px-5">
        <div className="row align-items-center">
          <div className="col-3">
            <img src={successIcon} />
          </div>
          <div className="col-9">
            <h2 className="text-sans-h2 mb-4">Enviaste tu solicitud con éxito</h2>
            <p className="text-sans-p">Esto es solo una vista previa de cómo se verá el proyecto una vez que sea aprobado para su publicación.</p>
            <p className="text-sans-p mt-2">Revisa que está todo bien para enviar la solicitud de publicación al final de esta página.</p>
          </div>
        </div>
        
      </div>
    </div>   
  );
}
  
export default SuccessViews ;
  