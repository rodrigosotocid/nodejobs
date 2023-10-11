const { response, request } = require('express');
const axios = require('axios');
const { obtenerInfoempleo, obtenerEmpleate, obtenerIndeed, infoJobs, ejecutaEndpointWpCron, } = require('../app/empleo-index');
const { URL_WP_CRON } = require('../helpers/constantes');
const { fechaHoraActual } = require('../helpers/funciones');
const { executeControllerWPCron } = require('../app/task-execute');

//* ----------------------------- *//
//* Job MANUAL EXECUTE Controller *//
//* ----------------------------- *//
const executeJobs = async (req = request, res = response) => {
    console.log('[executeJobs] - Execute task from Controller...');
    try {

        console.log('\n[executeJobs] - Task 01 - Controller');
        await obtenerInfoempleo();

        console.log('\n[executeJobs] - Task 02 - Controller');
        await obtenerEmpleate();

        console.log('\n[executeJobs] - Task 03 - Controller');
        await obtenerIndeed();

        // console.log('\n** Task 03 - Controller');

        // console.log('** Task - Ejecutando endpoint WP-CRON');
        // await executeControllerWPCron();
        // console.log('** FIN - Ejecutando endpoint WP-CRON');


        return res.status(200).json({
            msg: '[executeJobs] - Items recuperados: ** OK **',
            time: fechaHoraActual()
        })

    } catch (error) {
        res.status(500).json({
            message: '[executeJobs] - Error al ejecutar manualmente los jobs',
            error: error,
            time: fechaHoraActual()
        });
    }
    console.log('[executeJobs] - END Execute task from Controller...');
}

//* ----------------------------------- *//
//* executeTaskWordPressCron Controller *//
//* ----------------------------------- *//

// const executeTaskWordPressCron = async (req = request, res = response) => {
//     try {
//         // Realizar una solicitud interna a la URL de tu sitio WordPress para ejecutar la tarea de importación
//         const response = await axios.get('https://encuentratuempleo.es/wp-cron.php?ejecutar_tarea=mi_tarea_programada');
//         console.log('Ejecutando tarea de importación de trabajos en WordPress...');

//         res.status(200).json({
//             msg: 'executeTaskWordPressCron Controller: Tarea de importación de trabajos ejecutada en WordPress.',
//             response: response.data
//         });

//     } catch (error) {
//         console.error(error);

//         res.status(500).json({
//             msg: 'Error al ejecutar la tarea de importación de trabajos en WordPress.',
//             error
//         });
//     }
// }





module.exports = {
    executeJobs,
    // executeTaskWordPressCron
}