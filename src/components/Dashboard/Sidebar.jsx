import { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import useApiAdminNotificacions from '../../hooks/useApiAdminNotificacions';
import NotificationModal from '../Modals/ModalNotificacion';

export const Sidebar = () =>
{

  const [ openDropdownSidebar, setOpenDropdownSidebar ] = useState(false);
  // const state = useApiAdminNotificacions();

  // // const { data: dataInnovativeProjectNotificacions, 
  // //         loading: loadingInnovativeProjectNotificacions, 
  // //         error: errorInnovativeProjectNotificacions } = state.innovative_projects_notifications;
    
  // // const { data: dataUnreadCount,
  // //         loading: loadingUnreadCount,
  // //         error: errorUnreadCount } = state.unread_count;

  // // const { data: dataNotifications,
  // //         loading: loadingNotifications,
  // //         error: errorNotifications } = state.notifications;

  const [showModal, setShowModal] = useState(false);

  const handleNotificationsClick = () => {
    // // Llamar a markAsRead para marcar las notificaciones como leídas
    // state.markAsRead();
    // // Abrir el modal de notificaciones
    setShowModal(true); 
  };

  
  // const [count, setCount] = useState(0); // Solo para pruebas

  const handleDropdownClick = () =>
  {
    setOpenDropdownSidebar(prevState => !prevState); // Toggle el estado actual
  };

  return (
    <div className="sidebar  fixed-top  d-flex flex-column flex-shrink-0  border-end">
      <div className="my-0">
        <div className="line-container row">
          <div id="lineBlue" />
          <div id="lineRed" />
        </div>
        <div className="d-flex flex-column">
          <span className="text-serif-h3 mx-2 title-siderbar"><u>Banco de Proyectos</u></span>
          <p className="text-end px-2 mb-0">Admin</p>
        </div>
        <hr className="w-100 mt-0" />
      </div>
      <ul className="nav nav-pills flex-column mb-auto mt-0">
        <li className="my-1">
          <NavLink to="/dashboard" className="mx-4 btn-link"  aria-current="page" type="button" >
            <i className="material-symbols-outlined mx-3 ">
              home
            </i> <span className="text-link">Inicio</span>
          </NavLink>
        </li>
        <li className="my-1">
          <NavLink to="#" className="mx-4 btn-link"
          // onClick={handleNotificationsClick}
          >
            <i className="material-symbols-outlined mx-3">
              mail
            </i><u>Notificaciones</u>
            {/* { 
              dataUnreadCount && dataUnreadCount.unread_count === 0 ?
              <i className="material-symbols-outlined mx-3"></i> :
              loadingUnreadCount ? <span>Cargando...</span> : 
              errorUnreadCount ? <span>Error</span> :
              <i className="badge badge-notification mx-3"> {dataUnreadCount && dataUnreadCount.unread_count} </i> 
            } */}
          </NavLink>
        </li>
        <hr className="w-85 mx-4" />
        <span className="title-section ms-4 my-2">Gestión de Proyectos</span>
        <li>
          <NavLink to="crearproyectos" className="btn-sidebar my-1 mx-4" >
            <u>Subir Proyectos</u><i className="material-symbols-outlined">
              post_add
            </i>
          </NavLink>
        </li>
        <li className="my-1">
          <NavLink to="#" className="mx-4 btn-link"  type="button">
            {/* { 
              count === 0 ?
              <i className="material-symbols-outlined mx-3">library_books</i> :
              <i className="badge badge-notification mx-3"> {count} </i> 
            } */}
            <u>Banco de Proyectos</u>
          </NavLink>
        </li>
        <li className="my-1">
          <NavLink to="administrarproyectosinnovadores" className="mx-4 btn-link" type="button">
            {/* { 
              dataInnovativeProjectNotificacions && dataInnovativeProjectNotificacions.total_count === 0 ?
              <i className="material-symbols-outlined mx-3">filter_none</i> :
              loadingInnovativeProjectNotificacions ? <span>Cargando...</span> : 
              errorInnovativeProjectNotificacions ? <span>Error</span> :
              <i className="badge badge-notification mx-3"> {dataInnovativeProjectNotificacions && dataInnovativeProjectNotificacions.total_count} </i> 
            } */}
            <u>Proyectos Innovadores</u>
          </NavLink>
        </li>
        <hr className="w-85 mx-4" />
        <span className="title-section  ms-4 my-1">Gestión de Usuarios</span>
        <li className="my-1">
          <NavLink to="#" className="btn-sidebar my-1 mx-4" type="button">
            <u>Crear Usuarios </u> <i className="material-symbols-outlined">
              person_add
            </i>
          </NavLink>
        </li>

        <li className="my-1">
          <NavLink to="#" className="mx-4 btn-link" type="button">
            {/* { 
              count === 0 ?
              <i className="material-symbols-outlined mx-3">supervised_user_circle</i> :
              <i className="badge badge-notification mx-3"> {count} </i> 
            } */}
            <u>Administrar Usuarios</u>
          </NavLink>
        </li>
        <hr className="w-85 mx-4" />
        <li className="nav-item dropdown">
          <button
            className=" dropdown-sidebar border-0 title-section ms-2"
            data-bs-toggle="dropdown"
            aria-expanded={openDropdownSidebar}
            onClick={handleDropdownClick}>
            Gestión de Plataforma <i className="material-symbols-outlined">
            {openDropdownSidebar ? 'expand_less' : 'expand_more'}
            </i>
          </button>
          <ul className={openDropdownSidebar ? "dropdown-menu show bg-white border-0 ms-3" : "dropdown-menu bg-white border-0 ms-4"}>
            <li className="my-1"> <NavLink to="#" className="btn-link" type="button">
              <i className="material-symbols-outlined mx-3">
                local_parking
              </i><u>Programas</u></NavLink></li>
            <li className="my-1">
              <NavLink to="#" className="btn-link" type="button">
                <i className="material-symbols-outlined mx-3">
                  file_copy
                </i><u>Documentos</u></NavLink>
            </li>
            <li className="my-1" >
              <NavLink to="#" className="btn-link" type="button">
                <i className="material-symbols-outlined mx-3">
                  admin_panel_settings

                </i><u>Tipos de Usuarios</u>
              </NavLink>
            </li>
          </ul>
        </li>
      </ul >
      <div className="d-flex justify-content-between  border-top w-100 " >
        <div className="circle-user" id="icon-user">
          <span className="material-symbols-outlined my-auto">
            person
          </span>
        </div>
        <span className="my-auto me-auto">Mi Perfil</span>
        <div className="dropdown">
          <a className="" data-bs-toggle="dropdown" aria-expanded="false" id="icon-setting">
            <span className="material-symbols-outlined">
              settings
            </span>
          </a>
          <ul className="dropdown-menu text-small shadow">
            <li><a className="dropdown-item" href="/">New project...</a></li>
            <li><a className="dropdown-item" href="#">Settings</a></li>
            <li><a className="dropdown-item" href="#">Profile</a></li>
            <li><a className="dropdown-item" href="#">Sign out</a></li>
          </ul>
        </div>
      </div>
{/* 
    <NotificationModal 
      show={showModal} 
      dataNotifications={dataNotifications} 
      onClose={() => setShowModal(false)} 
    />  */}
    </div >
  )
}
