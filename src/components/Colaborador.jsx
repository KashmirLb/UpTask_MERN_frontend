import useProyecto from "../hooks/useProyecto"
import useAdmin from "../hooks/useAdmin";

const Colaborador = ({colaborador}) => {

    const admin = useAdmin();
    const { handleModalEliminarColaborador } = useProyecto();
    const { nombre, email } = colaborador

  return (
    <div className="border-b p-5 flex justify-between items-center">
        <div>
            <p>{nombre}</p>
            <p className="text-sm text-gray-700">{email}</p>
        </div>
        <div>
            {admin && (

                <button
                    type="button"
                    className="bg-red-500 px-4 py-3 text-white uppercase font-bold text-sm rounded-lg"
                    onClick={()=>handleModalEliminarColaborador(colaborador)}
                >Eliminar</button>
            )}
        </div>
    </div>
  )
}

export default Colaborador