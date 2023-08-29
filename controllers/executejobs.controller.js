const { response, request } = require('express');
const { infoempleo, infoJobs } = require('../app/empleo-index');

//* ----------------------------- *//
//* Job MANUAL EXECUTE Controller *//
//* ----------------------------- *//
const executeJobs = async (req = request, res = response) => {

    try {
        console.log('\n* Task App-01 - Controller');
        await infoempleo();

        console.log('\n* Task App-02 - Controller');
        await infoJobs();

        res.status(200).json({
            msg: '** Execute Jobs OK **',
        })
    } catch (error) {
        res.status(500).json({
            message: 'Error al ejecutar manualmente los jobs',
            error: error
        });
    }
}




module.exports = {
    executeJobs
}