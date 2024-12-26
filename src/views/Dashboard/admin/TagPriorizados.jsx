import { useState } from 'react';
import { useApiTagProject } from "../../../hooks/useTag";
import { Tags } from "../../../components/Modals/Tags";
import { InputSearch } from '../../../components/Commons/input_search';

const TagPriorizados = () =>
{
  const [ setSearching ] = useState();
  const [ error, setError ] = useState('');
  const [ tagName, setTagName ] = useState('');
  const {
    tagList,
    setSearchTerm,
    searchTerm,
    metadata,
    pagination,
    setPagination,
    deleteTag,
    addTag,
  } = useApiTagProject();

  const tagPerPage = 10;
  const totalPages = Math.ceil(metadata.count / tagPerPage);

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

  const handleAddTag = async () =>
  {
    try
    {
      const newTagName = tagName;
      await addTag(newTagName);
      setTagName('');
    } catch (error)
    {
      setError('Error al agregar el tag:', error);
    }
  };

  const handleDelete = async (tagId) =>
  {
    await deleteTag(tagId);

    if (tagList.length === 1 && pagination > 1)
    {
      setPagination(pagination - 1);
    }
  };


  const renderPaginationButtons = () =>
  {
    if (totalPages <= 1)
    {
      return null;
    }

    return (
      <div className="d-flex flex-column flex-md-row my-5 justify-content-center">
        <p className="text-sans-h5 mx-3 text-center">
          {`Mostrando ${(pagination - 1) * tagPerPage + 1} - ${Math.min(pagination * tagPerPage, metadata.count)} de ${metadata.count} tags`}
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
        <div className="w-50 pl-2 text-sans-h3 align-self-center">Gestión de tags</div>
        <div className="d-flex">
          <div className="mx-3 col-7">
            <InputSearch
              value={searchTerm}
              onSearch={handleSearch}
              setHasSearched={setSearching}
              onChange={setSearchTerm}
              placeholder="Buscar tag"
            />
          </div>
          <div className="mx-3 col-5">
            <Tags
              handleAddTag={handleAddTag}
              error={error}
              tagName={tagName}
              setTagName={setTagName} />
          </div>
        </div>
      </div>
      <div>
        <div className="row py-2 border-top">
          <div className="col-1 mt-3">#</div>
          <div className="col mt-3">
            <p className="text-sans-b-gray">Tag</p>
          </div>
          <div className="col mt-3">
            <p className="text-sans-b-gray">Acción</p>
          </div>
          {tagList?.length > 0 ? (
            tagList?.map((tag, index) => (
              <div key={index} className={`row border-top ${index % 2 === 0 ? 'grey-table-line' : 'white-table-line'}`}>
                <div className="col-1 p-3">
                  {(pagination - 1) * tagPerPage + index + 1}
                </div>
                <div className="col p-3">{tag?.prioritized_tag}</div>
                <div className="col p-3">
                  <button className="red-btn px-3 py-1" onClick={() => handleDelete(tag?.id)}>
                    <u>Eliminar</u>
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div>No se encontraron tags priorizados.</div>
          )}
        </div>
        {metadata?.count > tagPerPage && renderPaginationButtons()}
      </div>
    </div>
  );
};

export default TagPriorizados;
