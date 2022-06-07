import { formatearFecha } from "../helpers"
import useProyecto from "../hooks/useProyecto"
import useAdmin from "../hooks/useAdmin"

const Tarea = ({ tarea }) => {


    const admin = useAdmin();
    const { descripcion, nombre, prioridad, fechaEntrega, estado, _id, completado } = tarea
    const { handleModalEditarTarea, handleModalEliminarTarea, completarTarea } = useProyecto()

  return (
    <div className="border-b p-5 flex justify-between items-center">
        <div>
            <p className="mb-1 text-xl">{nombre}</p>
            <p className="mb-1 text-sm text-gray-500 uppercase">{descripcion}</p>
            <p className="mb-1 text-sm">{formatearFecha(fechaEntrega)}</p>
            <p className="mb-1 text-xl">{prioridad}</p>
            { estado && <p className="text-xs text-sky-600 font-bold uppercase p-1 rounded-lg">Completada por: {completado?.nombre}</p>}
        </div>
        <div className="flex gap-2 flex-col lg:flex-row">
            {admin && (

                <button
                    className="bg-indigo-600 px-4 py-3 text-white uppercase dont-vold text-sm rounded-lg"
                    onClick={()=>handleModalEditarTarea(tarea)}
                >
                    Editar
                </button>
            )}
            <button
                className={`${estado ? "bg-sky-600" : "bg-gray-600"} px-4 py-3 text-white uppercase dont-vold text-sm rounded-lg`}
                onClick={()=>completarTarea(_id)}
            >
                {estado ? "Completa" : "Incompleta"}
            </button>
            {admin && (
                
                <button
                    className="bg-red-600 px-4 py-3 text-white uppercase dont-vold text-sm rounded-lg"
                    onClick={()=>handleModalEliminarTarea(tarea)}
                >
                    Eliminar
                </button>
            )}
        </div>
        
    </div>
  )
}

export default Tarea