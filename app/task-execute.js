const cron = require('node-cron');
const { infoempleo, infoJobs } = require('./empleo-index');
const { fechaHoraActual } = require('../helpers/date-format');

//*---------------------------------------------*/
//* Tarea programada para ejecutar cada 4 horas
//*---------------------------------------------*/
const task = cron.schedule('0 0 */4 * * *', async () => {
    try {
        console.log('Ejecutando tarea programada...');

        console.log('\n* Task App-01');
        await infoempleo();

        console.log('\n* Task App-02');
        await infoJobs();


        console.log(`* ${fechaHoraActual()} - Tarea ejecutada y almacenada en DB.`);
    } catch (error) {
        console.error('Error al guardar el elemento:', error);
    }
}); // Fin de la tarea programada

module.exports = {
    task
}