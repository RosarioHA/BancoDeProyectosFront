import { useState, useRef, useEffect, forwardRef } from "react";


const CustomInput = forwardRef(({
  loading,
  descripcion,
  saved,
  label,
  placeholder,
  id,
  maxLength,
  error,
  value = "",
  onChange,
  onBlur,
  readOnly,
  name,
}, ref) =>
{
  const [ inputValue, setInputValue ] = useState(value || ''); 
  const [ totalCharacters, setTotalCharacters ] = useState((value || '').length);
  const internalRef = useRef(null); 
  const lastSavedValueRef = useRef(value);


  useEffect(() => {
    if (value !== null && value !== undefined) {
        setInputValue(value);
        setTotalCharacters(value.length);
    }
}, [value]);


  const handleChange = (event) =>
  {
    event.preventDefault();
    const newText = event.target.value;
    if (maxLength !== undefined && newText.length > maxLength)
    {
      setInputValue(newText.slice(0, maxLength));
    } else
    {
      setInputValue(newText);
    }
    onChange(event); // Pasa el evento
    setTotalCharacters(newText.length); // Actualiza el contador total de caracteres
  };

  const handleBlur = (e) =>
  {
    e.preventDefault();
    if (inputValue !== lastSavedValueRef.current && onBlur)
    {
      onBlur(e);
      lastSavedValueRef.current = inputValue; // Actualiza el valor de referencia al momento del último guardado
    }
  };


  useEffect(() =>
  {
    setInputValue(value); // Actualiza el inputValue cuando el prop 'value' cambia
  }, [ value ]);

  const counterClass = maxLength !== undefined && totalCharacters === maxLength
    ? "text-sans-h5-red"
    : "text-sans-h5";

  const renderSpinnerOrCheck = () =>
  {
    if (loading)
    {
      return <div className="spinner-border text-primary my-4 mx-3" role="status"></div>;
    }
    if (saved)
    {
      return <i className="material-symbols-outlined my-4 mx-3 text-success">check</i>;
    }
    return null;
  };

  return (
    <>
      {readOnly ? (
        <div className="d-flex flex-column input-container col">
          <label className="text-sans-sub-grey input-label ms-3 ms-sm-0">{label}</label>
          <div className={`textarea-text input-textarea p-3 ${error ? 'input-error' : ''}`}>
            <p className="text-sans-p-grey mb-0">{value}</p>
          </div>
        </div>
      ) : (
        <>
          <div className="d-flex input-container col">
            <label className="text-sans-sub-grey input-label ms-3 ms-sm-0 ">{label}</label>
            <input
              ref={ref || internalRef} // Utiliza ref externa si disponible, sino usa interna
              className={`input-textarea input-s p-3  col-12 ${error ? 'input-error' : ''}`}
              placeholder={placeholder}
              id={id}
              value={inputValue}
              maxLength={maxLength}
              onChange={handleChange}
              onBlur={handleBlur}
              style={{ overflow: 'hidden'}}
              name={name}
            />
            <div className="d-flex align-self-end align-items-center">
              {renderSpinnerOrCheck()}
            </div>
          </div>
          <div className="d-flex justify-content-between ">
            {error && (
              <p className="text-sans-h5-red mt-1 mb-0">{error}</p>
            )}
            <div className="mb-0 mt-1 ms-auto text-sans-h5 text-end">
              {descripcion}
            </div>
            {maxLength !== null && maxLength !== undefined && (
              <div className="mb-0 mt-1 ms-auto">
                <span className={counterClass}>
                  {totalCharacters}/{maxLength} caracteres.
                </span>
              </div>
            )}
          </div>
        </>
      )}
    </>
  );
});

CustomInput.displayName = 'CustomInput';

export default CustomInput
