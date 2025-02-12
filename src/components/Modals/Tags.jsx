
import { ModalBase } from '../../components/Modals/ModalBase';
export const Tags = ({handleAddTag, error, tagName ,  setTagName}) =>
{

  

  return (
    <ModalBase
      btnName="Agregar Tag"
      btnIcon="add"
      title="Agregar Tag Priorización"
      modalID="tags"
      classStyle="btn-principal-s px-3 py-3"
      titleStyle="text-sans-h3 ms-3"
    >
      <div className="mx-5">
        <input
          type="text"
          className="form-control py-3 my-4"
          placeholder="Nombre tag"
          value={tagName}
          onChange={(e) => setTagName(e.target.value)}
        />
        {error && <div className="text-danger">{error}</div>}
      </div>
      <div className="d-flex justify-content-end mt-4 me-5">
        <button
          className="btn-principal-s d-flex py-2 me-3 align-self-center"
          onClick={handleAddTag}
          data-bs-dismiss="modal"
        >
          <u>Guardar Tag</u>
          <i className="material-symbols-rounded ms-2 pt-1">save</i>
        </button>
      </div>
    </ModalBase>
  );
};
