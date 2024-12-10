import axios from  'axios'


export const apiBancoProyecto = axios.create({
  baseURL: import.meta.env.VITE_REACT_APP_API_URL,
});

// Interceptor para incluir el token en cada solicitud
apiBancoProyecto.interceptors.request.use(
  async (config) => {
    const token = localStorage.getItem('userToken');
    //console.log("Token enviado en el encabezado:", token); // Log para verificar el token
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);