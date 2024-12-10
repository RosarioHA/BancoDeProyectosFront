// import Notification from "../../../components/Commons/Notification";
import { useAuth } from "../../../context/AuthContext";
// import useApiAdminNotificacions from "../../../hooks/useApiAdminNotificacions";

const HomeDashboard = () =>
{

  const { isLoggedIn, userData, } = useAuth();
  // const state = useApiAdminNotificacions();

  // const { data: dataInnovativeProjectNotificacions, 
  //         loading: loadingInnovativeProjectNotificacions, 
  //         error: errorInnovativeProjectNotificacions } = state.innovative_projects_notifications;

  // const { data: dataRecentActions,
  //         loading: loadingRecentActions,
  //         error: errorRecentActions } = state.recent_actions;

  return (
    <>
      <div className="container-home">
        <div className="container">
          <div className="row">
            <div className="col-12">
              {isLoggedIn && (
                <span className="text-sans-h2-tertiary" >Hola, {userData.full_name || userData.rut}</span>)}
              <div className='container-credential'>
                {/* <span className="text-sans-h4">
                {"Tienes permisos de "}
                <span className="text-sans-h35">
                  {userData.tipo_de_usuario} 
                  {userData.program ? ` ${userData.program.name}` : ""}
                </span>
              </span> */}
              </div>
            </div>
          </div>

          <div className="row">
            <div className="col-6 ">

              {/* Solicitudes de Banco de Proyectos  */}
              <div className="my-4">
                {/* <Notification
                  title="Banco de Proyectos"
                  count="0"
                /> */}
              </div>

              {/* Solicitudes de Proyectos Innovadores  */}
              {/* {dataInnovativeProjectNotificacions && (
                <div>
                  <div className="my-4">
                    <Notification
                      count={dataInnovativeProjectNotificacions.total_count}
                      title="Proyectos Innovadores"
                      ver_mas="dashboard/administrarproyectosinnovadores"
                      latest_projects={dataInnovativeProjectNotificacions.latest_projects.map(project => ({
                        status: project.application_status,
                        title: project.title,
                        date: project.modified,
                        id: project.id
                      }))}
                    />
                  </div>
                </div>
              )} */}

            </div>

            <div className="col-3">

              {/* Solicitudes de usuario  */}
              <div className="container-history my-4">
                {/* <Notification
                  title="Solicitudes de Usuarios"
                  count="0"
                /> */}
              </div>

              <div className="container-history my-4">
                <div className="title-history text-sans-h4"><i className="material-symbols-outlined">
                  history
                </i>Mis acciones recientes
                </div>
                <div>
                  <div className="body-history">
                    <ul className="list-group list-group-flush">
                      {/* Mostrar mensaje si no hay acciones recientes */}
                      {/* {!loadingRecentActions && dataRecentActions.length === 0 && (
                        <li className="list-group-item">Aun no haz realizado acciones dentro de la plataforma.</li>
                      )} */}

                      {/* Iterar y mostrar las acciones recientes */}
                      {/* {!loadingRecentActions && dataRecentActions.length > 0 && dataRecentActions.map((action, index) => (
                        <li key={index} className="list-group-item">
                          <div className="d-flex mb-1">
                            <div className="text-start text-sans-b-gray">{`${action.action}`}</div>
                            <div className="ms-auto text-sans-c-gray">{action.history_date}</div>
                          </div>
                          <div className="text-sans-p">{action.title}</div>
                        </li>
                      ))} */}

                      {/* Manejar errores */}
                      {/* {errorRecentActions && (
                        <li className="list-group-item">Hubo un error al cargar las acciones recientes.</li>
                      )} */}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
export default HomeDashboard;
