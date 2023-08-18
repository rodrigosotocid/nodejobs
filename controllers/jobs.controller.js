const { response, request } = require('express');
const Job = require('../models/job');



//* Job GET Controller
const empleosGetAll = async (req = request, res = response) => {

    const { limite = 5, desde = 0 } = req.query;
    const query = { estado: true };

    const [total, jobs] = await Promise.all([
        Job.countDocuments(query),
        Job.find(query)
            .skip(Number(desde))
            .limit(Number(limite))
    ]);

    res.json({
        total,
        jobs
    })
}

module.exports = {
    empleosGetAll
}