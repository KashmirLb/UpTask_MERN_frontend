import { useEffect, useState, useRef } from "react"
import { useParams, Link } from 'react-router-dom'
import clienteAxios from "../config/clienteAxios"
import Alerta from '../components/Alerta'

const ConfirmarCuenta = () => {

  const firstMount = useRef(true)
  const [ alerta, setAlerta ] = useState ({})
  const [ cuentaConfirmada, setCuentaConfirmada ] = useState()

  const params = useParams()
  const { id } = params

  useEffect(()=> {

    const confirmarCuenta = async () =>{
      try {
        const url = `/usuarios/confirmar/${id}`
        const { data } = await clienteAxios(url)

        setAlerta({
          msg: data.msg,
          error: false
        })
        setCuentaConfirmada(true)
        
      } catch (error) {
        setAlerta({
          msg: error.response.data.msg,
          error: true
        })
      }
    }
    if(firstMount.current){
      confirmarCuenta()
      firstMount.current = false
    }

  },[])

  const { msg } = alerta
  
  return (
    <>

      <h1 className="text-sky-600 font-black text-6xl capitalize">Confirma tu <span className="text-slate-700">cuenta</span></h1>
      <div className="mt-20 md:mt-10 shadow-lg px-5 py-10 rounded-xl bg-white">
        {msg && <Alerta alerta={alerta} />}
        {cuentaConfirmada && (
          <div>
            <Link
              to="/"
              className="block text-center my-5 text-slate-500 uppercase text-sm"
              >
                Inicia sesión
            </Link>
          </div>
        )}
      </div>
    </>
  )
}

export default ConfirmarCuenta