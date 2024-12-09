import { useState } from 'react';
import UploadFile from "../Modals/UploadFile";
import { AdditionalDocs } from "../Tables/AdditionalDocs";

const DocumentsAditionals = ({ documents, addDocument, deleteDocument }) =>
{
  const [ editingIndex, setEditingIndex ] = useState(null);
  const [ isEditMode, setIsEditMode ] = useState(false);
  const [ files, setFiles ] = useState(documents || []);

  const addFile = (newFile, title) =>
  {
    addDocument(title, newFile); // Pasa title y newFile en el orden correcto
    setFiles([ ...files, { file: newFile, name: title, file_format: newFile.type } ]);
  };

  const handleEdit = (index) =>
  {
    setEditingIndex(index);
    setIsEditMode(true);
  };

  const handleUpdateFile = (index, updatedFile, updatedTitle) =>
  {
    const updatedFiles = [ ...files ];
    updatedFiles[ index ] = { file: updatedFile, name: updatedTitle, file_format: updatedFile.type };
    setFiles(updatedFiles);
  };

  const handleDelete = (index) =>
  {
    const documentId = files[ index ].id;
    deleteDocument(documentId);
    setFiles(files.filter((file, i) => i !== index));
  };

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
      {files.length >= 0 && (
        <AdditionalDocs
          files={files}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      )}
    </>
  );
};

export default DocumentsAditionals;
