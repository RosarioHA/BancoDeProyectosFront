import { useState } from 'react';
import { useNavigate } from "react-router-dom";
import { InputSearch } from '../../../components/Commons/input_search';
import { useApiDocuments } from '../../../hooks/useApiDocuments'


const Documents = () =>
{
  const [ setSearching ] = useState(); // Usado para indicar si se está realizando una búsqueda
  const {
    documentsList,
    metadata,
    pagination,
    setPagination,
    setSearchTerm,
    searchTerm
  } = useApiDocuments();
  const navigate = useNavigate();


  const usersPerPage = 10; // Número de elementos por página
  const totalPages = Math.ceil(metadata.count / usersPerPage); // Total de páginas

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

  const handleDetailsDocument = (documento) =>
    {
      navigate(`/dashboard/editar_documento/${documento.id}`, { state: { documento} });
    };

  const handleAddDocument = () =>
  {
    navigate('/dashboard/agregar_documento');
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
          {`Mostrando ${(pagination - 1) * usersPerPage + 1} - ${Math.min(pagination * usersPerPage, metadata.count)} de ${metadata.count} documentos`}
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
        <div className="w-50 pl-2 text-sans-h3 align-self-center">Documentos</div>
        <div className="d-flex">
          <div className="mx-3 col-7">
            <InputSearch
              value={searchTerm}
              onSearch={handleSearch}
              setHasSearched={setSearching}
              onChange={setSearchTerm}
              placeholder="Buscar documento"
            />
          </div>
          <div className="mx-3 col-5">
            <button
              className="btn-principal-s d-flex py-3 me-3 align-self-center"
              onClick={handleAddDocument}
            >
              <u>Subir documento</u>
              <i className="material-symbols-rounded ms-2 ">add</i>
            </button>
          </div>
        </div>
      </div>
      <div>
        <div className="row py-2 border-top">
          <div className="col-1 mt-3">#</div>
          <div className="col mt-3">
            <p className="text-sans-b-gray">Nombre del documento</p>
          </div>
          <div className="col mt-3">
            <p className="text-sans-b-gray text-center mx-auto">Formato</p>
          </div>
          <div className="col mt-3">
            <p className="text-sans-b-gray">Tipo de documento</p>
          </div>
          <div className="col mt-3">
            <p className="text-sans-b-gray">Última modificación</p>
          </div>
          <div className="col mt-3">
            <p className="text-sans-b-gray text-center me-5">Acción</p>
          </div>
          {documentsList?.length > 0 ? (
            documentsList.map((documento, index) => (
              <div key={index} className={`row border-top ${index % 2 === 0 ? 'grey-table-line' : 'white-table-line'}`}>
                <div className="col-1 p-3">{index + 1}</div>
                <div className="col p-3">{documento.title}</div>
                <div className="col p-3 text-center mx-auto">{documento.document_format}</div>
                <div className="col p-3 text-center"><span className="program mx-auto px-2 py-1">{documento.document_type.type}</span></div>
                <div className="col p-3 text-center mx-auto">{documento.modified}</div>
                <div className="col p-3 text-center ">
                  <button className="btn-secundario-s px-3 py-1 " onClick={() => handleDetailsDocument(documento)}>
                    <u>Editar</u>
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div>No se encontraron documentos.</div>
          )}
        </div>
        {metadata.count > usersPerPage && renderPaginationButtons()}
      </div>
    </div>
  );
};
export default Documents; 