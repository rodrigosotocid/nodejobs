const { response, request } = require('express');
const { ObjectId } = require('mongoose').Types;

const { Job } = require('../models');

const coleccionesPermitidas = [
    'jobs',
    'localidad',
];


const search = async (req = request, res = response) => {
    const { coleccion, termino = '' } = req.params;
    const { page = 1, limit = 20 } = req.query; // Añadir parámetros de paginación

    if (!coleccionesPermitidas.includes(coleccion)) {
        return res.status(400).json({
            msg: `Las colecciones permitidas son: ${coleccionesPermitidas}`
        });
    }

    switch (coleccion) {
        case 'jobs':
            await buscarJobs(termino, res, page, limit);
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
const buscarJobs = async (termino = '', res = response, page = 1, limit = 20) => {
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

    const skip = (page - 1) * limit;

    const [total, jobs] = await Promise.all([
        Job.countDocuments(query),
        Job.find(query).skip(skip).limit(limit)
    ]);

    res.json({
        total,
        results: jobs,
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages: Math.ceil(total / limit)
    });
}



// const buscarJobs = async (termino = '', res = response) => {
//     let query = {};

//     if (termino) {
//         const esMongoID = ObjectId.isValid(termino);

//         if (esMongoID) {
//             const job = await Job.findById(termino);

//             return res.json({
//                 total: job ? 1 : 0,
//                 results: job ? [job] : []
//             });
//         }

//         const terminoRegex = new RegExp(termino, 'i');
//         query = { titulo: terminoRegex };
//     }

//     const [total, jobs] = await Promise.all([
//         Job.countDocuments(query),
//         Job.find(query)
//     ]);

//     res.json({
//         total,
//         results: jobs
//     });
// }

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