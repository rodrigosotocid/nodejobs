

const fechaHoraActual = () => {

    let fechaFormateada = new Date();
    let fechaFormateadaString = fechaFormateada.toLocaleString('es-ES', { timeZone: 'Europe/Madrid' });

    return fechaFormateadaString;
}// Formatear la fecha a formato español}


const delay = (time) => {
    return new Promise(function (resolve) {
        setTimeout(resolve, time)
    });
}


module.exports = {
    fechaHoraActual,
    delay
}