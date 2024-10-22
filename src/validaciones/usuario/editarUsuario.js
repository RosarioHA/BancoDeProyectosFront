import * as yup from 'yup';

// Esquema de validación
const validationSchema = yup.object().shape({
  email: yup
    .string()
    .email('El formato del correo electrónico es inválido') // Validar formato de email
    .max(100, 'El correo electrónico no puede tener más de 100 caracteres') // Validar longitud máxima
    .nullable(), // Permitir que el campo sea nulo o vacío

  institucion: yup
    .string()
    .max(100, 'La institución debe tener como máximo 100 caracteres')  
    .nullable(), // Permitir que el campo sea nulo o vacío
});

export default validationSchema;
