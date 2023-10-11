const setupBrowser = require('../browser-setup');
const Job = require('../../models/job');
const { saveJobs } = require('../save-jobs');
const { URL_EMPLEATE, PAGE_GOTO } = require('../../helpers/constantes');
const { delay } = require('../../helpers/funciones');



const indeed = async () => {
    console.log('[indeed] - Init...');
    const { browser, page } = await setupBrowser();
    const todasLasOfertas = [];
    console.log('[indeed] - End...');
};


module.exports = indeed;