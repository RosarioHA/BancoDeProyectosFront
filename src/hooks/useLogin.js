import { useState, useContext } from 'react';
import apiBancoProyecto  from '../services/bancoproyecto.api';
import { generateCodeVerifier, generateCodeChallenge, encrypt, decryptCodeVerifier } from '../config/authUtils';
import { AuthContext } from '../context/AuthContext';


export const useLogin = () => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const { login: globalLogin, userData } = useContext(AuthContext);
    
    const loginWithKeycloak = async () => {
        setLoading(true);
        try {
            const codeVerifier = generateCodeVerifier();
            const codeChallenge = await generateCodeChallenge(codeVerifier);
            const encryptedCodeVerifier = encrypt(codeVerifier);

            localStorage.setItem('codeVerifier', codeVerifier);
            const redirectUri = import.meta.env.VITE_KEYCLOAK_REDIRECT_URI;
            const clientId = import.meta.env.VITE_KEYCLOAK_RESOURCE;
            const keycloakAuthUrl = import.meta.env.VITE_KEYCLOAK_AUTH_URL;

            const state = encodeURIComponent(encryptedCodeVerifier);
            const authUrl = `${keycloakAuthUrl}?client_id=${clientId}&redirect_uri=${redirectUri}&response_type=code&scope=openid&code_challenge=${codeChallenge}&code_challenge_method=S256&state=${state}`;

            window.location.href = authUrl;
            localStorage.setItem('isKeycloak', 'true');
        } catch (initError) {
            console.error('Error during login initialization:', initError);
            setError(`Error initializing login process: ${initError.message || 'Unknown error'}`);
        } finally {
            setLoading(false);
        }
    };

    const handleAuthentication = async (code, state) => {
        setLoading(true);
        try {
            const codeVerifier = decryptCodeVerifier(state);
            const apiUrl = import.meta.env.VITE_REACT_APP_API_URL;
            const response = await apiBancoProyecto.post(`${apiUrl}/callback/`, {
                code,
                codeVerifier  // Enviar el codeVerifier recibido de Keycloak
            });

            console.log("se envía el code :", code, " y el codeVerifier: ", codeVerifier)
    
            if (response.data && response.data.access_token && response.data.refresh_token) {
                const { access_token, refresh_token, expires_in, user } = response.data;
    
                // Calcula el tiempo de expiración exacto
                const tokenExpiry = Date.now() + expires_in * 1000;
    
                // Almacena los valores en localStorage
                localStorage.setItem('userToken', access_token);
                localStorage.setItem('userData', JSON.stringify(user));
                localStorage.setItem('refreshToken', refresh_token);
                localStorage.setItem('tokenExpiry', tokenExpiry);
                localStorage.setItem('authMethod', 'keycloak');
    
                console.log("Refresh Token almacenado:", refresh_token);
                console.log("User Token almacenado:", access_token);
    
                // Llama al método global de login
                globalLogin(access_token, refresh_token, user);
                setData(response.data);
            } else {
                throw new Error("The server response does not include the necessary tokens.");
            }
        } catch (error) {
            console.error('Error during the authentication process:', error);
            setError(`Error during authentication: ${error.response?.data?.detail || error.message || 'Unknown error'}`);
        } finally {
            setLoading(false);
        }
    };

      const esFlujoKeycloak = () => {
        return localStorage.getItem('isKeycloak') === 'true';
    };

    return { data, loading, error, loginWithKeycloak, handleAuthentication, esFlujoKeycloak };
};
