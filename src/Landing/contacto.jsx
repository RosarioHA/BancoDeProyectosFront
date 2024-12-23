import ContactoForm from "../../components/Contacto/contactoForm";

const Contacto = () => {
    return (
      <div className="container">
        <nav aria-label="breadcrumb">
          <ol className="breadcrumb ms-3">
            <li className="breadcrumb-item "><a className="breadcrumbs" href="/">Inicio</a></li>
            <li className="breadcrumb-item active" aria-current="page">Contacto</li>
          </ol>
        </nav>
        <h1 className="text-sans-h1 text-center mt-5">Formulario de Contacto</h1>
        <ContactoForm />
      </div>
    );
  };
  
  export default Contacto;