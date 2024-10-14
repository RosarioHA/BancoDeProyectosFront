import { useState } from 'react';
import { NavLink , Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useFormContext } from '../../context/FormContext'
import ModalAbandonoFormulario from '../Modals/ModalAbandono';


const SidebarLink = ({ to, icon, text, badgeCount, onClick, hasBorder }) =>
{
  const { hasChanged } = useFormContext();
  const [ isModalOpen, setIsModalOpen ] = useState(false);
  const linkStyle = hasBorder ? 'blue-border my-2' : '';

  const handleOpenModal = () =>
  {
    setIsModalOpen(true);
  };
  const handleCloseModal = () =>
  {
    setIsModalOpen(false);
  };
  const handleLinkClick = (e) =>
  {
    if (hasChanged)
    {
      e.preventDefault();
      handleOpenModal();
    } else
    {
      onClick && onClick(e);
    }
  };
  return (
    <>
      {!hasChanged ? (
        <NavLink to={to} className={`mx-4 btn-link ${linkStyle}`} onClick={handleLinkClick}>
          <i className="material-symbols-outlined mx-3">{icon}</i>
          {badgeCount && <i className="badge badge-notification mx-3">{badgeCount}</i>}
          <u>{text}</u>
        </NavLink>
      ) : (
        <>
          <NavLink className={`mx-4 btn-link ${linkStyle}`} onClick={handleOpenModal}>
            <i className="material-symbols-outlined mx-3">{icon}</i>
            {badgeCount && <i className="badge badge-notification mx-3">{badgeCount}</i>}
            <u>{text}</u>
          </NavLink>
          {isModalOpen && <ModalAbandonoFormulario onClose={handleCloseModal} isOpen={isModalOpen} direction={to} />}
        </>
      )}
    </>
  );
};

export const Sidebar = () =>
{
  const { userData } = useAuth();
  const [ openDropdownSidebar, setOpenDropdownSidebar ] = useState(false);
  const userEditor = userData?.perfil?.includes("Editor");

  const handleDropdownClick = () =>
  {
    setOpenDropdownSidebar(prevState => !prevState);
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
          <SidebarLink to="/dashboard" icon="home" text="Inicio" hasBorder={false} />
        </li>
        <hr className="w-85 mx-4" />
        <span className="title-section ms-4 my-2">Gestión de Proyectos</span>
        <li>
          <SidebarLink to="crear_proyectos" icon="post_add" text="Subir Proyectos" hasBorder={true} />

        </li>
        <li className="my-1">
          <SidebarLink to="administrar_proyectos" text="Banco de Proyectos" hasBorder={false} />

        </li>
        <li className="my-1">
          <SidebarLink to="administrar_proyectos_innovadores" text="Proyectos Innovadores" hasBorder={false} />
        </li>

        <hr className="w-85 mx-4" />
        {userEditor && (
          <>
            <span className="title-section  ms-4 my-1">Gestión de Usuarios</span>

            <li className="my-1">
              <SidebarLink to="gestion_usuarios" text="Administrar Usuarios" hasBorder={false} />
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
                <li className="my-1">
                  <SidebarLink to="#" icon="local_parking" text="Programas" hasBorder={false} />
                </li>
                <li className="my-1">
                  <SidebarLink to="#" icon="file_copy" text="Documentos" hasBorder={false}/>

                </li>
                <li className="my-1" >
                  <SidebarLink to="#" icon="admin_panel_settings" text="Tipos de Usuarios" hasBorder={false}/>
                </li>
              </ul>
            </li>
          </>
        )}
      </ul>
      <div className="d-flex justify-content-between  border-top w-100 " >
        <div className="circle-user" id="icon-user">
          <span className="material-symbols-outlined my-auto">
            person
          </span>
        </div>
        <span className="my-auto me-auto">{userData?.perfil}</span>
        <div className="dropdown">
          <a className="" data-bs-toggle="dropdown" aria-expanded="false" id="icon-setting">
            <span className="material-symbols-outlined">
              settings
            </span>
          </a>
          <ul className="dropdown-menu text-small shadow">
            <li>
              <Link className="dropdown-item" to={`editar_perfil/${userData?.id}`} >
                Editar Perfil
              </Link>
            </li>
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
