const { response, request } = require('express');
const { ObjectId } = require('mongoose').Types;

const { Job } = require('../models');

const coleccionesPermitidas = [
    'jobs',
    'localidad',
];


const search = async (req = request, res = response) => {
    const { coleccion, termino = '' } = req.params;

    if (!coleccionesPermitidas.includes(coleccion)) {
        return res.status(400).json({
            msg: `Las colecciones permitidas son: ${coleccionesPermitidas}`
        });
    }

    switch (coleccion) {
        case 'jobs':
            buscarJobs(termino, res);
            break;
        case 'localidad':
            buscarJobsLocalidad(termino, res);
            break;
        default:
            res.status(500).json({
                msg: 'Búsqueda no existente!'
            });
    }
}

//*------------*//
//* buscarJobs
//*------------*//
const buscarJobs = async (termino = '', res = response) => {
    let query = {};

    if (termino) {
        const esMongoID = ObjectId.isValid(termino);

        if (esMongoID) {
            const job = await Job.findById(termino);

            return res.json({
                total: job ? 1 : 0,
                results: job ? [job] : []
            });
        }

        const terminoRegex = new RegExp(termino, 'i');
        query = { titulo: terminoRegex };
    }

    const [total, jobs] = await Promise.all([
        Job.countDocuments(query),
        Job.find(query)
    ]);

    res.json({
        total,
        results: jobs
    });
}

//*--------------------*//
//* buscarJobsLocalidad
//*--------------------*//

const buscarJobsLocalidad = async (termino = '', res = response) => {
    const esMongoID = ObjectId.isValid(termino);

    if (esMongoID) {
        const job = await Job.findById(termino);

        return res.json({
            total: (job) ? 1 : 0,
            results: (job) ? [job] : []
        });
    }

    const terminoRegex = new RegExp(termino, 'i');

    const query = {
        localidad: terminoRegex,
    };

    const [total, job] = await Promise.all([
        Job.countDocuments(query),
        Job.find(query)
    ]);

    res.json({
        total,
        results: job
    });
}

module.exports = {
    search
}