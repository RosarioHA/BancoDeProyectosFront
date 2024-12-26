import { Link } from 'react-router-dom';
import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import { faBars } from '@fortawesome/free-solid-svg-icons';
import { useAuth } from '../../context/AuthContext';
import { useLogin } from '../../hooks/useLogin';

const BtnInicioSesion = ({ btnPrincipalSize, btnSecundarioSize }) => {
  const { isLoggedIn, userData, logout } = useAuth();
  const { loginWithKeycloak } = useLogin(); // Asegúrate de que este método esté definido en tu hook.
  const userRegistrado = userData?.perfil?.includes("Registrado");

  //console.log(userData)

  return (
    <div className="lg-col d-flex justify-content-lg-end align-items-center">
      {isLoggedIn ? (
        <>
        <div className="container d-flex flex-column flex-lg-row justify-content-center">
          <span className="d-none d-lg-block text-sans-p align-self-center mt-lg-3 me-3">
            Hola, {userData.full_name || userData.rut}</span>
          {!userRegistrado && (
          <Link className={`mx-lg-3 mt-lg-4 me-md-4 ${btnSecundarioSize}`} to="/dashboard"> 
          Ir a Admin
          </Link>
                  )}

          <button
            className={`btn-clave-unica mt-2 mt-lg-4 me-0 me-lg-5 py-3 ${btnPrincipalSize}`}
            type="button"
            onClick={logout}
          >
            Cerrar sesión
          </button>
        </div>
        </>
      ) : (
        <div className="mt-4 me-lg-5 border-clave-unica">
          <button
            className={`btn-clave-unica m-1 ${btnPrincipalSize}`} //mt-4 me-lg-5
            type="button"
            onClick={() => {
              loginWithKeycloak(); // Llama a la función después de registrar el mensaje en la consola.
            }}
          >
            <img className="icono-xs " src="/img/icons/logo_clave_unica.svg" alt="CalveUnica" />
            <span className="text-decoration-underline mx-md-3">
              Iniciar sesión
            </span>
          </button>
        </div>
      )}
    </div>
  );
};

const Navbar = () => {  
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
  <>
    <nav className="container">
      <div className="row d-flez justify-content-between">

        <div className="col-7 col-lg-5 p-0">
          {/* Logo subdere */}
          <Link to="/" className="text-decoration-none">
            <div id="" className="lineContainer ms-2 ms-sm-1 row">
              <div id="lineBlue" />
              <div id="lineRed" />
            </div>
            <p className="logo-subdere mt-3 ms-2 ms-sm-1 ps-0">
              Subsecretaría de Desarrollo Regional y Administrativo</p>  
          </Link>
        </div>

        {/* boton hamburguesa vista mobile */}
        <button className="col burger-btn d-lg-none mt-3 text-decoration-underline pe-0" onClick={toggleMenu}>
          Menú 
          <FontAwesomeIcon icon={faBars} className="fa-xl ms-2"/>
        </button>
        {/* boton login vista desktop*/}
        <div className="col d-none d-lg-block">
          <BtnInicioSesion 
            btnPrincipalSize="btn-clave-unica"
            btnSecundarioSize="btn-secundario-s"
          />
        </div>
      </div>
    </nav>  

    <div className="row mt-4 col-12">
      {/* Navegacion */}
      <div className="mx-md-auto mx-lg-auto mx-xl-auto d-flex flex-column flex-md-row justify-content-center p-0">
        <Link to="/" className="link text-black text-underline mx-md-3 d-none d-lg-block"> Inicio </Link>
        <Link to="/bancodeproyectos" className="link text-black text-underline mx-md-3 d-none d-lg-block"> Banco de Proyectos </Link>
        <Link to="/bancodeideas" className="link text-black text-underline mx-md-3 d-none d-lg-block"> Proyectos Innovadores </Link>
        <Link to="/documentacion" className="link text-black text-underline mx-md-3 d-none d-lg-block"> Documentación </Link>
        <Link to="/contacto" className="link text-black text-underline mx-md-3 d-none d-lg-block">Contacto</Link>
      </div>
    </div> 

    {/* Menu Desplegable */}
    {isMenuOpen && (
      <div className={`menu-modal ${isMenuOpen ? 'open' : ''}`}>
        <div className="d-flex justify-content-end my-4 me-2">
          <button className="btn-close-modal"onClick={toggleMenu}> Cerrar
            <FontAwesomeIcon icon={faTimes} className="fa-xl ms-2"/> 
          </button>
        </div>
        {/* navegacion */}
        <div className="d-flex flex-column ms-3">
          <Link to="/" className="link text-sans-p-white text-underline my-2"> Inicio </Link>
          <Link to="/bancodeproyectos" className="link text-sans-p-white text-underline my-2"> Banco de Proyectos </Link>
          <Link to="/bancodeideas" className="link text-sans-p-white text-underline my-2"> Proyectos Innovadores </Link>
          <Link to="/documentacion" className="link text-sans-p-white text-underline my-2"> Documentación </Link>
          <Link to="/contacto" className="link text-sans-p-white text-underline my-2">Contacto</Link>
        </div>
        <hr id="menu-divider mx-2"/>
        <BtnInicioSesion 
          btnPrincipalSize="btn-clave-unica-l"
          btnSecundarioSize="btn-secundario-xl"
        />
      </div>
    )}
    <hr className="d-lg-none my-0"/>
  </>
);
};

export default Navbar;
