require('dotenv').config();
const puppeteer = require('puppeteer');
const Job = require('../models/job');
const { saveJobs } = require('./save-jobs');
const { dbConnection } = require('../database/config');
const e = require('express');

dbConnection();

//**************/
//* INFOEMPLEO *
//**************/

const infoempleo = async () => {
    try {
        const url = 'https://www.infoempleo.com/trabajo/';

        console.log('Launching browser...');
        const browser = await puppeteer.launch({ headless: 'new' });

        console.log('Creating new page...');
        const page = await browser.newPage();
        await page.setUserAgent("Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/66.0.3359.181 Safari/537.36");
        await page.setViewport({ width: 1920, height: 1080 });

        const response = await page.goto(url, [1000, { waitUntil: "domcontentloaded" }]);
        console.log(`Website loaded with status code ${response.status()}`);

        console.log('Click button cookies accept...');
        await page.waitForSelector('#onetrust-accept-btn-handler');
        await page.click('#onetrust-accept-btn-handler');

        console.log('Click input for hide modal...');
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

            await page.goto(enlace, [1000, { waitUntil: "domcontentloaded" }]);
            await page.waitForSelector('h1.regular');

            const jobs = await page.evaluate(() => {

                const job = {};
                job.titulo = document.querySelector('h1.regular')?.innerText;
                job.empresa = document.querySelector('.companyname>a:nth-child(1)')?.innerText;
                job.fechaCreacion = Date.now();
                job.url = '';
                job.fuente = 'Infoempleo';
                job.experiencia = document.querySelector('div.offer-excerpt>ul:nth-child(1)>li:nth-child(1)>p')?.innerText;
                job.salario = document.querySelector('div.offer-excerpt>ul:nth-child(1)>li:nth-child(2)>p')?.innerText;
                job.categoria = document.querySelector('div.offer-excerpt>ul:nth-child(2)>li:nth-child(2)>p')?.innerText;
                job.descripcion = document.querySelector('.offer')?.innerHTML;
                job.fechaPublicación = document.querySelector('.mt10')?.innerText;
                job.vacantes = document.querySelector('div.offer-excerpt>ul:nth-child(3)>li:nth-child(1)>p')?.innerText;
                job.inscritos = document.querySelector('div.offer-excerpt>ul:nth-child(3)>li:nth-child(2)>p')?.innerText;
                job.logo = 'https://res.cloudinary.com/dsidiwm77/image/upload/v1692266273/jobLogo/wmpyazfwjubrhtxrh0ud.svg';
                job.area = document.querySelector('div.offer-excerpt>ul:nth-child(2)>li:nth-child(1)>p')?.innerText;
                job.contrato = document.querySelector('div.offer-excerpt>ul:nth-child(4)>li:nth-child(1)>p')?.innerText;
                job.localidad = document.querySelector('.block')?.innerText;

                return job;
            });

            jobs.url = enlace ?? '';
            const existeTitulo = await Job.findOne({ titulo: jobs.titulo });

            if (jobs.titulo != null && !existeTitulo) {
                console.log('...ALMACENANDO NUEVO ITEMS EN DB');
                todasLasOfertas.push(jobs);
            }
        }
        await saveJobs(todasLasOfertas);

        await browser.close();
        console.log('Browser closed');

    } catch (error) {
        console.log('*** Ha habido un error inseperado la ejecución de la app ***', error.message);
    }
}


module.exports = {
    infoempleo
}