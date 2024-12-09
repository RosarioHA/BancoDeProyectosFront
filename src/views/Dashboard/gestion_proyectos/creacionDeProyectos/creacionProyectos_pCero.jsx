import { useNavigate } from 'react-router-dom';
import { UseApiPrograms } from '../../../../hooks/usePrograms';
import { useCreateProjects } from '../../../../hooks/proyectos/useCreateProjects';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import {validationSchema} from '../../../../validaciones/crearProject.js'
import { useCreateInnovative } from '../../../../hooks/innovativeProject/useCreateInnovative.js';

const CrearProyectos = () =>
{
  const { createProject } = useCreateProjects();
  const {createInnovative} = useCreateInnovative(); 
  const navigate = useNavigate();
  const { dataPrograms, loadingPrograms } = UseApiPrograms();

  const {
    handleSubmit,
    control,
    watch,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(validationSchema),
    mode: 'onBlur',
    defaultValues: {
      title: '',
      projectType: '',
      program: '',
    },
  });

  const selectedOption = watch('projectType');

  const onSubmit = async (data) =>
  {
    try
    {
      const { title, projectType, program } = data;
      if (projectType === 'bancoProyectos')
      {
        const slug = await createProject({ name: title, program: program || null });
        if (slug)
        {
          navigate(`/dashboard/crear_proyecto/${slug}/`, { state: { project: data } });
        } else
        {
          alert('No se pudo obtener el slug del proyecto.');
        }
      } else if (projectType === 'proyectosInnovadores')
      {
        const id = await createInnovative({ title: title, program: program || null });
        if (id){
          navigate(`/dashboard/crear_innovador/${id}/`, { state: { project: data } });
        }else {
          alert('No se pudo obtener el id del proyecto.');
        }
      }
    } catch (error)
    {
      console.error('Error al crear el proyecto:', error);
      alert('Ocurrió un error al intentar crear el proyecto. Por favor, inténtalo nuevamente.');
    }
  };

  const getContentForType = (type) =>
  {
    switch (type)
    {
      case 'bancoProyectos':
        return (
          <>
            <hr />
            <div className="d-flex flex-row">
              <i className="material-symbols-rounded me-2">check</i>
              <p className="text-sans-h5">Proyectos que ya han sido ejecutados en alguna comuna de Chile.</p>
            </div>
            <div className="d-flex flex-row">
              <i className="material-symbols-rounded me-2">check</i>
              <p className="text-sans-h5">Muestran información como: año de construcción, región y comuna donde se realizó, y el código SUBDERE asociado.</p>
            </div>
            <div className="d-flex flex-row">
              <i className="material-symbols-rounded me-2">check</i>
              <p className="text-sans-h5">Comparten documentación como presupuestos, especificaciones técnicas, entre otros.</p>
            </div>
            <hr />
          </>
        );
      case 'proyectosInnovadores':
        return (
          <>
            <hr />
            <div className="d-flex flex-row">
              <i className="material-symbols-rounded me-2">check</i>
              <p className="text-sans-h5">Proyectos referenciales que no necesariamente han sido ejecutados.</p>
            </div>
            <div className="d-flex flex-row">
              <i className="material-symbols-rounded me-2">check</i>
              <p className="text-sans-h5">Debes tener fotos para mostrar.</p>
            </div>
            <div className="d-flex flex-row">
              <i className="material-symbols-rounded me-2">check</i>
              <p className="text-sans-h5">Puedes agregar enlaces a sitios web referenciales.</p>
            </div>
            <div className="d-flex flex-row">
              <i className="material-symbols-rounded me-2">check</i>
              <p className="text-sans-h5">Proyectos novedosos que escapan de lo que normalmente se postula.</p>
            </div>
            <hr />
          </>
        );
      default:
        return <p className="text-sans-h5">Selecciona un tipo de proyecto para ver más información.</p>;
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="container view-container mx-5 mb-5">
      <h2 className="text-sans-h2 mt-4 mb-5">Subir Proyecto</h2>
      <div className="col-10 mx-5">
        <h3 className="text-sans-h3 ms-1">Elige donde quieres mostrar el proyecto:</h3>

        <div className="row my-5">
          {[ 'bancoProyectos', 'proyectosInnovadores' ].map((option) => (
            <div
              key={option}
              className={`col-5 opt-container p-3 mx-4 ${selectedOption === option ? 'opt-container-active' : ''}`}
            >
              <h3 className="text-serif-h3 text-center text-decoration-underline">
                {option === 'bancoProyectos' ? 'Banco de Proyectos' : 'Proyectos Innovadores'}
              </h3>
              <div className="mx-2">{getContentForType(option)}</div>
              <div className="d-flex justify-content-center">
                <Controller
                  name="projectType"
                  control={control}
                  render={({ field }) => (
                    <a
                      className={`btn-secundario-s  px-4 ${selectedOption === option ? 'btn-secundario-s-active' : ''}`}
                      onClick={() => field.onChange(option)}
                    >
                      Seleccionar
                    </a>
                  )}
                />
              </div>
            </div>
          ))}
        </div>

        {errors.projectType && <p className="text-sans-h5-red ms-1">{errors.projectType.message}</p>}

        <div className="container">
          <div className="d-flex flex-row justify-content-between my-3">
            <div>
              <p className="text-sans-h5">Escribe el título del proyecto (Obligatorio)</p>
              <Controller
                name="title"
                control={control}
                render={({ field }) => (
                  <>
                    <input
                      className="text-sans-h1 container-fluid ghost-input"
                      placeholder="Titulo del Proyecto"
                      {...field}
                    />
                    <p className={`text-sans-h5 ${field.value.length > 70 ? 'text-sans-h5-red' : ''}`}>
                      {field.value.length} / 700 caracteres
                    </p>
                  </>
                )}
              />
              {errors.title && <p className="text-sans-h5-red mt-1">{errors.title.message}</p>}
            </div>
          </div>

          <div>
            <p className="text-sans-p">Este proyecto corresponde al programa:</p>
            <Controller
              name="program"
              control={control}
              render={({ field }) => (
                <select
                  className="custom-selector p-3"
                  {...field}
                  disabled={loadingPrograms}
                >
                  <option value="">Seleccionar Programa</option>
                  {dataPrograms.map((program) => (
                    <option key={program.id} value={program.id}>
                      {program.name}
                    </option>
                  ))}
                </select>
              )}
            />
            {errors.program && <p className="text-sans-h5-red">{errors.program.message}</p>}
          </div>
        </div>

        <div className="container d-flex justify-content-end mt-5">
          <button
            onClick={handleSubmit(onSubmit)}
            className="btn-principal-s d-flex text-sans-h4 pb-0"
          >
            <p className="text-decoration-underline">Subir Proyecto</p>
            <i className="material-symbols-rounded ms-2">arrow_forward_ios</i>
          </button>
        </div>
      </div>
    </form>
  );
};

export default CrearProyectos;
