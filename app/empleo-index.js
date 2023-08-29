require('dotenv').config();
const puppeteer = require('puppeteer');
const Job = require('../models/job');
const { saveJobs } = require('./save-jobs');
const { dbConnection } = require('../database/config');
const {
    URL_INFOEMPLEO,
    VIEWPORT,
    BROWSER_ARGS,
    NAV_CONFIG,
    PAGE_GOTO
} = require('../helpers/const-strings');

// dbConnection();

//**************/
//* INFOEMPLEO *
//**************/

const infoempleo = async () => {
    try {
        console.log('- Init App_01...');
        const browser = await puppeteer.launch(BROWSER_ARGS);
        const page = await browser.newPage();
        await page.setUserAgent(NAV_CONFIG);
        await page.setViewport(VIEWPORT);

        const response = await page.goto(URL_INFOEMPLEO, PAGE_GOTO);
        console.log(`- Status code: ${response.status()}`);

        await page.waitForSelector('#onetrust-accept-btn-handler');
        await page.click('#onetrust-accept-btn-handler');
        await page.click('#search');

        // page evaluate
        const enlaces = await page.evaluate(() => {
            const links = [];
            const elements = document.querySelectorAll('.offerblock');

            for (const element of elements) {
                const link = element.querySelector('h2 a')?.href ?? null;
                if (link !== null) links.push(link);
            }
            return links;
        });

        const todasLasOfertas = [];

        for (const enlace of enlaces) {

            await page.goto(enlace, PAGE_GOTO);
            await page.waitForSelector('h1.regular');

            const jobs = await page.evaluate(() => {

                const job = {};
                job.titulo = document.querySelector('h1.regular')?.innerText;
                job.empresa = document.querySelector('.companyname>a:nth-child(1)')?.innerText ?? '';
                job.fechaCreacion = Date.now();
                job.url = '';
                job.fuente = 'Infoempleo';
                job.experiencia = document.querySelector('div.offer-excerpt>ul:nth-child(1)>li:nth-child(1)>p')?.innerText;
                job.salario = document.querySelector('div.offer-excerpt>ul:nth-child(1)>li:nth-child(2)>p')?.innerText;
                job.categoria = document.querySelector('div.offer-excerpt>ul:nth-child(2)>li:nth-child(2)>p')?.innerText;
                job.descripcion = document.querySelector('.offer')?.innerHTML;
                job.descripcion = job.descripcion.replace(/\sclass="[^"]*"/g, '').replace(/<pre>/g, '<p>').replace(/<\/pre>/g, '</p>');
                // job.descripcion = job.descripcion.replace(/<\/?[^>]+(>|$)/g, "");
                job.fechaPublicación = document.querySelector('.mt10')?.innerText;
                job.fechaPublicación = job.fechaPublicación.trimStart();
                job.vacantes = document.querySelector('div.offer-excerpt>ul:nth-child(3)>li:nth-child(1)>p')?.innerText;
                job.inscritos = document.querySelector('div.offer-excerpt>ul:nth-child(3)>li:nth-child(2)>p')?.innerText;
                job.logo = 'https://res.cloudinary.com/dsidiwm77/image/upload/v1692266273/jobLogo/wmpyazfwjubrhtxrh0ud.svg';
                job.area = document.querySelector('div.offer-excerpt>ul:nth-child(2)>li:nth-child(1)>p')?.innerText;
                job.contrato = document.querySelector('div.offer-excerpt>ul:nth-child(4)>li:nth-child(1)>p')?.innerText;
                job.localidad = document.querySelector('.block')?.innerText;
                job.localidad = job.localidad.trimStart();

                return job;
            });

            jobs.url = enlace ?? '';
            const existeTitulo = await Job.findOne({ titulo: jobs.titulo });
            if (jobs.titulo != null && !existeTitulo) todasLasOfertas.push(jobs);
        }
        console.log(`- Total a guardar: <<${todasLasOfertas.length} items>>`);
        if (todasLasOfertas.length > 0) await saveJobs(todasLasOfertas);

    } catch (error) {
        console.log('*** Error inesperado en App_01 ***', error.message);
    }
    console.log('End App_01');
}


//************/
//* INFOJOBS */
//************/
const infoJobs = async () => {
    try {
        console.log('App-02');
    } catch (error) {
        console.log('*** Error inesperado en App-02 ***', error.message);
    }
}



module.exports = {
    infoempleo,
    infoJobs
}