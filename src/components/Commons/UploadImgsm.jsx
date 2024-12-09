import { useState, useRef, useEffect } from 'react';

function UploadImgsm({ projectId, useGalleryHook })
{
  const { gallery, setGallery, refreshGallery, addImageToGallery, deleteImageInGallery, loading, uploadPercentage } = useGalleryHook(projectId);
  const [ showModal, setShowModal ] = useState(false);
  const [ currentImg, setCurrentImg ] = useState('');
  const modalRef = useRef(null);
  const baseApiUrl = import.meta.env.VITE_REACT_APP_API_URL;


  useEffect(() =>
  {
    setGallery(gallery);
  }, [ gallery, setGallery ]);

  const openModal = (imageUrl) =>
  {
    setCurrentImg(imageUrl);
    setShowModal(true);
  };

  const closeModal = () =>
  {
    setCurrentImg(null);
    setShowModal(false);
  };

  const handleOutsideClick = (e) =>
  {
    if (e.target === modalRef.current)
    {
      closeModal();
    }
  };

  const handleImageChange = async (files) =>
  {
    if (gallery.length + files.length > 10)
    {
      alert('Has alcanzado el límite de 10 imágenes.');
      return;
    }

    for (let file of files)
    {
      const formData = new FormData();
      formData.append('image', file);

      try
      {
        const result = await addImageToGallery(formData);
        console.log("Respuesta del servidor:", result);

        if (!result && !result.url)
        {
          await refreshGallery();
        }
      } catch (error)
      {
        alert('Error al cargar la imagen: ' + error.message);
      }
    }
  };

  const handleDelete = async (imageId) =>
  {
    console.log("Eliminando imagen con ID:", imageId);
    if (imageId)
    {
      try
      {
        const result = await deleteImageInGallery(imageId);
        if (result)
        {
          alert('Imagen eliminada con éxito.');
        } else
        {
          alert('Error al eliminar la imagen. Por favor, inténtalo de nuevo.');
        }
      } catch (error)
      {
        alert('Error al eliminar la imagen: ' + error.message);
      }
    }
  };



  return (
    <div className="my-5">
      <h3 className="text-sans-h3">Imágenes para la galería</h3>
      <p className="text-sans-h5">(Máximo 10 imágenes)</p>

      <div className="grid-container">
        {gallery.map((image, index) => (
          <div key={index} className="image-container-fixed my-2">
            <>
              <img
                className="upload-image-fixed"
                src={`${baseApiUrl}/${image.image}`}
                alt={image.image}
              />
              <div className="overlay-sm">
                <button
                  className="btn-borderless-white d-flex align-content-center mx-3 my-3 px-3"
                  onClick={() => openModal(`${baseApiUrl}/${image.image}`)}
                >
                  <i className="material-symbols-outlined mx-1">visibility</i>Ver
                </button>
                <button
                  className="btn-borderless-white d-flex align-content-center mx-3 mb-4 pb-3 px-3"
                  onClick={() => handleDelete(image.id)}
                >
                  <i className="material-symbols-outlined mx-1">delete</i>Borrar
                </button>
              </div>
            </>
          </div>
        ))}


        {gallery.length < 10 && (
          <div className="img-section-s" onDrop={(e) =>
          {
            e.preventDefault();
            handleImageChange(e.dataTransfer ? e.dataTransfer.files : e.target.files);
          }} onDragOver={(e) => e.preventDefault()}>
            <label htmlFor="formMultiFile">
              <div className="d-flex flex-column align-items-center">
                <i className="material-symbols-rounded">add_a_photo</i>
                <p className="text-sans-p">Agregar fotos</p>
              </div>
              <input
                style={{ display: 'none' }}
                type="file"
                id="formMultiFile"
                multiple
                onChange={(e) => handleImageChange(e.target.files)}
              />
            </label>
            {loading && (
              <div
                className="progress w-75 mx-1"
                role="progressbar"
                aria-label="carga"
              >
                <div className="progress-bar-striped progress-bar-animated bg-primary w-100" style={{ width: `${uploadPercentage}%` }}>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
      {showModal && (
        <div ref={modalRef} className="modal-uploadImg" onClick={handleOutsideClick}>
          <div className="modalImg-content">
            <button
              type="button"
              onClick={closeModal}
              className="btn-close btn-close-img"
              data-bs-dismiss="modal"
              aria-label="Close"
            ></button>
            <img src={currentImg} alt="Modal view" className="img-modal" />
          </div>
        </div>
      )}
    </div>
  );
}

export default UploadImgsm;
