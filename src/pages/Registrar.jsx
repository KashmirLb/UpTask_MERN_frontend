import { useState } from "react"
import { Link } from "react-router-dom"
import Alerta from "../components/Alerta"
import clienteAxios from "../config/clienteAxios"


const Registrar = () => {

  const [ nombre, setNombre ] = useState("")
  const [ email, setEmail ] = useState("")
  const [ password, setPassword ] = useState("")
  const [ repetirPassword, setRepetirPassword ] = useState("")
  const [ alerta, setAlerta ] = useState({})

  const handleSubmit = async e => {
    e.preventDefault();
    setAlerta({})

    if([nombre, email, password, repetirPassword].includes("")){
      setAlerta({
        msg: "Todos los campos son obligatorios",
        error: true
      })
      return
    }
    if(password !== repetirPassword){
      setAlerta({
        msg: "Las contraseñas no son iguales",
        error: true
      })
      return
    }
    if(password.length < 6){
      setAlerta({
        msg: "La contraseña debe tener al menos 6 caracteres",
        error: true
      })
      return
    }
    
    try {

      const { data } = await clienteAxios.post(`/usuarios`, {
          nombre,
          email,
          password
      })

      setAlerta({
        msg: data.msg,
        error: false
      })
      setNombre("")
      setPassword("")
      setRepetirPassword("")
      setEmail("")

    }catch (error) {
      setAlerta({
        msg: error.response.data.msg,
        error: true
      })
    }
  }

  const { msg } = alerta
  return (
    <>
    <h1 className="text-sky-600 font-black text-6xl capitalize">Crea tu cuenta y administra tus <span className="text-slate-700">proyectos</span></h1>
    
    { msg && <Alerta alerta={alerta}/> }
    <form className="my-10 bg-white shadow rounded-lg p-10" onSubmit={handleSubmit}>
        <div className="my-5">
            <label 
                className="uppercase text-gray-600 block text-xl font-bold"
                htmlFor="nombre"
            >Nombre</label>
            <input 
                type="text"
                id="nombre"
                autoComplete="name"
                placeholder="Nombre"
                className="w-full mt-3 p-3 border rounded-xl bg-gray-50"
                value={nombre}
                onChange={e => setNombre(e.target.value)}
            />
        </div>
        <div className="my-5">
            <label 
                className="uppercase text-gray-600 block text-xl font-bold"
                htmlFor="email"
            >Email</label>
            <input 
                type="email"
                id="email"
                autoComplete="username"
                placeholder="Tu Email"
                className="w-full mt-3 p-3 border rounded-xl bg-gray-50"
                value={email}
                onChange={e => setEmail(e.target.value)}
            />
        </div>
        <div className="my-5">
            <label 
                className="uppercase text-gray-600 block text-xl font-bold"
                htmlFor="password"
            >Password</label>
            <input 
                type="password"
                id="password"
                autoComplete="new-password"
                placeholder="Tu Password"
                className="w-full mt-3 p-3 border rounded-xl bg-gray-50"
                value={password}
                onChange={e => setPassword(e.target.value)}
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
                autoComplete="new-password"
                placeholder="Repite Password"
                className="w-full mt-3 p-3 border rounded-xl bg-gray-50"
                value={repetirPassword}
                onChange={e => setRepetirPassword(e.target.value)}
            />
        </div>
        <input
            type="submit"
            value="Crear Cuenta"
            className="bg-sky-700 w-full py-3 text-white uppercase font-bold rounded hover:cursor-pointer hover:bg-sky-800 mb-5"
        /> 
    </form>
    <nav className="lg:flex lg:justify-between">
        <Link
            to="/"
            className="block text-center my-5 text-slate-500 uppercase text-sm"
        >Ya tienes cuenta? Inicia sesión</Link>
        <Link
            to="/olvide-password"
            className="block text-center my-5 text-slate-500 uppercase text-sm"
        >Olvidé mi contraseña</Link>
    </nav>
</>
  )
}

export default Registrar