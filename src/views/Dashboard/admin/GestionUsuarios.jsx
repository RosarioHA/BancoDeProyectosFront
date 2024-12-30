import { useEffect, useState } from 'react';
import { useNavigate } from "react-router-dom";
import { useUsers } from "../../../hooks/usuarios/useUsers";
import { InputSearch } from '../../../components/Commons/input_search';


const GestionUsuarios = () =>
{
  const { users, pagination, setPagination, fetchUsers, metadata, setSearchTerm, searchTerm } = useUsers();
  const [ setSearching ] = useState(false);
  const navigate = useNavigate();
  const usersPerPage = 10;
  const totalPages = Math.ceil(metadata.count / usersPerPage);


  useEffect(() =>
  {
    fetchUsers();
  }, [ fetchUsers, pagination ]);

  // Cambiar `users` a `allUsers`

  const handleDetailsUser = (user) =>
  {
    navigate(`/dashboard/editar_usuario/${user.id}`, { state: { user } });
  };

  const handleSearch = (term) =>
  {
    const normalizedTerm = term.trim().toLowerCase();
    setSearchTerm(normalizedTerm);
    setSearching(!!normalizedTerm);
  };

  const handlePageChange = (pageNumber) =>
  {
    setPagination(pageNumber);
  };

  const renderPaginationButtons = () => {
    if (!pagination || totalPages <= 1) {
      return null;
    }
  
    const maxVisiblePages = 5; // Número máximo de botones visibles
    const startPage = Math.max(1, pagination - Math.floor(maxVisiblePages / 2));
    const endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);
  
    return (
      <div className="d-flex flex-column flex-md-row my-5 col-10">
        <p className="text-sans-h5 mx-5 text-center">
          {`${(pagination - 1) * usersPerPage + 1}- ${Math.min(pagination * usersPerPage, metadata.count)} de ${metadata.count} usuarios`}
        </p>
        <nav className="pagination-container mx-2 col-5">
          <ul className="pagination">
            <li className={`page-item ${pagination === 1 ? 'disabled' : ''}`}>
              <button className="custom-pagination-btn mx-3" onClick={() => handlePageChange(1)} disabled={pagination === 1}>
                &laquo; {/* Ir a la primera página */}
              </button>
            </li>
            <li className={`page-item ${pagination === 1 ? 'disabled' : ''}`}>
              <button className="custom-pagination-btn mx-3" onClick={() => handlePageChange(pagination - 1)} disabled={pagination === 1}>
                &lt; {/* Página anterior */}
              </button>
            </li>
            {Array.from({ length: endPage - startPage + 1 }, (_, i) => startPage + i).map((page) => (
              <li key={page} className="page-item">
                <button className={`custom-pagination-btn text-decoration-underline px-2 mx-2 ${pagination === page ? 'active' : ''}`} onClick={() => handlePageChange(page)}>
                  {page}
                </button>
              </li>
            ))}
            <li className={`page-item ${pagination === totalPages ? 'disabled' : ''}`}>
              <button className="custom-pagination-btn mx-3" onClick={() => handlePageChange(pagination + 1)} disabled={pagination === totalPages}>
                &gt; {/* Página siguiente */}
              </button>
            </li>
            <li className={`page-item ${pagination === totalPages ? 'disabled' : ''}`}>
              <button className="custom-pagination-btn mx-3" onClick={() => handlePageChange(totalPages)} disabled={pagination === totalPages}>
                &raquo; {/* Ir a la última página */}
              </button>
            </li>
          </ul>
        </nav>
      </div>
    );
  };

  return (
    <div className="container col-10 col-xxl-11 mt-2">
      <div className="text-sans-h2 mx-3">Administrar Usuarios</div>
      <div className="d-flex flex-row px-4 mb-5 justify-content-between">
        <div className="w-50 pl-2 text-sans-24 align-self-center">Todos los usuarios</div>
        <div>
          <InputSearch
            value={searchTerm}
            onSearch={handleSearch}
            setHasSearched={setSearching}
            onChange={setSearchTerm}
            placeholder="Busca palabras clave"
          />
        </div>
      </div>
      <div>
        <div className="d-flex row col-10 ms-5 border-top justify-content-evenly">
          <div className="col-1 mt-3">#</div>
          <div className="col mt-3">
            <p className="text-sans-b-gray">Nombre</p>
          </div>
          <div className="col mt-2">
            <p className="text-sans-b-gray">Correo Electrónico</p>
          </div>
          <div className="col mt-2">
            <button className="sort-estado-btn d-flex align-items-top mx-5">
              <p className="text-sans-b-gray mt-1 mx-2">Tipo de usuario</p>
              <i className="material-symbols-rounded ">filter_alt</i>
            </button>
          </div>
          <div className="col mt-3">
            <p className="text-sans-b-gray">Acción</p>
          </div>
          {users?.length > 0 ? (
            users?.map((user, index) => (
              <div key={index} className={`row border-top ${index % 2 === 0 ? 'grey-table-line' : 'white-table-line'}`}>
                <div className="col-1 p-3">{index + 1}</div>
                <div className="col p-3">{user.full_name}</div>
                <div className="col p-3">{user.email}</div>
                <div className="col p-3"> <p className="program mx-auto px-2 py-1">{user.perfil}</p></div>
                <div className="col p-3"><button className="btn-secundario-s px-3 py-1" onClick={() => handleDetailsUser(user)}><u>Ver usuario</u></button></div>
              </div>
            ))
          ) : (
            <div>No se encontraron usuario.</div>
          )}
        </div>
      </div>
        {metadata.count > usersPerPage && (
          <div className="d-flex justify-content-center">
            {renderPaginationButtons()}
          </div>
        )}
    </div>
  );
}

export default GestionUsuarios;
