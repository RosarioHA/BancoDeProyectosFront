export const AdditionalDocs = (props) =>
{
  const handleDelete = (event, index) =>
  {
    event.preventDefault();
    props.onDelete(index);
  };

  return (
    <>
      <div className="row my-4 fw-bold border-top">
        <div className="col-1 mt-3">#</div>
        <div className="col mt-3">Documento</div>
        <div className="col mt-3">Formato</div>
        <div className="col mt-3 ms-5">Acción</div>
      </div>
      {props.files.map((fileObj, index) => (
        <div key={index} className={`row border-top align-items-center ${index % 2 === 0 ? 'grey-table-line' : 'white-table-line'}`}>
          <div className="col-1 p-3">{index + 1}</div>
          <div className="col p-3">
            {fileObj.file ? (
              <span>
                {fileObj.name}
              </span>
            ) : (
              fileObj.name
            )}
          </div>
          <div className="col p-3">{fileObj.file_format}</div>
          <div className="col p-3 d-flex">
            <a className="col p-3 text-sans-p-tertiary" href={fileObj.file} target="_blank" rel="noopener noreferrer">Ver Documento</a>
            <button
              type="button"
              onClick={(e) => handleDelete(e, index)}
              className="btn-borderless-red px-2 d-flex align-items-center mx-1"
            >
              <span className="text-sans-b-red">Borrar</span><i className="material-symbols-rounded">delete</i>
            </button>
          </div>
        </div>
      ))}
    </>
  );
};
