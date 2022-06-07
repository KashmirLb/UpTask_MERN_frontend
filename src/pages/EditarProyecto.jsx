import { useEffect, useRef } from "react"
import { useParams } from "react-router-dom"
import useProyecto from "../hooks/useProyecto"
import FormularioProyecto from "../components/FormularioProyecto"
import { Link } from "react-router-dom"

const EditarProyecto = () => {

    const params = useParams()
    const firstLoad = useRef(true)

    const { obtenerProyecto, proyecto, cargando } = useProyecto()

    useEffect(()=>{

        if(firstLoad.current){
            obtenerProyecto(params.id)
            firstLoad.current=false
        }
    },[])

    const { nombre } = proyecto;

  return (
    <>
        <h1 className="font-black text-4xl">Editar Proyecto: {nombre}</h1>
            <div className="mt-10 flex justify-center">
                <FormularioProyecto proyecto={proyecto}/>
            </div>
            <div className="flex ">
                <Link 
                        to={`/proyectos/${params.id}`}
                        className="uppercase font-bold hover:bg-red-800 bg-red-600 rounded-md p-4 text-white mt-10 "
                    > 
                        Atrás   
                </Link>
            </div>

    </>
  )
}

export default EditarProyecto