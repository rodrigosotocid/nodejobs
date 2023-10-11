const { response, request } = require('express');
const axios = require('axios');
const { obtenerInfoempleo, obtenerEmpleate, obtenerIndeed, infoJobs, } = require('../app/empleo-index');
const { URL_WP_POST_CREATE } = require('../helpers/constantes');
const { fechaHoraActual } = require('../helpers/funciones');

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

//* --------------------------- *//
//* sendJobsPostToWP Controller *//
//* --------------------------- *//

const sendJobsPostToWP = async (req = request, res = response) => {
    console.log('[sendJobsPostToWP] - Ejecutando tarea de importación de trabajos en WordPress...');
    try {
        // Realizar una solicitud interna a la URL de tu sitio WordPress para ejecutar la tarea de importación
        const response = await axios.get(URL_WP_POST_CREATE);

        res.status(200).json({
            msg: '[sendJobsPostToWP] - Tarea de importación de trabajos ejecutada en WordPress.',
            status: response.status,
            statusText: response.statusText,
        });

    } catch (error) {
        console.error(`[sendJobsPostToWP] - ${error}`);

        res.status(500).json({
            msg: '[sendJobsPostToWP] - Error al ejecutar la tarea de importación de trabajos en WordPress.',
            status: response.status,
            error,
        });
    }
    console.log('[sendJobsPostToWP] - End...');
}


module.exports = {
    executeJobs,
    sendJobsPostToWP
}