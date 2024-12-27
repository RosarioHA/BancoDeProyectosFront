import { useState, useEffect } from 'react';
import { useNavigate, useParams } from "react-router-dom";
import { useForm, Controller, useWatch } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { UserUpdate } from "../../../hooks/usuarios/userUpdate";
import { useFormContext } from '../../../context/FormContext';
import { useApiRegionComuna } from "../../../hooks/useApiRegionComuna";
import { useUserDetails } from "../../../hooks/usuarios/userDetail";
import CustomInput from "../../../components/Form/custom_input";
import { DropdownSimple } from '../../../components/Form/DropdownSimple';
import validationSchema from '../../../validaciones/usuario/editarUsuario';
import  ModalAbandonoFormulario  from '../../../components/Modals/ModalAbandono';

const EdicionUsuario = () =>
{
  const { id } = useParams();
  const navigate = useNavigate();
  const { userDetails } = useUserDetails(id);
  const { data } = useApiRegionComuna();
  const { updateUser, success } = UserUpdate();

  const [ selectedPerfil, setSelectedPerfil ] = useState("");
  const [ userData, setUserData ] = useState({ email: '', institucion: '' });
  const [ selectedRegion, setSelectedRegion ] = useState("");
  const [ communes, setCommunes ] = useState([]);
  const [ selectedComuna, setSelectedComuna ] = useState("");
  const { editMode, updateEditMode, hasChanged, updateHasChanged } = useFormContext();

  const [ isModalOpen, setIsModalOpen ] = useState(false);

  const { control, handleSubmit, formState: { errors }, reset } = useForm({
    resolver: yupResolver(validationSchema),
    mode: 'onBlur',
  });
  const watchedValues = useWatch({ control });

  useEffect(() =>
  {
    if (userDetails)
    {
      setUserData({ email: userDetails.email, institucion: userDetails.institucion });
      setSelectedPerfil(userDetails.perfil);
      setSelectedRegion(userDetails.region);
      setSelectedComuna(userDetails.comuna);
      reset({
        institucion: userDetails.institucion,
        email: userDetails.email,
      });
    }
  }, [ userDetails, reset ]);

  useEffect(() => {
    const isChanged = (
      watchedValues.institucion !== userDetails?.institucion ||
      watchedValues.email !== userDetails?.email ||
      selectedPerfil !== userDetails?.perfil ||
      selectedRegion !== userDetails?.region ||
      selectedComuna !== userDetails?.comuna
    );
    updateHasChanged(isChanged);
  }, [watchedValues, selectedPerfil, selectedRegion, selectedComuna, userDetails, updateHasChanged]);
  
  useEffect(() => {
    const handleBeforeUnload = (event) => {
      if (hasChanged) {
        event.preventDefault();
        event.returnValue = '';  // Necesario para mostrar el diálogo de confirmación
      }
    };
  
    window.addEventListener('beforeunload', handleBeforeUnload);
  
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [hasChanged]);
  const handleBackButtonClick = () =>
  {
    if (editMode)
    {
      if (hasChanged)
      {
        setIsModalOpen(true);
      } else
      {
        updateEditMode(false);
      }
    } else
    {
      navigate(-1);
    }
  };
  const handleEditClick = () =>
  {
    if (!editMode)
    {
      updateEditMode(true);
    } else if (hasChanged)
    {
      setIsModalOpen(true);
    } else
    {
      updateEditMode(false);
    }
  };


  const perfiles = [
    "Editor",
    "Usuario Formulante",
    "Usuario Registrado"
  ];

  const handleOptionSelect = (option) =>
  {
    setSelectedPerfil(option); // Actualizar el perfil seleccionado
  };

  const handleRegionSelect = (option) =>
  {
    setSelectedRegion(option);

    // Filtrar las comunas de la región seleccionada
    const selectedRegionData = data.find(region => region.region === option);
    setCommunes(selectedRegionData ? selectedRegionData.comunas : []);
  };

  const handleComunaSelect = (option) =>
  {
    setSelectedComuna(option); // Actualizar la comuna seleccionada
  };

  const onSubmit = async (data) =>
  {
    const updatedData = {
      ...userData,
      ...data,
      perfil: selectedPerfil,
      region: selectedRegion,
      comuna: selectedComuna,
    };
    console.log('Updated data:', updatedData); // Log data for debugging
    await updateUser(updatedData);
    updateHasChanged(false);
  };

  // Redirigir automáticamente cuando 'success' sea true
  useEffect(() =>
  {
    if (success)
    {
      navigate('/dashboard/edicion_exitosa', { state: { origen: "editar_usuario", id: userDetails.id } });
    }
  }, [ success, navigate, userDetails ]);

  return (
    <div className="container col-10 col-xxl-11 mt-2">

      {isModalOpen && (
        <ModalAbandonoFormulario
          onClose={() => setIsModalOpen(false)}
          isOpen={isModalOpen}
        />
      )}
      <div className="text-sans-h2 mx-3">Administrar Usuarios</div>

      <div className="d-flex flex-row px-4 mb-5 justify-content-between my-3">
        <button className="btn-secundario-s d-flex justify-content-between" onClick={handleBackButtonClick}>
          <i className="material-symbols-rounded me-2">arrow_back_ios</i>
          <p className="mb-0">Volver</p>
        </button>

        <div className="w-100 pl-2 text-sans-h3-tertiary my-auto mx-5">Perfil de: {userDetails?.full_name}</div>
        <button className="btn-secundario-s d-flex justify-content-between" onClick={handleEditClick}>
          <i className="material-symbols-rounded me-2">{editMode ? 'edit' : 'edit'}</i>
          <p className="mb-0">{editMode ? 'Editando' : 'Editar'}</p>
        </button>
      </div>
      <form onSubmit={handleSubmit(onSubmit)} className="container col-9"> {/* Agregado el formulario */}
        <div className="d-flex flex-column input-container my-5">
          <label className="text-sans-sub-grey input-label ms-3 ms-sm-0">Nombre de usuario</label>
          <div className={`textarea-text input-textarea p-3 d-flex justify-content-between`}>
            <p className="text-sans-p-grey mb-0">{userDetails?.full_name}</p>
            <span className="material-symbols-outlined">lock</span>
          </div>
        </div>
        <div className="d-flex flex-column input-container my-5">
          <label className="text-sans-sub-grey input-label ms-3 ms-sm-0">RUT</label>
          <div className={`textarea-text input-textarea p-3 d-flex justify-content-between`}>
            <p className="text-sans-p-grey mb-0">{userDetails?.rut}</p>
            <span className="material-symbols-outlined">lock</span>
          </div>
        </div>
        <div className="my-5">
          <Controller
            control={control}
            name="institucion"
            render={({ field }) => (
              <CustomInput
                placeholder="Nombre de la institución"
                label="Institución"
                maxLength="100"
                error={errors.institucion?.message}
                {...field}
                readOnly={!editMode}
              />
            )}
          />
        </div>
        <div className="my-5">
          <Controller
            control={control}
            name="email"
            render={({ field }) => (
              <CustomInput
                placeholder="Correo electrónico"
                label="Correo electrónico"
                maxLength="100"
                name="email"
                error={errors.email?.message} // Mostrar el mensaje de error
                {...field} // Pasar las props del controlador
                readOnly={!editMode}
              />
            )}
          />
        </div>
        <div className="d-flex flex-column input-container my-5">
          <label className="text-sans-sub-grey input-label ms-3 ms-sm-0">Elige la región a la que representa</label>
          <DropdownSimple
            data={data.map(region => region.region)} // Extraer solo las regiones
            description="una región"
            onOptionSelect={handleRegionSelect}
            selectedOption={selectedRegion}
            readOnly={!editMode}
          />
        </div>

        <div className="d-flex flex-column input-container my-5">
          <label className="text-sans-sub-grey  input-label ms-3 ms-sm-0">Elige la comuna a la que representa </label>
          <DropdownSimple
            data={communes.map(comuna => comuna.comuna)}
            description="una comuna"
            onOptionSelect={handleComunaSelect}
            selectedOption={selectedComuna}
            readOnly={!editMode}
          />
        </div>
        <div className="d-flex flex-column input-container my-5">
          <label className="text-sans-sub-grey input-label ms-3 ms-sm-0">Tipo de usuario </label>
          <DropdownSimple
            data={perfiles}
            description="un perfil"
            onOptionSelect={handleOptionSelect}
            selectedOption={selectedPerfil}
            readOnly={!editMode}
          />
        </div>
        <div>
          <div className="d-flex flex-column input-container my-5">
            <label className="text-sans-sub-grey input-label ms-3 ms-sm-0">Fecha de Creación</label>
            <div className={`textarea-text input-textarea p-3 d-flex justify-content-between`}>
              <p className="text-sans-p-grey mb-0">{userDetails?.created}</p>
            </div>
          </div>
          <div className="d-flex flex-column input-container my-5">
            <label className="text-sans-sub-grey input-label ms-3 ms-sm-0">Fecha último inicio de sesión</label>
            <div className={`textarea-text input-textarea p-3 d-flex justify-content-between`}>
              <p className="text-sans-p-grey mb-0">{userDetails?.last_login_display}</p>
            </div>
          </div>
        </div>
        <div className="d-flex justify-content-end">
          {editMode && (
            <button className="btn-secundario-s mb-5 d-flex " type="submit">
              <i className="material-symbols-rounded me-2">save</i>
              <p className="mb-0">Guardar</p>
            </button>
          )}
        </div>
      </form>
    </div>
  );
};

export default EdicionUsuario;
