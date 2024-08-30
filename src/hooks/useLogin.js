import { useState, useContext } from 'react';
import { apiBancoProyecto } from '../services/bancoproyecto.api';
import { generateCodeVerifier, generateCodeChallenge, calculateHash, encrypt, decryptCodeVerifier } from '../config/authUtils';
import { AuthContext } from '../context/AuthContext';
import axios from 'axios';


export const useLogin = () => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const { login: globalLogin, userData } = useContext(AuthContext);
    
    const loginWithKeycloak = async () => {
        setLoading(true);
        try {
            // Generar code_verifier y code_challenge aquí
            const codeVerifier = generateCodeVerifier();
            const codeChallenge = await generateCodeChallenge(codeVerifier);
            const encryptedCodeVerifier = encrypt(codeVerifier); 
                    

            // Guardar el codeVerifier en algún lugar para su uso posterior
            localStorage.setItem('codeVerifier', codeVerifier);
            // console.log("Se guarda el code Verifier: ", codeVerifier);

            // Construir la URL de redirección manualmente con los parámetros necesarios
            // const redirectUri = import.meta.env.VITE_KEYCLOAK_REDIRECT_URI;
            // const clientId = import.meta.env.VITE_KEYCLOAK_RESOURCE;
            // const keycloakAuthUrl = import.meta.env.VITE_KEYCLOAK_AUTH_URL;

            const redirectUri = 'http://localhost:5173/callback/';
            const clientId = 'bancoproyectos';
            const keycloakAuthUrl = 'https://oid.subdere.gob.cl/realms/app-qa/protocol/openid-connect/auth';


            const state = encodeURIComponent(encryptedCodeVerifier); // Codificar el hash para la URL
            // console.log("Se encripta el code Verifier: ", encryptedCodeVerifier);

            const authUrl = `${keycloakAuthUrl}?client_id=${clientId}&redirect_uri=${redirectUri}&response_type=code&scope=openid&code_challenge=${codeChallenge}&code_challenge_method=S256&state=${state}`;
            // console.log("URL de autenticación: ", authUrl);


            // Redirigir al usuario a Keycloak para el login
            window.location.href = authUrl;

            localStorage.setItem('isKeycloak', 'true');

        } catch (initError) {
            setError(`Error initializing login process: ${initError}`);
            console.error('Error during login initialization:', initError);
        } finally {
            setLoading(false);
        }
    };

    const handleAuthentication = async (code, state) => {
        setLoading(true);
        try {
            // console.log("handleAuthentication recibe el code y state")
            const codeVerifier = decryptCodeVerifier(state);
            // console.log("codeVerifier :", codeVerifier);
   
            // Intercambiar el código por un token utilizando el codeVerifier
            const response = await apiBancoProyecto.post('/callback/', {
                code,
                codeVerifier  // Enviar el codeVerifier recibido de Keycloak
            });

            // console.log("se envía el code :", code, " y el codeVerifier: ", codeVerifier)
    
            if (response.data && response.data.access_token && response.data.refresh_token) {
                localStorage.setItem('userToken', response.data.access_token);
                localStorage.setItem('userData', JSON.stringify(response.data.user));
                localStorage.setItem('refreshToken', response.data.refresh_token);
                const expiresAt = new Date().getTime() + (response.data.expires_in * 1000);
                localStorage.setItem('tokenExpiry', expiresAt.toString());
                localStorage.setItem('authMethod', 'keycloak');
                setData(response.data);
                globalLogin(response.data.access_token, response.data.refresh_token, response.data.user);
                // console.log("El backend devuelve los tokens necesarios")
            } else {
                throw new Error("La respuesta del servidor no incluye los tokens necesarios.");
            }
        } catch (error) {
            console.error('Error during the authentication process:', error);
            setError(`Error during the authentication process: ${error.message || 'Unknown error'}`);
        } finally {
            setLoading(false);
        }
    };


    // Función para refrescar el token si está próximo a expirar

    const isTokenExpired = () => {
        const expiry = localStorage.getItem('tokenExpiry');
        if (!expiry) return true;
        return Date.now() > parseInt(expiry);
    };

    const refreshAccessToken = async () => {
        setLoading(true);
        try {
            // console.log("Refresh Access Token")
            if (isTokenExpired()) {
                const refreshToken = localStorage.getItem('refreshToken');
                if (!refreshToken) {
                    console.error("Refresh token not found.");
                    // Opcionalmente, redirigir al usuario al login
                    setError("Login required.");
                    setLoading(false);
                    return;
                }

                const response = await axios.post('/refresh-token/', { refresh_token: refreshToken });

                if (response.data && response.data.access_token) {
                    // Actualizar el contexto y el almacenamiento local con el nuevo token de acceso y refresco
                    const { access_token, refresh_token, expires_in } = response.data;
                    localStorage.setItem('userToken', access_token);
                    localStorage.setItem('tokenExpiry', Date.now() + expires_in * 1000); // Almacenar la nueva caducidad del token
                    if (refresh_token) {
                        localStorage.setItem('refreshToken', refresh_token); // Si se devuelve un nuevo refresh token
                    }

                    // console.log("refresh acces token", access_token)
                    // console.log("refresh refresh token", access_token)
                    // console.log("refresh Expiry token", access_token)

                    globalLogin(access_token, refresh_token, userData); // Asegúrate de que userData esté definido correctamente
                } else {
                    console.error('Failed to refresh access token.');
                    setError('Failed to refresh access token.');
                }
            }
        } catch (error) {
            console.error('Error refreshing access token:', error);
            setError('Error refreshing access token.');
        } finally {
            setLoading(false);
        }
    };

    const esFlujoKeycloak = () => {
        return localStorage.getItem('isKeycloak') === 'true';
    };

    return { data, loading, error, loginWithKeycloak, handleAuthentication, refreshAccessToken, esFlujoKeycloak };
};
