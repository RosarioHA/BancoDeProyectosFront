import { useState } from "react";
import { useApiTypeProject } from "../../hooks/useTypeProject";

export const ListDocument = () => {
  const { dataType } = useApiTypeProject();

  // Agrupar tipos por programa
  const groupedTypes = dataType.reduce((acc, item) => {
    if (!acc[item.program]) {
      acc[item.program] = [];
    }
    acc[item.program].push(item);
    return acc;
  }, {});

  // Estado para los checkboxes seleccionados
  const [selectedTypes, setSelectedTypes] = useState({});

  // Verificar si todos los checkboxes de un programa están seleccionados
  const areAllSelected = (program) => {
    return groupedTypes[program]?.every((item) => selectedTypes[item.id]);
  };

  // Manejar alternar selección de todos los checkboxes
  const toggleSelectAll = (program) => {
    const allSelected = areAllSelected(program);

    const updatedSelection = groupedTypes[program]?.reduce((acc, item) => {
      acc[item.id] = !allSelected; // Alternar entre seleccionar y deseleccionar
      return acc;
    }, {});

    setSelectedTypes((prev) => ({
      ...prev,
      ...updatedSelection,
    }));
  };

  const handleCheckboxChange = (id) => {
    setSelectedTypes((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  return (
    <>
      <div>Asocia el documento a un tipo de proyecto (Opcional)</div>
      <div className="container text-center my-5">
        <div className="row">
          {/* Programa Mejoramiento Urbano (PMU) */}
          <div className="col me-3">
            <div className="d-flex justify-content-between">
              <h5>PMU</h5>
              <button
                className="blue-ghost-btn"
                onClick={() => toggleSelectAll(1)}
              >
                <u>{areAllSelected(1) ? "Deseleccionar Todos" : "Seleccionar Todos"}</u>
              </button>
            </div>
            {groupedTypes[1]?.map((type) => (
              <div className="form-check d-flex my-2" key={type.id}>
                <input
                  className="form-check-input"
                  type="checkbox"
                  checked={!!selectedTypes[type.id]}
                  onChange={() => handleCheckboxChange(type.id)}
                  id={`type-${type.id}`}
                />
                <label className="form-check-label" htmlFor={`type-${type.id}`}>
                  {type.name}
                </label>
              </div>
            ))}
          </div>

          {/* Programa Mejoramiento de Barrios (PMB) */}
          <div className="col ms-4">
            <div className="d-flex justify-content-between">
              <h5>PMB</h5>
              <button
                className="blue-ghost-btn"
                onClick={() => toggleSelectAll(2)}
              >
                <u>{areAllSelected(2) ? "Deseleccionar Todos" : "Seleccionar Todos"}</u>
              </button>
            </div>
            {groupedTypes[2]?.map((type) => (
              <div className="form-check d-flex my-2" key={type.id}>
                <input
                  className="form-check-input"
                  type="checkbox"
                  checked={!!selectedTypes[type.id]}
                  onChange={() => handleCheckboxChange(type.id)}
                  id={`type-${type.id}`}
                />
                <label className="form-check-label" htmlFor={`type-${type.id}`}>
                  {type.name}
                </label>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};
