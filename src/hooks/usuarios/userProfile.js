import { useState } from "react";
import { apiBancoProyecto } from "../../services/bancoproyecto.api";

export const useUserProfileUpdate = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);

    const updateProfile = async (userData) => {
        setLoading(true);
        setError(null);
        setSuccess(false);

        try {
            // Realizar la solicitud PATCH al endpoint de actualización del perfil del usuario autenticado
            const response = await apiBancoProyecto.patch(`/users/update_profile/`, userData);
            setSuccess(true);
            return response.data;  // Retorna los datos actualizados
        } catch (err) {
            setError(err.response ? err.response.data : 'Error al actualizar el perfil');
        } finally {
            setLoading(false);
        }
    };

    return { updateProfile, loading, error, success };
};