import { useState, useEffect } from "react";
import { useApiTypeProject } from "../../hooks/useTypeProject";

export const ListDocument = ({ selectedTypes = [], setSelectedTypes, documentId }) => {
  const { dataType } = useApiTypeProject();
  const [programTypes, setProgramTypes] = useState({ PMU: [], PMB: [] });
  const [selected, setSelected] = useState(Array.isArray(selectedTypes) ? selectedTypes : []);
  
  useEffect(() => {
    if (dataType) {
      const pmuTypes = dataType.filter(type => type.program === 1);
      const pmbTypes = dataType.filter(type => type.program === 2);

      setProgramTypes({
        PMU: pmuTypes,
        PMB: pmbTypes,
      });

      const autoSelected = dataType
        .filter(type => type.documents?.some(doc => doc.id === documentId))
        .map(type => type.id) || [];

      setSelected(autoSelected);
    }
  }, [dataType, documentId]);

  const handleSelectAll = (program) => {
    const allIds = programTypes[program].map(type => type.id);

    setSelected(prevSelected => {
      const updatedSelected = prevSelected.some(id => allIds.includes(id))
        ? prevSelected.filter(id => !allIds.includes(id))
        : [...prevSelected, ...allIds];

      return updatedSelected.sort((a, b) => a - b);
    });
  };

  const handleCheckboxChange = (id) => {
    setSelected(prevSelected => {
      const updatedSelected = prevSelected.includes(id)
        ? prevSelected.filter(typeId => typeId !== id)
        : [...prevSelected, id];

      return updatedSelected.sort((a, b) => a - b);
    });
  };

  const isAllSelected = (program) => {
    return programTypes[program].every(type => selected.includes(type.id));
  };

  useEffect(() => {
    setSelectedTypes([...selected]);
  }, [selected, setSelectedTypes]);

  return (
    <>
      <div>Asocia el documento a un tipo de proyecto (Opcional)</div>
      <div className="container text-center my-5">
        <div className="row">
          <div className="col me-3">
            <div className="d-flex justify-content-between">
              <h5>PMU</h5>
              <button
                className="blue-ghost-btn"
                onClick={() => handleSelectAll("PMU")}
              >
                <u>{isAllSelected("PMU") ? "Deseleccionar Todos" : "Seleccionar Todos"}</u>
              </button>
            </div>
            {programTypes.PMU.length > 0 ? (
              programTypes.PMU.map(type => (
                <div className="form-check d-flex my-2" key={type.id}>
                  <input
                    className="form-check-input"
                    type="checkbox"
                    checked={selected.includes(type.id)}
                    onChange={() => handleCheckboxChange(type.id)}
                    id={`type-${type.id}`}
                  />
                  <label className="form-check-label" htmlFor={`type-${type.id}`}>
                    {type.name}
                  </label>
                </div>
              ))
            ) : (
              <p>No hay tipos disponibles para PMU.</p>
            )}
          </div>
          <div className="col">
            <div className="d-flex justify-content-between">
              <h5>PMB</h5>
              <button
                className="blue-ghost-btn"
                onClick={() => handleSelectAll("PMB")}
              >
                <u>{isAllSelected("PMB") ? "Deseleccionar Todos" : "Seleccionar Todos"}</u>
              </button>
            </div>
            {programTypes.PMB.length > 0 ? (
              programTypes.PMB.map(type => (
                <div className="form-check d-flex my-2" key={type.id}>
                  <input
                    className="form-check-input"
                    type="checkbox"
                    checked={selected.includes(type.id)}
                    onChange={() => handleCheckboxChange(type.id)}
                    id={`type-${type.id}`}
                  />
                  <label className="form-check-label" htmlFor={`type-${type.id}`}>
                    {type.name}
                  </label>
                </div>
              ))
            ) : (
              <p>No hay tipos disponibles para PMB.</p>
            )}
          </div>
        </div>
      </div>
    </>
  );
};
