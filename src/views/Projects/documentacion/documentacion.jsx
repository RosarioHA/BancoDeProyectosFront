import { useState } from 'react';
import SelectorLateral from "../../../components/Commons/selectorLateral";
import useApiDocuments from "../../../hooks/useApiDocuments";
import Buscador from '../../../components/Commons/barraDeBusqueda';

const Documentacion = () => {
  // Hooks de estado
  const [selectedDocumentType, setSelectedDocumentType] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [searchResults, setSearchResults] = useState({});
  const [searchActive, setSearchActive] = useState(false);

  // Logica para obtener datos de Documents
  const {
    documentTypes,
    dataDocuments,
    loadingDocuments,
    errorDocuments,
  } = useApiDocuments();

  // Funcion para manejar la busqueda
  const handleSearch = (searchInput) => {
    setSearchTerm(searchInput);
  
    const resultsByType = {};
    const matchingTypes = [];
  
    // Filtra los tipos de documentos y documentos
    documentTypes.forEach((type) => {
      if (type.type.toLowerCase().includes(searchInput.toLowerCase())) {
        matchingTypes.push(type.type);
        resultsByType[type.type] = [];
      }
    });
    dataDocuments.forEach((document) => {
      if (document.title.toLowerCase().includes(searchInput.toLowerCase())) {
        const type = document.document_type.type;
        if (!resultsByType[type]) {
          resultsByType[type] = [];
        }
        resultsByType[type].push(document);
      }
    });
  
    // Verifica si hay tipos de documento coincidentes y agrega todos los documentos correspondientes
    if (matchingTypes.length > 0) {
      matchingTypes.forEach((type) => {
        resultsByType[type] = dataDocuments.filter(
          (document) => document.document_type.type === type
        );
      });
    }

    // Actualiza el estado para indicar si el buscador está activo
    setSearchActive(searchInput.trim() !== '');
  
    setSearchResults(resultsByType);
  };

  // Manejo de errores y carga de datos
  if (loadingDocuments) {
    return  <>
    <div className="d-flex align-items-center flex-column my-5">
      <div className="text-center text-sans-p-blue">Cargando Datos</div>
      <span className="placeholder col-4 bg-primary"></span>
    </div>
  </>
  }
  if (errorDocuments) {
    return <div>Error: {errorDocuments}</div>;
  }

  return (
    <div className="container col-md-8 mb-5">
      <nav aria-label="breadcrumb">
        <ol className="breadcrumb ms-3">
          <li className="breadcrumb-item "><a className="breadcrumbs" href="/">Inicio</a></li>
          <li className="breadcrumb-item active" aria-current="page">Documentación</li>
        </ol>
      </nav>
      <h1 className="text-sans-h1 mt-5">Documentación</h1>
      <p className="text-sans-p my-md-4"> En la sección de Documentación encontrarás toda la documentación asociada a la elaboración de proyectos PMU y PMB, 
        de manera fácil y ordenada para que puedas descargarla según necesites. </p>

      <div className="d-flex justify-content-center my-5">
        <Buscador 
        searchTerm={searchTerm}
        onSearch={handleSearch}
        isSearching={isSearching}
        setIsSearching={setIsSearching}
        placeholder='Buscar documento por palabras claves'
        />
      </div>

      {/* Resultados de la busqueda */}
      <div className="my-5">
        {isSearching && (
          <div className="mt-4 pb-4">
            {Object.keys(searchResults).length === 0 ? ( <p> No se encontraron resultados. </p> ) : (
              Object.keys(searchResults).map((type) => (
                <div className="my-5" key={type}>
                  <h4 className="text-sans-h3 mb-4"> {type} </h4>
                  <div className="row fw-bold border-top pb-3">
                    <div className="col-1 p-3">#</div>
                    <div className="col p-3">Documento</div>
                    <div className="col p-3">Formato</div>
                    <div className="col p-3">Acción</div>
                  </div>
                  {/* Mapea los resultados y crea las filas de la tabla */}
                  {searchResults[type].map((result, index) => (
                    <div
                    key={index}
                    className={`row ${index % 2 === 0 ? 'grey-table-line' : 'white-table-line'}`}
                    >
                      <div className="col-1 p-3">{index + 1}</div>
                      <div className="col p-3">{result.title}</div>
                      <div className="col p-3">{result.document_format || '-'}</div>
                      <div className="col p-3">
                        {result.document && (
                          <a
                          href={result.document}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sans-p-tertiary"
                          >
                            Descargar
                          </a>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ))
            )}
          </div>
        )}
      </div>

      {searchActive ? null : (
        <div className="d-flex flex-column flex-lg-row">
          <div className="col-md-4 col-lg-3">
            <SelectorLateral 
            data={documentTypes}
            titlePropertyName="type"
            onSelect={(selectedType) => setSelectedDocumentType(selectedType)}
            />
          </div>
         
          <div className="col mx-5">
            {selectedDocumentType && (
              <>
                <h4 className="text-sans-h3 mb-4">{selectedDocumentType.type}</h4>
                <div className="row fw-bold border-top pb-3">
                  <div className="col-1 mt-3">#</div>
                  <div className="col mt-3">Documento</div>
                  <div className="col mt-3">Formato</div>
                  <div className="col mt-3">Acción</div>
                </div>
                {dataDocuments
                  .filter((document) => document.document_type.type === selectedDocumentType.type)
                  .map((document, index) => (
                    <div
                    key={document.id}
                    className={`row border-top ${index % 2 === 0 ? 'grey-table-line' : 'white-table-line'}`}
                    >
                      <div className="col-1 p-3">{index + 1}</div>
                      <div className="col p-3">{document.title}</div>
                      <div className="col p-3">{document.document_format}</div>
                      <div className="col p-3">
                        <a
                        href={document.document}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sans-p-tertiary"
                        >
                          Descargar
                        </a>
                      </div>
                    </div>
                ))} 
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Documentacion;