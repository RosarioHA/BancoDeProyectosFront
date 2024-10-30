import { useAuth } from "../context/AuthContext"; 
import { apiBancoProyecto } from "../services/bancoproyecto.api";

export const useAuthenticatedRequest = () => {
  const { refreshAccessToken } = useAuth();  // Accede al método de refrescar el token desde AuthContext

  const makeAuthenticatedRequest = async (url, config = {}) => {
    try {
        const token = await refreshAccessToken();  // Verifica y refresca el token si es necesario
        console.log("¿access token devuelto?")

        if (!token) {
            console.error("No hay token disponible. El usuario no está autenticado.");
            throw new Error("Usuario no autenticado");
        }
        console.log("access token devuelto: ", token)
        return await apiBancoProyecto.get(url, {
            ...config,
            headers: {
                Authorization: `Bearer ${token}`,  // Usa el token válido para la solicitud
            },
        });
    } catch (error) {
        console.error("Error en la solicitud autenticada:", error);
        throw error;
    }
  };

  return { makeAuthenticatedRequest };  // Retornamos la función para ser usada en los componentes que lo requieran
};