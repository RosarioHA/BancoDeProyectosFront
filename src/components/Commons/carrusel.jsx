import { useState, useRef, useEffect } from 'react';
import ImageModal from '../Commons/modal';

const Carrusel = ({ imgPortada, imgGeneral, context }) =>
{
  const miniContainerRef = useRef(null);
  const [ selectedImageIndex, setSelectedImageIndex ] = useState(0);
  const [ hiddenThumbnailsCount, setHiddenThumbnailsCount ] = useState(0);


  let imgArray = [];

  if (imgPortada)
  {
    imgArray.push(imgPortada);
  }

  if (Array.isArray(imgGeneral) && imgGeneral.length > 1)
  {
    imgArray = [ ...imgArray, ...imgGeneral.map(img => img.image) ];
  }

  useEffect(() =>
  {
    const miniContainer = miniContainerRef.current;

    if (!miniContainer)
    {
      return;
    }

    const thumbnails = Array.from(miniContainer.querySelectorAll('.miniatura'));

    const updateHiddenThumbnails = () =>
    {
      const miniaturaStyles = getComputedStyle(thumbnails[ 0 ]);
      const miniaturaWidth = thumbnails[ 0 ].offsetWidth + parseFloat(miniaturaStyles.marginLeft) + parseFloat(miniaturaStyles.marginRight);
      const containerWidth = miniContainer.offsetWidth;
      const visibleThumbnailsCount = Math.floor(containerWidth / miniaturaWidth);

      setHiddenThumbnailsCount(Math.max(0, imgArray.length - visibleThumbnailsCount));
    };

    updateHiddenThumbnails();
    window.addEventListener('resize', updateHiddenThumbnails);

    return () =>
    {
      window.removeEventListener('resize', updateHiddenThumbnails);
    };
  }, [ imgArray.length ]);

  const isMobile = window.innerWidth <= 768; // Establece el punto de corte para dispositivos moviles

  return (
    <div className="container text-center mb-md-5 d-flex flex-column align-items-center">
      {isMobile && imgArray.length === 1 ? (
        // En vista movil, muestra imgPortada de no haber miniaturas.
        <div className="col-12 d-block d-md-none img-portada my-4 d-flex justify-content-center">
          <a data-bs-toggle="modal" data-bs-target={`#imageModal-${context}`} onClick={() => setSelectedImageIndex(0)}>
            <img className="img-fluid" src={imgPortada} alt="Portada" />
          </a>
        </div>
      ) : (
        // Si no, muestra imagen de portada y miniaturas
        <>
          {/* Portada */}
          {imgPortada && (
            <div className="col-10 d-none d-md-block img-portada my-4 d-flex justify-content-center">
              <a data-bs-toggle="modal" data-bs-target={`#imageModal-${context}`} onClick={() => setSelectedImageIndex(0)}>
                <img className="img-fluid" src={imgPortada} alt="Portada" />
              </a>
            </div>
          )}

          {/* Miniaturas */}
          {imgGeneral && imgArray.length > 1 && (
            <div className="mini-container d-flex flex-wrap justify-content-center" ref={miniContainerRef}>
              {imgArray.map((image, index) => (
                <div className="m-1 m-md-2 miniatura" key={image.id || index}>
                  <a data-bs-toggle="modal" data-bs-target={`#imageModal-${context}`} onClick={() => setSelectedImageIndex(index)}>
                    <img className="miniatura" src={image} alt={`Thumbnail ${index}`} />
                    {index === imgArray.length - hiddenThumbnailsCount - 1 && hiddenThumbnailsCount > 0 && (
                      <div className="thumbnail-counter-overlay">+{hiddenThumbnailsCount}</div>
                    )}
                  </a>
                </div>
              ))}

              <ImageModal
                img={imgArray}
                selectedImageIndex={selectedImageIndex}
                setSelectedImageIndex={setSelectedImageIndex}
                context={context}
              />
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Carrusel;