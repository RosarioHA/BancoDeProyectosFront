import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';

export const NavbarUser = () =>
{
  const { isLoggedIn, userData, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout(); // Asegurarse de que el logout se ejecute
    navigate('/');  // Redirigir a la vista principal después de cerrar sesión
  };
  //console.log(userData)

  return (
    <nav className="d-flex  bg-white border-bottom justify-content-end me-5 w-100 sticky-top mt-1">
      <div className="align-self-center mx-2 text-sans-h5">
        {isLoggedIn && (
          <span>Hola, {userData.full_name || userData.rut} </span>
        )}
      </div>
      <a className="btn-open mx-2 my-2 " href="/" target="_blank" >
        <u>Volver a Banco de Proyectos</u><i className="material-symbols-outlined mx-2" id="">
          open_in_new
        </i></a>
        <button className="btn-logout mx-2 my-2" type="button" onClick={handleLogout}>
        <u>Cerrar Sesión</u>
        <i className="material-symbols-outlined">
          logout
        </i>
      </button>
    </nav>
  )
}
