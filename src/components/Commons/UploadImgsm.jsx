import { useState, useRef } from 'react';

function UploadImgsm({ imgs = [], add, delete: deleteImage }) {
  const [showModal, setShowModal] = useState(false);
  const [currentImg, setCurrentImg] = useState('');
  const [loading, setLoading] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const modalRef = useRef(null);

  const openModal = (imageUrl) => {
    setCurrentImg(imageUrl);
    setShowModal(true);
  };

  const closeModal = () => {
    setCurrentImg(null);
    setShowModal(false);
  };

  const handleOutsideClick = (e) => {
    if (e.target === modalRef.current) {
      closeModal();
    }
  };

  const handleImageChange = async (files) => {
    if (imgs.length + files.length > 10) {
      setAlertMessage('Has alcanzado el límite de 10 imágenes.'); 
      return;
    }

    setLoading(true);
    for (let file of files) {
      try {
        await add(file);
      } catch (error) {
        setAlertMessage('Error al cargar la imagen: ' + error.message); 
      }
    }
    setLoading(false);
  };

  const handleDelete = async (imageId) => {
    if (imageId) {
      try {
        await deleteImage(imageId);
      } catch (error) {
        setAlertMessage('Error al eliminar la imagen: ' + error.message); 
      }
    }
  };

  return (
    <div className="my-5">
      <h3 className="text-sans-h3">Imágenes para la galería</h3>
      <p className="text-sans-h5">(Máximo 10 imágenes)</p>

      <div className="grid-container mx-5">
        {imgs?.map((image, index) => (
          <div key={index} className="image-container-fixed my-2">
            <img
              className="upload-image-fixed"
              src={image.image}
              alt={image.image}
            />
            <div className="overlay-sm">
              <button
                className="btn-borderless-white d-flex align-content-center mx-3 my-3 px-3"
                onClick={() => openModal(image.image)}
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
          </div>
        ))}

        {imgs.length < 10 && (
          <div className="img-section-s" onDrop={(e) => {
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
                <div className="progress-bar-striped progress-bar-animated bg-primary w-100" >
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

      {/* Aquí mostramos el mensaje de alerta si existe */}
      {alertMessage && (
        <div className="text-sans-h5-error">
          {alertMessage}
        </div>
      )}
    </div>
  );
}

export default UploadImgsm;
