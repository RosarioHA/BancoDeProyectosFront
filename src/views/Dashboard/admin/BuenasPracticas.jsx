import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useListAdminGoodPractices } from "../../../hooks/goodPractices/useListAdminGoodPractices";
import { InputSearch } from "../../../components/Commons/input_search";

const BuenasPracticas = () =>
{
  const { goodPracticesAdmin,
    metadata, pagination,
    setPagination, searchTerm,
    setSearchTerm } = useListAdminGoodPractices();
  const [ setSearching ] = useState(false);
  const navigate = useNavigate();
  const practicaPerPage = 10;
  const totalPages = Math.ceil(metadata.count / practicaPerPage);

  const handleSearch = (term) =>
  {
    const normalizedTerm = term.trim().toLowerCase();
    setSearchTerm(normalizedTerm);
    setSearching(!!normalizedTerm);
  };
  const handlePageChange = (pageNumber) =>
  {
    if (pageNumber >= 1 && pageNumber <= totalPages)
    {
      setPagination(pageNumber);
    }
  };

  const handleDetailsPractica = (practica) =>
  {
    navigate(`/dashboard/editar_buenas_practicas/${practica.id}`, { state: { practica } });
  };

  const handleAddPractica = () =>
  {
    navigate('/dashboard/crear_buena_practica');
  };


  const renderPaginationButtons = () =>
  {
    if (totalPages <= 1)
    {
      return null; // No mostrar paginación si hay una sola página
    }

    return (
      <div className="d-flex flex-column flex-md-row my-5 justify-content-center">
        <p className="text-sans-h5 mx-3 text-center">
          {`Mostrando ${(pagination - 1) * practicaPerPage + 1} - ${Math.min(pagination * practicaPerPage, metadata.count)} de ${metadata.count} documentos`}
        </p>
        <nav className="pagination-container">
          <ul className="pagination">
            <li className={`page-item ${pagination === 1 ? 'disabled' : ''}`}>
              <button
                className="custom-pagination-btn mx-2"
                onClick={() => handlePageChange(pagination - 1)}
                disabled={pagination === 1}
              >
                &lt;
              </button>
            </li>
            {Array.from({ length: totalPages }, (_, i) => (
              <li key={i} className="page-item">
                <button
                  className={`custom-pagination-btn mx-1 ${pagination === i + 1 ? 'active' : ''}`}
                  onClick={() => handlePageChange(i + 1)}
                >
                  {i + 1}
                </button>
              </li>
            ))}
            <li className={`page-item ${pagination === totalPages ? 'disabled' : ''}`}>
              <button
                className="custom-pagination-btn mx-2"
                onClick={() => handlePageChange(pagination + 1)}
                disabled={pagination === totalPages}
              >
                &gt;
              </button>
            </li>
          </ul>
        </nav>
      </div>
    );
  };
  return (
    <div className="container col-10 col-xxl-11 mt-2">
      <div className="text-sans-h2 mx-3">Gestión de Plataforma</div>
      <div className="d-flex flex-row px-4 mb-5 justify-content-between">
        <div className="w-50 pl-2 text-sans-h3 align-self-center">Buenas Prácticas</div>
        <div className="d-flex">
          <div className="mx-3 col-7">
            <InputSearch
              value={searchTerm}
              onSearch={handleSearch}
              setHasSearched={setSearching}
              onChange={setSearchTerm}
              placeholder="Buscar"
            />
          </div>
          <div className="mx-3 col-5">
            <button
              className="btn-principal-s d-flex py-3 me-3 align-self-center"
              onClick={handleAddPractica}
            >
              <u>Crear Buenas Prácticas</u>
              <i className="material-symbols-rounded ms-2 ">add</i>
            </button>
          </div>
        </div>
      </div>
      <div>
        <div className="row py-2 border-top">
          <div className="col-1 mt-3">#</div>
          <div className="col mt-3">
            <p className="text-sans-b-gray">Nombre</p>
          </div>
          <div className="col mt-3">
            <p className="text-sans-b-gray text-center mx-auto">Programa</p>
          </div>
          <div className="col mt-3">
            <p className="text-sans-b-gray">Estado</p>
          </div>
          <div className="col mt-3">
            <p className="text-sans-b-gray">Fecha modificacion</p>
          </div>
          <div className="col mt-3">
            <p className="text-sans-b-gray text-center me-5">Acción</p>
          </div>
          {goodPracticesAdmin?.length > 0 ? (
            goodPracticesAdmin?.map((practica, index) => (
              <div key={index} className={`row border-top ${index % 2 === 0 ? 'grey-table-line' : 'white-table-line'}`}>
                <div className="col-1 p-3">{index + 1}</div>
                <div className="col p-3">{practica.title}</div>
                <div className="col p-3 text-center mx-auto"><span className="program mx-auto px-2 py-1">{practica.program?.sigla}</span></div>
                <div className="col p-3 text-center">
                  <span className={`mx-auto px-2 py-1 ${practica.public ? 'publicado' : 'privado'}`}>
                    {practica.public ? "Publicado" : "Privado"}
                  </span>
                </div>
                <div className="col p-3 text-center mx-auto">{practica.modified}</div>
                <div className="col p-3 text-center ">
                  <button className="btn-secundario-s px-3 py-1 " onClick={() => handleDetailsPractica(practica)}>
                    <u>Editar</u>
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div>No se encontraron Buenas Practicas.</div>
          )}
        </div>
        {metadata.count > practicaPerPage && renderPaginationButtons()}
      </div>
    </div>
  )
}

export default BuenasPracticas