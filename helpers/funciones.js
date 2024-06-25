

const fechaHoraActual = () => {

    let fechaFormateada = new Date();
    let fechaFormateadaString = fechaFormateada.toLocaleString('es-ES', { timeZone: 'Europe/Madrid' });

    return fechaFormateadaString;
}// Formatear la fecha a formato español}

const mostrarHoraActual = (prefix = 'Hora actual') => {
    // Crear una nueva instancia del objeto Date
    const ahora = new Date();

    // Obtener las horas, minutos y segundos actuales
    const horas = ahora.getHours();
    const minutos = ahora.getMinutes();
    const segundos = ahora.getSeconds();

    // Formatear la hora como HH:MM:SS
    const horaFormateada = `${horas.toString().padStart(2, '0')}:${minutos.toString().padStart(2, '0')}:${segundos.toString().padStart(2, '0')}`;

    // Mostrar la hora formateada en la consola
    console.log(`${prefix} - ${horaFormateada}`);
}

const obtenerFechaHoy = () => {

    // Crear una nueva instancia del objeto Date
    const ahora = new Date();

    // Obtener el día, mes y año actuales
    const dia = ahora.getDate();
    const mes = ahora.getMonth() + 1; // Los meses en JavaScript son 0-indexados
    const anio = ahora.getFullYear();

    // Formatear el día y el mes para que siempre tengan dos dígitos
    const diaFormateado = dia.toString().padStart(2, '0');
    const mesFormateado = mes.toString().padStart(2, '0');

    // Crear la fecha formateada
    const fechaFormateada = `${diaFormateado}/${mesFormateado}/${anio}`;

    return fechaFormateada;
}

const validarFecha = (fecha) => {
    // Expresión regular para verificar el formato DD/MM/YYYY
    const regex = /^\d{2}\/\d{2}\/\d{4}$/;
    // Si la fecha no coincide con el formato, devolver la fecha actual
    if (!regex.test(fecha)) {
        return obtenerFechaHoy();
    }
    return fecha;
}

const delay = (time) => {
    return new Promise(function (resolve) {
        setTimeout(resolve, time)
    });
}

const obtenerUltimaParte = (cadena) => {
    const partes = cadena.split(',');
    return partes.length > 1 ? partes[partes.length - 1].trim() : cadena;
}

module.exports = {
    fechaHoraActual,
    mostrarHoraActual,
    obtenerFechaHoy,
    validarFecha,
    delay,
    obtenerUltimaParte,
}