import { useState, useEffect, useCallback } from 'react';
import { useApiRegionComuna } from '../../hooks/useApiRegionComuna';
import { useApiTypeProject } from '../../hooks/useTypeProject';
import { UseApiPrograms } from '../../hooks/usePrograms';
import { useApiTagProject } from '../../hooks/useTag'
import { useApiYears } from '../../hooks/useYears';
import ModalBase from './ModalBase';
import { YearPicker } from '../Commons/YearPicker';

export const ModalDetalles = ({ initialDetails = {}, onGuardar }) =>
{
  const { data, loading, error } = useApiRegionComuna();
  const { dataType, typeLoading, typeError } = useApiTypeProject();
  const { dataPrograms, loadingPrograms, errorPrograms } = UseApiPrograms();
  const { dataTag } = useApiTagProject();
  const { dataYears, addYear } = useApiYears();

  // Estados para los inputs, inicializados con los valores preseleccionados si existen
  const [ selectedPrograma, setSelectedPrograma ] = useState(initialDetails.programa || '');
  const [ selectedTipoProyecto, setSelectedTipoProyecto ] = useState(initialDetails.tipoProyecto || '');
  const [ selectedTag, setSelectedTag ] = useState(initialDetails.tag || '');
  const [ selectedRegion, setSelectedRegion ] = useState(initialDetails.region || '');
  const [ selectedRegionID, setSelectedRegionID ] = useState(null);
  const [ selectedComuna, setSelectedComuna ] = useState(initialDetails.comuna || ''); 
  const [ selectedYear, setSelectedYear ] = useState(initialDetails.year || '');
  const [ idSubdere, setIdSubdere ] = useState(initialDetails.idSubdere || '');
  const [ filteredTypes, setFilteredTypes ] = useState(dataType);

  const findAndSetByName = useCallback((name, dataList, setter, key = 'name') =>
  {
    if (name && dataList)
    {
      const item = dataList.find(dataItem => dataItem[ key ] === name);
      if (item)
      {
        setter(item.id);
      }
    }
  }, []);
  useEffect(() =>
  {
    if (initialDetails.tag)
    {
      setSelectedTag(initialDetails.tag);
    }
  }, [ initialDetails.tag ]);


  // Efecto para seleccionar la región y la comuna correspondiente
  useEffect(() =>
  {
    if (data && initialDetails.region)
    {
      const region = data.find(r => r.region === initialDetails.region);
      if (region)
      {
        setSelectedRegionID(region.id);
        if (initialDetails.comuna)
        {
          const comuna = region.comunas?.find(c => c.comuna === initialDetails.comuna);
          if (comuna) setSelectedComuna(comuna.comuna);
        }
      }
    }
  }, [ data, initialDetails.region, initialDetails.comuna ]);

  useEffect(() =>
  {
    if (initialDetails.tipoProyecto)
    {
      setSelectedTipoProyecto(initialDetails.tipoProyecto);
    }
  }, [ initialDetails.tipoProyecto ]);

  useEffect(() =>
  {
    if (selectedPrograma && dataType)
    {
      const filtered = dataType.filter((type) => type.program === parseInt(selectedPrograma));
      setFilteredTypes(filtered);
      const initialType = filtered.find((type) => type.name === initialDetails.tipoProyecto);
      if (initialType)
      {
        setSelectedTipoProyecto(initialType.id);
      } else
      {
        setSelectedTipoProyecto('');
      }
    }
  }, [ selectedPrograma, dataType, initialDetails.tipoProyecto ]);



  useEffect(() =>
  {
    if (dataPrograms && initialDetails.programa)
    {
      const selectedProgram = dataPrograms.find(program => program.name === initialDetails.programa);
      if (selectedProgram)
      {
        setSelectedPrograma(selectedProgram.id);
      }
    }
  }, [ dataPrograms, initialDetails.programa ]);

  useEffect(() =>
  {
    if (dataPrograms && initialDetails.programa)
    {
      const selectedProgram = dataPrograms.find(program => program.name === initialDetails.programa);
      if (selectedProgram)
      {
        setSelectedPrograma(selectedProgram.id);
      }
    }
  }, [ dataPrograms, initialDetails.programa ]);



  useEffect(() =>
  {
    findAndSetByName(initialDetails.tags, dataTag, setSelectedTag);
  }, [ dataTag, initialDetails.tags, findAndSetByName ]);


  useEffect(() =>
  {
    if (initialDetails.tag && dataTag)
    {
      const tagItem = dataTag.find(tag => tag.prioritized_tag === initialDetails.tag);
      if (tagItem)
      {
        setSelectedTag(tagItem.id);
      }
    }
  }, [ dataTag, initialDetails.tag ]);



  useEffect(() =>
  {
    if (initialDetails.year && dataYears)
    {
      const initialYearData = dataYears.find(y => y.number === initialDetails.year.toString());
      if (initialYearData)
      {
        setSelectedYear(initialYearData.id);
      }
    }
  }, [ dataYears, initialDetails.year ]);
  // Handlers de cambio

  const handleRegionChange = (e) =>
  {
    const selectedIndex = e.target.selectedIndex;
    setSelectedRegion(e.target[ selectedIndex ].text);
    setSelectedRegionID(e.target.value);
  };


  const handleComunaChange = (e) =>
  {
    setSelectedComuna(e.target.value);
  };


  // Función para manejar el cambio de año
  const handleYearChange = async (year) =>
  {
    if (!year)
    {
      setSelectedYear(initialDetails.year);
      return;
    }

    const yearData = dataYears.find(y => y.number === year.toString());
    if (yearData)
    {
      setSelectedYear(yearData.id);
    } else
    {
      try
      {
        const newYear = await addYear(year);
        if (newYear && newYear.id)
        {
          setSelectedYear(newYear.id);
        }
      } catch (error)
      {
        console.error("Error creando el año:", error);
      }
    }
  };

  const handleGuardar = () =>
  {
    const tipoProyectoid = dataType.find((type) => type.id === parseInt(selectedTipoProyecto))?.id;
    const comunaID = data.find(region => region.id === parseInt(selectedRegionID))
      ?.comunas.find(comuna => comuna.comuna === selectedComuna)?.id;
    const newDetails = {
      program: selectedPrograma,
      type: tipoProyectoid,
      region: selectedRegion,
      comuna: comunaID,
      year: selectedYear,
      id_subdere: idSubdere,
      prioritized_tag: selectedTag || null,
    };

    // Llamar a la función de callback para pasar los nuevos detalles al componente padre
    onGuardar(newDetails);
  };


  return (
    <>
      <ModalBase
        classStyle="btn-secundario-s"
        titleStyle="text-sans-h4"
        title="Detalles del Proyecto"
        btnName="Editar"
        btnIcon="edit"
        modalID="modalDetalles">
        <div className="modal-detalle d-flex align-items-center">

          <div className="col">
            {/* Programa */}
            <div className="col-12 d-flex flex-column my-4">
              <label className="text-sans-p px-3">Elige el programa (Obligatorio)</label>
              <select
                className="custom-select px-3"
                value={selectedPrograma || ''}
                onChange={(e) => setSelectedPrograma(e.target.value)}
              >
                <option value="">Elige una opción</option>
                {!loadingPrograms && !errorPrograms && dataPrograms?.map(program => (
                  <option key={program.id} value={program.id}>{program.name}</option>
                ))}
              </select>
            </div>

            {/* Tipo de Proyecto */}
            <div className="col-12 d-flex flex-column my-4">
              <label className="text-sans-p px-3">Elige el tipo de proyecto (Obligatorio)</label>
              <select
                className="custom-select px-3"
                value={selectedTipoProyecto || ''}
                onChange={(e) => setSelectedTipoProyecto(e.target.value)}
              >
                <option value="">Elige una opción</option>
                {!typeLoading && !typeError && filteredTypes?.map((type) => (
                  <option key={type.id} value={type.id}>{type.name}</option>
                ))}
              </select>
            </div>
            {/* Tag Prioridad */}
            <div className="col-12 d-flex flex-column my-4">
              <label className="text-sans-p px-3">Elige un Tag de priorización</label>
              <select
                className="custom-select px-3"
                value={selectedTag || ''}
                onChange={(e) => setSelectedTag(e.target.value)} // selectedTag should be ID here
              >
                <option value="">Elige una opción</option>
                {dataTag?.map(tag => (
                  <option key={tag.id} value={tag.id}>{tag.prioritized_tag}</option>
                ))}
              </select>
            </div>
            {/* Región */}
            <div className="col-12 d-flex flex-column my-4">
              <label className="text-sans-p px-3">¿En qué región está el proyecto? (Obligatorio)</label>
              <select
                className="custom-select px-3"
                value={selectedRegionID || ''}
                onChange={handleRegionChange}
              >
                <option value="">Elige una opción</option>
                {!loading && !error && data?.map(region => (
                  <option key={region.id} value={region.id}>{region.region}</option>
                ))}
              </select>
            </div>

            {/* Comuna */}
            <div className="col-12 d-flex flex-column my-4">
              <label className="text-sans-p px-3">¿En qué comuna? (Obligatorio)</label>
              <select
                className="custom-select px-3"
                value={selectedComuna || ''}
                onChange={handleComunaChange}
              >
                <option value="">Elige una opción</option>
                {!loading && !error && selectedRegionID &&
                  data.find(region => region.id === parseInt(selectedRegionID))?.comunas.map(comuna => (
                    <option key={comuna.id} value={comuna.comuna}>{comuna.comuna}</option>
                  ))}
              </select>
            </div>
            {/* Año */}
            <div className="col-12 d-flex flex-column my-4">
              <YearPicker
                onYearChange={handleYearChange}
                selectedYear={initialDetails.year}
              />
            </div>

            {/* ID SUBDERE */}
            <div className="d-flex flex-column input-container my-4">
              <label className="text-sans-p input-label ms-3 ms-sm-0" htmlFor="idSubdere">ID SUBDERE (Obligatorio) </label>
              <input
                className="input-s px-3"
                type="text"
                value={idSubdere}
                onChange={(e) => setIdSubdere(e.target.value)}
                placeholder="Ingresa el ID SUBDERE del Proyecto"
              />
            </div>
          </div>


          <div className="col-10 d-flex justify-content-between">
            <button className="btn-borderless d-flex justify-content-between my-5" data-bs-dismiss="modal" aria-label="Close">
              <i className="material-symbols-rounded ms-2 fs-2 mt-1">keyboard_arrow_left</i>
              <p className="text-sans-p-blue text-decoration-underline mb-0 py-1 px-2">Volver a la solicitud</p>
            </button>
            <button
              className="btn-principal-s d-flex text-sans-h4 pb-0 me-3 align-self-center"
              onClick={handleGuardar}
              data-bs-dismiss="modal"
            >
              <p className="text-decoration-underline">Guardar</p>
              <i className="material-symbols-rounded ms-2 pt-1">save</i>
            </button>
          </div>
        </div>
      </ModalBase>
    </>
  );
};
