import "../../static/styles/proyectosSort.css"

const SortProyectos = () => {
    return (
      <select className="selector text-underline">
        <option value="">Ordenado: Más reciente</option>
        <option value="desc">Ordenado: Menos reciente</option>
      </select>
    );
  };
  
  export default SortProyectos;