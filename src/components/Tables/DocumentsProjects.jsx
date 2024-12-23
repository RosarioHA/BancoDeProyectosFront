import { useState, useEffect } from "react";
import UploadBtn from "../Commons/UploadBtn";

export const DocumentsProjects = ({ index, description, fileType, value, onUpload, maxSize}) => { // maxSize in MB (default 5MB)
  const [fileUploaded, setFileUploaded] = useState(false);
  const [fileName, setFileName] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  // Function to extract file name from URL
  const getFileNameFromUrl = (url) => {
    const parts = url.split('/');
    return decodeURIComponent(parts[parts.length - 1]); // Decodes special characters and extracts the file name
  };

  // Extract file name without extension
  const getFileNameWithoutExtension = (fileName) => {
    return fileName.split('.').slice(0, -1).join('.');
  };

  // If a file value is provided, set initial file name
  useEffect(() => {
    if (value) {
      setFileUploaded(true);
      const fileNameFromUrl = getFileNameFromUrl(value); // Extract the file name from URL
      setFileName(getFileNameWithoutExtension(fileNameFromUrl)); // Remove extension
    }
  }, [value]);

  const handleFileChange = (event) => {
    const file = event.target.files[0];

    // Validate file type and size
    if (file) {
      const fileExtension = file.name.split('.').pop().toLowerCase();
      const fileSizeInMB = file.size / (1024 * 1024); // Convert size to MB

      // Check if the file is a PDF
      if (fileExtension !== 'pdf') {
        setErrorMessage('El archivo debe ser un PDF.');
        setFileUploaded(false);
        return;
      }

      // Check if the file size exceeds the limit
      if (fileSizeInMB > maxSize) {
        setErrorMessage(`El archivo no puede exceder los ${maxSize} MB.`);
        setFileUploaded(false);
        return;
      }

      // If validation passes, update the state
      setErrorMessage('');
      setFileUploaded(true);
      setFileName(getFileNameWithoutExtension(file.name));
      onUpload(file); // Pass the selected file to the parent component for uploading
    }
  };

  const handleDelete = () => {
    setFileUploaded(false);
    setFileName('');
    setErrorMessage('');
    onUpload(null); // Send null to the parent component to delete the file
  };

  return (
    <>
      <div className="col-1 p-3">{index}</div>
      <div className="col p-3">{description}</div>
      <div className="col p-3">
        {errorMessage ? (
          <div className="text-danger">{errorMessage}</div> 
        ) : (
          <span>{fileUploaded ? fileName : fileType}</span>
        )}
      </div>
      <div className="col p-3 d-flex">
        <UploadBtn onFileChange={handleFileChange} fileUploaded={fileUploaded} />
        {fileUploaded && (
          <button onClick={handleDelete} className="btn-borderless-red px-2 d-flex align-items-center mx-1">
            <span className="text-sans-b-red">Borrar</span>
            <i className="material-symbols-rounded">delete</i>
          </button>
        )}
      </div>
    </>
  );
};
