const { response, request } = require('express');
const Job = require('../models/job');



//* ------------------ *//
//* Job GET Controller *//
//* ------------------ *//
const empleosGetAll = async (req = request, res = response) => {

    const { limite = 5, desde = 0, orden = -1 } = req.query;
    const query = { estado: true };
    const ordenQuery = { fechaCreacion: orden };

    try {
        const [total, jobs] = await Promise.all([
            Job.countDocuments(query),
            Job.find(query)
                .skip(Number(desde))
                .limit(Number(limite))
                .sort(ordenQuery)
        ]);

        res.status(200).json({
            total,
            jobs
        })
    } catch (err) {
        res.status(500).json({
            message: 'Error al obtener los registros',
            error: err
        });
    }
}

//* --------------------- *//
//* Job DELETE Controller *
//* --------------------- *//
const empleosDelete = async (req = request, res = response) => {
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

    const twoMonthsAgo = new Date();
    twoMonthsAgo.setMonth(twoMonthsAgo.getMonth() - 2);

    try {
        const result = await Job.deleteMany({
            fechaCreacion: {
                $lt: twoMonthsAgo
            }
        });

        res.status(200).json({
            message: 'Registros antiguos eliminados',
            details: result
        });
    } catch (err) {
        res.status(500).json({
            message: 'Error al borrar registros',
            error: err
        });
    }
}

module.exports = {
    empleosGetAll,
    empleosDelete
}