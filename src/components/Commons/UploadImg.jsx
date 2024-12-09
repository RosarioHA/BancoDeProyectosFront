import { useState, useRef } from 'react';

export default function UploadImg({ img, onSave, tag, title })
{
  const [ showModal, setShowModal ] = useState(false);
  const [ isEditMode, setIsEditMode ] = useState(false);
  const [ selectedFile, setSelectedFile ] = useState(null);
  const [ preview, setPreview ] = useState(null);
  const [ isHovered, setIsHovered ] = useState(false);
  const modalRef = useRef(null);

  const openModal = (editMode = false) =>
  {
    setIsEditMode(editMode);
    setShowModal(true);
  };

  const closeModal = () =>
  {
    setShowModal(false);
    setSelectedFile(null);
    setPreview(null);
    setIsEditMode(false);
  };

  const handleOutsideClick = (e) =>
  {
    if (e.target === modalRef.current)
    {
      closeModal();
    }
  };

  const handleFileChange = (e) =>
  {
    const file = e.target.files[ 0 ];
    setSelectedFile(file);

    if (file)
    {
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleUpload = async () =>
  {
    if (!selectedFile) return;

    const formData = new FormData();
    formData.append(tag, selectedFile);

    try
    {
      // Envía solo el nombre del archivo al backend
      await onSave(formData);

      // Guarda solo el nombre de la imagen en el estado (no la URL)
      const fileName = selectedFile.name;
      setSelectedFile(null);
      setPreview(null);
      closeModal();
      onSave(fileName);  // Envía solo el nombre si es necesario

    } catch (error)
    {
      console.error('Error uploading image:', error);
    }
  };

  const handleDelete = async () =>
  {
    const formData = new FormData();
    formData.append(tag, '');
    await onSave(formData);
  };
  return (
    <div className="img-section my-3">
      {img ? (
        <div
          className="image-container"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          <img className="upload-image" src={img} alt={tag} />

          {/* Show overlay when hovering */}
          {isHovered && (
            <div className="overlay">
              <button
                className="btn-borderless-white d-flex align-content-center mx-3 px-3"
                onClick={() => openModal(false)}
              >
                <i className="material-symbols-outlined mx-1">visibility</i>Ver
              </button>
              <button
                className="btn-borderless-white d-flex align-content-center mx-3 px-3"
                onClick={() => openModal(true)}
              >
                <i className="material-symbols-outlined mx-1">edit</i>Editar
              </button>
              <button
                className="btn-borderless-white d-flex align-content-center mx-3 px-3"
                onClick={handleDelete}
              >
                <i className="material-symbols-outlined mx-1">delete</i>Eliminar
              </button>
            </div>
          )}
        </div>
      ) : (
        <div>

          <button
            className="btn-borderless-white d-flex  align-content-center mx-3 px-3"
            onClick={() => openModal(true)}
          >
            <i className="material-symbols-outlined mx-1 text-sans-h4">add</i><span className="text-sans-h4">Agregar Imagen</span>
          </button>
        </div>
      )}

      {showModal && (
        <div ref={modalRef} className="modal-uploadImg" onClick={handleOutsideClick}>
          <div className="modalImg-content">
            <div className="text-sans-h3 text-start">{title}</div>
            <button type="button" onClick={closeModal} className="btn-close btn-close-img" aria-label="Close"></button>
            {preview ? (
              <img src={preview} alt="Preview" className="img-modal" />
            ) : (
              img && <img src={img} alt="Modal view" className="img-modal" />
            )}

            {isEditMode && (
              <div className="modal-actions my-auto">
                <input type="file" onChange={handleFileChange} accept="image/*" className="file-input my-3 mx-5" />
                <button className="btn-principal-s my-2 mx-3 d-flex align-content-center" type="submit" onClick={handleUpload}>
                  <i className="material-symbols-outlined mx-2">save</i><u>Guardar Imagen</u>
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
