import { useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

const YearPicker = ({ onYearChange }) => {
  const [startDate, setStartDate] = useState(new Date());

  const handleDateChange = (date) => {
    setStartDate(date);
    if (onYearChange) {
      onYearChange(date.getFullYear()); 
    }
  };
  return (
    <>
    <label className="text-sans-p px-3">Elige el año de construcción del proyecto (Obligatorio)</label>
    <DatePicker
      selected={startDate}
      onChange={handleDateChange}
      showYearPicker
      dateFormat="yyyy"
      yearItemNumber={9}
      className="custom-select px-3 w-100"
      />
    </>
  );
};


export default YearPicker;