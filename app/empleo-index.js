require('dotenv').config();
const puppeteer = require('puppeteer');
const Job = require('../models/job');
const { saveJobs } = require('./save-jobs');

const { URL_INFOEMPLEO, VIEWPORT, BROWSER_ARGS, NAV_CONFIG, PAGE_GOTO, URL_INFOJOBS, URL_INDEED, URL_EMPLEATE, URL_EMPLEATE_PAG2 } = require('../helpers/const-strings');
const { delay } = require('../helpers/helper-functions');


//*----------------*//
//* 1 - INFOEMPLEO *//
//*----------------*//

const infoempleo = async () => {
    console.log('- Init...');

    try {
        const todasLasOfertas = [];
        const browser = await puppeteer.launch(BROWSER_ARGS);
        const page = await browser.newPage();
        await page.setUserAgent(NAV_CONFIG);
        await page.setViewport(VIEWPORT);

        const response = await page.goto(URL_INFOEMPLEO, PAGE_GOTO);
        console.log(`- Status ${response.status()}`);

        await page.waitForSelector('#onetrust-accept-btn-handler');
        await page.click('#onetrust-accept-btn-handler');
        await page.click('#search');

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
        console.log(`- <<${enlaces.length} enlaces recuperados>>`);

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
                job.fechaPublicacion = document.querySelector('.mt10')?.innerText;
                job.fechaPublicacion = job.fechaPublicacion.trimStart();
                job.vacantes = document.querySelector('div.offer-excerpt>ul:nth-child(3)>li:nth-child(1)>p')?.innerText;
                job.inscritos = document.querySelector('div.offer-excerpt>ul:nth-child(3)>li:nth-child(2)>p')?.innerText;
                job.logo = 'https://res.cloudinary.com/dsidiwm77/image/upload/v1692266273/jobLogo/wmpyazfwjubrhtxrh0ud.svg';
                job.area = document.querySelector('div.offer-excerpt>ul:nth-child(2)>li:nth-child(1)>p')?.innerText;
                job.contrato = document.querySelector('div.offer-excerpt>ul:nth-child(4)>li:nth-child(1)>p')?.innerText;
                job.localidad = document.querySelector('.block')?.innerText;
                job.localidad = job.localidad.trimStart();
                job.pais = 'España';

                return job;
            });
            if (jobs.titulo == null || jobs.titulo.trim() === '') continue;

            jobs.url = enlace ?? '';
            const existeTitulo = await Job.findOne({ titulo: jobs.titulo });
            if (jobs.titulo != null && !existeTitulo) todasLasOfertas.push(jobs);
        }
        console.log(`- Total a guardar: <<${todasLasOfertas.length} items>>`);
        if (todasLasOfertas.length > 0) await saveJobs(todasLasOfertas);

        await browser.close();
    } catch (error) {
        console.log('*** Error inesperado en App_01 ***', error.message);
    }
    console.log('- End Task 01');
}

