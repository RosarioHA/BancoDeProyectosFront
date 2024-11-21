import { useState, useRef, useEffect } from 'react';

export const EditableTitle = ({ initialTitle, onSave, maxChars, minChars = 5 }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState(initialTitle);
  const [inputValue, setInputValue] = useState('');
  const [errorMessage, setErrorMessage] = useState(null);
  const [charCount, setCharCount] = useState(0);
  const inputRef = useRef(null);
  const containerRef = useRef(null);

  const handleEditClick = () => {
    setInputValue(title);
    setCharCount(title.length);
    setIsEditing(true);
    setErrorMessage(null);
  };

  const handleSaveClick = () => {
    if (!inputValue.trim()) {
      setErrorMessage("El título no puede estar vacío");
      return;
    }
    if (inputValue.length < minChars) {
      setErrorMessage(`El título debe tener al menos ${minChars} caracteres.`);
      return;
    }
    setTitle(inputValue);
    setIsEditing(false);
    setErrorMessage(null);
    onSave(inputValue); // Llama a la función de guardado pasando el nuevo título
  };

  const handleTitleChange = (e) => {
    const newValue = e.target.value;
    if (newValue.length <= maxChars) {
      setInputValue(newValue);
      setCharCount(newValue.length);
      setErrorMessage(null); // Limpia el mensaje de error si la entrada es válida
    } else {
      setErrorMessage(`El título no puede tener más de ${maxChars} caracteres.`);
    }
  };

  useEffect(() => {
    setTitle(initialTitle);
  }, [initialTitle]);

  return (
    <div className="mb-4 me-5" ref={containerRef}>
      <div className="my-2">
        <div className="my-4">
          {isEditing ? (
            <div className="d-flex flex-column">
              <label>Título del proyecto</label>
              <textarea
                type="text"
                value={inputValue}
                onChange={handleTitleChange}
                className="border-0 mt-4 text-sans-h1"
                placeholder="Título Proyecto"
                ref={inputRef}
              />
              {errorMessage && <p className="text-sans-h5-red mb-3 mt-1">{errorMessage}</p>}
              <p className="text-sans-h5-grey mb-3 mt-0">{charCount}/{maxChars} caracteres.</p>
            </div>
          ) : (
            <div>
              <label>Título del proyecto</label>
              <div className="text-sans-h1">{title}</div>
            </div>
          )}
        </div>
        <div className="align-items-end my-4">
          <button
            className="btn-secundario-s text-sans-p-blue d-flex pb-0 me-5 mt-4"
            onClick={isEditing ? handleSaveClick : handleEditClick}
          >
            <p className="text-decoration-underline">{isEditing ? 'Guardar' : 'Editar'}</p>
            <i className="material-symbols-rounded ms-2">
              {isEditing ? 'save' : 'edit'}
            </i>
          </button>
        </div>
      </div>
    </div>
  );
};
