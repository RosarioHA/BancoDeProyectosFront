import { useState } from "react";
import { apiBancoProyecto } from "../../services/bancoproyecto.api";

export const UserUpdate = () =>
{
    const [ loading, setLoading ] = useState(false);
    const [ error, setError ] = useState(null);
    const [ success, setSuccess ] = useState(false);

    const updateUser = async (userId, userData) =>
    {
        setLoading(true);
        setError(null);
        setSuccess(false);

        try {
            const response = await apiBancoProyecto.put(`/users/${userId}/`, userData);
            setSuccess(true); 
            return response.data;
        } catch (err) {
            console.error("Error al actualizar usuario:", err.response ? err.response.data : err);
            setError(err.response ? err.response.data : 'Error al actualizar el usuario');
            setSuccess(false); 
        }
    };
    return { updateUser, loading, error, success };
};