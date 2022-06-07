export const formatearFecha = fecha => {
    const nuevaFecha = new Date(fecha)

    const opciones = {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    }
    return nuevaFecha.toLocaleDateString('es-ES', opciones).substring(0,1).toLocaleUpperCase() + nuevaFecha.toLocaleDateString('es-ES', opciones).substring(1)
}