import { useEffect, useRef } from "react"
import { useParams, Link } from "react-router-dom"
import FormularioColaborador from "../components/FormularioColaborador"
import Spinner from "../components/Spinner"
import useProyecto from "../hooks/useProyecto"
import Alerta from "../components/Alerta"


const NuevoColaborador = () => {

    const { obtenerProyecto, proyecto, cargando, colaborador, agregarColaborador, alerta } = useProyecto()
    const params = useParams();
    const firstLoad = useRef(false)

    useEffect(()=>{
        if(firstLoad.current){
            obtenerProyecto(params.id)
            firstLoad.current = false
        }
    },[])
    
    if(!proyecto?._id) return <Alerta alerta={alerta} />
  return (
   <div>
        <h1 className="text-4xl font-black">Añadir Colaborador(a) a proyecto: {proyecto.nombre}</h1>
        <div className="flex mt-10  justify-center">
            <FormularioColaborador />
        </div>
        { cargando ?  <Spinner/> : colaborador?._id && (
            <div className="flex justify-center mt-10 ">
                <div className="bg-white py-10 px-5 w-full lg:w-1/2 rounded-lg shadow">
                    <h2 className="text-center mb-10 text-2xl font-bold">Resultado:</h2>
                    <div className="flex justify-between items center">
                        <p>{colaborador.nombre}</p>
                        <button
                            type="button"
                            className="bg-slate-500 px-5 py-2 rounded-lg uppercase text-white text-sm"
                            onClick={()=>agregarColaborador({
                                email: colaborador.email
                            })}
                        >Agregar</button>
                    </div>
                </div>
            </div>
        )}
        <Link 
            to={`/proyectos/${params.id}`}
            className="uppercase font-bold hover:bg-red-800 bg-red-600 rounded-md py-4 px-7 text-white mt-10 block w-fit"
        > 
            Atrás   
        </Link>
   </div>
  )
}

export default NuevoColaborador