import { useState, useEffect } from 'react';


const ImageModal = ({ img, selectedImageIndex, setSelectedImageIndex, context }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(selectedImageIndex);

  const handleCarouselSlide = newIndex => {
    setCurrentImageIndex(newIndex);
  };

  const imageIndicator = `${currentImageIndex + 1} de ${img.length}`;

  useEffect(() => {
    setCurrentImageIndex(selectedImageIndex); // Sincroniza currentImageIndex cuando selectedImageIndex cambia
  }, [selectedImageIndex]);

  const handleClose = () => {
    setSelectedImageIndex(currentImageIndex); // Restaura selectedImageIndex al valor de currentImageIndex
  };

  return (
    <div className="modal fade" id={`imageModal-${context}`} tabIndex="-1" aria-labelledby="imageModalLabel" aria-hidden="true">
      <div className="modal-dialog modal-lg modal-dialog-centered">
        <div className="modal-content border border-secondary">
          <div className="d-flex justify-content-between p-2">
          <div className="image-indicator">{imageIndicator}</div>
            <button type="button" className="custom-close-button d-flex align-self-center" data-bs-dismiss="modal" aria-label="Close" onClick={handleClose}>
              Cerrar  <i className="material-symbols-outlined mx-1">close</i>
            </button>
          </div>
          
          <div className="modal-body">
            <div id="carouselExampleControls" className="carousel slide"  key={currentImageIndex}>
            <div className="carousel-inner">
              {img.map((image, index) => (
                <div className={`carousel-item ${index === currentImageIndex ? 'active' : ''}`} key={index}>
                  <img className="d-block w-100" src={image} alt={`Image ${index}`} />
                </div>
              ))}
            </div>

            {/* <div className="image-indicator">{imageIndicator}</div> */}

              <button className="carousel-control-prev" type="button" data-bs-target="#carouselExampleControls" data-bs-slide="prev" onClick={() => handleCarouselSlide((currentImageIndex - 1 + img.length) % img.length)}>
                <span className="carousel-btn carousel-control-prev-icon" aria-hidden="true"></span>
                <span className="visually-hidden">Previous</span>
              </button>
              <button className="carousel-control-next" type="button" data-bs-target="#carouselExampleControls" data-bs-slide="next" onClick={() => handleCarouselSlide((currentImageIndex + 1) % img.length)}>
                <span className="carousel-btn carousel-control-next-icon" aria-hidden="true"></span>
                <span className="visually-hidden">Next</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ImageModal;