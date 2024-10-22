import { useState, useRef, useEffect } from 'react';

export const DropdownSimple = ({
  data,
  onOptionSelect,
  description = 'una opción',
  selectedOption,
  readOnly = false,
}) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownButtonRef = useRef(null);
  const dropdownMenuRef = useRef(null);

  const selectDropdown = () => {
    if (!readOnly) {
      setDropdownOpen((prevState) => !prevState);
    }
  };

  useEffect(() => {
    function handleClickOutside(event) {
      if (
        dropdownMenuRef.current &&
        !dropdownMenuRef.current.contains(event.target) &&
        !dropdownButtonRef.current.contains(event.target)
      ) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const getDropdownMessage = () => {
    if (!selectedOption) {
      return `Elige ${description}`;
    }
    return selectedOption; // Mostrar la opción seleccionada
  };

  return (
    <>
      <div
        ref={dropdownButtonRef}
        onClick={selectDropdown}
        className={`select-dropdown btn-dropdown mt-3 border border-2 col-12 ${readOnly ? 'read-only' : ''}`}
        role="button"
        tabIndex="0"
        onKeyDown={(e) => {
          if (e.key === 'Enter') {
            selectDropdown();
          }
        }}
        aria-haspopup="true"
        aria-expanded={dropdownOpen}
        disabled={readOnly}
      >
        <span className="dropdown-content text-sans-sub-grey">
          {getDropdownMessage()}
          {dropdownOpen ? (
            <i className="material-symbols-outlined pr-0">expand_less</i>
          ) : (
            <i className="material-symbols-outlined pr-0">expand_more</i>
          )}
        </span>
      </div>
      {dropdownOpen && !readOnly && (
        <div ref={dropdownMenuRef} className=" panel-dropdown ">
          <ul>
            {data.map((item) => (
              <li key={item}>
                <div
                  className={`dropdown-option ${item === selectedOption ? 'active-option' : ''}`}
                  onClick={() => {
                    onOptionSelect(item);
                    setDropdownOpen(false);
                  }}
                  role="option" // Esto ayuda a la accesibilidad
                  tabIndex="0" // Hace que el div sea "navegable"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      onOptionSelect(item);
                      setDropdownOpen(false);
                    }
                  }}
                >
                  <spam className="mx-2">{item}</spam>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </>
  );
};