import { useEffect, useRef } from "react"
import { useParams, Link } from "react-router-dom"
import useProyecto from "../hooks/useProyecto"
import useAdmin from "../hooks/useAdmin"
import Spinner from "../components/Spinner"
import ModalFormularioTarea from "../components/ModalFormularioTarea"
import ModalEliminarTarea from "../components/ModalEliminarTarea"
import Tarea from "../components/Tarea"
import Colaborador from "../components/Colaborador"
import ModalEliminarColaborador from "../components/ModalEliminarColaborador"
import io from 'socket.io-client'

let socket;

const Proyecto = () => {
    
    const params = useParams()

    const admin = useAdmin();
    const { obtenerProyecto, proyecto, cargando, eliminarProyecto, handleModalTarea, submitTareasProyecto, eliminarTareaProyecto, actualizarTareaProyecto } = useProyecto()

    useEffect(() =>{
        obtenerProyecto(params.id)
        socket = io(import.meta.env.VITE_BACKEND_URL)
        socket.emit("abrir proyecto", params.id)            
    },[])
    
    useEffect(()=>{
        socket.on('tarea agregada', (tareaNueva) =>{
            if(tareaNueva.proyecto === proyecto._id){
                submitTareasProyecto(tareaNueva)
            }
        })

        socket.on('tarea eliminada', tareaEliminada =>{
            if(tareaEliminada.proyecto === proyecto._id){
                eliminarTareaProyecto(tareaEliminada)
            }
        })

        socket.on('tarea actualizada', tareaActualizada =>{

            if(tareaActualizada.proyecto._id === proyecto._id){
                actualizarTareaProyecto(tareaActualizada)
            }
        })
    })

    const { nombre } = proyecto;

    const handleClick = () => {
        if(confirm("¿Deseas eliminar este proyecto?")){
            eliminarProyecto(proyecto._id)
        }
    }

  return (

    cargando ? <Spinner /> : 
    <>
    <div className="flex justify-between flex-col md:flex-row">
        <h1 className="font-black text-4xl">{nombre}</h1>
        {admin && (

        <div className="flex items-center gap-2 text-white mt-2">
            <Link 
                    to={`/proyectos/editar/${params.id}`}
                    className="uppercase font-bold flex items-center gap-2 hover:bg-sky-800 bg-sky-600 rounded-md p-2"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                    </svg>
                    <div>
                       Editar 
                    </div>
            </Link>
            <button 
                onClick={handleClick}
                className="uppercase font-bold flex items-center gap-2 hover:bg-red-800 bg-red-600 rounded-md p-2"
            
            >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
                
                <div>Eliminar</div></button>
        </div>
        )}
    </div>
    {admin && (

        <button 
            type="button"
            className="text-sm px-5 py-3 w-auto rounded-lg uppercase font-bold bg-sky-400 text-white text-center mt-5 flex flex-1 gap-2 items-center justify-center"
            onClick={handleModalTarea}
        >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Nueva Tarea
        </button>
    )}

        <p className="font-bold text-xl mt-10">Tareas del Proyecto</p>

        <div className="bg-white shadow mt-10 rounded-lg">
            {proyecto.tareas?.length ? proyecto.tareas?.map( tarea => (
                <Tarea tarea={tarea} key={tarea._id} />
            )) : 
            <p className="text-center my-5 p-10">No hay tareas en este proyecto</p>}
        </div>

        <div className="flex flex-col md:flex-row items-center justify-between mt-10">
            <p className="font-bold text-xl">Colaboradores</p>
            {admin && (

                <Link
                    to={`/proyectos/nuevo-colaborador/${proyecto._id}`}
                    className="text-sm px-5 py-3 w-full md:w-auto rounded-lg uppercase font-bold bg-sky-400 text-white text-center mt-5 flex gap-2 items-center justify-center"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Añadir
                </Link>
            )}

        </div>
        <div className="bg-white shadow mt-10 rounded-lg">
            {proyecto.colaboradores?.length ? proyecto.colaboradores?.map( colaborador => (
                <Colaborador colaborador={colaborador} key={colaborador._id} />
            )) : 
            <p className="text-center my-5 p-10">No hay colaboradores en este proyecto</p>}
        </div>


        <ModalFormularioTarea/>
        <ModalEliminarTarea />
        <ModalEliminarColaborador/>
    </>
  )
}

export default Proyecto