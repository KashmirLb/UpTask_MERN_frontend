import { useEffect, useState } from "react"
import { Link, useParams } from 'react-router-dom'
import clienteAxios from "../config/clienteAxios"
import Alerta from "../components/Alerta"

const NuevoPassword = () => {

    const params = useParams();
    const [ tokenValido, setTokenValido ] = useState(false)
    const [ alerta, setAlerta ] = useState({})
    const [ password, setPassword ] = useState("")
    const [ repetirPassword, setRepetirPassword ] = useState("")
    const [ passwordModificado, setPasswordModificado ] = useState(false)

    const { token } = params

    useEffect(() => {
        const comprobarToken = async () => {

            try {
                await clienteAxios(`/usuarios/olvide-password/${token}`)
                setTokenValido(true)
            } catch (error) {
                setAlerta({
                    msg: error.response.data.msg,
                    error: true
                })
            }
        }
        comprobarToken()
    }, [])

    const handleSubmit = async e => {

        e.preventDefault()

        if (password.length < 6){
            setAlerta({
                msg: "El password debe ser minimo de 6 caracteres",
                error: true
            })
            return
        }

        try {
            const url = `/usuarios/olvide-password/${token}`
            const { data } = await clienteAxios.post(url, { password })

            setAlerta({
                msg: data.msg,
                error: false
            })
            setTokenValido(false)
            setPasswordModificado(true)
            
        } catch (error) {
            setAlerta({
                msg: error.response.data.msg,
                error: true
            })
        }
    }

  return (
    <>
    <h1 className="text-sky-600 font-black text-6xl capitalize">Reestablece tu  <span className="text-slate-700">password</span></h1>
    
    { tokenValido ? (

    <form className="my-10 bg-white shadow rounded-lg p-10" onSubmit={handleSubmit}>
        
        <div className="my-5">
            <label 
                className="uppercase text-gray-600 block text-xl font-bold"
                htmlFor="password"
            >Nuevo Password</label>
            <input 
                type="password"
                id="password"
                autoComplete="new-password"
                placeholder="Nuevo Password"
                className="w-full mt-3 p-3 border rounded-xl bg-gray-50"
                value={password}
                onChange={e=> setPassword(e.target.value)}
            />
        </div>
        <div className="my-5">
            <label 
                className="uppercase text-gray-600 block text-xl font-bold"
                htmlFor="password2"
            >Repite password</label>
            <input 
                type="password"
                id="password2"
                autoComplete="current-password"
                placeholder="Repite Password"
                className="w-full mt-3 p-3 border rounded-xl bg-gray-50"
                value={repetirPassword}
                onChange={e=> setRepetirPassword(e.target.value)}
            />
        </div>
        <input
            type="submit"
            value="Guardar Password"
            className="bg-sky-700 w-full py-3 text-white uppercase font-bold rounded hover:cursor-pointer hover:bg-sky-800 mb-5"
        /> 
    </form>
    ) : <Alerta alerta={alerta} />
    
    }
    {passwordModificado && (
        <Link
            to="/"
            className="block text-center my-5 text-slate-500 uppercase text-sm"
            >
            Inicia sesión
        </Link>
    )}
  
</>
  )
}

export default NuevoPassword