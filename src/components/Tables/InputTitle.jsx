import { useState, useRef, useEffect } from 'react';

export const EditableTitle = ({ initialTitle, onSave }) =>
{
  const [ isEditing, setIsEditing ] = useState(false);
  const [ title, setTitle ] = useState(initialTitle);
  const [ inputValue, setInputValue ] = useState('');
  const [ errorMessage, setErrorMessage ] = useState(null);
  const inputRef = useRef(null);

  console.log("initialTitle:", initialTitle);
  console.log('title', title);

  const handleEditClick = () =>
  {
    setInputValue(title);
    setIsEditing(true);
    setErrorMessage(null);
  };

  const handleFocus = () =>
  {
    setInputValue(title);
  };

  const handleBlur = () => {
    setIsEditing(false);
  };


  const handleSaveClick = () =>
  {
    if (!inputValue.trim())
    {
      setErrorMessage("El título no puede estar vacío");
      return;
    }
    setTitle(inputValue);
    setIsEditing(false);
    setErrorMessage(null);
    // Llama a la función onSave para guardar el título en el componente padre
    onSave(inputValue);
  };

  const handleTitleChange = (e) =>
  {
    setInputValue(e.target.value);
  };


  useEffect(() =>
  {
    setTitle(initialTitle);
  }, [ initialTitle ]);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isEditing]);

  return (
    <div className="mb-4 me-3">
      <div className="title-edit-container d-flex flex-row justify-content-between pb-0 ">
        <div className="title-input-container-edit">
          {isEditing ? (
            <input
              type="text"
              value={inputValue}
              onChange={handleTitleChange}
              onBlur={handleBlur}
              className='ghost-input-edit  border-0 mt-4 text-sans-h1'
              placeholder='Titulo Proyecto'
              ref={inputRef}
            />
          ) : (
            <div>
              <label>Título del proyecto</label>
              <div className="text-sans-h1">{title}</div>
            </div>
          )}
        </div>
        <div className="align-items-center">
          <button className="btn-secundario-s text-sans-p-blue d-flex pb-0 me-5 mt-4"
          onClick={isEditing ? handleSaveClick : handleEditClick}>
            <p className="text-decoration-underline">{isEditing ? 'Guardar' : 'Editar'}</p>
            <i className="material-symbols-rounded ms-2">{isEditing ? 'save' : 'edit'}</i>
          </button>
        </div>
      </div>
      {isEditing ? (
        <>
          <div>
            {errorMessage && <p className="text-sans-h5-red mb-3 mt-0">{errorMessage}</p>}
          </div>
          <div className="d-flex my-0">
            <p className="text-sans-h5-grey mb-3 mt-0"> {title.length + inputValue.length}/ 70 caracteres.</p>
          </div>
        </>
      ) : null}
    </div>
  );
};