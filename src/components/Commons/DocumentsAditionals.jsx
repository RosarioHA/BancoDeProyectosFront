import { useState } from 'react';
import UploadFile from "../Modals/UploadFile";
import { AdditionalDocs } from "../Tables/AdditionalDocs";


const DocumentsAditionals = () =>
{
  const [ editingIndex, setEditingIndex ] = useState(null);
  const [ isEditMode, setIsEditMode ] = useState(false);
  const [ files, setFiles ] = useState([]);


  const addFile = (newFile, title) =>
  {
    setFiles([ ...files, { file: newFile, title: title } ]);
  };

  const handleEdit = (index) =>
  {
    setEditingIndex(index);
    setIsEditMode(true);
    // Aquí podrías abrir el modal usando React (por ejemplo, cambiando un state que controle si el modal está abierto o no).
  }

  const handleUpdateFile = (index, updatedFile, updatedTitle) =>
  {
    const updatedFiles = [ ...files ];
    updatedFiles[ index ] = { file: updatedFile, title: updatedTitle };
    setFiles(updatedFiles);
  }

  const handleDelete = (index) =>
  {
    const newFiles = [ ...files ];
    newFiles.splice(index, 1);
    setFiles(newFiles);
  }


  return (
    <>
      <span className='text-sans-h3 mt-4'>Documentos Adicionales (Opcionales)</span>
      <p>(Número de archivos máximo, peso máximo 20 MB, formato libre)</p>
      <UploadFile
        onFileAdded={addFile}
        isEditMode={isEditMode}
        editingFile={editingIndex !== null ? files[ editingIndex ] : null}
        onFileUpdated={handleUpdateFile}
      />
      {files.length > 0 && <AdditionalDocs
        key={Date.now()} 
        files={files}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onUpdateFile={handleUpdateFile} />}
    </>
  )
}

export default DocumentsAditionals