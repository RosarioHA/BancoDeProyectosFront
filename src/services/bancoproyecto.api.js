import axios from  'axios'


const apiBancoProyecto = axios.create({
  baseURL: import.meta.env.VITE_REACT_APP_API_URL,
});

// Interceptor para agregar el token a cada solicitud
apiBancoProyecto.interceptors.request.use(
  async (config) => {
      const token = localStorage.getItem('userToken'); // Siempre toma el token actualizado
      if (token) {
          config.headers['Authorization'] = `Bearer ${token}`;
      }
      return config;
  },
  (error) => {
      return Promise.reject(error);
  }
);

// Manejo de errores y renovación automática de tokens
apiBancoProyecto.interceptors.response.use(
  (response) => response,
  async (error) => {
      if (error.response?.status === 401 || error.response?.status === 403) {
          console.log("Token expirado o no válido. Intentando renovar...");
          try {
              const newToken = await refreshAccessToken();
              if (newToken) {
                  // Reintenta la solicitud original con el nuevo token
                  error.config.headers['Authorization'] = `Bearer ${newToken}`;
                  return apiBancoProyecto.request(error.config);
              }
          } catch (refreshError) {
              console.error("Error al renovar el token:", refreshError);
              await logout();
          }
      }
      return Promise.reject(error);
  }
);

export default apiBancoProyecto;