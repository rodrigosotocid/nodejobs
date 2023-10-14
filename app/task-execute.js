const cron = require('node-cron');
const axios = require('axios');
const { obtenerInfoempleo, obtenerEmpleate, obtenerIndeed } = require('./empleo-index');
const { fechaHoraActual } = require('../helpers/funciones');
const {
    CRON_CADA_1_MINUTO,
    CRON_CADA_5_MINUTOS,
    CRON_CADA_3_HORAS,
    CRON_CADA_4_HORAS,
    CRON_CADA_7_DIAS,
    URL_WP_CRON,
    URL_WP_POST_CREATE
} = require('../helpers/constantes');
const { Job } = require('../models');
const { sendJobsPostToWP } = require('../controllers/executejobs.controller');

//*---------------------------------------------*/
//* Tarea programada para ejecutar cada 4 horas
//*---------------------------------------------*/
const task = cron.schedule(CRON_CADA_4_HORAS, async () => {
    console.log('\n[task] - Ejecutando tarea programada...');

    try {
        console.log('[task] - Task 01');
        await obtenerInfoempleo();

        console.log('[task] - Task 02');
        await obtenerEmpleate();

        console.log('[task] - Task 03');
        await obtenerIndeed();

        console.log(`[task] - Tarea ejecutada y almacenada en la BD el ${fechaHoraActual()}.`);
    } catch (error) {
        console.error('[task] - Error al guardar el elemento:', error);
    }
    console.log('[task] - FIN ejecución tarea programada...');
}); // Fin de la tarea programada


//*---------------------------------------------*/
//* Tarea programada para ejecutar cada 7 días */
//*---------------------------------------------*/
const taskDeleteJob = cron.schedule(CRON_CADA_7_DIAS, async () => {
    console.log('[taskDeleteJob] - Ejecutando tarea de eliminación programada...');

    const days = 60;

    if (!days || isNaN(Number(days))) {
        console.log('[taskDeleteJob] - El valor days debe ser un número válido.');
        return;
    }

    // Calcula la fecha de corte para eliminar registros más antiguos que la cantidad de días especificada.
    const currentDate = new Date();
    currentDate.setDate(currentDate.getDate() - days);

    try {
        console.log(`[taskDeleteJob] - recuperando registros antiguos de la DB...`);
        const result = await Job.deleteMany({
            fechaCreacion: {
                $lt: currentDate
            }
        });
        console.log(`[taskDeleteJob] - Se han eliminado ${result.deletedCount} registros con ${days} días o más de antigüedad.`);
        return true;

    } catch (err) {
        console.log(err);
    }
    console.log('[taskDeleteJob] - FIN tarea de eliminación programada...');
});  // Fin de la tarea programada


//*-------------------------------------------------------*/
//* Programa la ejecución cada 3 horas (cada 180 minutos) */
//*-------------------------------------------------------*/

const taskCreaPostWP = cron.schedule(CRON_CADA_3_HORAS, async () => {
    console.log('\n[taskCreaPostWP] - Ejecutando tarea programada...');
    try {
        const response = await axios.get(URL_WP_POST_CREATE);
        console.log(`[taskCreaPostWP] - Status Task ${response.statusText}`);
    } catch (error) {
        console.error('[taskCreaPostWP] - Error en tarea programada:', error);
    }
    console.log(`[taskCreaPostWP] - FIN tarea programada... ${fechaHoraActual()}.`);
});




module.exports = {
    task,
    taskDeleteJob,
    taskCreaPostWP,
}