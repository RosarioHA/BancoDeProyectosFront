import * as yup from 'yup';

// Validación con Yup
export const validationSchema = yup.object().shape({
  title: yup
    .string()
    .required('El título es obligatorio')
    .min(10, 'El título debe tener al menos 10 caracteres')
    .max(700, 'El título no puede exceder los 700 caracteres'),
  projectType: yup.string().required('Debes elegir donde quieres mostrar el proyecto antes de continuar.'),
  program: yup
  .string()
  .required('Debes seleccionar un programa'), 
});