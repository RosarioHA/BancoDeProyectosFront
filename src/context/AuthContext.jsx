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

  const login = (token, refreshToken, userData) => {
    localStorage.setItem('userToken', token);
    localStorage.setItem('refreshToken', refreshToken);
    localStorage.setItem('userData', JSON.stringify(userData));
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
    setIsLoggedIn(false);
    setUserData(null);
  };

  const isTokenExpired = () => {
    const expiry = localStorage.getItem('tokenExpiry');
    return !expiry || Date.now() > parseInt(expiry);
  };

  const refreshAccessToken = async () => {
    console.log("refreshAccessToken llamado");
    const refreshToken = localStorage.getItem('refreshToken');

    // Si no hay refreshToken, simplemente devolvemos null, ya que el usuario no está autenticado
    if (!refreshToken) {
        console.log("No hay refresh token disponible. Usuario no autenticado.");
        return null;
    }

    if (isTokenExpired()) {
        console.log("Token expirado, refrescando...");

        try {
            const response = await apiBancoProyecto.post('/refresh_token/', { refresh_token: refreshToken });

            if (response.data.access_token) {
                localStorage.setItem('userToken', response.data.access_token);
                console.log("user token retornado al front en authcontext: ", localStorage.getItem('userToken'))
                if (response.data.refresh_token) {
                    localStorage.setItem('refreshToken', response.data.refresh_token);
                }
                return response.data.access_token;  // Devolvemos el nuevo access_token
            } else {
                throw new Error("No se recibió un nuevo access token.");
            }
        } catch (error) {
            console.error("Error refrescando el token:", error);
            throw new Error("Failed to refresh token");
        }
    }

    // Si el token no ha expirado o no se requiere refrescarlo, devolvemos el token actual
    return localStorage.getItem('userToken');
  };
 
    return (
      <AuthContext.Provider value={{ isLoggedIn, userData, login, logout, refreshAccessToken }}>
        {children}
      </AuthContext.Provider>
    );
  };

  // eslint-disable-next-line react-refresh/only-export-components
  export const useAuth = () => {
    return useContext(AuthContext);
  };
