const { response, request } = require('express');
const Job = require('../models/job');
const { infoempleo } = require('../app/empleo-index');


//* Job MANUAL EXECUTE Controller
const executeJobs = async (req = request, res = response) => {

    await infoempleo();

    res.json({
        msg: '** Execute Jobs OK **',
    })
}

module.exports = {
    executeJobs
}