const { Date } = require('mongoose');
const { Schema, model } = require('mongoose');

const JobSchema = Schema({
    titulo: {
        type: String,
        required: [true, 'El titulo es obligatorio']
    },
    empresa: { type: String, default: 'Sin especificar', },
    fechaCreacion: { type: Date, },
    url: { type: String },
    fuente: { type: String },
    experiencia: { type: String, default: 'Sin especificar', },
    salario: { type: String, default: 'Sin especificar', },
    categoria: { type: String, default: 'Sin especificar', },
    subcategoria: { type: String, default: 'Sin especificar', },
    descripcion: { type: String, default: 'Sin especificar', },
    fechaPublicación: { type: String, default: 'Sin especificar', },
    vacantes: { type: String, default: 'Sin especificar', },
    inscritos: { type: String, default: 'Sin especificar', },
    logo: { type: String, default: 'Sin especificar', },
    area: { type: String, default: 'Sin especificar', },
    contrato: { type: String, default: 'Sin especificar', },
    localidad: { type: String, default: 'Sin especificar', },
    pais: { type: String, default: 'Sin especificar', },
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