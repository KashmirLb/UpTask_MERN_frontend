import { useState } from "react"
import useProyecto from "../hooks/useProyecto"
import Alerta from "./Alerta"

const FormularioColaborador = () => {

    const [ email, setEmail ] = useState("")

    const { mostrarAlerta, alerta, submitColaborador } = useProyecto()

    const handleSubmit = e => {
        e.preventDefault()

        if(email ===""){
            mostrarAlerta({
                msg: "El email es obligatorio",
                error: true
            })
            return
        }

        submitColaborador(email)
    }

    const { msg } = alerta

  return (
    <form
        className="bg-white py-10 px-5 lg:w-1/2 rounded-lg shadow w-full"
        onSubmit={handleSubmit}
    >
        {msg && <Alerta alerta={alerta}/>}
       <div className="mb-5">
            <label
                className="text-gray-700 uppercase font-bold text-sm"
                htmlFor="email"
            >
                Email colaborador
            </label>
            <input
                id="email"
                type="email"
                className="border w-full p-2 mt-2 placeholder-gray-400 rounded-md"
                placeholder="Email del usuario"
                value={email}
                onChange={e=>setEmail(e.target.value)}
            />
        </div>
        <input
            type="submit"
            value="Buscar"
            className="bg-sky-600 w-full p-3 uppercase font-bold text-white rounded cursor-pointer hover:bg-sky-700 transition-colors"
        />

    </form>
  )
}

export default FormularioColaborador