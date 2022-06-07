import useProyecto from "../hooks/useProyecto"
import PreviewProyecto from "../components/PreviewProyecto"

const Proyectos = () => {

    const { proyectos } = useProyecto()

  return (
    <>
      <h1 className="text-4xl font-black">
        Proyectos
      </h1>
      <div className="bg-white shadow mt-10 rounded-lg">
        {proyectos.length ? 
          proyectos.map( proyecto =>(
            <PreviewProyecto proyecto={proyecto} key={proyecto._id}/>
          ))
        : <p className="text-center text-gray-600 uppercase p-5 font-bold">No hay proyectos aún.</p>}

      </div>
    </>
  )
}

export default Proyectos