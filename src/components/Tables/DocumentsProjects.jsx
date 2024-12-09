import { useState } from "react";
import UploadBtn from "../Commons/UploadBtn";

export const DocumentsProjects = ({ index, description, fileType }) =>
{
  const [ fileUploaded, setFileUploaded ] = useState(false);
  const [ fileName, setFileName ] = useState('');

  const handleFileChange = (event) =>
  {
    const file = event.target.files[ 0 ];
    if (file)
    {
      setFileUploaded(true);
      setFileName(file.name);
    }
  };
  const handleDelete = () =>
  {
    setFileUploaded(false);
    setFileName('');
  };

  return (
    <>
      <div className="col-1 p-3">{index}</div>
      <div className="col p-3">{description}</div>
      <div className="col p-3">{fileUploaded ? fileName : fileType}</div>
      <div className="col p-3 d-flex">
        <UploadBtn onFileChange={handleFileChange} fileUploaded={fileUploaded} />
        {fileUploaded && <button onClick={handleDelete} className=" btn-borderless-red px-2 d-flex align-items-center mx-1"><span className="text-sans-b-red ">Borrar</span><i className="material-symbols-rounded ">delete</i></button>}
      </div>
    </>
  );

}
