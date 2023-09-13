import { useState, useRef, useEffect } from 'react';

const Dropdown = ({
  items = [],
  selectedItems = [],
  onItemChange,
  singleItemName = 'ítems',
  isComuna = false,
}) =>
{
  const [ dropdownDisplay, setDropdownDisplay ] = useState(false);
  const dropdownRef = useRef(null);
  const buttonRef = useRef(null);

  useEffect(() =>
  {
    function handleClickOutside(event)
    {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target) && !buttonRef.current.contains(event.target))
      {
        setDropdownDisplay(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () =>
    {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const getDropdownDisplayMessage = () =>
  {
    if (!Array.isArray(selectedItems) || selectedItems.length === 0)
    {
      return `Elige uno o más ${singleItemName}`;
    } else if (selectedItems.length === 1)
    {
      const singleItem = items.find(item => item.id.toString() === selectedItems[ 0 ]);
      return singleItem ? singleItem.name || singleItem.comuna || singleItem.region || singleItem.number : `${selectedItems.length} seleccionados`;
    } else
    {
      return `${selectedItems.length} seleccionados`;
    }
  };

  return (
    <>
      <button  tabIndex="0" ref={buttonRef} className='select-dropdown mt-3 btn btn-md border border-2' onClick={() => setDropdownDisplay((prevState) => !prevState)}>
        <span className="dropdown-content">
          {getDropdownDisplayMessage()}
          <i className="material-symbols-outlined pr-0">expand_more</i>
        </span>
      </button>

      {dropdownDisplay && <div ref={dropdownRef} className='panel'>
        {isComuna ? items.map(region => (
          <div key={region.id} >
            <span className='fw-semibold list-group-item'>{region.region}</span>
            {region.comunas.map(comuna => (
              <li className="list-group-item" key={comuna.id}>
                <input className="form-check-input" id={`comuna-${comuna.id}`} type='checkbox' value={comuna.id}
                  onChange={(e) => onItemChange(e, comuna)}
                  checked={selectedItems.includes(comuna.id.toString())} />
                <label
                  className="form-check-label px-2" htmlFor={`comuna-${comuna.id}`}>{comuna.comuna}</label>
              </li>
            ))}
          </div>
        )) : items.map(item => (
          <li className="list-group-item " key={item.id}>
            <input className="form-check-input" id={`item-${item.id}`} type='checkbox' value={item.id}
              onChange={(e) => onItemChange(e, item)}
              checked={selectedItems.includes(item.id.toString())} />
            <label
              className="form-check-label px-2" htmlFor={`item-${item.id}`}>{item.name || item.comuna || item.region || item.number}</label>
          </li>
        ))}
      </div>}
    </>

  );
};

export default Dropdown;