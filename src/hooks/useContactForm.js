import { useState } from 'react';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';
import apiBancoProyecto from '../services/bancoproyecto.api'; 
import { yupResolver } from '@hookform/resolvers/yup';


// Esquema de validación con Yup
const schema = yup.object().shape({
  full_name: yup.string().required('Por favor, introduce tu nombre completo.'),
  email: yup.string().email('Formato de correo inválido.').required('Por favor, introduce tu correo electrónico.'),
  organization: yup.string().required('Por favor, introduce tu organización.'),
  contact_reason: yup.string().required('Por favor, indica la razón de tu contacto.'),
  message: yup.string().required('Por favor, deja un comentario.')
});

const useContactForm = () => {
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: yupResolver(schema)
  });

  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    organization: '',
    contact_reason: '',
    message: ''
  });

  // Maneja el cambio en los inputs y actualiza el estado
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

   // Maneja el envío del formulario
  const onSubmit = async (data) => {
    try {
      const response = await apiBancoProyecto.post('contact/v1/', data);
      if (response.status === 200) {
        console.log('Form data submitted successfully:', response.data);
        // Puedes agregar lógica adicional aquí, como mostrar un mensaje de éxito, redireccionar, etc.
      } else {
        console.log('Failed to submit form data:', response.data);
      }
    } catch (error) {
      console.error('Error submitting form data:', error);
      // Maneja los errores de manera adecuada, por ejemplo, mostrando un mensaje de error al usuario.
    }
    // Resetea el formulario
    setFormData({
      full_name: '',
      email: '',
      organization: '',
      contact_reason: '',
      message: ''
    });
  };

  return {
    register,
    handleChange,
    handleSubmit: handleSubmit(onSubmit),
    errors
  };
};

export default useContactForm;