const Carrusel = () => {
    return (
      <div className="container text-center my-4">
        {/* Imagen portada */}
        <div className="row d-none d-lg-block img-portada my-4">
          <div className="col d-flex justify-content-center">
            <div className="img-proyecto col-lg-7">Portada</div>
          </div>
        </div>

        {/* Miniaturas */}
        <div className="container mini-container d-flex flex-wrap ">
            <div className="miniatura m-1">
                <div>img</div>
            </div>
            <div className="miniatura m-1">
                <div>img</div>
            </div>
            <div className="miniatura m-1">
                <div>img</div>
            </div>
            <div className="miniatura m-1">
                <div>img</div>
            </div>
            <div className="miniatura m-1">
                <div>img</div>
            </div>
            <div className="miniatura mx-1">
                <div>img</div>
            </div>
            <div className="miniatura">
                <div>img</div>
            </div>
        </div>
        
      </div>
    );
  };
    
  export default Carrusel;