const cron = require('node-cron');
const { infoempleo, empleate } = require('./empleo-index');
const { fechaHoraActual } = require('../helpers/helper-functions');
const { CRON_CADA_5_MINUTOS, CRON_CADA_7_DIAS, CRON_CADA_4_HORAS } = require('../helpers/const-strings');
const { Job } = require('../models');

//*---------------------------------------------*/
//* Tarea programada para ejecutar cada 4 horas
//*---------------------------------------------*/
const task = cron.schedule(CRON_CADA_4_HORAS, async () => {
    console.log('Ejecutando tarea programada...');

    try {
        console.log('\n** Task 01');
        await infoempleo();

        console.log('\n** Task 02');
        await empleate();

        console.log(`* ${fechaHoraActual()} - Tarea ejecutada y almacenada en DB.`);
    } catch (error) {
        console.error('Error al guardar el elemento:', error);
    }
}); // Fin de la tarea programada


//*---------------------------------------------*/
//* Tarea programada para ejecutar cada 7 días */
//*---------------------------------------------*/
const taskDeleteJob = cron.schedule(CRON_CADA_7_DIAS, async () => {
    const twoMonthsAgo = new Date();
    twoMonthsAgo.setMonth(twoMonthsAgo.getMonth() - 2);

    try {
        console.log(`\n* taskDeleteJob\n- recuperando registros antiguos de la DB...`);
        const result = await Job.deleteMany({
            fechaCreacion: {
                $lt: twoMonthsAgo
            }
        });
        console.log(`- ${result.deletedCount} registros antiguos eliminados`);
        return true;

    } catch (err) {
        console.log(err);
    }
});  // Fin de la tarea programada






module.exports = {
    task,
    taskDeleteJob
}