import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import icon from "../../../../static/img/icons/InfoBlue.svg";
import EvaluarSeccion from "../../../../components/Dashboard/EvaluarSeccion";

const EvaluarProyecto = () => {
  const [comentario, setComentario] = useState("");
  const [todasLasSelecciones, setTodasLasSelecciones] = useState({
    contenido: [],
    imagenes: [],
    documentos: [],
  });
  const [mostrarResumen, setMostrarResumen] = useState(false);
  const [allAccepted, setAllAccepted] = useState(false);
  const [anyNotAccepted, setAnyNotAccepted] = useState(false);

  // Maneja boton de volver atras
  const history = useNavigate();
  const handleBackButtonClick = () => {
    history(-1); 
  };

  // Opciones EvaluarSeccion Contenido
  const opcionesEvaluarContenido = [
    { value: 'Error en el título', label: 'Error en el título' },
    { value: 'Error en la descripción del proyecto', label: 'Error en la descripción del proyecto' },
    { value: 'Programa incorrecto', label: 'Programa incorrecto' },
    { value: 'Tipo de proyecto incorrecto', label: 'Tipo de proyecto incorrecto' },
    { value: 'Región incorrecta', label: 'Región incorrecta' },
    { value: 'Comuna incorrecta', label: 'Comuna incorrecta' },
    { value: 'Código SUBDERE incorrecto', label: 'Código SUBDERE incorrecto' },
  ];

  // Opciones EvaluarSeccion Imagenes
  const opcionesEvaluarImgs = [
    { value: 'Foto de portada con problemas', label: 'Foto de portada con problemas' },
    { value: 'Fotos de la galería con problemas', label: 'Fotos de la galería con problemas' },
    { value: 'Fotos antes y despues con problemas', label: 'Fotos antes y despues con problemas' },
    { value: 'Video del proyecto con problemas', label: 'Video del proyecto con problemas' },
  ];

  // Opciones EvaluarSeccion Documentos
  const opcionesEvaluarDocs = [
    { value: 'Especificaciones Técnicas incorrectas o con errores', label: 'Especificaciones Técnicas incorrectas o con errores' },
    { value: 'Presupuesto incorrecto o con errores', label: 'Presupuesto incorrecto o con errores' },
    { value: 'Otros documentos del proyecto con errores', label: 'Otros documentos del proyecto con errores' },
  ];

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
    <div className="container view-container ms-4">
      <h1 className="text-sans-h2 mb-3 mt-2">Banco de Proyectos: Ver solicitud</h1>
      <button className="btn-secundario-s d-flex mb-4" onClick={handleBackButtonClick}>
        <i className="material-symbols-rounded me-2">arrow_back_ios</i>
        <p className="mb-0 text-decoration-underline">Volver atrás</p>
      </button>

      {/* Mensaje */}
      <div className="conainer d-flex justify-content-center my-5">
        <div className="tertiary-container d-flex col-9 p-3 px-5">
          <div className="col-2 d-flex align-items-center">
            <img className="" src={icon} />
          </div>
          <div>
            <h2 className="text-sans-h2">Esta solicitud está pendiente de evaluación</h2>
            <p className="text-sans-p">Revisa que está todo bien para enviar la solicitud de publicación al final de esta página.</p>
          </div>
        </div>
      </div>

      {/* Detalles del proyecto */}
      <div className="dashed-container my-5 p-2">
        <h1 className="text-sans-h1 ms-5 my-3">Titulo  del Proyecto - dinamico</h1>
        <div className="neutral-container mx-5 my-5 p-3">
          <h3 className="text-sans-h2">Descripción del proyecto</h3>
          <p className="text-sans-p">descripcion - dinamico</p>
        </div>

        <div className="mx-5">traer tabla de la otra vista</div>

        <div className="mx-5">
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
      <div className="dashed-container my-5 p-2">
        <h2 className="text-sans-h2 ms-5">Imágenes del proyecto</h2>
        <div className="col-5">
          <div className="img-l ms-5 my-3"></div>
        </div>
        <div className="d-flex flex-row text-sans-h5-blue mt-2 ms-5">
          <i className="material-symbols-rounded me-2">info</i>
          <p className="pt-1">La foto de portada será la primera que se verá en la galería y en el buscador de proyectos.</p>
        </div>

        <h3 className="text-sans-h3 ms-5">Imágenes para la gallería</h3>
        <p className="text-sans-h5 ms-5">(máximo 10 imágenes)</p>
        <div className="ms-5 my-3 text-danger">IMPORTAR AQUI COMPONENTE MINIATURASCARRUSEL, CONECTAR AL BACK</div>

        <h3 className="text-sans-h3 ms-5">Antes del proyecto</h3>
        <div className="col-5">
          <div className="img-l ms-5 my-3"></div>
        </div>
        <h3 className="text-sans-h3 ms-5">Después del proyecto</h3>
        <div className="col-5">
          <div className="img-l ms-5 my-3"></div>
        </div>

        <h2 className="text-sans-h2 ms-5">Video del proyecto</h2>
        <div className="col-5">
          <div className="img-l ms-5 my-3"></div>
        </div>
        
        <div className="mx-5">
          <EvaluarSeccion 
          opciones={opcionesEvaluarImgs}
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

      {/* Documentos del proyecto */}
      <div className="dashed-container my-5 p-2">
        <h3 className="text-sans-h2 ms-5">Documentos del proyecto</h3>
        <h4 className="text-sans-h4 ms-5">Documentos Obligatorios</h4>
        <p className="text-sans-h5 ms-5">(Máximo 1 archivo, peso máximo 5 MB, formato PDF)</p>
        <div className="ms-5">TABLA 1</div>
        <h4 className="text-sans-h4 ms-5">Documentos Adicionales (Opcionales)</h4>
        <p className="text-sans-h5 ms-5">(Número de archivos máximo, peso máximo 20 MB, formato libre)</p>
        <div className="ms-5">TABLA 2</div>

        <h3 className="text-sans-h2 ms-5">Documentos con normativa de uso general</h3>
        <div className="ms-5">TABLA 3</div>

        <div className="mx-5">
          <EvaluarSeccion 
          opciones={opcionesEvaluarDocs}
          onCheckboxSelect={(seleccionados) => {
            setTodasLasSelecciones((prevSelecciones) => ({
              ...prevSelecciones,
              documentos: seleccionados,
            }));
          }}
          onReject = {handleReject}
          />
        </div>
      </div>

      {/* Resumen evaluacion */}
      <div className="col-11 mx-5">
        {mostrarResumen && (anyNotAccepted || !allAccepted) && (
        <div>
          <h3 className="text-sans-h3-tertiary">Evaluación de la solicitud</h3><p className="text-sans-p-tertiary">Marcaste que estas secciones tienen problemas:</p><div className="container row mt-4 mb-5">
              {todasLasSelecciones.contenido.length > 0 && (
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
              {todasLasSelecciones.documentos.length > 0 && (
                <div className="col-4">
                  <div>
                    <p className="text-sans-p ms-3">Sección 3</p>
                    <div>
                      {todasLasSelecciones.documentos.map((seleccion, index) => (
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
              {todasLasSelecciones.contenido.length === 0 && todasLasSelecciones.imagenes.length === 0 && todasLasSelecciones.documentos.length === 0 && (
                <div className="col-8">
                  <p className="text-sans-p-bold-darkred ms-3">Debes justificar tu evaluación en cada sección rechazada.</p>
                </div>
              )}
            </div><div className="d-flex">
                <p className="text-sans-p-tertiary"><strong>Por lo tanto la solicitud será:</strong></p>
                <p className="text-sans-p ms-2 border ms-5">etiqueta</p>
              </div><p className="text-sans-p-tertiary">Esta retroalimentación le llegará a $userName(solicitante), si crees que necesita más detalles para hacer las correcciones, puedes agregarlos a continuación.</p><div className="d-flex flex-column input-container mt-4">
                <label className="text-sans-p input-label ms-3 ms-sm-0" htmlFor="message">Comentarios (Opcional)</label>
                <textarea
                  className="input-l p-3"
                  id="message"
                  placeholder="Escribe un comentario adicional."
                  value={comentario}
                  onChange={(e) => setComentario(e.target.value)}
                ></textarea>
              </div><div className="d-flex justify-content-end">
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

export default EvaluarProyecto; 