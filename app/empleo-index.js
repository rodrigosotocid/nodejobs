require('dotenv').config();
const puppeteer = require('puppeteer');
const axios = require('axios');

const Job = require('../models/job');
const { saveJobs } = require('./save-jobs');
const { Infoempleo, Empleate, Indeed } = require('./job-scrapers/');

const {
    URL_INFOEMPLEO,
    VIEWPORT,
    BROWSER_ARGS,
    NAV_CONFIG,
    PAGE_GOTO,
    URL_INFOJOBS,
    URL_INDEED,
    URL_EMPLEATE,
} = require('../helpers/constantes');
const { delay } = require('../helpers/funciones');


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

//* Funcion que llama al controlador que desencadena tarea en WP
const ejecutaEndpointWpCron = async () => {
    axios.get('https://encuentratuempleo.es/?forzar_ejecucion=ahora')
        .then(response => {
            console.log(response.data);
        })
        .catch(error => {
            console.error(error);
        });
}



//*--------*//
//* INDEED *//
//*--------*//

// const indeed = async () => {
//     console.log('- Init App_03...');
//     const todasLasOfertas = [];

//     try {
//         const browser = await puppeteer.launch({ headless: false });
//         const page = await browser.newPage();
//         await page.setUserAgent(NAV_CONFIG);
//         await page.setViewport(VIEWPORT);
//         const response = await page.goto(URL_INDEED, PAGE_GOTO);
//         console.log(`- Status code: ${response.status()}`);


//         //* page evaluate
//         const enlaces = await page.evaluate(() => {
//             const links = [];
//             const elements = document.querySelectorAll('.animated-fast.fadeIn.ng-scope');

//             for (const element of elements) {
//                 const link = element.querySelector('h2 a')?.href ?? null;
//                 alert(link);
//                 if (link !== null) links.push(link);
//             }
//             return links;
//         });


//         for (const enlace of enlaces) {

//             await page.goto(enlace, PAGE_GOTO);
//             // await page.waitForSelector('h1.regular');

//             const jobs = await page.evaluate(() => {

//                 const job = {};
//                 job.titulo = document.querySelector('h1 span')?.innerText;
//                 console.log(job.titulo);
//                 // job.empresa = document.querySelector('.companyname>a:nth-child(1)')?.innerText ?? '';
//                 job.fechaCreacion = Date.now();
//                 job.url = '';
//                 job.fuente = 'Indeed';
//                 // job.experiencia = document.querySelector('div.offer-excerpt>ul:nth-child(1)>li:nth-child(1)>p')?.innerText;
//                 // job.salario = document.querySelector('div.offer-excerpt>ul:nth-child(1)>li:nth-child(2)>p')?.innerText;
//                 // job.categoria = document.querySelector('div.offer-excerpt>ul:nth-child(2)>li:nth-child(2)>p')?.innerText;
//                 // job.descripcion = document.querySelector('.offer')?.innerHTML;
//                 // job.descripcion = job.descripcion.replace(/\sclass="[^"]*"/g, '').replace(/<pre>/g, '<p>').replace(/<\/pre>/g, '</p>');
//                 // job.descripcion = job.descripcion.replace(/<\/?[^>]+(>|$)/g, "");
//                 // job.fechaPublicacion = document.querySelector('.mt10')?.innerText;
//                 // job.fechaPublicacion = job.fechaPublicacion.trimStart();
//                 // job.vacantes = document.querySelector('div.offer-excerpt>ul:nth-child(3)>li:nth-child(1)>p')?.innerText;
//                 // job.inscritos = document.querySelector('div.offer-excerpt>ul:nth-child(3)>li:nth-child(2)>p')?.innerText;
//                 job.logo = 'https://res.cloudinary.com/dsidiwm77/image/upload/v1692266273/jobLogo/wmpyazfwjubrhtxrh0ud.svg';
//                 // job.area = document.querySelector('div.offer-excerpt>ul:nth-child(2)>li:nth-child(1)>p')?.innerText;
//                 // job.contrato = document.querySelector('div.offer-excerpt>ul:nth-child(4)>li:nth-child(1)>p')?.innerText;
//                 // job.localidad = document.querySelector('.block')?.innerText;
//                 // job.localidad = job.localidad.trimStart();

//                 return job;
//             });

//             jobs.url = enlace ?? '';
//             const existeTitulo = await Job.findOne({ titulo: jobs.titulo });
//             if (jobs.titulo != null && !existeTitulo) todasLasOfertas.push(jobs);
//         }
//         console.log(`- Total a guardar: <<${todasLasOfertas.length} items>>`);
//         // if (todasLasOfertas.length > 0) await saveJobs(todasLasOfertas);

//         await browser.close();
//     } catch (error) {
//         console.log('*** Error inesperado en App_03 ***', error.message);
//     }
// }

//*----------*//
//* INFOJOBS */
//*----------*//
const infoJobs = async () => {
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
    infoJobs,
    ejecutaEndpointWpCron,
}