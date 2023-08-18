const cron = require('node-cron');
const { infoempleo } = require('./empleo-index');
const { fechaHoraActual } = require('../helpers/date-format');


// Tarea programada para ejecutar cada 6 horas
const task = cron.schedule('0 0 */6 * * *', async () => {
    try {
        console.log('Ejecutando tarea programada...');

        await infoempleo();


        console.log(`* ${fechaHoraActual()} - Tarea ejecutada y almacenada en DB.`);
    } catch (error) {
        console.error('Error al guardar el elemento:', error);
    }
}); // Fin de la tarea programada

module.exports = {
    task
}