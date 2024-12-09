import { useAuth } from "../context/AuthContext"; 
import { apiBancoProyecto } from "../services/bancoproyecto.api";
import axios from "axios";

export const useAuthenticatedRequest = () => {
  const { refreshAccessToken } = useAuth();  // Accede al método de refrescar el token desde AuthContext

  const makeAuthenticatedRequest = async (url, config = {}) => {
    try {
        const token = await refreshAccessToken();  // Verifica y refresca el token si es necesario
        console.log("¿access token devuelto?");

        if (!token) {
            console.error("No hay token disponible. El usuario no está autenticado.");
            throw new Error("Usuario no autenticado");
        }
        console.log("access token devuelto: ", token);


        // Preparar configuración con encabezados
        const requestConfig = {
            ...config,
            headers: {
            ...config.headers,
            Authorization: `Bearer ${token}`, // Incluye el token en el encabezado
            },
        };

        console.log("Configuración de la solicitud:", requestConfig);

        // Realiza la solicitud con Axios
        const response = await apiBancoProyecto.get(url, requestConfig);
        console.log("Respuesta recibida:", response);

        return response;
        } catch (error) {
        console.error("Error en makeAuthenticatedRequest:", error);
        throw error;
        }
    };

  return { makeAuthenticatedRequest };  // Retornamos la función para ser usada en los componentes que lo requieran
};