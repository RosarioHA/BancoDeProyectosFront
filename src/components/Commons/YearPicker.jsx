import { useState, useEffect } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

export const YearPicker = ({ onYearChange, selectedYear }) => {
  const [startDate, setStartDate] = useState(null);
  const [noYearAssigned, setNoYearAssigned] = useState(selectedYear === 's/n');

  useEffect(() => {
    if (selectedYear && selectedYear !== 's/n') {
      setStartDate(new Date(selectedYear, 0)); 
    } else {
      setStartDate(null);
      setNoYearAssigned(true);
    }
  }, [selectedYear]);

  const handleDateChange = (date) => {
    setStartDate(date);
    if (onYearChange) {
      onYearChange(date.getFullYear());
    }
    setNoYearAssigned(false); 
  };

  const handleCheckboxChange = () => {
    setNoYearAssigned((prev) => !prev);
    if (!noYearAssigned && onYearChange) {
      onYearChange('s/n'); 
      setStartDate(null); 
    }
  };

  return (
    <>
      <label className="text-sans-p px-3">Elige el año de construcción del proyecto </label>
      <DatePicker
        selected={startDate}
        onChange={handleDateChange}
        showYearPicker
        dateFormat="yyyy"
        yearItemNumber={9}
        className="custom-select px-3 w-100"
        placeholderText="Seleccione un año"
      />
      <div className="px-3 mt-2">
        <input
          type="checkbox"
          checked={noYearAssigned}
          onChange={handleCheckboxChange}
          id="noYearCheckbox"
        />
        <label htmlFor="noYearCheckbox" className="text-sans-p"><span className="mx-2">Sin año asignado</span></label>
      </div>
    </>
  );
};
