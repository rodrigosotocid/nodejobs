const cron = require('node-cron');
const axios = require('axios');
const { obtenerInfoempleo, obtenerEmpleate, obtenerIndeed } = require('./empleo-index');
const { fechaHoraActual } = require('../helpers/funciones');
const {
    CRON_CADA_1_MINUTO,
    CRON_CADA_5_MINUTOS,
    CRON_CADA_7_DIAS,
    CRON_CADA_4_HORAS,
    URL_WP_CRON
} = require('../helpers/constantes');
const { Job } = require('../models');

//*---------------------------------------------*/
//* Tarea programada para ejecutar cada 4 horas
//*---------------------------------------------*/
const task = cron.schedule(CRON_CADA_1_MINUTO, async () => {
    console.log('\n[task] - Ejecutando tarea programada...');

    try {
        console.log('[task] - Task 01');
        await obtenerInfoempleo();

        console.log('[task] - Task 02');
        await obtenerEmpleate();

        console.log('[task] - Task 03');
        await obtenerIndeed();

        // console.log('** Task - Ejecutando endpoint WP-CRON');
        // await executeTaskWordPressCron();

        console.log(`[task] - Tarea ejecutada y almacenada en la BD el ${fechaHoraActual()}.`);
        return;
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
    const twoMonthsAgo = new Date();
    twoMonthsAgo.setMonth(twoMonthsAgo.getMonth() - 2);

    try {
        console.log(`[taskDeleteJob] - recuperando registros antiguos de la DB...`);
        const result = await Job.deleteMany({
            fechaCreacion: {
                $lt: twoMonthsAgo
            }
        });
        console.log(`[taskDeleteJob] - ${result.deletedCount} registros antiguos eliminados`);
        return true;

    } catch (err) {
        console.log(err);
    }
    console.log('[taskDeleteJob] - FIN tarea de eliminación programada...');
});  // Fin de la tarea programada


// const executeControllerWPCron = async () => {
//     console.log('** executeTaskWordPressCron **');
//     try {
//         await axios.get('http://localhost:8080/api/ejecutar-wp-cron')
//             .then(response => {
//                 console.log(response.data);
//             }).catch(error => {
//                 console.error(error);
//             });

//     } catch (error) {
//         console.error(error);
//     }
// }



module.exports = {
    task,
    taskDeleteJob,
    // executeControllerWPCron
}