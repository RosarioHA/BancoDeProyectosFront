import { useState } from 'react';
import { apiBancoProyecto } from '../../services/bancoproyecto.api';

export const useDeleteProject = () =>
{
    const [ loading, setLoading ] = useState(false);
    const [ error, setError ] = useState(null);
    const [ success, setSuccess ] = useState(false);

    const deleteProject = async (slug) =>
    {
        setLoading(true);
        setError(null);
        setSuccess(false);

        try
        {
            const response = await apiBancoProyecto.delete(`/api/projects/v1/${slug}/`);
            if (response.status === 204)
            {
                setSuccess(true);
            }
        } catch (err)
        {
            setError(err.response ? err.response.data.detail : 'Error al eliminar el proyecto');
        } finally
        {
            setLoading(false);
        }
    };

    return {
        deleteProject,
        loading,
        error,
        success,
    };
};
