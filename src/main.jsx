import { useEffect, useState } from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, useLocation } from 'react-router-dom';
import App from './App.jsx';
import 'bootstrap/dist/css/bootstrap.min.css';
import { AuthProvider } from './context/AuthContext';
import { useLogin } from './hooks/useLogin';
import ReactGA from "react-ga4";

//============================================ INIT KEYCLOAK CONFIGURATION ============================================

const Main = () =>
{
  const { handleAuthentication } = useLogin();
  const location = useLocation();
  const [ codeProcessed, setCodeProcessed ] = useState(false);

  useEffect(() =>
  {
    ReactGA.initialize('G-45DT9TXBFN');

    const queryParams = new URLSearchParams(location.search);
    const code = queryParams.get('code');
    const state = queryParams.get('state');

    if (code && state && !codeProcessed)
    {
      // Set codeProcessed immediately to prevent re-entry
      setCodeProcessed(true);

      localStorage.setItem('code', code);
      localStorage.setItem('state', state);

      // Clear URL parameters immediately to prevent reuse
      queryParams.delete('code');
      queryParams.delete('state');
      const newUrl = window.location.pathname + '?' + queryParams.toString();
      window.history.replaceState({}, '', newUrl);

      // Log and proceed with authentication
      // console.log("Code y State guardados en localStorage y URL limpiada.");
      // console.log("Hay code y state y se inicia handleAuthentication");

      handleAuthentication(code, state).then(() =>
      {
        //  console.log("Autenticación exitosa");
      }).catch(error =>
      {
        //  console.log("Falló handleAuthentication");
        console.error('Error during handleAuthentication:', error);
      }).finally(() =>
      {
        //  console.log("Se completa el proceso de handleAuthentication");
        localStorage.removeItem('code'); // Clear localStorage after handling
        localStorage.removeItem('state');
      });
    }

    const currentPage = location.pathname + location.search;
    ReactGA.send({ hitType: 'pageview', page: currentPage });
  }, [ location.search, handleAuthentication, codeProcessed ]);  // Use location.search to trigger effect only when URL changes

  return null; // No rendering needed here
};

export default Main;

//============================================ END KEYCLOAK CONFIGURATION ============================================

ReactDOM.createRoot(document.getElementById('root')).render(
  //<React.StrictMode>
  <BrowserRouter>
    <AuthProvider>
        <Main />
        <App />
    </AuthProvider>
  </BrowserRouter>
  //</React.StrictMode>,
);

