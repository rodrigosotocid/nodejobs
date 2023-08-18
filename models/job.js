const { Date } = require('mongoose');
const { Schema, model } = require('mongoose');

const JobSchema = Schema({
    titulo: {
        type: String,
        required: [true, 'El titulo es obligatorio']
    },
    empresa: {
        type: String,
    },
    fechaCreacion: {
        type: Date,
    },
    url: {
        type: String
    },
    fuente: {
        type: String
    },
    experiencia: { type: String },
    salario: { type: String },
    categoria: { type: String },
    descripcion: { type: String },
    fechaPublicación: { type: String },
    vacantes: { type: String },
    inscritos: { type: String },
    logo: { type: String },
    area: { type: String },
    contrato: { type: String },
    localidad: { type: String },
    estado: {
        type: Boolean,
        default: true,
        required: true
    },
});


JobSchema.methods.toJSON = function () {
    const { __v, ...job } = this.toObject();
    return job;
}

module.exports = model('Job', JobSchema);