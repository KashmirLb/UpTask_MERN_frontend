import { useState, useEffect, createContext } from "react";
import clienteAxios from "../config/clienteAxios";
import { useNavigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import io from "socket.io-client";

let socket;

const ProyectoContext = createContext()

const ProyectoProvider = ({children}) => {

    const [ proyectos, setProyectos ] = useState([])
    const [ alerta, setAlerta ] = useState({})
    const [ proyecto, setProyecto ] = useState({})
    const [ cargando, setCargando ] = useState(false)
    const [ modalFormularioTarea, setModalFormularioTarea ] = useState(false)
    const [ tarea, setTarea ] = useState({})
    const [ modalEliminarTarea, setModalEliminarTarea ] = useState(false)
    const [ colaborador, setColaborador ] = useState({})
    const [ modalEliminarColaborador, setModalEliminarColaborador ] = useState(false)
    const [ buscador, setBuscador ] = useState(false)

    const navigate = useNavigate()
    const { auth } = useAuth()

    useEffect(()=> {

        const obtenerProyectos = async () => {

            try {
                const token = localStorage.getItem('token')
                if(!token) return

                const config = {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`
                    }
                }
                const { data } = await clienteAxios('/proyectos', config)
                setProyectos(data)

            } catch (error) {
                console.log(error)
            }
        }
        obtenerProyectos()
    },[auth])

    useEffect(()=>{
        socket = io(import.meta.env.VITE_BACKEND_URL)
    },[])

    const mostrarAlerta = alerta => {
        setAlerta(alerta)

        setTimeout(()=>{
            setAlerta({})
            if(modalFormularioTarea){
                setModalFormularioTarea(false)
            }
        },5000)
    }

    const mostrarAlertaTarea = alerta =>{
        setAlerta(alerta)

        setTimeout(()=>{
            setAlerta({})
            if(modalFormularioTarea){
                setModalFormularioTarea(false)
            }
            if(modalEliminarTarea){
                setModalEliminarTarea(false)
            }
            if(modalEliminarColaborador){
                setModalEliminarColaborador(false)
            }
        },1500)
    }

    const submitProyecto = (proyecto) => {
        
        if(proyecto.id){
            editarProyecto(proyecto)
        }
        else{
            nuevoProyecto(proyecto)
        }
    }

    const obtenerProyecto = async id => {
        
        try {
            setCargando(true)
            const token = localStorage.getItem('token')
            if(!token) return

            const config = {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                }
            }
            

            const { data } = await clienteAxios(`proyectos/${id}`, config)

            setProyecto(data)
        } catch (error) {
            setAlerta({
                msg: error.response.data.msg,
                error: true
            })
        }
        setCargando(false)
    }

    const nuevoProyecto = async proyecto => {
        
        try {
            const token = localStorage.getItem('token')
            if(!token) return

            const config = {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                }
            }

            const { data } = await clienteAxios.post("/proyectos", proyecto, config)
           
            setProyectos([...proyectos, data])
            setAlerta({
                msg: "Proyecto creado correctamente",
                error: false
            })

            setTimeout(()=> {
                setAlerta({})
                navigate("/proyectos")
            },3000)
        } catch (error) {
            setAlerta({
                msg: error.response.data.msg,
                error: true
            })
        }
    }

    const editarProyecto = async (proyecto) => {
        try {
            const token = localStorage.getItem('token')
            if(!token) return

            const config = {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                }
            }

            const { data } = await clienteAxios.put(`proyectos/${proyecto.id}`, proyecto, config)
            const nuevosProyectos = proyectos.map( p => p._id===data._id ? data : p)
            setProyectos(nuevosProyectos)
            setAlerta({
                msg: "Proyecto actualizado correctamente",
                error: false
            })

            setTimeout(()=> {
                setAlerta({})
                navigate("/proyectos")
            },2000)
        } catch (error) {
            setAlerta({
                msg: error.response.data.msg,
                error: true
            })
        }
    }

    const eliminarProyecto = async id => {
        try {
            const token = localStorage.getItem('token')
            if(!token) return

            const config = {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                }
            }

            const { data } = await clienteAxios.delete(`proyectos/${proyecto._id}`, config)
            setAlerta({
                msg: data.msg,
                error:true
            })
            const proyectosActualizado = proyectos.filter(p => p._id !== id)
            setProyectos(proyectosActualizado)
            setTimeout(()=>{
            setAlerta({})
            navigate("/proyectos")
        }, 2000)

        } catch (error) {
            
        }
        
    }

    const handleModalTarea = () => {
        setTarea({})
        setModalFormularioTarea(!modalFormularioTarea)
    }

    const submitTarea = async tarea => {

        if(tarea?.id){
            await editarTarea(tarea)
        }
        else{
            await crearTarea(tarea)
        }
    }

    const crearTarea = async tarea => {
        try {
            const token = localStorage.getItem('token')
            if(!token) return

            const config = {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                }
            }

            const { data } = await clienteAxios.post("/tareas", tarea, config)

            mostrarAlertaTarea({
                msg: "Tarea agregada correctamente",
                error:false
            })

            //SOCKET IO
            socket.emit('nueva tarea', data)

        } catch (error) {
            mostrarAlerta({
                msg: error.response.data.msg,
                error: true
            })
        }
    }

    const editarTarea = async tarea =>{
        try {
            const token = localStorage.getItem('token')
            if(!token) return

            const config = {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                }
            }

            const { data } = await clienteAxios.put(`/tareas/${tarea.id}`, tarea, config)

            mostrarAlertaTarea({
                msg: "Tarea actualizada",
                error: false
            })

            socket.emit('actualizar tarea', data)
        } catch (error) {
            console.log(error)
        }
    }

    const eliminarTarea = async () =>{
        try {
            const token = localStorage.getItem('token')
            if(!token) return

            const config = {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                }
            }
            const { data } = await clienteAxios.delete(`/tareas/${tarea._id}`, config)

            //Socket

            socket.emit('eliminar tarea', tarea)

            setTarea({})
            mostrarAlertaTarea({
                msg: data.msg,
                error: true
            })

        }

        catch(error){
            console.log(error)
        }
    }

    const handleModalEditarTarea = tarea =>{
        setTarea(tarea)
        setModalFormularioTarea(true)
    }

    const handleModalEliminarTarea = tarea =>{
        setTarea(tarea)
        setModalEliminarTarea(!modalEliminarTarea)
    }

    const submitColaborador = async email => {

        setCargando(true)
        try {
            const token = localStorage.getItem('token')
            if(!token) return

            const config = {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                }
            }

            const { data } = await clienteAxios.post(`/proyectos/colaboradores`, {email}, config)

            setColaborador(data)
            setAlerta({})

        } catch (error) {
           setAlerta({
               msg: error.response.data.msg,
               error: true
           })
        }
        setCargando(false)
    }

    const agregarColaborador = async email => {
        try {
            const token = localStorage.getItem('token')
            if(!token) return

            const config = {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                }
            }

            const { data } = await clienteAxios.post(`/proyectos/colaboradores/${proyecto._id}`, email, config)

            setColaborador(data)
            mostrarAlerta({
                msg: data.msg,
                error:false
            })

        } catch (error) {
           mostrarAlerta({
               msg: error.response.data.msg,
               error: true
           })
        }
    }

    const handleModalEliminarColaborador = colaborador => {
        setModalEliminarColaborador(!modalEliminarColaborador)
        setColaborador(colaborador)
    }

    const eliminarColaborador = async () => {
        try {
            
            const token = localStorage.getItem('token')
            if(!token) return

            const config = {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                }
            }

            
            const { data } = await clienteAxios.post(`/proyectos/eliminar-colaborador/${proyecto._id}`, {id: colaborador._id}, config)

            const proyectoActualizado = {...proyecto}

            proyectoActualizado.colaboradores = proyectoActualizado.colaboradores.filter( colaboradorState => colaboradorState._id !== colaborador._id )

            setProyecto(proyectoActualizado)
            setColaborador({})
            mostrarAlertaTarea({
                msg: data.msg,
                error: false
            })

  

        } catch (error) {
            console.log(error.response)
        }
    }

    const completarTarea = async id => {
       
        try {

            const token = localStorage.getItem('token')
            if(!token) return

            const config = {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                }
            }

            const { data } = await clienteAxios.post(`/tareas/estado/${id}`, {}, config)

            const proyectoActualizado = {...proyecto}

            proyectoActualizado.tareas = proyectoActualizado.tareas.map(tareaState => tareaState._id === data._id ? data : tareaState)

            setProyecto(proyectoActualizado)
            setTarea({})
            setAlerta({})

             
        } catch (error) {
            console.log(error.response)
        }
    }

    const handleBuscador = () => {
        setBuscador(!buscador)
    }

    //SOCKET IO
    const submitTareasProyecto = (tarea) => {

        const proyectoActualizado = {...proyecto}
        proyectoActualizado.tareas = [...proyectoActualizado.tareas, tarea]

        setProyecto(proyectoActualizado)
        setTarea({})
    }

    const eliminarTareaProyecto = tarea => {
        const proyectoActualizado = {...proyecto}
        proyectoActualizado.tareas = proyectoActualizado.tareas.filter( t => t._id !== tarea._id)
        setProyecto(proyectoActualizado)
        setTarea({})
    }

    const actualizarTareaProyecto = tarea =>{
        const proyectoActualizado = { ...proyecto }
        
        proyectoActualizado.tareas = proyectoActualizado.tareas.map(tareaState => tareaState._id === tarea._id ? tarea : tareaState)
        setProyecto(proyectoActualizado)
        setTarea({})
    }

    const cerrarSesionProyectos = () => {
        setProyectos([])
        setProyecto({})
        setAlerta({})

    }

    return(
        <ProyectoContext.Provider 
            value={{
                proyectos,
                mostrarAlerta,
                alerta,
                submitProyecto,
                obtenerProyecto,
                proyecto,
                cargando,
                eliminarProyecto,
                modalFormularioTarea,
                handleModalTarea,
                submitTarea,
                handleModalEditarTarea,
                tarea,
                handleModalEliminarTarea,
                modalEliminarTarea,
                eliminarTarea,
                submitColaborador,
                colaborador,
                agregarColaborador,
                handleModalEliminarColaborador,
                modalEliminarColaborador,
                eliminarColaborador,
                completarTarea,
                handleBuscador,
                buscador,
                submitTareasProyecto,
                eliminarTareaProyecto,
                actualizarTareaProyecto,
                cerrarSesionProyectos
            }}
        >
            {children}
        </ProyectoContext.Provider>
    )
}

export {
    ProyectoProvider
}

export default ProyectoContext