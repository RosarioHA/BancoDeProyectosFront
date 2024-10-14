import { useState, useContext } from 'react';
import { apiBancoProyecto } from '../services/bancoproyecto.api';
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
                codeVerifier
            });

            if (response.data && response.data.access_token) {
                const { access_token, refresh_token, expires_in } = response.data;
                localStorage.setItem('userToken', access_token);
                localStorage.setItem('userData', JSON.stringify(response.data.user));
                localStorage.setItem('refreshToken', refresh_token);
                localStorage.setItem('tokenExpiry', Date.now() + expires_in * 1000);
                localStorage.setItem('authMethod', 'keycloak');

                setData(response.data);
                globalLogin(access_token, refresh_token, response.data.user);
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

    const isTokenExpired = () => {
        const expiry = localStorage.getItem('tokenExpiry');
        return !expiry || Date.now() > parseInt(expiry);
    };

    const refreshAccessToken = async () => {
        setLoading(true);
        try {
            if (isTokenExpired()) {
                const refreshToken = localStorage.getItem('refreshToken');
                if (!refreshToken) {
                    setError("Login required.");
                    return;
                }

                const response = await apiBancoProyecto.post('/refresh-token/', { refresh_token: refreshToken });
                if (response.data && response.data.access_token) {
                    const { access_token, refresh_token, expires_in } = response.data;    
                    localStorage.setItem('userToken', access_token);
                    localStorage.setItem('tokenExpiry', Date.now() + expires_in * 1000);
                    if (refresh_token) {
                        localStorage.setItem('refreshToken', refresh_token);
                    }
                    globalLogin(access_token, refresh_token, userData);
                } else {
                    throw new Error('Failed to refresh access token.');
                }
            }
        } catch (error) {
            console.error('Error refreshing access token:', error);
            setError(`Error refreshing access token: ${error.response?.data?.detail || error.message || 'Unknown error'}`);
        } finally {
            setLoading(false);
        }
    };

    const esFlujoKeycloak = () => {
        return localStorage.getItem('isKeycloak') === 'true';
    };

    return { data, loading, error, loginWithKeycloak, handleAuthentication, refreshAccessToken, esFlujoKeycloak };
};
