import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import icon from "../../../../static/img/icons/InfoBlue.svg"
import EvaluarSeccion from "../../../../components/Dashboard/EvaluarSeccion";
import MiniaturasCarousel from "../../../../components/Dashboard/MiniaturasCarrusel";
import useApiInnovativeProjects from "../../../../hooks/useApiInnovativeProjects";

const EvaluarInnovador = () => {
  const [comentario, setComentario] = useState("");
  const [miniaturas, setMiniaturas] = useState([]);
  const [todasLasSelecciones, setTodasLasSelecciones] = useState({
    contenido: [],
    imagenes: [],
  });
  const [mostrarResumen, setMostrarResumen] = useState(false);
  const [allAccepted, setAllAccepted] = useState(false);
  const [anyNotAccepted, setAnyNotAccepted] = useState(false);

  const { getInnovativeProjectById } = useApiInnovativeProjects();
  // Aqui entregar el id del proyecto de manera dinamica.
  const id = '23';

  // Maneja boton de volver atras
  const history = useNavigate();
  const handleBackButtonClick = () => {
    history(-1); 
  };

  // Opciones EvaluarSeccion Contenido
  const opcionesEvaluarContenido = [
    { value: 'Error en el título', label: 'Error en el título' },
    { value: 'Error en la descripción', label: 'Error en la descripción' },
    { value: 'Fuente no corresponde', label: 'Fuente no corresponde' },
  ];

  // Opciones EvaluarSeccion Img
  const opcionesEvaluarImg = [
    { value: 'Foto de portada con problemas', label: 'Foto de portada con problemas' },
    { value: 'Fotos de la galería con problemas', label: 'Fotos de la galería con problemas' },
  ];

  // Cargar miniaturas de imagenes
  useEffect(() => {
    getInnovativeProjectById(id)
      .then((projectData) => {
        if (projectData && projectData.innovative_gallery_images) {
          setMiniaturas(projectData.innovative_gallery_images);
        }
      })
      .catch((error) => {
        console.error('Error al cargar las miniaturas de imágenes', error);
      });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Maneja calificacion "no" en EvaluarSeccion
  const handleReject = () => {
    setAnyNotAccepted(true);
    setMostrarResumen(true);
  };

  useEffect(() => {
    const contenidoAccepted = todasLasSelecciones.contenido.every((seleccion) => seleccion === 'Si');
    const imagenesAccepted = todasLasSelecciones.imagenes.every((seleccion) => seleccion === 'Si');
    setAllAccepted(contenidoAccepted && imagenesAccepted);

    if (contenidoAccepted && imagenesAccepted) {
      setMostrarResumen(false);
    }
  }, [todasLasSelecciones]);

  return (
    <div className="container view-container ms-5">
      <h1 className="text-sans-h2 mb-3 mt-2">Proyectos Innovadores: Ver solicitud</h1>
      <button className="btn-secundario-s d-flex mb-4" onClick={handleBackButtonClick}>
        <i className="material-symbols-rounded me-2">arrow_back_ios</i>
        <p className="mb-0 text-decoration-underline">Volver atrás</p>
      </button>

      {/* Mensaje */}
      <div className="d-flex justify-content-center my-5">
        <div className="tertiary-container d-flex col-8 p-3">
          <div className="col-1 d-flex align-items-center">
            <img className="" src={icon} />
          </div>
          <div className="col ms-2">
            <h2 className="text-sans-h2">Esta solicitud está pendiente de evaluación</h2>
            <p className="text-sans-p">Revisa que está todo bien para enviar la solicitud de publicación al final de esta página.</p>
          </div>
        </div>
      </div>

      <div className="d-flex my-5">
        {/* Descripcion del proyecto */}
        <div className="dashed-container d-flex flex-column justify-content-between col-5 p-3">
          <div className="">
            <h3 className="text-sans-h2">Titulo - dinamico</h3>
            <p className="text-sans-p"> Descripcion - dinamico</p>
            <ul>
              <li className="d-flex text-sans-p-tertiary">
                <p className="text-decoration-underline">Visitar fuente 1</p>
                <i className="material-symbols-rounded ms-2 pt-1">open_in_new</i>
              </li>
            </ul>
          </div>

          <div className="mt-4">
            <EvaluarSeccion
              opciones={opcionesEvaluarContenido}
              onCheckboxSelect={(seleccionados) => {
                setTodasLasSelecciones((prevSelecciones) => ({
                  ...prevSelecciones,
                  contenido: seleccionados,
                }));
              }}
              onReject = {handleReject}
            />
          </div>
        </div>

        {/* Imagenes del proyecto */}
        <div className="dashed-container d-flex flex-column justify-content-between ms-3 col-6 p-3">
          <div>
            <h3 className="text-sans-h35">Imagen de Portada</h3>
            <div className="img-l"></div>
            <h3 className="text-sans-h35">Imágenes para la galería</h3>
            <div className="">
              <MiniaturasCarousel img={miniaturas}/>
            </div>
          </div>

          <div className="mt-4">
            <EvaluarSeccion
              opciones={opcionesEvaluarImg}
              onCheckboxSelect={(seleccionados) => {
                setTodasLasSelecciones((prevSelecciones) => ({
                  ...prevSelecciones,
                  imagenes: seleccionados,
                }));
              }}
              onReject = {handleReject}
            />
          </div>
        </div>
      </div>

     {/* Resumen evaluacion */}
     <div className="col-11">
      {mostrarResumen && (anyNotAccepted || !allAccepted) && (
        <div>
          <h3 className="text-sans-h3-tertiary">Evaluación de la solicitud</h3>
          <div className="container row mt-4 mb-5">
            {todasLasSelecciones.contenido.length > 0 && (
            <>
            <p className="text-sans-p-tertiary">Marcaste que estas secciones tienen problemas:</p>
            <div className="col-4">
              <div>
                <p className="text-sans-p ms-3">Sección 1</p>
                <div>
                  {todasLasSelecciones.contenido.map((seleccion, index) => (
                    <div 
                    key={seleccion} 
                    className={`d-flex py-4 text-sans-h5-red ${index % 2 === 0 ? 'grey-table-line' : 'white-table-line'}`}
                    >
                      <i className="material-symbols-rounded ms-3">warning</i>
                      <p className="text-sans-p ms-4 mb-0">{seleccion}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            </>
            )}
            {todasLasSelecciones.imagenes.length > 0 && (
            <div className="col-4">
              <div>
                <p className="text-sans-p ms-3">Sección 2</p>
                <div>
                  {todasLasSelecciones.imagenes.map((seleccion, index) => (
                    <div 
                    key={seleccion} 
                    className={`d-flex py-4 text-sans-h5-red ${index % 2 === 0 ? 'grey-table-line' : 'white-table-line'}`}
                    >
                      <i className="material-symbols-rounded ms-2 red-icon">warning</i>
                      <p className="text-sans-p ms-4 mb-0">{seleccion}</p>
                  </div>
                  ))}
                </div>
              </div>
            </div>
            )}
            {/* Mensaje si no hay selecciones */}
            {todasLasSelecciones.contenido.length === 0 && todasLasSelecciones.imagenes.length === 0 && (
              <div className="col-8">
                <p className="text-sans-p-bold-darkred ms-3">Debes justificar tu evaluación en cada sección rechazada.</p>
              </div>
            )}
          </div>

          <div className="d-flex">
            <p className="text-sans-p-tertiary"><strong>Por lo tanto la solicitud será:</strong></p>
            <p className="text-sans-p ms-2 border ms-5">etiqueta</p>
          </div>
          <p className="text-sans-p-tertiary">Esta retroalimentación le llegará a $userName(solicitante), si crees que necesita más detalles para hacer las correcciones, puedes agregarlos a continuación.</p>

          <div className="d-flex flex-column input-container mt-4">
            <label className="text-sans-p input-label ms-3 ms-sm-0" htmlFor="message">Comentarios (Opcional)</label>
            <textarea
              className="input-l p-3"
              id="message"
              placeholder="Escribe un comentario adicional."
              value={comentario}
              onChange={(e) => setComentario(e.target.value)}
            ></textarea>
          </div>
          <div className="d-flex justify-content-end mt-1">
            <p className="text-sans-h5">{comentario.length} / 200 caracteres</p>
          </div>
        </div>
        )}

        <div className="d-flex justify-content-between my-5">
          <button className="btn-secundario-s d-flex"  onClick={handleBackButtonClick}>
            <i className="material-symbols-rounded me-2">arrow_back_ios</i>
            <p className="mb-0">Volver a Solicitudes de Proyectos</p>
          </button>
          <button className="btn-principal-s d-flex">
            <p className="mb-0">Enviar evaluación</p>
            <i className="material-symbols-rounded ms-2">arrow_forward_ios</i>
          </button>
        </div>
      </div>

    </div>
  )
}

export default EvaluarInnovador; 