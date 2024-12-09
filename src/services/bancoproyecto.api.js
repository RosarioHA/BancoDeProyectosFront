import axios from  'axios'
import { useAuth } from '../context/AuthContext';


export const apiBancoProyecto = axios.create({
  baseURL: import.meta.env.VITE_REACT_APP_API_URL,
});

// Interceptor para manejar la expiración del token
apiBancoProyecto.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Verificar si es un error de autenticación y la solicitud no ha sido reintentada
    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true; // Marcar que la solicitud ya ha sido reintentada

      try {
        // Solicitar un nuevo token de acceso usando el refresh token
        const refreshToken = localStorage.getItem('refreshToken');
        const tokenResponse = await axios.post(`${apiBancoProyecto.defaults.baseURL}/refresh_token/`, {
          refresh_token: refreshToken
        });

        const { access_token } = tokenResponse.data;

        // Guardar el nuevo token de acceso y actualizar la solicitud original
        localStorage.setItem('userToken', access_token);
        originalRequest.headers['Authorization'] = `Bearer ${access_token}`;
        // console.log("nuevo access token guardado: ", access_token)

        // Reintentar la solicitud original con el nuevo token
        return apiBancoProyecto(originalRequest);
      } catch (refreshError) {
        console.error('Failed to refresh the access token:', refreshError);

        // Manejar el error de refresco aquí (por ejemplo, redirigir al login)
        // Asegúrate de limpiar el localStorage y cualquier estado relacionado
        localStorage.removeItem('userToken');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('userData');

      }
    }

    // Rechazar la promesa si el error no es 401 o la solicitud ya fue reintentada
    return Promise.reject(error);
  }
);