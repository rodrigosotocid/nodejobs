require('dotenv').config();
const puppeteer = require('puppeteer');
const axios = require('axios');

const Job = require('../models/job');
const { saveJobs } = require('./save-jobs');
const { Infoempleo, Empleate, Indeed, Infojobs } = require('./job-scrapers/');

const { VIEWPORT, BROWSER_ARGS, NAV_CONFIG, PAGE_GOTO, URL_INFOJOBS, } = require('../helpers/constantes');
const { delay } = require('../helpers/funciones');
const Jobtoday = require('./job-scrapers/jobtoday');


//* 1 - GET INFOEMPLEO *//
async function obtenerInfoempleo() {
    try {
        console.log('[obtenerInfoempleo] - Start');
        await Infoempleo();
        console.log('[obtenerInfoempleo] - End');
    } catch (error) {
        console.error('Error al obtener información de Infoempleo:', error);
    }
}


//* 2 - GET EMPLEATE *//
async function obtenerEmpleate() {
    try {
        console.log('[obtenerEmpleate] - Start');
        await Empleate();
        console.log('[obtenerEmpleate] - End');
    } catch (error) {
        console.error('Error al obtener información de Empleate:', error);
    }
};

//* 3 - GET INDEED *//
async function obtenerIndeed() {
    try {
        console.log('[obtenerIndeed] - Start');
        await Indeed();
        console.log('[obtenerIndeed] - End');
    } catch (error) {
        console.error('Error al obtener información de Indeed:', error);
    }
};

//* 4 - GET JOBTODAY *//
async function obtenerJobtoday() {
    try {
        console.log('[obtenerJobtoday] - Start');
        await Jobtoday();
        console.log('[obtenerJobtoday] - End');
    } catch (error) {
        console.error('Error al obtener información de Jobtoday:', error);
    }
};

//* 5 - GET INFOJOBS *//
async function obtenerInfojobs() {
    try {
        console.log('[obtenerInfojobs] - Start');
        // await Infojobs();
        console.log('[obtenerInfojobs] - End');
    } catch (error) {
        console.error('Error al obtener información de Infojobs:', error);
    }
};


//* - Funcion que llama al controlador que desencadena tarea en WP
const ejecutaEndpointWpCron = async () => {
    axios.get('https://encuentratuempleo.es/?forzar_ejecucion=ahora')
        .then(response => {
            console.log(response.data);
        })
        .catch(error => {
            console.error(error);
        });
}




//*----------*//
//* INFOJOBS */
//*----------*//
const infoJobs2 = async () => {
    console.log('- Init App_02...');

    try {
        const browser = await puppeteer.launch({ headless: false });
        const page = await browser.newPage();
        await page.setUserAgent(NAV_CONFIG);
        await page.setViewport(VIEWPORT);
        const response = await page.goto(URL_INFOJOBS, PAGE_GOTO);
        console.log(`- Status code: ${response.status()}`);


        //* page evaluate
        const enlaces = await page.evaluate(() => {
            const links = [];
            const elements = document.querySelectorAll('.offerblock');

            for (const element of elements) {
                const link = element.querySelector('h2 a')?.href ?? null;
                if (link !== null) links.push(link);
            }
            return links;
        });

        await browser.close();
    } catch (error) {
        console.log('*** Error inesperado en App_02 ***', error.message);
    }
}





module.exports = {
    obtenerInfoempleo,
    obtenerEmpleate,
    obtenerIndeed,
    obtenerJobtoday,
    obtenerInfojobs,
    ejecutaEndpointWpCron,
}