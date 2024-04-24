import { Link } from 'react-router-dom';

const ProyectoCard = ({ project = {} }) => {
  const {
    name,
    description = "",
    comuna = {},
    portada,
    program = {},
    type = {},
    year = {},
    slug = "",
    prioritized_tag: prioritizedTag
  } = project;

  const { comuna: comunaName, region } = comuna;
  const isPrioritizedTagPresent = prioritizedTag && prioritizedTag.length > 0;

  const truncateText = (text, maxWords) => {
    if (!text) {
      return "";
    }

    const words = text.split(" ");
    return words.length <= maxWords
      ? text
      : `${words.slice(0, maxWords).join(" ")} ...`;
  };

  const truncatedDescription = truncateText(description, 20);

  return (
    <div className="proyect-card mx-0 m-md-3 col-6 d-flex flex-column justify-content-between">
      <div>
        <div className="img-container d-flex justify-content-center">
          <img src={portada} className="image" alt={name} />

          {/* ESTE TAG APARECE DE MANERA DINAMICA, CON EL CONTENIDO TAMBIEN DINAMICO */}
          {isPrioritizedTagPresent && (
            <div className="tag-container">
              {prioritizedTag.map((tag, index) => (
                <div key={index} className="proyect-tag py-1 me-1">
                  <p className="text-tag mx-2">{tag.prioritized_tag}</p>
                </div>
              ))}
            </div>
          )}

        </div>
        <div className="d-flex flex-row justify-content-between ms-3 my-2">
          <p className="col-6 text-sans-h5 text-muted">Región: {region}</p>
          <p className="col-5 text-sans-h5 text-muted">Comuna: {comunaName}</p>
        </div>
        <h2 className="text-serif-h2 text-decoration-underline ml-3 mb-3 mx-3">{name}</h2>
        <p className="text-sans-p mx-3">{truncatedDescription}</p>
      </div>

      <div>
        <div className="container d-flex justify-content-between">
          <p className="tag p-1">{program.sigla}</p>
          <p className="tag p-1">{type.name}</p>
          <p className="tag p-1">{year.number}</p>
        </div>
        <div className="d-flex justify-content-end p-3">
          <button className="font-level-4 btn-principal-s text-decoration-underline px-3">
            <Link to={`/project/${slug}/`} className="font-level-4 btn-principal-s text-decoration-underline px-3">
              Ver más &gt;
            </Link>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProyectoCard;