//*--------------*//
//* 2 - EMPLEATE *//
//*--------------*//
const empleate = async () => {
    console.log('- Init...');
    try {
        const todasLasOfertas = [];
        const browser = await puppeteer.launch(BROWSER_ARGS);
        // const browser = await puppeteer.launch({ headless: false });

        const context = browser.defaultBrowserContext();
        // Anular permisos para la ubicación geográfica
        await context.overridePermissions(URL_EMPLEATE, ['geolocation']);

        const page = await browser.newPage();

        // Configurar la geolocalización a null
        // await page.setGeolocation({ latitude: null, longitude: null });

        await page.setUserAgent(NAV_CONFIG);
        await page.setViewport(VIEWPORT);


        //* Escuchar el evento dialog y descartarlo (dismiss)
        page.on('dialog', async dialog => {
            console.log(`Se encontró un diálogo: ${dialog.message()}`);
            await dialog.dismiss();
        });

        const response = await page.goto(URL_EMPLEATE, [5000, { waitUntil: "domcontentloaded" }]);
        console.log(`- Status ${response.status()}`);
        await delay(3000);

        //* selecciona cantidad de ofertas por página
        const pagesizeinput = await page.select('#pagesizeinput', '100');
        console.log('- before waiting 5 seconds: ', pagesizeinput);
        await delay(5000);
        console.log('- after waiting 5 seconds');


        //* Obteniendo enlaces de la página
        const enlaces = await page.evaluate(() => {
            const links = [];
            const elements = document.querySelectorAll('.animated-fast.fadeIn.ng-scope');

            for (const element of elements) {
                const link = element.querySelector('div p a')?.href ?? null;
                if (link !== null) links.push(link);
            }
            return links;
        });
        console.log(`- <<${enlaces[0]}>>`);
        console.log(`- <<${enlaces.length} links retrieves>>`);

        //* Recorriendo cada uno de los enlaces
        for (const enlace of enlaces) {

            await page.goto(enlace);
            await page.waitForSelector('#tituloOferta');

            const jobs = await page.evaluate(() => {
                const job = {};
                const CSS_BASE = '#toTop > section.row.margin-top-20.wrap-white.margin-5 >';

                job.titulo = document.querySelector('#tituloOferta')?.innerText;
                job.empresa = document.querySelector('h2.clickable.texto-13.display-inline-imp.ng-binding')?.innerText ?? '';
                job.fechaCreacion = Date.now();
                job.url = '';
                job.fuente = 'Empleate';
                job.experiencia = document.querySelector(`${CSS_BASE} section.col-md-7.margin-left-15.margin-right-15 > div:nth-child(6) > div:nth-child(1) > div:nth-child(1) > div:nth-child(3) > strong`)?.innerText;
                job.salario = document.querySelector(`${CSS_BASE} section:nth-child(6) > div > div:nth-child(6) > span.ng-binding`)?.innerText;
                job.categoria = document.querySelector(`${CSS_BASE} section.col-md-7.margin-left-15.margin-right-15 > div:nth-child(2) > div.col-md-9.col-xs-12 > div:nth-child(1) > div > span > a:nth-child(1)`)?.innerText;
                job.subcategoria = document.querySelector(`${CSS_BASE} section.col-md-7.margin-left-15.margin-right-15 > div:nth-child(2) > div.col-md-9.col-xs-12 > div:nth-child(1) > div > span > a:nth-child(2)`)?.innerText;
                job.descripcion = document.querySelector(`${CSS_BASE} section.col-md-7.margin-left-15.margin-right-15 > div.row.texto-16.justify-text.margin-top-15`)?.innerHTML;
                job.descripcion = job.descripcion.replace(/\sclass="[^"]*"/g, '').replace(/<pre>/g, '<p>').replace(/<\/pre>/g, '</p>');
                job.descripcion = job.descripcion.trimStart();
                job.fechaPublicacion = document.querySelector(`${CSS_BASE} section.col-md-7.margin-left-15.margin-right-15 > div:nth-child(2) > div.col-md-9.col-xs-12 > div.row.margin-top-15.text-center-sm.text-center-xs > div:nth-child(2) > span.ng-binding`)?.innerText;
                job.vacantes = document.querySelector(`${CSS_BASE} section:nth-child(6) > div > div:nth-child(2) > span.ng-binding`)?.innerText;
                job.logo = 'https://res.cloudinary.com/dsidiwm77/image/upload/v1693396121/jobLogo/xstogxuihgni7uc18r9n.png';
                job.area = job.categoria;
                job.contrato = document.querySelector(`${CSS_BASE} section:nth-child(6) > div > div:nth-child(4) > span.ng-binding`)?.innerText;
                job.localidad = document.querySelector(`${CSS_BASE} section:nth-child(6) > div > div:nth-child(14) > span.ng-binding > a:nth-child(1)`)?.innerText;
                job.pais = document.querySelector(`${CSS_BASE} section:nth-child(6) > div > div:nth-child(14) > span.ng-binding > a:nth-child(2)`)?.innerText;

                return job;
            });
            console.log(`jobs.titulo: ${jobs?.titulo}`);
            console.log(`jobs.empresa: ${jobs?.empresa}`);
            console.log(`enlace: ${jobs?.enlace}`);
            console.log('** A **');

            if (jobs.titulo == null || jobs.titulo.trim() === '') continue;
            console.log('** B **');
            jobs.url = enlace ?? '';
            console.log('** C **');
            const existeTitulo = await Job.findOne({ titulo: jobs.titulo });
            console.log('** D **');

            if (jobs.titulo != null && jobs.titulo != '' && !existeTitulo) {
                console.log('** INSERT OK **');
                todasLasOfertas.push(jobs);
            }
        }
        console.log(`- <<${todasLasOfertas.length} items adds>>`);
        if (todasLasOfertas.length > 0) await saveJobs(todasLasOfertas);

        await browser.close();

    } catch (error) {
        console.log(`*** Error Task 02 *** ${error.message}`);
    }
    console.log('- End Task 02');
}



