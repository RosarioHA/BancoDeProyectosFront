import { useState } from 'react';
import  apiBancoProyecto  from '../../services/bancoproyecto.api';

export const useDeleteGoodPractices = () =>
{
    const [ loading, setLoading ] = useState(false);
    const [ error, setError ] = useState(null);
    const [ success, setSuccess ] = useState(false);

    const  deleteGoodPractices= async (id) =>
    {
        setLoading(true);
        setError(null);
        setSuccess(false);

        try
        {
            const response = await apiBancoProyecto.delete(`good_practices/v1/${id}/`);

            if (response.status === 204)
            {
                setSuccess(true);
            } else
            {
                setError('Error desconocido. La Buena Práctica no fue eliminado.');
            }
        } catch (err)
        {
  
            if (err.response)
            {
          
                setError(err.response.data.detail || 'Error al eliminar la Buena práctica');
            } else
            {
                setError('Error al contactar el servidor');
            }
        } finally
        {
            setLoading(false); 
        }
    };

    return {
        deleteGoodPractices,
        loading,
        error,
        success,
    };
};
