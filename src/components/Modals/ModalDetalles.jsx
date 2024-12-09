import { useRef, useState } from 'react';
import { useApiRegionComuna } from '../../hooks/useApiRegionComuna';
import { useApiTypeProject } from '../../hooks/useTypeProject';
import { UseApiPrograms } from '../../hooks/usePrograms';
import ModalBase from './ModalBase';
import YearPicker from '../Commons/YearPicker';


const ModalDetalles = ({ setDetalles }) =>
{
  const { data, loading, error } = useApiRegionComuna();
  const { dataType, typeLoading, typeError } = useApiTypeProject();
  const { dataPrograms, loadingPrograms, errorPrograms } = UseApiPrograms();
  const [ selectedRegion, setSelectedRegion ] = useState(null);
  const [ selectedRegionID, setSelectedRegionID ] = useState(null);
  const [ selectedComuna, setSelectedComuna ] = useState(null);
  const [ selectedYear, setSelectedYear ] = useState(new Date().getFullYear());

  const programaNameRef = useRef(null);
  const tipoProyectoRef = useRef(null);
  const regionRef = useRef(null);
  const comunaRef = useRef(null);
  const idSubereRef = useRef(null);

  const handleYearChange = (year) =>
  {
    setSelectedYear(year);
  };

  const handleRegionChange = (e) =>
  {
    const selectedIndex = e.target.selectedIndex;
    setSelectedRegion(e.target[ selectedIndex ].text);
    setSelectedRegionID(e.target.value);
  };

  const handleComunaChange = (e) =>
  {
    setSelectedComuna(e.target[ e.target.selectedIndex ].text);
  };

  const handleGuardar = () =>
  {
    const programa = programaNameRef.current;
    const tipoProyectoID = tipoProyectoRef.current ? tipoProyectoRef.current.value : "";
    const tipoProyectoName = dataType.find(type => type.id === parseInt(tipoProyectoID))?.name;
    const idSubdere = idSubereRef.current ? idSubereRef.current.value : "";
    setDetalles({
      programa,
      tipoProyecto: tipoProyectoName,
      region: selectedRegion,
      comuna: selectedComuna,
      year: `${selectedYear}`,
      idSubdere,
    });

  };
  return (
    <>
      <ModalBase title="Detalles del Proyecto" btnName="Editar" btnIcon="edit" modalID="modalDetalles">
        <div className="modal-detalle d-flex align-items-center" >

          <form className="col">
            <div className="col-12 d-flex flex-column my-4">
              <label className="text-sans-p px-3">Elige el programa (Obligatorio)</label>
              <select
                className="custom-select px-3"
                id=""
                ref={programaNameRef}
                onChange={(e) => programaNameRef.current = e.target.options[ e.target.selectedIndex ].text}
              >
                <option value="">Elige una opción</option>
                {!loadingPrograms && !errorPrograms && dataPrograms?.map(program => (
                  <option key={program.id} value={program.id}>{program.name}</option>
                ))}
              </select>
            </div>

            <div className="col-12  d-flex flex-column my-4 ">
              <label className="text-sans-p px-3">Elige el tipo de proyecto (Obligatorio)</label>
              <select className="custom-select px-3" id="" ref={tipoProyectoRef}>
                <option value="">Elige una opción</option>
                {!typeLoading && !typeError && dataType?.map(type => (
                  <option key={type.id} value={type.id}>{type.name}</option>
                ))}
              </select>
            </div>

            <div className="col-12 d-flex flex-column my-4">
              <label className="text-sans-p px-3">¿En qué región está el proyecto? (Obligatorio)</label>
              <select
                className="custom-select px-3"
                onChange={handleRegionChange}
                ref={regionRef}>
                <option value="">Elige una opción</option>
                {!loading && !error && data?.map(region => (
                  <option key={region.id} value={region.id}>{region.region}</option>
                ))}
              </select>
            </div>

            <div className="col-12 d-flex flex-column my-4">
              <label className="text-sans-p px-3">¿En qué comuna? (Obligatorio)</label>
              <select
                className="custom-select px-3"
                onChange={handleComunaChange}
                ref={comunaRef}>
                <option value="">Elige una opción</option>
                {!loading && !error && selectedRegionID && data.find(region => region.id === parseInt(selectedRegionID))?.comunas.map(comuna => (
                  <option key={comuna.id} value={comuna.id}>{comuna.comuna}</option>
                ))}
              </select>
            </div>


            <div className="col-12 d-flex flex-column my-4">
              <YearPicker onYearChange={handleYearChange} />
            </div>
            <div className="d-flex flex-column input-container my-4">
              <label className="text-sans-p input-label ms-3 ms-sm-0" htmlFor="organization">ID SUBDERE (Obligatorio)</label>
              <input
                className="input-s px-3"
                type="text"
                placeholder="Ingresa el ID SUBDERE del Proyecto"
                ref={idSubereRef}
              />
            </div>
          </form>
          <div className=" col-12 d-flex border-top justify-content-between">
            <button className="btn-borderless d-flex justify-content-between my-5" data-bs-dismiss="modal" aria-label="Close">
              <i className="material-symbols-rounded ms-2 fs-2 mt-1">keyboard_arrow_left</i>
              <p className="text-sans-p-blue text-decoration-underline mb-0 py-1 px-2">Volver a la solicitud</p>
            </button>
            <button
              className="btn-principal-s d-flex text-sans-h4 pb-0 me-3 align-self-center"
              onClick={handleGuardar}
              data-bs-dismiss="modal"
            >
              <p className="text-sans-p-white text-decoration-underline">Guardar</p>
              <i className="material-symbols-rounded ms-2 pt-1">save</i>
            </button>
          </div>
        </div>
      </ModalBase>
    </>

  )
}

export default ModalDetalles