export const ModalBase = ({ btnName, btnIcon, title, children, modalID , classStyle, titleStyle}) =>
{
  // btn-secundario-s text-sans-p-blue ---text-sans-h4
  return (
    <>
      <button 
      type="button" 
      className={`${classStyle} d-flex align-items-center`}
      data-bs-toggle="modal"
      data-bs-target={`#${modalID}`}
      >
        <u>{btnName}</u>
        <i className="material-symbols-rounded ms-2">{btnIcon}</i> 
      </button>

      <div className="modal fade " id={modalID} tabIndex="-1" aria-labelledby="ModalLabel" aria-hidden="true">
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h1 className={`modal-title ${titleStyle}`} id="ModalLabel">{title}</h1>
              <button type="button" className="btn-close mx-1" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div className="modal-body">
              {children}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ModalBase; 
