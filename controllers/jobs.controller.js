const { response, request } = require('express');
const Job = require('../models/job');



//* ------------------ *//
//* Job GET Controller *//
//* ------------------ *//
const empleosGetAll = async (req = request, res = response) => {

    const { limite = 5, desde = 0, orden = -1 } = req.query;
    const query = { estado: true };
    const ordenQuery = { fechaCreacion: orden };

    debugger;

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
    console.log('[empleosDelete] - Ejecutando tarea de eliminación programada desde el controlador...');

    const days = req.query.days;


    if (!days || isNaN(Number(days))) {
        return res.status(400).json({
            message: '[empleosDelete] - El parámetro days debe ser un número válido.'
        });
    }

    // Calcula la fecha de corte para eliminar registros más antiguos que la cantidad de días especificada.
    const currentDate = new Date();
    currentDate.setDate(currentDate.getDate() - days);

    try {
        const result = await Job.deleteMany({
            fechaCreacion: {
                $lt: currentDate
            }
        });

        res.status(200).json({
            message: `[empleosDelete] - Se han eliminado ${result.deletedCount} registros con ${days} días o más de antigüedad.`,
            details: result
        });
    } catch (err) {
        res.status(500).json({
            message: `[empleosDelete] - Error al borrar registros con ${days} días o más de antigüedad.`,
            error: err
        });
    }
}

module.exports = {
    empleosGetAll,
    empleosDelete
}