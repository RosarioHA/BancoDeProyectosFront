import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLogin } from '../../hooks/useLogin';
import { useAuth } from '../../context/AuthContext';

const Login = () => {
  const [formData, setFormData] = useState({
    rut: '',
    password: '',
  });

  const [errorMessage, setErrorMessage] = useState(''); // Agregado para manejar errores

  const navigate = useNavigate();
  const { login: authLogin } = useAuth();
  const { login, loading, error, data } = useLogin();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await login(formData);

    if (data) {
      console.log('Datos de respuesta:', data);
      authLogin(data.token, data['refresh-token'], data.user);
      navigate('/');
    } else if (error) {
      console.error('Error en el inicio de sesión:', error);

      // Asumimos que el error del backend viene en una propiedad 'message', ajusta esto según tu backend
      setErrorMessage(error.response?.data?.message || 'Ocurrió un error inesperado');
    }
  };


  return (
    <div className="container">
      <div className="d-flex align-items-center">
        <button className="volver-btn d-none d-lg-block" onClick={() => navigate(-1)}> &lt; volver</button>
        <p className="m-0 d-none d-lg-block me-3 opacity-50">|</p>
        <nav aria-label="breadcrumb">
          <ol className="breadcrumb m-0">
            <li className="breadcrumb-item "><a className="breadcrumbs" href="/">Inicio</a></li>
            <li className="breadcrumb-item active" aria-current="page">Inicio de sesión</li>
          </ol>
        </nav>
      </div>
      
      <div className="d-flex justify-content-center p-4">
        <div className="col-lg-5 my-5 px-sm-5 px-lg-5 login-container">
          <div className="row ms-0 d-none d-md-flex">
            <div id="lineBlue" />
            <div id="lineRed" />
          </div>
          <p className="logo-subdere mt-3 ms-0 d-none d-md-block">Subsecretaría de Desarrollo Administrativo y Regional</p>  

          <div className="p-3">
            <h2 className="text-serif-h2 text-center mb-2">Portal <br /> Banco de Proyectos</h2>
            <h3 className="text-sans-p text-center">Requiere credenciales otorgadas por la Subdere</h3>
            <form onSubmit={handleSubmit}>
              <label htmlFor='rut'></label>
              <input
                className="my-3 col-12 p-2"
                placeholder='Ingresa tu RUT'
                type='text'
                id='rut'
                name='rut'
                value={formData.rut}
                onChange={handleChange} 
              />
              <label htmlFor='password'></label>
              <input
                className="my-3 col-12 p-2"
                placeholder='Ingresa tu contraseña'
                type='password'
                id='password'
                name='password'
                value={formData.password}
                onChange={handleChange} 
              />
              <div className="d-flex justify-content-end">
                <button className=" btn-principal-s my-4 mt-5 px-5 text-decoration-underline" type="submit">Ingresar al portal</button>
              </div>
            </form>

            {/* Muestra el mensaje de error si existe */}
            {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}

            <h3 className="text-sans-p mt-4">¿No tienes credenciales para ingresar al Banco de Proyectos? <br />
              Debes solicitarlas en tu municipalidad.</h3>
          </div>

        </div>
      </div>

    </div>
  );
};

export default Login;
