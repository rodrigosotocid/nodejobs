const Job = require('../models/job');
const axios = require('axios');


const saveJobs = async (jobsArray) => {
    console.log('[saveJobs] - Init...');
    try {
        const result = await Job.insertMany(jobsArray);
        console.log('[saveJobs] - saveJobs executed!');

        // await insertarDatosEnSupabase(jobsArray);
        // console.log('[saveJobs] - insertarDatosEnSupabase executed!');

        return result;

    } catch (error) {
        console.error('[saveJobs] - Error saving jobs:', error);
        throw error;
    }
};

const insertarDatosEnSupabase = async (datos) => {

    console.log('[insertarDatosEnSupabase] - Init...');

    const SUPABASE_URL = process.env.SUPABASE_URL;
    const SUPABASE_KEY = process.env.SUPABASE_KEY;

    // Eliminar el campo 'fechaCreacion' de cada objeto en el array
    const datosSinFechaCreacion = datos.map(({ fechaCreacion, ...resto }) => resto);

    // Obtener todas las claves posibles de los objetos en el array
    const todasLasClaves = [...new Set(datosSinFechaCreacion.flatMap(Object.keys))];

    // Asegurarse de que todos los objetos tengan las mismas claves
    const datosAjustados = datosSinFechaCreacion.map(obj => {
        const objAjustado = {};
        todasLasClaves.forEach(clave => {
            objAjustado[clave] = obj[clave] !== undefined ? obj[clave] : null;
        });
        return objAjustado;
    });

    try {
        const response = await axios.post(SUPABASE_URL, datosAjustados, {
            headers: {
                'apikey': SUPABASE_KEY,
                'Authorization': `Bearer ${SUPABASE_KEY}`,
                'Content-Type': 'application/json'
            }
        });
        console.log('[insertarDatosEnSupabase] Datos insertados exitosamente:', response.data);

    } catch (error) {
        console.error('[insertarDatosEnSupabase] Error al insertar los datos:', error.response ? error.response.data : error.message);
    }
    console.log('[insertarDatosEnSupabase] - End');
};

module.exports = {
    saveJobs,
    insertarDatosEnSupabase,
};
