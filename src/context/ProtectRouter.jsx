import { useContext } from 'react';
import { AuthContext } from "./AuthContext";

export const ProtectedRoute = ({ children, allowedProfiles }) => {
  const { userData } = useContext(AuthContext); 
  
  // Si el usuario no está logueado o no tiene perfil permitido, deniega el acceso
  if (!userData || !allowedProfiles.includes(userData.perfil)) {
    return (
      <div className="m-5">
        <h2 className="mx-5">Acceso Denegado</h2>
        <p className="mx-5">No tienes permiso para acceder a esta página.</p>
      </div>
    );
  }

  return children; // Si el perfil es válido, muestra el contenido
};