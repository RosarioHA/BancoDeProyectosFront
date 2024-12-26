import { createContext, useState, useContext, useEffect } from 'react'; 
import axios from 'axios';
import  apiBancoProyecto from '../services/bancoproyecto.api';

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
            console.log("No hay tokenExpiry o refreshToken. No se puede renovar el token.");
            return;
        }

        // Verificar si el token está a punto de expirar (1 minuto de margen)
        const timeRemaining = parseInt(tokenExpiry) - Date.now();
        if (timeRemaining < 60 * 1000) { // 1 minuto
            console.log("El token está a punto de expirar. Intentando renovarlo...");
            try {
                await refreshAccessToken();
            } catch (error) {
                console.error("Error al renovar el token automáticamente:", error);
                await logout();
            }
        }
    }, 60 * 1000); // Comprueba cada minuto

    return () => clearInterval(interval); // Limpia el intervalo al desmontar
  }, []);


  const login = (token, refreshToken, userData) => {
    localStorage.setItem('userToken', token);
    localStorage.setItem('refreshToken', refreshToken);
    localStorage.setItem('userData', JSON.stringify(userData));
    const tokenExpiry = localStorage.getItem('tokenExpiry');
    if (!tokenExpiry) {
        console.error("Error: tokenExpiry no está configurado en el localStorage");
        return;
    }

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
    return !expiry || Date.now() > parseInt(tokenExpiry) - 60000;
  };
  
  const refreshAccessToken = async () => {
    const refreshToken = localStorage.getItem('refreshToken');
    if (!refreshToken) {
        console.log("No hay refresh token disponible. Usuario no autenticado.");
        await logout();
        return null;
    }

    try {
        const response = await apiBancoProyecto.post('/refresh_token/', { refresh_token: refreshToken });
        if (response.data.access_token) {
            const { access_token, refresh_token, expires_in } = response.data;

            // Actualiza los tokens en localStorage
            localStorage.setItem('userToken', access_token);
            if (refresh_token) {
                localStorage.setItem('refreshToken', refresh_token);
            }
            const tokenExpiry = Date.now() + expires_in * 1000;
            localStorage.setItem('tokenExpiry', tokenExpiry);

            // Actualiza el estado global (si es necesario)
            setIsLoggedIn(true);
            setUserData(prevUserData => ({
                ...prevUserData,
                token: access_token, // O cualquier estructura que uses
            }));

            console.log("Token renovado exitosamente");
            return access_token;
        } else {
            throw new Error("No se recibió un nuevo access token.");
        }
    } catch (error) {
        console.error("Error refrescando el token:", error);

        // Manejo más granular de errores
        if (error.response?.status === 400) {
            console.log("Token no válido o expirado. Cerrando sesión automáticamente...");
            await logout();
        } else {
            console.log("Error desconocido al renovar el token.");
        }

        throw error;
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