const { response, request } = require('express');
const axios = require('axios');
const { obtenerInfoempleo, obtenerEmpleate, obtenerIndeed, obtenerInfojobs, } = require('../app/empleo-index');
const { URL_WP_POST_CREATE } = require('../helpers/constantes');
const { fechaHoraActual } = require('../helpers/funciones');


//* Job MANUAL EXECUTE Controller *//
const executeJobs = async (req = request, res = response) => {
    var prefix = "[executeJobs]";
    console.log(`${prefix} - Execute task from Controller...`);
    try {

        console.log(`\n${prefix} - Controller Task 01 [obtenerInfoempleo]`);
        await obtenerInfoempleo();

        console.log(`\n${prefix} - Controller Task 02 [obtenerEmpleate]`);
        await obtenerEmpleate();

        console.log(`\n${prefix} - Controller Task 03 [obtenerIndeed]`);
        await obtenerIndeed();

        // console.log(`\n${prefix} - Controller Task 04 [obtenerInfojobs]`);
        // await obtenerInfojobs();

        return res.status(200).json({
            msg: `${prefix} - Items recuperados: ** OK **`,
            time: fechaHoraActual()
        })

    } catch (error) {
        res.status(500).json({
            message: `${prefix} - Error al ejecutar manualmente los jobs`,
            error: error,
            time: fechaHoraActual()
        });
    }
    console.log(`${prefix} - END Execute task from Controller...`);
}


//* sendJobsPostToWP Controller *//
const sendJobsPostToWP = async (req = request, res = response) => {
    console.log('[sendJobsPostToWP] - Ejecutando tarea de importación de trabajos en WordPress...');
    try {
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