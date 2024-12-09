import { useState, useRef, useEffect } from 'react';

export default function UploadImg({ projectId , getPortada , updatePortada })
{

  const [ imageURL, setImageURL ] = useState(null);
  const [ showModal, setShowModal ] = useState(false);
  const [ uploadProgress, setUploadProgress ] = useState(0);
  const modalRef = useRef(null);
  const baseApiUrl = import.meta.env.VITE_REACT_APP_API_URL;

  const handleImageChange = async (e) =>
  {
    const file = e.target.files[ 0 ];
    if (file)
    {
      const result = await updatePortada(projectId, file, (progress) =>
      {
        setUploadProgress(progress);
      });
      if (result.success)
      {
        setImageURL(result.data.portada);
        setUploadProgress(0);
      } else
      {
        console.error(result.error);
      }
    }
  };

  const handleDelete = async () =>
  {
    const response = await updatePortada(projectId, null);
    if (response.success)
    {
      setImageURL(null);
    } else
    {
      console.error("Error al eliminar la imagen:", response.error);
    }
  };

  const getFullImageUrl = (relativePath) =>
  {
    if (relativePath.startsWith('http'))
    {
      return relativePath;
    }
    return `${baseApiUrl}/${relativePath}`;
  };


  const onDragOver = (e) =>
  {
    e.preventDefault();
  };




  const openModal = () => 
  {
    setShowModal(true);
  };

  const closeModal = () =>
  {
    setShowModal(false);
  };

  const handleOutsideClick = (e) =>
  {
    if (e.target === modalRef.current)
    {
      closeModal();
    }
  };

  useEffect(() =>
  {
    const fetchProjectImage = async () =>
    {
      const projectData = await getPortada(projectId);
      if (projectData && projectData.portada)
      {
        setImageURL(projectData.portada);
      }
    };

    fetchProjectImage();
  }, [ projectId, getPortada ]);

  return (
    <div
      className="img-section my-3"
      onDrop={handleImageChange}
      onDragOver={onDragOver}
    >
      {!imageURL ? (
        <label htmlFor="formFile">
          <div className="d-flex  flex-column align-items-center">
            <i className="material-symbols-rounded">add_a_photo</i>
            <p className="form-label">Agregar foto</p>
          </div>
          <input
            className="text-sans-p"
            style={{ display: 'none' }}
            type="file"
            id="formFile"
            onChange={handleImageChange}
          />
          {uploadProgress > 0 && (
            <div className="progress" role="progressbar" aria-valuenow={uploadProgress} aria-valuemin="0" aria-valuemax="100">
              <div className="progress-bar progress-bar-striped progress-bar-animated" style={{ width: `${uploadProgress}%` }}></div>
            </div>
          )}
        </label>
      ) : (
        <div className="image-container">
          <img className="upload-image" src={getFullImageUrl(imageURL)} alt="Portada" />
          <div className="overlay">
            <button className="btn-borderless-white  d-flex align-content-center mx-3 px-3" onClick={openModal}>
              <i className="material-symbols-outlined mx-1">visibility</i>Ver
            </button>
            <button className="btn-borderless-white d-flex align-content-center mx-3 px-3" onClick={handleDelete}>
              <i className="material-symbols-outlined mx-1">delete</i>Borrar
            </button>
          </div>
        </div>
      )}

      {showModal && (
        <div ref={modalRef} className="modal-uploadImg" onClick={handleOutsideClick}>
          <div className="modalImg-content">
            <button type="button" onClick={closeModal} className="btn-close btn-close-img" data-bs-dismiss="modal" aria-label="Close"></button>
            <img src={getFullImageUrl(imageURL)} alt="Modal view" className="img-modal" />
          </div>
        </div>
      )}
    </div>
  );
}