//*--------*//
//* INDEED *//
//*--------*//

const indeed = async () => {
    console.log('- Init App_03...');
    const todasLasOfertas = [];

    try {
        const browser = await puppeteer.launch({ headless: false });
        const page = await browser.newPage();
        await page.setUserAgent(NAV_CONFIG);
        await page.setViewport(VIEWPORT);
        const response = await page.goto(URL_INDEED, PAGE_GOTO);
        console.log(`- Status code: ${response.status()}`);


        //* page evaluate
        const enlaces = await page.evaluate(() => {
            const links = [];
            const elements = document.querySelectorAll('.animated-fast.fadeIn.ng-scope');

            for (const element of elements) {
                const link = element.querySelector('h2 a')?.href ?? null;
                alert(link);
                if (link !== null) links.push(link);
            }
            return links;
        });


        for (const enlace of enlaces) {

            await page.goto(enlace, PAGE_GOTO);
            // await page.waitForSelector('h1.regular');

            const jobs = await page.evaluate(() => {

                const job = {};
                job.titulo = document.querySelector('h1 span')?.innerText;
                console.log(job.titulo);
                // job.empresa = document.querySelector('.companyname>a:nth-child(1)')?.innerText ?? '';
                job.fechaCreacion = Date.now();
                job.url = '';
                job.fuente = 'Indeed';
                // job.experiencia = document.querySelector('div.offer-excerpt>ul:nth-child(1)>li:nth-child(1)>p')?.innerText;
                // job.salario = document.querySelector('div.offer-excerpt>ul:nth-child(1)>li:nth-child(2)>p')?.innerText;
                // job.categoria = document.querySelector('div.offer-excerpt>ul:nth-child(2)>li:nth-child(2)>p')?.innerText;
                // job.descripcion = document.querySelector('.offer')?.innerHTML;
                // job.descripcion = job.descripcion.replace(/\sclass="[^"]*"/g, '').replace(/<pre>/g, '<p>').replace(/<\/pre>/g, '</p>');
                // job.descripcion = job.descripcion.replace(/<\/?[^>]+(>|$)/g, "");
                // job.fechaPublicacion = document.querySelector('.mt10')?.innerText;
                // job.fechaPublicacion = job.fechaPublicacion.trimStart();
                // job.vacantes = document.querySelector('div.offer-excerpt>ul:nth-child(3)>li:nth-child(1)>p')?.innerText;
                // job.inscritos = document.querySelector('div.offer-excerpt>ul:nth-child(3)>li:nth-child(2)>p')?.innerText;
                job.logo = 'https://res.cloudinary.com/dsidiwm77/image/upload/v1692266273/jobLogo/wmpyazfwjubrhtxrh0ud.svg';
                // job.area = document.querySelector('div.offer-excerpt>ul:nth-child(2)>li:nth-child(1)>p')?.innerText;
                // job.contrato = document.querySelector('div.offer-excerpt>ul:nth-child(4)>li:nth-child(1)>p')?.innerText;
                // job.localidad = document.querySelector('.block')?.innerText;
                // job.localidad = job.localidad.trimStart();

                return job;
            });

            jobs.url = enlace ?? '';
            const existeTitulo = await Job.findOne({ titulo: jobs.titulo });
            if (jobs.titulo != null && !existeTitulo) todasLasOfertas.push(jobs);
        }
        console.log(`- Total a guardar: <<${todasLasOfertas.length} items>>`);
        // if (todasLasOfertas.length > 0) await saveJobs(todasLasOfertas);

        await browser.close();
    } catch (error) {
        console.log('*** Error inesperado en App_03 ***', error.message);
    }
}

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
    infoempleo,
    empleate,
    infoJobs,
    indeed,
}