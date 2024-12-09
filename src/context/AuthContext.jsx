import { createContext, useState, useContext, useEffect } from 'react'; 
import axios from 'axios';
import { apiBancoProyecto } from '../services/bancoproyecto.api';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('userToken');
    const userDataFromLocalStorage = localStorage.getItem('userData');
    if (token && userDataFromLocalStorage) {
      setIsLoggedIn(true);
      setUserData(JSON.parse(userDataFromLocalStorage));
    }
  }, []);


  // Renovar el token automáticamente
  useEffect(() => {
    const interval = setInterval(async () => {
      const tokenExpiry = localStorage.getItem('tokenExpiry');
      const refreshToken = localStorage.getItem('refreshToken');

      if (!tokenExpiry || !refreshToken) {
        //console.log("No hay tokenExpiry o refreshToken. No se puede renovar el token.");
        return;
      }

      // Verificar si el token está a punto de expirar (5 minutos de margen)
      const timeRemaining = parseInt(tokenExpiry) - Date.now();
      if (timeRemaining < 5 * 60 * 1000) { // 5 minutos
        //console.log("El token está a punto de expirar. Intentando renovarlo...");
        try {
          await refreshAccessToken();
        } catch (error) {
          console.error("Error al renovar el token automáticamente:", error);
        }
      }
    }, 60 * 1000); // Comprobar cada minuto

    return () => clearInterval(interval); // Limpiar intervalo al desmontar
  }, []);


  const login = (token, refreshToken, userData) => {
    localStorage.setItem('userToken', token);
    localStorage.setItem('refreshToken', refreshToken);
    localStorage.setItem('userData', JSON.stringify(userData));
    const tokenExpiry = Date.now() + 3600 * 1000; // Estimación de 1 hora de validez
    localStorage.setItem('tokenExpiry', tokenExpiry);
    setIsLoggedIn(true);
    setUserData(userData);
  };

  const logout = async () => {
    const refreshToken = localStorage.getItem('refreshToken');

    try {
      const apiUrl = import.meta.env.VITE_REACT_APP_API_URL;
      const response = await axios.post(`${apiUrl}/logout/`, {
        refresh_token: refreshToken  // Incluye el refresh token aquí
      });
      console.log('Logout successful', response);
    } catch (error) {
      console.error('Error en el cierre de sesión:', error);
    }

    localStorage.removeItem('userToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('userData');
    localStorage.removeItem('tokenExpiry');
    setIsLoggedIn(false);
    setUserData(null);
  };

  const isTokenExpired = () => {
    const expiry = localStorage.getItem('tokenExpiry');
    return !expiry || Date.now() > parseInt(expiry);
  };
  
  const refreshAccessToken = async () => {
    //console.log("refreshAccessToken llamado");
    const refreshToken = localStorage.getItem('refreshToken');
    if (!refreshToken) {
      console.log("No hay refresh token disponible. Usuario no autenticado.");
      return null;
    }

    try {
      const response = await apiBancoProyecto.post('/refresh_token/', { refresh_token: refreshToken });
      if (response.data.access_token) {
        localStorage.setItem('userToken', response.data.access_token);
        //console.log("user token retornado al front en authcontext: ", localStorage.getItem('userToken'));
        if (response.data.refresh_token) {
          localStorage.setItem('refreshToken', response.data.refresh_token);
        }
        const tokenExpiry = Date.now() + response.data.expires_in * 1000; // Actualizar el tiempo de expiración
        localStorage.setItem('tokenExpiry', tokenExpiry);
        return response.data.access_token;
      } else {
        throw new Error("No se recibió un nuevo access token.");
      }
    } catch (error) {
      console.error("Error refrescando el token:", error);
  
      // Si el error es 400 (Bad Request), gatilla el logout
      if (error.response && error.response.status === 400) {
        console.log("Token no válido o expirado. Cerrando sesión automáticamente...");
        await logout();
      } else {
        console.log("Error desconocido al refrescar el token. Cerrando sesión...");
        await logout();
      }
  
      throw new Error("Failed to refresh token");
    }
  };
 
    return (
      <AuthContext.Provider value={{ isLoggedIn, userData, login, logout, refreshAccessToken, isTokenExpired }}>
        {children}
      </AuthContext.Provider>
    );
  };

  // eslint-disable-next-line react-refresh/only-export-components
  export const useAuth = () => {
    return useContext(AuthContext);
  };