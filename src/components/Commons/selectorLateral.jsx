import { useState, useEffect } from "react";
import DropdownComponent from "./Dropdown";

const SelectorLateral = ({ data, onSelect, titlePropertyName }) => {
  const [ selectedOption, setSelectedOption ] = useState(null); // Almacena la opcion seleccionada.

  // Evento que selecciona primera opcion del listado al cambiar opciones o montar componente.
  useEffect(() => {
    if (!selectedOption && data.length > 0){
      setSelectedOption(data[0]);
      onSelect(data[0]); // Llama a la función onSelect con la primera opción
    }
  }, [ data, selectedOption, onSelect ]);

  // Evento que actualiza opcion seleccionada al primer elemento de 'data' cuando 'data' cambia.
  useEffect(() => {
    if (data.length > 0){
      setSelectedOption(data[0]);
    }
  }, [ data ]);

  return (
    <div>
      <div className="d-flex flex-column d-none d-lg-block">
        {data.map((item) => (
          <button
          key={item.id}
          className={`btn-selector-lateral d-flex justify-content-between ${selectedOption === item ? "btn-selector-lateral-active" : ""}`}
          onClick={() => {
            setSelectedOption(item);
            onSelect(item);
          }}
        >
          <p className="text-decoration-underline mb-0 py-1">{item[titlePropertyName]}</p>
          <i className="material-symbols-rounded ms-2">keyboard_arrow_right</i>
        </button>
        ))}
      </div>

      <div className="d-flex justify-content-center my-4 d-lg-none">
        <DropdownComponent
          data={data}
          description="una buena practica"
          onOptionSelect={(item) => {
            setSelectedOption(item);
            onSelect(item);
          }}
          titlePropertyName={titlePropertyName}
          selectedOption={selectedOption}
        />
      </div>
    </div>
  );
};

export default SelectorLateral;