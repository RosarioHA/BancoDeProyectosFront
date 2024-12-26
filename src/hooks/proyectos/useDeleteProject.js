import { useState } from 'react';
import apiBancoProyecto  from '../../services/bancoproyecto.api';

export const useDeleteProject = () =>
{
    const [ loading, setLoading ] = useState(false);
    const [ error, setError ] = useState(null);
    const [ success, setSuccess ] = useState(false);

    // Función para eliminar el proyecto
    const deleteProject = async (slug) =>
    {
        setLoading(true);
        setError(null);
        setSuccess(false); // Reiniciar el éxito antes de la eliminación

        try
        {
            const response = await apiBancoProyecto.delete(`/api/projects/v1/${slug}/`);

            // Validar que la respuesta sea un código 204 (sin contenido, eliminación exitosa)
            if (response.status === 204)
            {
                setSuccess(true);
            } else
            {
                setError('Error desconocido. El proyecto no fue eliminado.');
            }
        } catch (err)
        {
            // Manejo de errores, dependiendo de la respuesta
            if (err.response)
            {
                // Si el error tiene respuesta, obtener detalle
                setError(err.response.data.detail || 'Error al eliminar el proyecto');
            } else
            {
                setError('Error al contactar el servidor');
            }
        } finally
        {
            setLoading(false); // Finaliza la solicitud
        }
    };

    return {
        deleteProject,
        loading,
        error,
        success,
    };
};
