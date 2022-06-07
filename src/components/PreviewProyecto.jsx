import { Link } from "react-router-dom"
import useAuth from "../hooks/useAuth"


const PreviewProyecto = ({proyecto}) => {

    const { auth } = useAuth()

    const { nombre, _id, cliente, creador } = proyecto
  
  return (
    <div className="border-b p-5 md:flex items-center">
        <p className="flex-1 block md:flex">
            {nombre}
            <span className="txt-sm text-gray-500 uppercase md:pl-3 block md:flex">{cliente}</span>
        </p>

        {auth._id !== creador && (
          <p className="text-sky-600 uppercase text-xs font-bold pr-3">Colaborador</p>
        )}

        <Link 
            to={`${_id}`}
            className="text-gray-600 hover:text-gray-800 uppercase text-sm font-bold"
        >Ver Proyecto</Link>
    </div>
  )
}

export default PreviewProyecto