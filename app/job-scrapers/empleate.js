const setupBrowser = require('../browser-setup');
const Job = require('../../models/job');
const { saveJobs } = require('../save-jobs');
const { URL_EMPLEATE, PAGE_GOTO } = require('../../helpers/constantes');
const { delay } = require('../../helpers/funciones');


const empleate = async () => {
    console.log('[empleate] - Init...');
    const { browser, page } = await setupBrowser();
    const todasLasOfertas = [];

    const context = browser.defaultBrowserContext();
    await context.overridePermissions(URL_EMPLEATE, ['geolocation']);

    //* Escuchar el evento dialog y descartarlo (dismiss)
    page.on('dialog', async dialog => {
        console.log(`[empleate] - Se encontró un diálogo: ${dialog.message()}`);
        await dialog.dismiss();
    });

    const response = await page.goto(URL_EMPLEATE, [5000, { waitUntil: "domcontentloaded" }]);
    console.log(`[empleate] - Status ${response.status()}`);
    await delay(3000);

    //* selecciona cantidad de ofertas por página
    const pagesizeinput = await page.select('#pagesizeinput', '100');
    console.log('[empleate] - before waiting 3 seconds: ', pagesizeinput);
    await delay(3000);
    console.log('[empleate] - after waiting 3 seconds');

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
    console.log(`[empleate] - ${enlaces.length} enlaces recuperados`);

    //* Recorriendo cada uno de los enlaces
    for (const enlace of enlaces) {
        await page.goto(enlace, PAGE_GOTO);
        await page.waitForSelector('#tituloOferta');
        await delay(2000);

        const jobs = await page.evaluate(() => {
            const job = {};
            const CSS_BASE = '#toTop > section.row.margin-top-20.wrap-white.margin-5 >';

            job.titulo = document.querySelector('#tituloOferta')?.innerText;
            job.empresa = document.querySelector('h2.clickable.texto-13.display-inline-imp.ng-binding')?.innerText;
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

        if (jobs.titulo && jobs.titulo.trim() !== '') {
            jobs.url = enlace ?? '';
            const existeRegistro = await Job.findOne({ titulo: jobs.url });

            if (!existeRegistro) {
                if (!todasLasOfertas.some(empleo => empleo.url === jobs.url)) {
                    todasLasOfertas.push(jobs);
                }
            }
        }
    }

    console.log(`[empleate] - ${todasLasOfertas.length} items adds`);
    if (todasLasOfertas.length > 0) await saveJobs(todasLasOfertas);

    await browser.close();
    console.log('[empleate] - End');

};

module.exports = empleate;